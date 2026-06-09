/**
 * useLastFm fetches the most recent track scrobbled to my Last.fm account so
 * the site can show a little "now playing / last played" badge.
 *
 * Fits in: used by the NowPlaying component. Returns { track, loading, error }.
 * Note:    Last.fm's JSON is loosely typed and a bit inconsistent (a single
 *          track can arrive as an object OR a one-item array; the artist can be a
 *          string OR a nested object), so most of the code here is careful
 *          unwrapping with fallbacks.
 *
 * For beginners ----------------------------------------------------------------
 * "async/await" is how JavaScript waits for something slow (a network request)
 * without freezing the page. `await fetch(...)` pauses this function until the
 * server answers, then continues meanwhile the rest of the app keeps running.
 * -----------------------------------------------------------------------------
 */
import { useState, useEffect } from 'react';
import { debug } from '@/utils';

const LASTFM_API_KEY = '8322aaa4ef7c1cfe94f42acdf682c940';
const LASTFM_USERNAME = 'justincalrke';

// LEARN: A logger labelled "spotify" (this badge is the music feature). Enable in
//    the console with  localStorage.debug = 'spotify'  then refresh.
const log = debug('spotify');

// LEARN: An interface is a TypeScript shape: it lists which fields exist and their
//    types. It's a compile-time contract only it disappears at runtime, but it
//    catches typos like track.nmae before the code ever ships. `?` = optional.
export interface LastFmTrack {
  name: string;
  artist: string;
  albumArt?: string;
  isNowPlaying: boolean;
  lastPlayedMinutesAgo?: number;
}

export const useLastFm = () => {
  // LEARN: three pieces of state model the three things a fetch can be in:
  //    have a track, still loading, or errored. The UI reads these to decide
  //    what to show.
  const [track, setTrack] = useState<LastFmTrack | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // LEARN: this effect runs once on mount (empty `[]`) and kicks off the fetch.
  //    We define `fetchTrack` as an async function INSIDE the effect and call it,
  //    because the effect callback itself isn't allowed to be async.
  useEffect(() => {
    const fetchTrack = async () => {
      try {
        setLoading(true);
        setError(null);
        log('fetching recent track', LASTFM_USERNAME);

        const response = await fetch(
          `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USERNAME}&api_key=${LASTFM_API_KEY}&limit=1&format=json`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch from Last.fm');
        }

        const data = await response.json();
        const tracks = data.recenttracks?.track;
        // LEARN: Last.fm returns either an array of tracks or a single object.
        //    This normalises both cases to "the first track".
        const recentTrack = Array.isArray(tracks) ? tracks[0] : tracks;

        if (!recentTrack) {
          setTrack(null);
          return;
        }

        // LEARN: the '@attr'.nowplaying flag (a string "true") marks a track that
        //    is playing RIGHT NOW. If it's set, there's no "played at" timestamp.
        const isNowPlaying = recentTrack['@attr']?.nowplaying === 'true';
        const timestamp = recentTrack.date?.uts;
        let minutesAgo: number | undefined;

        if (timestamp && !isNowPlaying) {
          const now = Math.floor(Date.now() / 1000);
          minutesAgo = Math.floor((now - parseInt(timestamp)) / 60);
        }

        // LEARN: artist may be a plain string or a `{ '#text': ... }` object,
        //    depending on the endpoint. The `?.` (optional chaining) reads nested
        //    fields without crashing if a middle part is missing; `||` supplies a
        //    fallback chain ending in 'Unknown'.
        const artistName = typeof recentTrack.artist === 'string'
          ? recentTrack.artist
          : recentTrack.artist?.['#text'] || recentTrack.artist?.name || 'Unknown';

        setTrack({
          name: recentTrack.name || 'Unknown',
          artist: artistName,
          albumArt: recentTrack.image?.find((img: any) => img.size === 'extralarge')?.['#text'] || recentTrack.image?.find((img: any) => img.size === 'large')?.['#text'],
          isNowPlaying,
          lastPlayedMinutesAgo: minutesAgo,
        });
        log('track', recentTrack.name, isNowPlaying ? '(now playing)' : `(${minutesAgo}m ago)`);
      } catch (err) {
        // LEARN: anything thrown inside `try` lands here. We store a readable
        //    message and clear the track so the badge simply hides itself.
        log('fetch failed', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setTrack(null);
      } finally {
        // LEARN: `finally` always runs success or failure so loading is
        //    guaranteed to switch off exactly once.
        setLoading(false);
      }
    };

    fetchTrack();
  }, []);

  return { track, loading, error };
};
