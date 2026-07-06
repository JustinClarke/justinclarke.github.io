/**
 * WindowChrome the fake macOS title bar at the top of any "window" on the site:
 * the red/yellow/green traffic lights, the centred URL, and the right-hand actions
 * (email/linkedin/github links, NowPlaying, "shipping" badge).
 *
 * Fits in: wraps the hero terminal and the project "windows". Reused, so almost
 *          everything is configurable through props.
 * Note:    the traffic lights are real buttons red reloads (or asks the parent
 *          to confirm a close), yellow minimises. The green one is decorative.
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { NowPlaying } from '@/components/NowPlaying';
import { ThemeToggle } from '@/ui/ThemeToggle';
import { TOOLTIPS } from '@/utils/tooltipContent';
import { SITE } from '@/content';

interface WindowChromeProps {
  url?: string;
  right?: React.ReactNode;
  showBackOnMobile?: boolean;
  onMinimize?: () => void;
  isMinimized?: boolean;
  onCloseConfirm?: () => void;
  onCommand?: (cmd: string) => void;
}

export const WindowChrome: React.FC<WindowChromeProps> = ({
  url = `${SITE.social.github.toLowerCase()}@portfolio: ~`,
  right,
  showBackOnMobile = false,
  onMinimize,
  isMinimized = false,
  onCloseConfirm,
  onCommand
}) => {
  const [copiedToast, setCopiedToast] = useState(false);

  const handleYellowClick = () => { onMinimize?.(); };
  const handleRedClick = () => {
    if (onCloseConfirm) {
      onCloseConfirm();
    } else {
      setTimeout(() => window.location.reload(), 600);
    }
  };

  const trafficLights = (
    <div className="relative flex gap-2 group/traffic">
      {/* The 10px traffic-light dots keep the macOS-chrome look; `before:-inset-1.5`
          adds an invisible hit-slop so the real tap target is ~22px without resizing
          the visual dot (a full 44px is impossible in this tight row see AUDIT §12.3). */}
      <button
        type="button"
        onClick={handleRedClick}
        aria-label="Close terminal window"
        className="w-2.5 h-2.5 rounded-full bg-viz-mac-red hover:bg-viz-mac-red/80 cursor-pointer relative before:absolute before:-inset-1.5 before:content-[''] group-hover/traffic:after:content-['×'] after:absolute after:inset-0 after:flex after:items-center after:justify-center after:text-micro after:text-black/40 after:font-bold after:opacity-0 hover:after:opacity-100 transition-colors"
      />
      <button
        type="button"
        onClick={handleYellowClick}
        aria-label="Minimize terminal window"
        data-tooltip={TOOLTIPS.yellowbutton}
        data-tooltip-pos="below"
        className="w-2.5 h-2.5 rounded-full bg-viz-mac-yellow hover:bg-viz-mac-yellow/80 cursor-pointer relative before:absolute before:-inset-1.5 before:content-[''] group-hover/traffic:after:content-['−'] after:absolute after:inset-0 after:flex after:items-center after:justify-center after:text-micro after:text-black/40 after:font-bold after:opacity-0 hover:after:opacity-100 transition-colors"
      />
      {/* Green is purely decorative (no handler) a span, not a button, so it stays
          out of the a11y tree and tab order instead of being a nameless control. */}
      <span
        aria-hidden="true"
        className="w-2.5 h-2.5 rounded-full bg-viz-mac-green relative group-hover/traffic:after:content-['+'] after:absolute after:inset-0 after:flex after:items-center after:justify-center after:text-micro after:text-black/40 after:font-bold after:opacity-0 transition-colors"
      />

    </div>
  );

  const renderedRight = right !== undefined ? right : (
    !isMinimized && (
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="hidden sm:flex items-center gap-4 text-term-dim font-mono text-micro">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              navigator.clipboard.writeText(SITE.email);
              setCopiedToast(true);
              setTimeout(() => setCopiedToast(false), 2000);
            }}
            data-tooltip={TOOLTIPS.email}
            className="bg-transparent border-none p-0 outline-none hover:text-brand-primary transition-colors smooth-underline after:h-[1px] after:bg-brand-primary premium-text-hover cursor-pointer"
          >
            <span className="premium-target">email</span>
          </button>
          <a href={`https://linkedin.com/in/${SITE.social.linkedin}`} target="_blank" rel="noopener noreferrer" data-tooltip={TOOLTIPS.linkedin} className="hover:text-brand-primary transition-colors smooth-underline after:h-[1px] after:bg-brand-primary premium-text-hover"><span className="premium-target">linkedin</span></a>
          <a href={`https://github.com/${SITE.social.github}`} target="_blank" rel="noopener noreferrer" data-tooltip={TOOLTIPS.github} className="hover:text-brand-primary transition-colors smooth-underline after:h-[1px] after:bg-brand-primary premium-text-hover"><span className="premium-target">github</span></a>
        </div>

        <div className="hidden sm:block flex items-center"><NowPlaying /></div>

        <button
          type="button"
          onClick={() => onCommand?.('game')}
          aria-label="Play arcade games"
          data-tooltip="you got games on your phone??"
          data-tooltip-pos="below"
          className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-fg/5 text-viz-mac-yellow opacity-80 hover:opacity-100 transition-all cursor-pointer border-none outline-none"
        >
          <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="6" x2="10" y1="11" y2="11" />
            <line x1="8" x2="8" y1="9" y2="13" />
            <line x1="15" x2="15.01" y1="12" y2="12" />
            <line x1="18" x2="18.01" y1="10" y2="10" />
            <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z" />
          </svg>
        </button>

        <ThemeToggle size={14} className="flex" />
      </div>
    )
  );

  return (
    <div className="relative">
      <div className="flex items-center h-10 px-4 border-b border-edge-soft bg-term-chrome shrink-0">
        {showBackOnMobile ? (
          <>
            <div className="relative hidden sm:flex gap-2 group/traffic">
              {trafficLights}
            </div>
            <Link
              to="/"
              className="sm:hidden flex items-center gap-1.5 font-mono text-micro tracking-wider text-term-fg/60 hover:text-brand-primary active:scale-95 transition-all select-none no-underline cursor-pointer"
            >
              <span className="text-viz-mac-red font-bold">←</span>
              <span>back</span>
            </Link>
          </>
        ) : (
          trafficLights
        )}

        <div className="flex-1 text-center font-mono text-micro md:text-micro text-term-faint tracking-mega uppercase opacity-60 truncate px-2">
          {url}
        </div>
        <div className="flex items-center gap-2 md:gap-4 text-term-dim font-mono text-micro shrink-0">
          {renderedRight}
        </div>
      </div>

      {copiedToast && (
        <div className="fixed top-6 right-6 z-[100] bg-ink border border-brand-primary/40 px-5 py-3 rounded-xl shadow-[0_15px_30px_rgba(0,0,0,0.6)] flex items-center gap-3 animate-fade-in font-mono text-xs text-brand-primary">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
          <span>EMAIL COPIED TO CLIPBOARD</span>
        </div>
      )}
    </div>
  );
};
