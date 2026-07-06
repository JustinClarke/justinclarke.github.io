/**
 * useLastFm fetches the most recent track scrobbled to my Last.fm account so
 * the site can show a little "now playing / last played" badge.
 *
 * Fits in: used by the NowPlaying component. Returns { track, loading, error }.
 *          Account + API key come from SITE.integrations.lastFm; when that is
 *          null the hook settles immediately (no fetch, no track) and
 *          NowPlaying's early return hides the badge the degradation contract.
 * Note:    Last.fm's JSON is loosely typed and a bit inconsistent (a single
 *          track can arrive as an object OR a one-item array; the artist can be a
 *          string OR a nested object), so most of the code here is careful
 *          unwrapping with fallbacks.
 */
import { useState, useEffect } from 'react';
import { debug } from '@/utils';
import { SITE, type SiteConfig } from '@/content';

// Widened to the config union so the null branch stays a checked code path
// even while this deployment has the integration switched on.
const LASTFM: SiteConfig['integrations']['lastFm'] = SITE.integrations.lastFm;

// Logger namespaced 'spotify' (legacy label the music badge). localStorage.debug.
const log = debug('spotify');

export interface LastFmTrack {
  name: string;
  artist: string;
  albumArt?: string;
  isNowPlaying: boolean;
  lastPlayedMinutesAgo?: number;
}

/**
 * Fetches and unwraps the most recent scrobble. Pure of React state so the
 * degradation contract is unit-testable: a null integration resolves to null
 * WITHOUT touching the network (see NowPlaying.test.ts).
 */
export async function fetchLastFmTrack(
  integration: SiteConfig['integrations']['lastFm'],
): Promise<LastFmTrack | null> {
  if (!integration) return null;

  const response = await fetch(
    `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${integration.username}&api_key=${integration.apiKey}&limit=1&format=json`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch from Last.fm');
  }

  const data = await response.json();
  const tracks = data.recenttracks?.track;
  // Last.fm returns either an array of tracks or a single object normalise both.
  const recentTrack = Array.isArray(tracks) ? tracks[0] : tracks;

  if (!recentTrack) return null;

  // '@attr'.nowplaying (the string "true") marks the currently-playing track;
  // when set there is no "played at" timestamp.
  const isNowPlaying = recentTrack['@attr']?.nowplaying === 'true';
  const timestamp = recentTrack.date?.uts;
  let minutesAgo: number | undefined;

  if (timestamp && !isNowPlaying) {
    const now = Math.floor(Date.now() / 1000);
    minutesAgo = Math.floor((now - parseInt(timestamp)) / 60);
  }

  // artist comes back as a plain string or a `{ '#text' }` object depending on
  // the endpoint; fall through both shapes to 'Unknown'.
  const artistName = typeof recentTrack.artist === 'string'
    ? recentTrack.artist
    : recentTrack.artist?.['#text'] || recentTrack.artist?.name || 'Unknown';

  return {
    name: recentTrack.name || 'Unknown',
    artist: artistName,
    albumArt: recentTrack.image?.find((img: any) => img.size === 'extralarge')?.['#text'] || recentTrack.image?.find((img: any) => img.size === 'large')?.['#text'],
    isNowPlaying,
    lastPlayedMinutesAgo: minutesAgo,
  };
}

export const useLastFm = () => {
  // With the integration off there is nothing to load, so loading starts (and
  // stays) false the badge just never appears.
  const [track, setTrack] = useState<LastFmTrack | null>(null);
  const [loading, setLoading] = useState(LASTFM !== null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!LASTFM) return; // integration off: settled state was set above

    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        log('fetching recent track', LASTFM.username);
        const next = await fetchLastFmTrack(LASTFM);
        setTrack(next);
        if (next) {
          log('track', next.name, next.isNowPlaying ? '(now playing)' : `(${next.lastPlayedMinutesAgo}m ago)`);
        }
      } catch (err) {
        // On failure, clear the track so the badge simply hides itself.
        log('fetch failed', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setTrack(null);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  return { track, loading, error };
};
