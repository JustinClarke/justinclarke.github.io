/**
 * WindowChrome the fake macOS title bar at the top of any "window" on the site:
 * the red/yellow/green traffic lights, the centred URL, and the right-hand actions
 * (email/linkedin/github links, NowPlaying, "shipping" badge).
 *
 * Fits in: wraps the hero terminal and the project "windows". Reused, so almost
 *          everything is configurable through props.
 * Note:    the traffic lights are real buttons red reloads (or asks the parent
 *          to confirm a close), yellow minimises. The green one is decorative.
 *
 * For beginners ----------------------------------------------------------------
 * Note how many props end in `?` and have `= default` values: that's how one
 * component flexes to many situations without the caller wiring up everything.
 * `React.ReactNode` means "anything renderable" text, an element, or nothing  
 * which lets a parent inject custom content into the `right` slot.
 * -----------------------------------------------------------------------------
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { NowPlaying } from '@/components/NowPlaying';
import { TOOLTIPS } from '@/config/tooltips';

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
  url = 'justinclarke@portfolio: ~',
  right,
  showBackOnMobile = false,
  onMinimize,
  isMinimized = false,
  onCloseConfirm,
  onCommand
}) => {
  // LEARN: A tiny piece of local state for the "EMAIL COPIED" toast true while it
  //    shows, flipped back to false by a timer after a couple of seconds.
  const [copiedToast, setCopiedToast] = useState(false);

  // LEARN: `onMinimize?.()` calls the handler only if the parent supplied one.
  //    Red either asks the parent to confirm a close (if given) or, as a fallback,
  //    reloads the page after a short delay so the click feels deliberate.
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
      <button
        type="button"
        onClick={handleRedClick}
        className="w-2.5 h-2.5 rounded-full bg-viz-mac-red hover:bg-viz-mac-red/80 cursor-pointer relative group-hover/traffic:after:content-['×'] after:absolute after:inset-0 after:flex after:items-center after:justify-center after:text-[8px] after:text-black/40 after:font-bold after:opacity-0 hover:after:opacity-100 transition-colors"
      />
      <button
        type="button"
        onClick={handleYellowClick}
        data-tooltip={TOOLTIPS.yellowbutton}
        data-tooltip-pos="below"
        className="w-2.5 h-2.5 rounded-full bg-viz-mac-yellow hover:bg-viz-mac-yellow/80 cursor-pointer relative group-hover/traffic:after:content-['−'] after:absolute after:inset-0 after:flex after:items-center after:justify-center after:text-[8px] after:text-black/40 after:font-bold after:opacity-0 hover:after:opacity-100 transition-colors"
      />
      <button
        type="button"
        className="w-2.5 h-2.5 rounded-full bg-[#28c840] hover:bg-[#28c840]/80 cursor-pointer relative group-hover/traffic:after:content-['+'] after:absolute after:inset-0 after:flex after:items-center after:justify-center after:text-[8px] after:text-black/40 after:font-bold after:opacity-0 hover:after:opacity-100 transition-colors" // tw-allow-hex
      />

    </div>
  );

  const renderedRight = right !== undefined ? right : (
    !isMinimized && (
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="hidden sm:flex items-center gap-4 text-term-dim font-mono text-[10px]">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              navigator.clipboard.writeText('justinsavioclarke@outlook.com');
              setCopiedToast(true);
              setTimeout(() => setCopiedToast(false), 2000);
            }}
            data-tooltip={TOOLTIPS.email}
            className="bg-transparent border-none p-0 outline-none hover:text-brand-primary transition-colors smooth-underline after:h-[1px] after:bg-brand-primary premium-text-hover cursor-pointer"
          >
            <span className="premium-target">email</span>
          </button>
          <a href="https://linkedin.com/in/justinsavioclarke" target="_blank" rel="noopener noreferrer" data-tooltip={TOOLTIPS.linkedin} className="hover:text-brand-primary transition-colors smooth-underline after:h-[1px] after:bg-brand-primary premium-text-hover"><span className="premium-target">linkedin</span></a>
          <a href="https://github.com/JustinClarke" target="_blank" rel="noopener noreferrer" data-tooltip={TOOLTIPS.github} className="hover:text-brand-primary transition-colors smooth-underline after:h-[1px] after:bg-brand-primary premium-text-hover"><span className="premium-target">github</span></a>
        </div>

        <div className="hidden sm:block flex items-center"><NowPlaying /></div>

        <button
          type="button"
          onClick={() => onCommand?.('game')}
          data-tooltip="you got games on your phone??"
          data-tooltip-pos="below"
          className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/5 text-viz-mac-yellow opacity-80 hover:opacity-100 transition-all cursor-pointer border-none outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="6" x2="10" y1="11" y2="11" />
            <line x1="8" x2="8" y1="9" y2="13" />
            <line x1="15" x2="15.01" y1="12" y2="12" />
            <line x1="18" x2="18.01" y1="10" y2="10" />
            <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z" />
          </svg>
        </button>

        <div
          data-tooltip={TOOLTIPS.shipping}
          data-tooltip-pos="below"
          className="flex items-center gap-1.5 bg-transparent sm:bg-brand-primary/[0.04] border-0 sm:border border-brand-primary/15 hover:bg-transparent sm:hover:bg-brand-primary/[0.08] hover:border-transparent sm:hover:border-brand-primary/30 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[9px] sm:text-[10px] text-brand-primary font-bold transition-all duration-300 shadow-[0_0_8px_rgba(0,200,180,0.02)] cursor-pointer select-none"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse shadow-[0_0_6px_var(--color-brand-primary)] shrink-0" />
          <span className="hidden sm:inline tracking-wider">shipping</span>
        </div>
      </div>
    )
  );

  return (
    <div className="relative">
      <div className="flex items-center h-10 px-4 border-b border-white/5 bg-white/[0.015] shrink-0">
        {showBackOnMobile ? (
          <>
            <div className="relative hidden sm:flex gap-2 group/traffic">
              {trafficLights}
            </div>
            <Link
              to="/"
              className="sm:hidden flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-term-fg/60 hover:text-brand-primary active:scale-95 transition-all select-none no-underline cursor-pointer"
            >
              <span className="text-viz-mac-red font-bold">←</span>
              <span>back</span>
            </Link>
          </>
        ) : (
          trafficLights
        )}

        <div className="flex-1 text-center font-mono text-[8px] md:text-[9px] text-term-faint tracking-[0.2em] uppercase opacity-60 truncate px-2">
          {url}
        </div>
        <div className="flex items-center gap-2 md:gap-4 text-term-dim font-mono text-[10px] shrink-0">
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
