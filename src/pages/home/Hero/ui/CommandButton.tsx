/**
 * CommandButton one styled button in the sidebar's CONTROLS menu (the numbered
 * "01 resumé", "02 connect" rows, plus the big featured-project tile).
 *
 * Fits in: rendered by SidebarMenu, once per menu item.
 * Note:    this file is almost entirely STYLING. The same component renders three
 *          looks a `large` tile, the special `the long version` row, and the
 *          plain default chosen by the boolean props. There's barely any logic;
 *          the length comes from the three className/markup branches.
 *
 * For beginners ----------------------------------------------------------------
 * `cn(...)` is a helper that stitches class names together and quietly drops any
 * that are false. So `important && "highlight"` adds "highlight" ONLY when
 * `important` is true that's how a prop toggles a look. Reading these blocks,
 * focus on which branch runs (`large` ? … : `isLongVersion` ? … : default); the
 * Tailwind strings inside are just CSS.
 * -----------------------------------------------------------------------------
 */
import React from 'react';
import { cn } from '@/utils';

export interface CommandButtonProps {
  num: string;
  cmd: string;
  desc: string;
  hot?: boolean;
  important?: boolean;
  large?: boolean;
  badge?: React.ReactNode;  // LEARN: ReactNode = any renderable content; here, ProjectShowcase
  alignTop?: boolean;
  tooltip?: string;
  onClick?: () => void;
  className?: string;
}

export const CommandButton: React.FC<CommandButtonProps> = ({ num, cmd, desc, hot, important, large, badge, alignTop, tooltip, onClick, className }) => {
  // LEARN: One flag computed up front; the markup below picks its variant from this
  //    plus the `large` prop. Naming it once keeps the JSX conditions readable.
  const isLongVersion = cmd === 'the long version';

  return (
    <button
      onClick={onClick}
      data-tooltip={tooltip}
      data-tooltip-pos="below"
      className={cn(
        "flex w-full rounded-lg border group/btn text-left relative transition-all duration-500 justify-between",
        large ? "overflow-hidden" : "overflow-hidden",
        large
          ? "flex-col items-stretch p-3 md:flex-1 md:min-h-0 md:h-full hover:scale-[1.01] hover:border-f1-red/30"
          : ((large && alignTop) ? "items-start" : "items-center p-3"),
        isLongVersion
          ? "bg-[rgba(102,14,29,0.06)] border-[rgba(216,207,192,0.18)] hover:border-[rgba(216,207,192,0.55)] hover:bg-[rgba(102,14,29,0.18)] text-f1-white hover:text-white hover:shadow-[0_10px_30px_-10px_rgba(102,14,29,0.12)]"
          : important
            ? "bg-brand-primary/10 border-brand-primary text-f1-white shadow-[0_0_20px_rgba(0,200,180,0.1)] scale-[1.02] important-control"
            : hot
              ? "bg-brand-primary/5 border-brand-primary/30 text-f1-white"
              : large
                ? "bg-transparent border-f1-red/20 md:border-white/5 text-f1-white"
                : "bg-transparent border-white/5 text-f1-white",
        (!isLongVersion && !large) && "system-control-hover",
        className
      )}
    >
      {/* Left accent spine  - bolder, grows on hover */}
      <div className={cn(
        "absolute left-0 top-2 bottom-2 transition-all duration-300 rounded-r-sm w-[3px] z-20",
        (!isLongVersion && !large) && "bg-brand-primary/20 group-hover/btn:bg-brand-primary group-hover/btn:shadow-[0_0_10px_rgba(0,200,180,0.6)] group-hover/btn:top-0 group-hover/btn:bottom-0",
        large && "bg-f1-red/20 group-hover/btn:bg-f1-red group-hover/btn:shadow-[0_0_10px_rgba(225,6,0,0.6)] group-hover/btn:top-0 group-hover/btn:bottom-0",
        isLongVersion && "bg-[oklch(96.5%_0.012_78)]/30 group-hover/btn:bg-[oklch(96.5%_0.012_78)] group-hover/btn:shadow-[0_0_8px_rgba(255,255,255,0.4)] group-hover/btn:top-0 group-hover/btn:bottom-0"
      )} />

      {important && (
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_3s_infinite]" />
      )}

      {/* LEARN: The three-way variant switch. `large ? (…) : isLongVersion ? (…) : (…)`
            renders exactly ONE of the three layouts. This nested-ternary-in-JSX is a
            common React idiom for "pick one of N templates". */}
      {large ? (
        <div className="flex flex-col md:h-full w-full relative z-10 gap-3">
          {/* Header row consistent with other items, floating elegantly on the top vignette */}
          <div className="flex items-center justify-between w-full relative z-20">
            <div className="hidden md:flex items-center gap-3">
              <div className="w-2 flex justify-center">
                <div className={cn("indicator-light bg-f1-red/60 group-hover/btn:!bg-f1-red group-hover/btn:!shadow-[0_0_6px_rgba(225,6,0,0.8)] transition-all duration-300")} />
              </div>

              <div className="flex items-center gap-2">
                <span className={cn(
                  "font-mono font-bold inline-flex items-center justify-center px-1.5 h-[18px] rounded-[4px] border transition-colors duration-300 text-[9px] md:text-[10px]",
                  "text-f1-grey border-white/5 bg-white/[0.015] group-hover/btn:text-f1-red group-hover/btn:border-f1-red/30 group-hover/btn:bg-f1-red/5"
                )}>{num}</span>
                <span className="font-noto font-black tracking-tight text-[13px] uppercase transition-colors duration-300 text-f1-white group-hover/btn:text-f1-red">
                  {cmd}
                </span>
              </div>
            </div>

            {desc && (
              <div className="hidden md:flex ml-auto items-center gap-2 relative z-10">
                <div className="font-mono tracking-tight whitespace-nowrap text-right text-[9px] uppercase text-f1-grey-dark group-hover/btn:text-f1-grey transition-colors duration-300">
                  {desc}
                </div>
                <span className="font-mono text-[13px] leading-none text-brand-primary transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] inline-block opacity-0 group-hover/btn:opacity-100 -translate-x-3 group-hover/btn:translate-x-0">
                  →
                </span>
              </div>
            )}
          </div>

          {/* Top vignette gradient for premium legibility and camera-like shadow */}
          <div
            className="hidden md:block absolute -inset-3 bottom-auto h-28 pointer-events-none z-[5] rounded-t-lg"
            style={{
              background: 'linear-gradient(to bottom, rgba(11,15,18,0.95) 0%, rgba(11,15,18,0.7) 40%, rgba(11,15,18,0.2) 75%, transparent 100%)',
            }}
          />

          {/* Badge Showcase */}
          <div className="flex-1 min-h-0 w-full">
            {badge}
          </div>
        </div>
      ) : isLongVersion ? (
        <>
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-2 flex justify-center">
              <div className="indicator-light bg-[oklch(96.5%_0.012_78)]/50 group-hover/btn:!bg-[oklch(96.5%_0.012_78)] group-hover/btn:!shadow-[0_0_6px_rgba(255,255,255,0.6)] group-hover/btn:!animate-none transition-all duration-300" />
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono font-bold hidden md:inline-flex items-center justify-center px-1.5 h-[18px] rounded-[4px] border text-[9px] text-f1-grey border-white/5 bg-white/[0.015] group-hover/btn:text-[oklch(96.5%_0.012_78)] group-hover/btn:border-[oklch(96.5%_0.012_78)]/40 group-hover/btn:bg-[oklch(96.5%_0.012_78)]/10 transition-colors duration-300">{num}</span>
              <span className="font-playfair italic font-extrabold tracking-tight text-[18px] md:text-[19px] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/btn:translate-x-2.5 group-hover/btn:scale-[1.05] inline-block origin-left">
                the long version
              </span>
            </div>
          </div>

          <div className="ml-auto hidden md:flex items-center gap-2 relative z-10">
            <div className="font-mono tracking-tight whitespace-nowrap text-right text-[9px] text-f1-grey-dark group-hover/btn:text-f1-grey transition-colors duration-300">
              {desc}
            </div>
            <span className="font-mono text-[13px] leading-none text-brand-primary transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] inline-block opacity-0 group-hover/btn:opacity-100 -translate-x-3 group-hover/btn:translate-x-0">
              →
            </span>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-2 flex justify-center">
              <div className={cn("indicator-light bg-brand-primary/60 group-hover/btn:bg-brand-primary group-hover/btn:shadow-[0_0_6px_rgba(0,255,196,0.6)] transition-all duration-300")} />
            </div>

            <div className="flex items-center gap-2">
              <span className={cn(
                "font-mono font-bold hidden md:inline-flex items-center justify-center px-1.5 h-[18px] rounded-[4px] border transition-colors duration-300 text-[9px]",
                important
                  ? "text-brand-primary border-brand-primary/40 bg-brand-primary/10"
                  : "text-f1-grey border-white/5 bg-white/[0.015] group-hover/btn:text-brand-primary group-hover/btn:border-brand-primary/30 group-hover/btn:bg-brand-primary/5"
              )}>{num}</span>
              <span className={cn(
                "font-noto font-black tracking-tight text-[13px] uppercase transition-colors duration-300",
                (hot || important) ? "text-brand-primary" : "text-f1-white group-hover/btn:text-brand-primary"
              )}>
                {cmd}
              </span>
            </div>
          </div>

          <div className="ml-auto hidden md:flex items-center gap-2 relative z-10">
            <div className="font-mono tracking-tight whitespace-nowrap text-right text-[9px] uppercase text-f1-grey-dark group-hover/btn:text-f1-grey transition-colors duration-300">
              {desc}
            </div>
            <span className={cn(
              "font-mono text-[13px] leading-none text-brand-primary transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] inline-block",
              "opacity-0 group-hover/btn:opacity-100",
              num === '01'
                ? "-translate-y-2 group-hover/btn:translate-y-0"
                : "-translate-x-3 group-hover/btn:translate-x-0"
            )}>
              {num === '01' ? '↓' : '→'}
            </span>
          </div>
        </>
      )}
    </button>
  );
};
