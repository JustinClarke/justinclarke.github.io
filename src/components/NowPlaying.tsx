import React, { useState, useRef } from 'react';
import { useLastFm } from '@/hooks';

const SpotifyLogo = ({ className = "w-2 h-2 sm:w-2.5 sm:h-2.5" }: { className?: string }) => (
  <svg className={`${className} shrink-0`} viewBox="0 0 24 24" fill="currentColor" preserveAspectRatio="xMidYMid meet">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-12.008-1.5-.479.122-1.023-.179-1.141-.62-.12-.48.179-1.023.621-1.141C9.6 9.9 15.079 10.561 18.679 12.84c.361.22.599.659.3 1.099zm.12-3.36C15.12 8.1 8.077 7.797 4.915 9.773c-.539.3-1.159.077-1.439-.461-.281-.537-.054-1.21.471-1.49C9.057 6.009 17.039 6.362 20.199 11.558c.3.441.077 1.141-.419 1.441-.46.3-1.141.077-1.441-.42z" />
  </svg>
);

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
      <div className={`flex items-center gap-1 font-mono text-[9px] sm:text-[10px] text-term-dim border px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-md max-w-sm transition-all duration-200 select-none cursor-default ${isOpen ? 'border-viz-spotify/30 bg-viz-spotify/[0.06]' : 'border-brand-primary/10 bg-brand-primary/[0.02]'}`}>
        <span className="text-viz-spotify flex items-center shrink-0">
          <SpotifyLogo />
        </span>
        <span className="text-[#e8e6e0] font-semibold">{track.artist}</span>
        <span className="text-term-faint shrink-0"> - </span>
        <span className="text-term-dim">{track.name}</span>
      </div>

      {/* Invisible bridge to prevent gap mouseout */}
      {isOpen && <div className="absolute top-full left-0 right-0 h-3" />}

      {/* Card */}
      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] right-0 z-50">
          <div
            className="relative overflow-hidden rounded-2xl shadow-[0_32px_64px_rgba(0,0,0,0.8)] w-[220px]"
            style={{ animation: 'nowPlayingIn 200ms cubic-bezier(0.16,1,0.3,1) both' }}
          >
            {/* Full-bleed album art */}
            {track.albumArt ? (
              <img
                src={track.albumArt}
                alt={track.name}
                className="w-full aspect-square object-cover block"
              />
            ) : (
              <div className="w-full aspect-square bg-[#0d1513] flex items-center justify-center">
                <SpotifyLogo className="w-10 h-10 text-viz-spotify/30" />
              </div>
            )}

            {/* Gradient overlay with info */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

            {/* Bottom info */}
            <div className="absolute bottom-0 left-0 right-0 p-3.5">
              <div className="text-[9px] uppercase tracking-[0.18em] text-viz-spotify font-mono mb-1.5 flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-viz-spotify inline-block" />
                {statusText}
              </div>
              <div className="text-sm font-bold text-white leading-tight">{track.artist}</div>
              <div className="text-[11px] text-white/60 mt-0.5 mb-3">{track.name}</div>

              <a
                href={`https://open.spotify.com/search/${encodeURIComponent(`${track.artist} ${track.name}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg bg-viz-spotify hover:brightness-110 active:scale-95 transition-all duration-150"
              >
                <SpotifyLogo className="w-3 h-3 text-black" />
                <span className="text-[10px] font-bold text-black tracking-wide font-mono">open on spotify</span>
              </a>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes nowPlayingIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
      `}</style>
    </div>
  );
};
