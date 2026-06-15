/**
 * useSpotify connects to a visitor's own Spotify account and shows what they
 * are currently playing. The connection uses the official "PKCE" login flow.
 *
 * Fits in: an optional, interactive Spotify widget. Returns { track, isAuthorized,
 *          isLoading, startAuth }. (The site's default music badge uses Last.fm  
 *          see useLastFm which needs no login.)
 * Note:    OAuth here is a redirect dance: startAuth() sends the browser to
 *          Spotify, Spotify sends it back with a `code` in the URL, and the first
 *          effect below trades that code for an access token. Tokens live in
 *          localStorage so a refresh keeps you logged in.
 *
 * For beginners ----------------------------------------------------------------
 * "PKCE" is a way to log in safely from code that can't keep a secret (like a
 * browser app). We invent a random secret (the "verifier"), send only a scrambled
 * hash of it (the "challenge") to Spotify, then later prove we're the same app by
 * revealing the original. No password or secret key ever ships in the page.
 * -----------------------------------------------------------------------------
 */
import { useState, useEffect, useCallback } from 'react';
import { debug } from '@/utils';

const SPOTIFY_CLIENT_ID = 'e6c4a4eea9bc4dda9a0f0014140cfce0';
const REDIRECT_URI = typeof window !== 'undefined'
  ? `${window.location.origin}/auth/spotify/callback`
  : '';
const SCOPES = ['user-read-currently-playing', 'user-read-playback-state'];

// LEARN: A logger labelled "spotify". Silent unless you turn it on in the console
//    with  localStorage.debug = 'spotify'  then refresh (see src/utils/debug.ts).
const log = debug('spotify');

// LEARN: the shape of a track once we've tidied Spotify's verbose response down
//    to just the fields the UI needs. `?` marks an optional field.
export interface SpotifyTrack {
  name: string;
  artist: string;
  albumArt?: string;
  isPlaying: boolean;
  progress?: number;
  duration?: number;
}

// LEARN: turns the random verifier into its scrambled "challenge". It SHA-256
//    hashes the text, then base64url-encodes it (the three .replace calls swap
//    the characters base64 uses that aren't URL-safe). crypto.subtle is the
//    browser's built-in cryptography; it returns a Promise, so this is async.
const generateCodeChallenge = async (codeVerifier: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

// LEARN: builds the random secret: 128 characters picked from a safe alphabet.
const generateCodeVerifier = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  let result = '';
  for (let i = 0; i < 128; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const useSpotify = () => {
  const [track, setTrack] = useState<SpotifyTrack | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ── On mount: are we returning FROM Spotify, or already logged in? ──────────
  useEffect(() => {
    // LEARN: URLSearchParams reads the "?key=value" part of the address bar.
    //    After Spotify redirects back, the URL carries `?code=...&state=...`.
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    const storedState = localStorage.getItem('spotify_state');

    // LEARN: the `state` we get back must match the one we stored before leaving.
    //    That check is what stops an attacker forging the redirect (CSRF guard).
    if (code && state === storedState) {
      log('returned from Spotify with auth code');
      exchangeCodeForToken(code);
      // LEARN: replaceState rewrites the URL (dropping the ?code=...) without
      //    reloading the page, so a refresh doesn't try to reuse a spent code.
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      // Not a fresh redirect reuse a token saved from a previous visit.
      const token = localStorage.getItem('spotify_access_token');
      if (token) {
        log('reusing saved access token');
        setIsAuthorized(true);
        fetchCurrentTrack(token);
      }
    }
  }, []);

  // ── While authorized: re-check the current track every 5 seconds ────────────
  // LEARN: this effect depends on `[isAuthorized]`, so it re-runs whenever that
  //    flips. It starts the polling timer only once we actually have access.
  useEffect(() => {
    if (!isAuthorized) return;

    const token = localStorage.getItem('spotify_access_token');
    if (!token) return;

    const interval = setInterval(() => {
      fetchCurrentTrack(token);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAuthorized]);

  // LEARN: step 2 of the login. We send Spotify the `code` it gave us PLUS the
  //    original verifier (proving we're the same app that started the flow), and
  //    Spotify hands back an access token we can use to call its API.
  const exchangeCodeForToken = async (code: string) => {
    try {
      setIsLoading(true);
      const codeVerifier = localStorage.getItem('spotify_code_verifier');

      if (!codeVerifier) {
        console.error('Code verifier not found');
        return;
      }

      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: SPOTIFY_CLIENT_ID,
          grant_type: 'authorization_code',
          code,
          redirect_uri: REDIRECT_URI,
          code_verifier: codeVerifier,
        }).toString(),
      });

      const data = await response.json();

      if (data.access_token) {
        // LEARN: stash the token and WHEN it expires (now + lifetime, in ms) so a
        //    later visit can tell whether it's still good.
        localStorage.setItem('spotify_access_token', data.access_token);
        const expiresIn = data.expires_in || 3600;
        localStorage.setItem('spotify_token_expiry', String(Date.now() + expiresIn * 1000));
        setIsAuthorized(true);
        log('token acquired');
        await fetchCurrentTrack(data.access_token);
      }
    } catch (error) {
      console.error('Error exchanging code for token:', error);
    } finally {
      setIsLoading(false);
      // The one-time verifier has done its job clear it.
      localStorage.removeItem('spotify_code_verifier');
    }
  };

  // LEARN: ask Spotify what's playing right now. 200 = a track, 204 = nothing
  //    playing, 401 = our token expired (so we log out and clear it).
  const fetchCurrentTrack = async (token: string) => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 204 || response.status === 200) {
        if (response.status === 204) {
          setTrack(null);
          return;
        }

        const data = await response.json();

        if (data.item) {
          setTrack({
            name: data.item.name,
            artist: data.item.artists[0]?.name || 'Unknown',
            albumArt: data.item.album?.images?.[0]?.url,
            isPlaying: data.is_playing,
            progress: data.progress_ms,
            duration: data.item.duration_ms,
          });
        } else {
          setTrack(null);
        }
      } else if (response.status === 401) {
        log('token expired logging out');
        localStorage.removeItem('spotify_access_token');
        localStorage.removeItem('spotify_token_expiry');
        setIsAuthorized(false);
      }
    } catch (error) {
      console.error('Error fetching current track:', error);
    }
  };

  // LEARN: step 1 of the login, triggered by a button. useCallback memoises this
  //    function so it keeps the same identity across renders (handy when it's
  //    passed to children). We mint the verifier + challenge + a random `state`,
  //    save the secrets, then send the browser off to Spotify's consent screen.
  const startAuth = useCallback(async () => {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    const state = Math.random().toString(36).substring(7);

    localStorage.setItem('spotify_code_verifier', codeVerifier);
    localStorage.setItem('spotify_state', state);

    const authUrl = new URL('https://accounts.spotify.com/authorize');
    authUrl.searchParams.append('client_id', SPOTIFY_CLIENT_ID);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('redirect_uri', REDIRECT_URI);
    authUrl.searchParams.append('scope', SCOPES.join(' '));
    authUrl.searchParams.append('code_challenge_method', 'S256');
    authUrl.searchParams.append('code_challenge', codeChallenge);
    authUrl.searchParams.append('state', state);

    // LEARN: assigning to window.location.href navigates the whole page away to
    //    Spotify. The flow continues when Spotify redirects back to REDIRECT_URI.
    log('redirecting to Spotify consent');
    window.location.href = authUrl.toString();
  }, []);

  return {
    track,
    isAuthorized,
    isLoading,
    startAuth,
  };
};
