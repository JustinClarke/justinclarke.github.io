/**
 * InteractiveHint a glowing "scroll / try me" pill with an icon and label.
 *
 * Fits in: nudges the visitor toward an interaction (e.g. "scroll to explore").
 * Note:    shows different text on mobile vs desktop via two spans toggled by
 *          Tailwind's `hidden md:inline` / `inline md:hidden` responsive classes.
 *
 * For beginners ----------------------------------------------------------------
 * `icon: Icon` renames the `icon` prop to `Icon` (capital I) so JSX will treat
 * it as a component you can render as <Icon />. Lowercase names are read as
 * plain HTML tags, so the capital letter matters.
 * -----------------------------------------------------------------------------
 */
import React from 'react';
import { ScrollReveal } from './ScrollReveal';
import { LucideIcon } from 'lucide-react';

interface InteractiveHintProps {
  text: string;
  mobileText?: string;
  icon: LucideIcon;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  className?: string;
}

export const InteractiveHint: React.FC<InteractiveHintProps> = ({
  text,
  mobileText,
  icon: Icon,
  delay = 0.2,
  direction = 'left',
  distance = 12,
  className = '',
}) => {
  return (
    <ScrollReveal delay={delay} direction={direction} distance={distance} className={`w-fit shrink-0 ${className}`}>
      <div className="group relative flex items-center gap-2.5 md:gap-3.5 px-3.5 py-1.5 md:px-6 md:py-3 rounded-full bg-brand-primary/[0.03] md:bg-brand-primary/10 backdrop-blur-2xl border border-brand-primary/15 md:border-brand-primary/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_0_10px_rgba(0,200,180,0.08)] md:shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_0_25px_rgba(0,200,180,0.25)] transition-all duration-500 cursor-default hover:bg-brand-primary/20 hover:scale-105 hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_0_35px_rgba(0,200,180,0.4)] hover:border-brand-primary/60">
        {/* Continuous breathing background (desktop only) */}
        <div className="absolute inset-0 rounded-full bg-brand-primary/10 animate-pulse pointer-events-none hidden md:block" style={{ animationDuration: '3s' }} />
        
        {/* Glowing icon */}
        <div className="relative z-10 flex items-center justify-center">
          <div className="absolute inset-0 bg-brand-primary/30 md:bg-brand-primary/50 rounded-full blur-md" />
          <Icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-brand-primary relative transition-transform duration-500 group-hover:-rotate-12" strokeWidth={2.5} />
        </div>
        
        <span className="font-mono text-[9px] md:text-[10px] sm:text-xs text-white/80 md:text-white tracking-[0.2em] md:tracking-[0.25em] uppercase font-bold md:font-black relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] whitespace-nowrap">
          <span className="hidden md:inline">{text}</span>
          <span className="inline md:hidden">{mobileText || text}</span>
        </span>
      </div>
    </ScrollReveal>
  );
};
