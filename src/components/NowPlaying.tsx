/**
 * NowPlaying the little "now playing / last played" music badge. Hovering it
 * opens a card with the album art and a link to open the track on Spotify.
 *
 * Fits in: a small pill placed in the page chrome; data comes from useLastFm.
 * Note:    while loading or with no track, it renders nothing (returns null), so
 *          it simply isn't there until there's something to show a clean
 *          degradation path when a forker has no Last.fm configured.
 */
import React, { useState, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useLastFm } from '@/hooks';

// Official filled Spotify logo inline SVG so it recolours/resizes via classes.
export const SpotifyLogo = ({ className = "w-2 h-2 sm:w-2.5 sm:h-2.5" }: { className?: string }) => (
  <svg className={`${className} shrink-0`} viewBox="0 0 24 24" fill="currentColor" preserveAspectRatio="xMidYMid meet">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-12.008-1.5-.479.122-1.023-.179-1.141-.62-.12-.48.179-1.023.621-1.141C9.6 9.9 15.079 10.561 18.679 12.84c.361.22.599.659.3 1.099zm.12-3.36C15.12 8.1 8.077 7.797 4.915 9.773c-.539.3-1.159.077-1.439-.461-.281-.537-.054-1.21.471-1.49C9.057 6.009 17.039 6.362 20.199 11.558c.3.441.077 1.141-.419 1.441-.46.3-1.141.077-1.441-.42z" />
  </svg>
);

// Outline Spotify logo matching Lucide icons, for the footer (TheCloser)
export const SpotifyLogoOutline = ({ className = "w-2 h-2 sm:w-2.5 sm:h-2.5" }: { className?: string }) => (
  <svg
    className={`${className} shrink-0`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M8 15c2.5-0.8 5.5-0.8 8 0" />
    <path d="M7 12c3.5-1.2 6.5-1.2 10 0" />
    <path d="M6 9c4.2-1.7 8.8-1.7 13 0" />
  </svg>
);

// Turns a minutes count into "just now" / "5m ago" / "2h ago" / "3d ago".
// Kept pure and exported so it can be unit-tested (see NowPlaying.test.ts).
export const formatTimeAgo = (minutes: number | undefined): string => {
  if (minutes === undefined) return '';
  if (minutes === 0) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export const NowPlaying: React.FC = () => {
  const { track, loading } = useLastFm();
  const [isOpen, setIsOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (loading || !track) return null;

  const statusText = track.isNowPlaying
    ? 'now playing'
    : formatTimeAgo(track.lastPlayedMinutesAgo);

  const handleMouseEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setIsOpen(true);
  };

  // Leaving waits 120ms before closing a grace period so the cursor can cross the
  // gap between pill and card without it flickering shut; re-entering cancels it.
  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setIsOpen(false), 120);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Pill */}
      <div className={`flex items-center gap-1 font-mono text-micro sm:text-micro text-term-dim border px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-md max-w-sm transition-all duration-200 select-none cursor-default ${isOpen ? 'border-viz-spotify/30 bg-viz-spotify/[0.06]' : 'border-brand-primary/10 bg-brand-primary/[0.02]'}`}>
        <span className="text-viz-spotify flex items-center shrink-0">
          <SpotifyLogo />
        </span>
        <span className="text-fg font-semibold">{track.artist}</span>
        <span className="text-term-faint shrink-0"> • </span>
        <span className="text-term-dim">{track.name}</span>
      </div>

      {/* Invisible strip bridging the pill→card gap so the mouse stays "inside". */}
      {isOpen && <div className="absolute top-full left-0 right-0 h-3" />}

      {/* Card Container with smooth fade-out and slide-up/down transitions */}
      <div
        className={`absolute top-[calc(100%+8px)] right-0 z-50 transition-all duration-300 ease-out origin-top-right ${
          isOpen
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
            : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
        }`}
      >
        <div className="relative overflow-hidden rounded-2xl shadow-[0_32px_64px_rgba(0,0,0,0.8)] w-[240px] bg-ink/95 backdrop-blur-md border border-white/10">
          {/* Album art */}
          <div className="p-3.5 pb-2">
            {track.albumArt ? (
              <div className="w-full aspect-square rounded-xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.5)] border border-white/10 group/art relative">
                <img
                  src={track.albumArt}
                  alt={track.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/art:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors duration-300 pointer-events-none" />
              </div>
            ) : (
              <div className="w-full aspect-square bg-[#070b0a] border border-white/5 rounded-xl flex items-center justify-center shadow-inner">
                <SpotifyLogo className="w-8 h-8 text-viz-spotify/25 animate-pulse" />
              </div>
            )}
          </div>

          {/* Track info & play actions */}
          <div className="px-3.5 pb-3.5 pt-1.5 flex flex-col">
            <div className="text-micro uppercase tracking-mega text-viz-spotify font-mono font-bold mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-viz-spotify animate-pulse inline-block shadow-[0_0_8px_rgba(29,185,84,0.6)]" />
              {statusText}
            </div>
            <div className="text-label font-bold text-white leading-tight truncate" title={track.artist}>{track.artist}</div>
            <div className="text-fine text-text-tertiary mt-1 mb-2.5 truncate" title={track.name}>{track.name}</div>

            <div className="flex flex-col gap-1.5">
              <a
                href={`https://open.spotify.com/search/${encodeURIComponent(`${track.artist} ${track.name}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg bg-viz-spotify hover:brightness-110 active:scale-[0.98] transition-all duration-300 shadow-[0_4px_12px_rgba(29,185,84,0.2)]"
              >
                <SpotifyLogo className="w-3.5 h-3.5 text-black" />
                <span className="text-micro font-black text-black tracking-[0.18em] uppercase font-mono pt-[1px]">open track</span>
              </a>
              <a
                href="https://open.spotify.com/user/312fwskwmcipw743yzgnuf4ak6ve?si=51a73edd462e4624"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg bg-transparent border border-white/10 hover:bg-white/[0.04] active:scale-[0.98] transition-all duration-300 text-text-secondary hover:text-white group/profile"
              >
                <span className="text-micro font-black tracking-[0.18em] uppercase font-mono pt-[1px]">Ear Candy (and Trash)</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-text-tertiary group-hover/profile:text-white group-hover/profile:translate-x-0.5 group-hover/profile:-translate-y-0.5 transition-all duration-300" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
