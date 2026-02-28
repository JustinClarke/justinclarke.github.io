import { useState, useEffect, useCallback } from 'react';

const SPOTIFY_CLIENT_ID = 'e6c4a4eea9bc4dda9a0f0014140cfce0';
const REDIRECT_URI = typeof window !== 'undefined'
  ? `${window.location.origin}/auth/spotify/callback`
  : '';
const SCOPES = ['user-read-currently-playing', 'user-read-playback-state'];

export interface SpotifyTrack {
  name: string;
  artist: string;
  albumArt?: string;
  isPlaying: boolean;
  progress?: number;
  duration?: number;
}

const generateCodeChallenge = async (codeVerifier: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

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

  // Check for auth code in URL and exchange for token
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    const storedState = localStorage.getItem('spotify_state');

    if (code && state === storedState) {
      exchangeCodeForToken(code);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      const token = localStorage.getItem('spotify_access_token');
      if (token) {
        setIsAuthorized(true);
        fetchCurrentTrack(token);
      }
    }
  }, []);

  // Poll for current track every 5 seconds
  useEffect(() => {
    if (!isAuthorized) return;

    const token = localStorage.getItem('spotify_access_token');
    if (!token) return;

    const interval = setInterval(() => {
      fetchCurrentTrack(token);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAuthorized]);

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
        localStorage.setItem('spotify_access_token', data.access_token);
        const expiresIn = data.expires_in || 3600;
        localStorage.setItem('spotify_token_expiry', String(Date.now() + expiresIn * 1000));
        setIsAuthorized(true);
        await fetchCurrentTrack(data.access_token);
      }
    } catch (error) {
      console.error('Error exchanging code for token:', error);
    } finally {
      setIsLoading(false);
      localStorage.removeItem('spotify_code_verifier');
    }
  };

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
        localStorage.removeItem('spotify_access_token');
        localStorage.removeItem('spotify_token_expiry');
        setIsAuthorized(false);
      }
    } catch (error) {
      console.error('Error fetching current track:', error);
    }
  };

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

    window.location.href = authUrl.toString();
  }, []);

  return {
    track,
    isAuthorized,
    isLoading,
    startAuth,
  };
};
