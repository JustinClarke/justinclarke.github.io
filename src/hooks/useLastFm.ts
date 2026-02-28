import { useState, useEffect } from 'react';

const LASTFM_API_KEY = '8322aaa4ef7c1cfe94f42acdf682c940';
const LASTFM_USERNAME = 'justincalrke';

export interface LastFmTrack {
  name: string;
  artist: string;
  albumArt?: string;
  isNowPlaying: boolean;
  lastPlayedMinutesAgo?: number;
}

export const useLastFm = () => {
  const [track, setTrack] = useState<LastFmTrack | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrack = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USERNAME}&api_key=${LASTFM_API_KEY}&limit=1&format=json`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch from Last.fm');
        }

        const data = await response.json();
        const tracks = data.recenttracks?.track;
        const recentTrack = Array.isArray(tracks) ? tracks[0] : tracks;

        if (!recentTrack) {
          setTrack(null);
          return;
        }

        const isNowPlaying = recentTrack['@attr']?.nowplaying === 'true';
        const timestamp = recentTrack.date?.uts;
        let minutesAgo: number | undefined;

        if (timestamp && !isNowPlaying) {
          const now = Math.floor(Date.now() / 1000);
          minutesAgo = Math.floor((now - parseInt(timestamp)) / 60);
        }

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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setTrack(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTrack();
  }, []);

  return { track, loading, error };
};
