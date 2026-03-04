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
}

export const WindowChrome: React.FC<WindowChromeProps> = ({
  url = 'justinclarke@portfolio: ~',
  right,
  showBackOnMobile = false,
  onMinimize,
  isMinimized = false,
  onCloseConfirm
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
      <button
        type="button"
        onClick={handleRedClick}
        className="w-2.5 h-2.5 rounded-full bg-viz-mac-red hover:bg-viz-mac-red/80 cursor-pointer relative group-hover/traffic:after:content-['×'] after:absolute after:inset-0 after:flex after:items-center after:justify-center after:text-[8px] after:text-black/40 after:font-bold after:opacity-0 hover:after:opacity-100 transition-colors"
      />
      <button
        type="button"
        onClick={handleYellowClick}
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

        <div className="hidden sm:block w-[1px] h-3 bg-white/10" />
        <div className="hidden sm:block flex items-center"><NowPlaying /></div>
        <div className="hidden sm:block w-[1px] h-3 bg-white/10" />

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
        <div className="fixed top-6 right-6 z-[100] bg-[#0c1110] border border-brand-primary/40 px-5 py-3 rounded-xl shadow-[0_15px_30px_rgba(0,0,0,0.6)] flex items-center gap-3 animate-fade-in font-mono text-xs text-brand-primary">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
          <span>EMAIL COPIED TO CLIPBOARD</span>
        </div>
      )}
    </div>
  );
};
