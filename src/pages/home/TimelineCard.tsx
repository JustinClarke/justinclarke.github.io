/**
 * TimelineCard one expandable entry (a job or a degree) in the career timeline.
 *
 * Fits in: rendered by CareerTimeline, once per entry, in both columns.
 * Note:    work entries are teal (brand-primary), education entries are amber.
 *          Every conditional class below hangs off the single `isWork` switch.
 *
 * For beginners ----------------------------------------------------------------
 * This is a "controlled" component: it keeps NO state of its own. The parent
 * passes in `isExpanded` (am I the open card?) and `onToggle` (call this when
 * clicked), so the card is purely "props in, markup out" the same template
 * stamped out for every entry with different data filled in.
 * -----------------------------------------------------------------------------
 */
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils';
import { Briefcase, GraduationCap, ChevronDown, Zap } from 'lucide-react';
import { TOOLTIPS, getTooltip } from '@/config/tooltips';
import { type Entry } from '@/data/timeline';

// LEARN: a TypeScript `interface` is the contract for the props this component
//    accepts misspell a prop or forget one at the call site and the compiler
//    complains before the browser ever runs it.
interface TimelineCardProps {
  entry: Entry;
  isExpanded: boolean;
  onToggle: () => void;
}

export const TimelineCard: React.FC<TimelineCardProps> = ({ entry, isExpanded, onToggle }) => {
  const isWork = entry.type === 'work';

  return (
    <div className="relative pl-10 md:pl-16 pb-2">
      {/* Timeline spine connector */}
      {/* LEARN: cn() joins class strings and drops falsy ones. The pattern all
          through this file is: base classes, then a teal-or-amber ternary on
          `isWork`, then extra classes that apply only while `isExpanded`. */}
      <div className={cn(
        "absolute left-[11.5px] md:left-[20.5px] top-0 bottom-0 w-px",
        isWork ? "bg-brand-primary/15" : "bg-amber/15"
      )} />

      {/* Node */}
      <div className={cn(
        "absolute left-0 md:left-2 top-6 w-[23px] h-[23px] md:w-[25px] md:h-[25px] rounded-full flex items-center justify-center z-10 transition-all duration-500",
        isWork
          ? "bg-surface border-2 border-brand-primary/60 shadow-[0_0_20px_rgba(0,200,180,0.25)]"
          : "bg-surface border-2 border-amber/60 shadow-[0_0_20px_rgba(245,158,11,0.25)]",
        isExpanded && (isWork
          ? "border-brand-primary shadow-[0_0_30px_rgba(0,200,180,0.5)]"
          : "border-amber shadow-[0_0_30px_rgba(245,158,11,0.5)]")
      )}>
        {isWork ? (
          <Briefcase className={cn(
            "w-3 h-3 transition-colors duration-300",
            isExpanded ? "text-brand-primary" : "text-brand-primary/60"
          )} />
        ) : (
          <GraduationCap className={cn(
            "w-3 h-3 transition-colors duration-300",
            isExpanded ? "text-amber" : "text-amber/60"
          )} />
        )}
      </div>

      {/* Card */}
      <div
        className={cn(
          "group relative rounded-2xl border overflow-hidden cursor-pointer transition-all duration-500",
          isWork
            ? "bg-fg/[0.03] border-edge-soft hover:bg-fg/[0.05] hover:border-[rgba(0,200,180,0.2)]"
            : "bg-fg/[0.03] border-edge-soft hover:bg-fg/[0.04] hover:border-[rgba(245,158,11,0.2)]",
          isExpanded && (isWork
            ? "bg-brand-primary/[0.05] border-[rgba(0,200,180,0.2)] shadow-[0_20px_60px_-15px_rgba(0,200,180,0.12)]"
            : "bg-amber/[0.05] border-[rgba(245,158,11,0.2)] shadow-[0_20px_60px_-15px_rgba(245,158,11,0.12)]")
        )}
        onClick={onToggle}
      >
        {/* Top accent line */}
        <div className={cn(
          "absolute top-0 left-0 right-0 h-[1px] transition-opacity duration-500",
          isWork
            ? "bg-gradient-to-r from-transparent via-brand-primary/40 to-transparent"
            : "bg-gradient-to-r from-transparent via-amber/40 to-transparent",
          isExpanded ? "opacity-100" : "opacity-0"
        )} />

        {/* Header (always visible) */}
        {/* LEARN: data-tooltip is a plain HTML data attribute; a site-wide
            script (src/utils/tooltips) finds these and shows hover bubbles.
            `as keyof typeof TOOLTIPS` tells TypeScript the id is a valid key. */}
        <div className="p-5 md:p-6" data-tooltip={TOOLTIPS[entry.id as keyof typeof TOOLTIPS] || ''}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {/* Period + badges row */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={cn(
                  "font-mono text-[9px] tracking-[0.2em] uppercase font-bold",
                  isWork ? "text-brand-primary/70" : "text-amber/70"
                )}>
                  {entry.period}
                </span>
                {entry.ongoing && (
                  <span className={cn(
                    "inline-flex items-center gap-1.5 font-mono text-[8px] tracking-[0.15em] font-bold uppercase px-2 py-0.5 rounded-full",
                    isWork
                      ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/20"
                      : "bg-amber/10 text-amber border border-amber/20"
                  )}>
                    <span className={cn(
                      "w-1 h-1 rounded-full animate-pulse",
                      isWork ? "bg-brand-primary" : "bg-amber"
                    )} />
                    Active
                  </span>
                )}
                {entry.badge && (
                  <span className={cn(
                    "font-mono text-[8px] tracking-[0.15em] font-bold uppercase px-2 py-0.5 rounded-full",
                    isWork
                      ? "bg-brand-primary/8 text-brand-primary/60 border border-brand-primary/15"
                      : "bg-amber/8 text-amber/70 border border-amber/15"
                  )}>
                    {entry.badge}
                  </span>
                )}
                {entry.concurrent && (
                  <span className="font-mono text-[8px] tracking-wider text-fg/25 font-bold uppercase">
                    ⟷ {entry.concurrent}
                  </span>
                )}
              </div>

              {/* Title + subtitle */}
              <h3 className={cn(
                "font-noto text-lg md:text-xl font-black text-fg tracking-tight leading-tight transition-colors duration-300",
                isWork ? "group-hover:text-brand-primary" : "group-hover:text-amber",
                isExpanded && (isWork ? "text-brand-primary" : "text-amber")
              )}>
                {entry.title}
              </h3>
              <span className="font-mono text-[10px] tracking-tight text-fg/35 font-bold uppercase block mt-0.5">
                {entry.subtitle}
              </span>
            </div>

            {/* Expand chevron */}
            {/* LEARN: motion.div is Framer Motion's animated <div>. Setting
                `animate` tells it the target pose; it tweens there on its own
                whenever the value changes (here: spin the arrow when opened). */}
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className={cn(
                "flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center border border-fg/5",
                isWork
                  ? "bg-brand-primary/5 text-brand-primary/60 group-hover:bg-brand-primary/10 group-hover:text-brand-primary group-hover:border-brand-primary/20"
                  : "bg-amber/5 text-amber/60 group-hover:bg-amber/10 group-hover:text-amber group-hover:border-amber/20",
                isExpanded && (isWork
                  ? "bg-brand-primary/15 text-brand-primary border-brand-primary/30"
                  : "bg-amber/15 text-amber border-amber/30")
              )}
            >
              <ChevronDown className="w-4 h-4" strokeWidth={2.5} />
            </motion.div>
          </div>

          {/* HUD Accent Brackets */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-fg/5 rounded-tl-2xl group-hover:border-fg/10 transition-colors pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-fg/5 rounded-br-2xl group-hover:border-fg/10 transition-colors pointer-events-none" />


          {/* Inline metrics (always visible for work entries with metrics) */}
          {/* LEARN: `a && b && <Thing />` renders <Thing /> only when both
              checks pass entries without metrics simply skip this block. */}
          {isWork && entry.metrics && (
            <div className="flex flex-wrap gap-4 mt-4">
              {entry.metrics.map((m, i) => (
                <div key={i} className="flex items-baseline gap-2">
                  <Zap className="w-2.5 h-2.5 text-brand-primary/50 flex-shrink-0 mt-0.5" />
                  <span className="font-noto text-sm font-black text-fg tabular-nums tracking-tight">
                    {m.value}
                  </span>
                  <span className="font-mono text-[10px] text-fg/30 font-bold uppercase tracking-wider">
                    {m.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Tags (always visible) */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {entry.tags.map(tag => {
              const tagTooltip = getTooltip(tag);
              return (
                <span
                  key={tag}
                  className={cn(
                    "font-mono text-[8px] px-2 py-0.5 rounded-md font-bold tracking-widest uppercase transition-colors duration-300",
                    isWork
                      ? "bg-brand-primary/5 border border-[rgba(0,200,180,0.1)] text-brand-primary/40 group-hover:text-brand-primary/60"
                      : "bg-amber/5 border border-[rgba(245,158,11,0.1)] text-amber/40 group-hover:text-amber/60"
                  )}
                  data-tooltip={tagTooltip}
                >
                  {tag}
                </span>
              );
            })}
          </div>
        </div>

        {/* Expanded content (CSS Grid Accordion for Safari) */}
        {/* LEARN: the open/close animation is pure CSS. `.exp-body` (defined in
            index.css) is a grid whose row height animates between 0fr and 1fr
            based on the data-open attribute React only flips the attribute. */}
        <div
          className="exp-body"
          data-open={isExpanded}
        >
          <div className="min-h-0">
            <div className={cn(
              "px-5 md:px-6 pb-6 pt-2",
              isWork ? "border-t border-[rgba(0,200,180,0.1)]" : "border-t border-[rgba(245,158,11,0.1)]"
            )}>
              <div className="space-y-2.5">
                {/* LEARN: each bullet gets a JS-computed stagger via a CSS
                    variable: the inline style sets --delay per bullet, and the
                    delay-[var(--delay)] utility consumes it (the Tailwind
                    contract's "dynamic values flow through CSS vars" rule). */}
                {entry.bullets.map((b, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex items-start gap-2.5 transition-all duration-500 delay-[var(--delay)]",
                      isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                    )}
                    style={{ '--delay': `${0.05 + i * 0.05}s` } as React.CSSProperties}
                  >
                    <span className={cn(
                      "mt-[7px] w-3 h-px flex-shrink-0",
                      isWork ? "bg-brand-primary/40" : "bg-amber/30"
                    )} />
                    <p className="font-mono text-[11px] leading-relaxed text-fg/50">
                      {b}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
