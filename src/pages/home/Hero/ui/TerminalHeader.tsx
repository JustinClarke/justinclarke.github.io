/**
 * TerminalHeader the "~$ whoami → justin clarke." block at the top of the hero
 * terminal: the name, role, and tech-stack badges that fade in on boot.
 *
 * Fits in: the first thing the Hero's boot sequence reveals. It reports back to
 *          the Hero via `onStepComplete` once its intro has played.
 * Note:    the staggered fade-ins are pure CSS (the `fadeIn` helper just sets an
 *          animation-delay); the only real logic is one timer that advances the
 *          boot sequence after the header has finished animating.
 */
import React, { memo, useEffect } from 'react';
import { TechStack } from '@/ui';
import { cn } from '@/utils';
import { SITE } from '@/content';

interface TerminalHeaderProps {
  bootStep: number;
  onStepComplete: (step: number) => void;
  showGradients?: boolean;
}

// Each element calls fadeIn(<ms>) to start its entrance a little later, producing
// the staggered boot reveal.
const fadeIn = (delay: number): React.CSSProperties => ({
  animation: `terminal-fade-in 0.5s cubic-bezier(0.215, 0.61, 0.355, 1) ${delay}ms both`,
});

export const TerminalHeader: React.FC<TerminalHeaderProps> = memo(({ bootStep, onStepComplete, showGradients = false }) => {
  // At boot step 0, wait 1.7s for the animation then advance the parent to step 7.
  useEffect(() => {
    if (bootStep !== 0) return;
    const timer = setTimeout(() => onStepComplete(7), 1700);
    return () => clearTimeout(timer);
  }, [bootStep, onStepComplete]);

  // Negative bootStep means "not ready yet" keep the header hidden until boot reaches it.
  if (bootStep < 0) return null;

  return (
    <div className="relative shrink-0 space-y-4 md:space-y-6 mt-6 md:mt-8 mb-4 md:mb-8">
      {/* Brand Ambient Glows - strictly behind the header text & badges (optimised without CSS filters for Safari 60fps performance) */}
      <div className={cn(
        "absolute -inset-10 pointer-events-none -z-10 select-none transition-opacity duration-1000",
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

      <div className="flex items-baseline gap-2 md:gap-3">
        <span className="font-mono text-fine md:text-xs text-brand-primary font-bold shrink-0 select-none" style={fadeIn(100)}>~$</span>
        <h1 className="leading-[0.9] tracking-tighter flex flex-col">
          <span className="font-mono text-3xl md:text-5xl lg:text-6xl font-black text-term-fg" style={fadeIn(300)}>{SITE.firstName.toLowerCase()}</span>
          <span className="font-playfair italic text-3xl md:text-5xl lg:text-6xl text-brand-primary font-black" style={fadeIn(450)}>{SITE.lastName.toLowerCase()}.</span>
        </h1>
      </div>

      <div className="space-y-2 md:space-y-3">
        <div className="flex items-baseline gap-2 md:gap-3">
          <span className="font-mono text-fine md:text-xs text-brand-primary font-bold shrink-0 select-none" style={fadeIn(650)}>~$</span>
          <span className="font-mono text-xs md:text-sm text-term-fg leading-relaxed block font-bold" style={fadeIn(850)}>data product engineer</span>
        </div>
        <div className="pl-4 md:pl-6 border-l border-edge-soft space-y-3.5 md:space-y-4">
          <div style={fadeIn(1050)}><TechStack animate /></div>
          <span className="font-mono text-xs md:text-sm text-term-dim leading-relaxed block" style={fadeIn(1250)}>Data to decisions & decisions into products</span>
        </div>
      </div>
    </div>
  );
});
