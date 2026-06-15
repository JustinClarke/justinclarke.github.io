/**
 * TerminalHeader the "~$ whoami → justin clarke." block at the top of the hero
 * terminal: the name, role, and tech-stack badges that fade in on boot.
 *
 * Fits in: the first thing the Hero's boot sequence reveals. It reports back to
 *          the Hero via `onStepComplete` once its intro has played.
 * Note:    the staggered fade-ins are pure CSS (the `fadeIn` helper just sets an
 *          animation-delay); the only real logic is one timer that advances the
 *          boot sequence after the header has finished animating.
 *
 * For beginners ----------------------------------------------------------------
 * `memo(...)` wraps the component so React skips re-rendering it when its props
 * haven't changed a small speed-up for a header that rarely updates. The
 * component "talks back" to its parent by calling the `onStepComplete` function
 * it was handed, the same way an HTML button calls an onclick.
 * -----------------------------------------------------------------------------
 */
import React, { memo, useEffect } from 'react';
import { TechStack } from '@/ui';
import { cn } from '@/utils';

interface TerminalHeaderProps {
  bootStep: number;
  onStepComplete: (step: number) => void;
  showGradients?: boolean;
}

// LEARN: A helper that returns an inline-style object. `React.CSSProperties` is the
//    type for "a bag of CSS properties". Each element calls fadeIn(<ms>) to start
//    its entrance animation a little later, producing the staggered reveal.
const fadeIn = (delay: number): React.CSSProperties => ({
  animation: `terminal-fade-in 0.5s cubic-bezier(0.215, 0.61, 0.355, 1) ${delay}ms both`,
});

export const TerminalHeader: React.FC<TerminalHeaderProps> = memo(({ bootStep, onStepComplete, showGradients = false }) => {
  // LEARN: When this is the first boot step (0), wait 1.7s for the animation to play,
  //    then tell the parent to advance to step 7. The cleanup `clearTimeout` cancels
  //    the timer if the component unmounts or `bootStep` changes before it fires  
  //    otherwise we could call onStepComplete on a component that's already gone.
  useEffect(() => {
    if (bootStep !== 0) return;
    const timer = setTimeout(() => onStepComplete(7), 1700);
    return () => clearTimeout(timer);
  }, [bootStep, onStepComplete]);

  // LEARN: Returning `null` from a component renders nothing. Here a negative bootStep
  //    means "not ready yet", so the header stays hidden until the boot reaches it.
  if (bootStep < 0) return null;

  return (
    <div className="relative shrink-0 space-y-4 md:space-y-6 mb-4 md:mb-8">
      {/* Brand Ambient Glows - strictly behind the header text & badges (optimised without CSS filters for Safari 60fps performance) */}
      <div className={cn(
        "absolute -inset-10 pointer-events-none -z-10 hidden md:block select-none transition-opacity duration-1000",
        showGradients ? "opacity-100" : "opacity-0"
      )}>
        {/* Python Blue */}
        <div
          className="absolute left-[5%] top-[10%] w-[320px] h-[320px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(75,139,190,0.28) 0%, rgba(75,139,190,0.14) 30%, rgba(75,139,190,0.04) 60%, transparent 100%)' }}
        />
        {/* dbt Orange */}
        <div
          className="absolute left-[18%] top-[30%] w-[260px] h-[260px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,105,75,0.22) 0%, rgba(255,105,75,0.10) 30%, rgba(255,105,75,0.02) 60%, transparent 100%)' }}
        />
        {/* Power BI Gold */}
        <div
          className="absolute left-[28%] top-[40%] w-[220px] h-[220px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(253,191,43,0.20) 0%, rgba(253,191,43,0.08) 30%, rgba(253,191,43,0.015) 60%, transparent 100%)' }}
        />
      </div>

      <div className="space-y-1 md:space-y-2">
        <div className="flex items-center gap-2 md:gap-3" style={fadeIn(100)}>
          <span className="font-mono text-[11px] md:text-xs text-brand-primary font-bold">~$</span>
          <span className="font-mono text-[11px] md:text-xs text-term-fg">whoami</span>
        </div>
        <div className="pl-4 md:pl-6">
          <h1 className="leading-[0.9] tracking-tighter flex flex-col">
            <span className="font-mono text-3xl md:text-5xl lg:text-6xl font-black text-term-fg" style={fadeIn(300)}>justin</span>
            <span className="font-playfair italic text-3xl md:text-5xl lg:text-6xl text-brand-primary font-black" style={fadeIn(450)}>clarke.</span>
          </h1>
        </div>
      </div>

      <div className="space-y-1 md:space-y-2">
        <div className="flex items-center gap-2 md:gap-3" style={fadeIn(650)}>
          <span className="font-mono text-[11px] md:text-xs text-brand-primary font-bold">~$</span>
          <span className="font-mono text-[11px] md:text-xs text-term-dim">profile.read()</span>
        </div>
        <div className="pl-4 md:pl-6 border-l border-white/5 space-y-3.5 md:space-y-4">
          <span className="font-mono text-xs md:text-sm text-term-fg leading-relaxed block font-bold" style={fadeIn(850)}>data & analytics developer.</span>
          <div style={fadeIn(1050)}><TechStack animate /></div>
          <span className="font-mono text-xs md:text-sm text-term-dim leading-relaxed block" style={fadeIn(1250)}>Data to decisions & decisions into products</span>
        </div>
      </div>
    </div>
  );
});
