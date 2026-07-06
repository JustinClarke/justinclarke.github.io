/**
 * TimelineCard one expandable entry (a job or a degree) in the career timeline.
 *
 * Fits in: rendered by CareerTimeline, once per entry, in both columns.
 * Note:    work entries are teal (brand-primary), education entries are amber.
 *          Every conditional class below hangs off the single `isWork` switch.
 */
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils';
import { Briefcase, GraduationCap, ChevronDown, Zap } from 'lucide-react';
import { TOOLTIPS, getTooltip } from '@/utils/tooltipContent';
import { type Entry } from '@/content/career';

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
      {/* The class pattern throughout this file: base classes, then a teal-or-amber
          ternary on `isWork`, then extras that apply only while `isExpanded`. */}
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
        {/* data-tooltip is read by the site-wide tooltip script (utils/tooltips)
            to show hover bubbles. */}
        <div className="p-5 md:p-6" data-tooltip={TOOLTIPS[entry.id as keyof typeof TOOLTIPS] || ''}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {/* Period + badges row */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={cn(
                  "font-mono text-micro tracking-mega uppercase font-bold transition-colors duration-300",
                  isWork
                    ? "text-brand-primary/45 group-hover:text-brand-primary/75"
                    : "text-amber/45 group-hover:text-amber/75"
                )}>
                  {entry.period}
                </span>
                {entry.ongoing && (
                  <span className={cn(
                    "inline-flex items-center gap-1.5 font-mono text-micro tracking-[0.15em] font-bold uppercase px-2 py-0.5 rounded-full transition-colors duration-300",
                    isWork
                      ? "bg-brand-primary/[0.04] text-brand-primary/55 border border-brand-primary/10"
                      : "bg-amber/[0.04] text-amber/55 border border-amber/10"
                  )}>
                    <span className={cn(
                      "w-1 h-1 rounded-full animate-pulse",
                      isWork ? "bg-brand-primary/50" : "bg-amber/50"
                    )} />
                    Active
                  </span>
                )}
                {entry.badge && (
                  <span className={cn(
                    "font-mono text-micro tracking-[0.15em] font-bold uppercase px-2 py-0.5 rounded-full",
                    isWork
                      ? "bg-brand-primary/8 text-brand-primary/60 border border-brand-primary/15"
                      : "bg-amber/8 text-amber/70 border border-amber/15"
                  )}>
                    {entry.badge}
                  </span>
                )}
                {entry.concurrent && (
                  <span className="font-mono text-micro tracking-wider text-fg-mid font-bold uppercase">
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
              <span className="font-mono text-micro tracking-tight text-fg-mid font-bold uppercase block mt-0.5">
                {entry.subtitle}
              </span>
            </div>

            {/* Expand chevron spins 180° when opened */}
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


          {/* Inline metrics (only for work entries that have them) */}
          {isWork && entry.metrics && (
            <div className="flex flex-wrap gap-4 mt-4">
              {entry.metrics.map((m, i) => (
                <div key={i} className="flex items-baseline gap-2">
                  <Zap className="w-2.5 h-2.5 text-brand-primary/50 flex-shrink-0 mt-0.5" />
                  <span className="font-noto text-sm font-black text-fg tabular-nums tracking-tight">
                    {m.value}
                  </span>
                  <span className="font-mono text-micro text-fg-mid font-bold uppercase tracking-wider">
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
                    "font-mono text-[9px] {/* tw-allow-micro */} px-1.5 py-0.5 rounded font-bold tracking-widest uppercase transition-colors duration-300",
                    isWork
                      ? "bg-brand-primary/[0.03] border border-[rgba(0,200,180,0.06)] text-brand-primary/30 group-hover:bg-brand-primary/[0.06] group-hover:text-brand-primary/50"
                      : "bg-amber/[0.03] border border-[rgba(245,158,11,0.06)] text-amber/30 group-hover:bg-amber/[0.06] group-hover:text-amber/50"
                  )}
                  data-tooltip={tagTooltip}
                >
                  {tag}
                </span>
              );
            })}
          </div>
        </div>

        {/* Expanded content. The open/close animation is pure CSS: `.exp-body`
            (index.css) is a grid whose row height tweens 0fr↔1fr off data-open
            React only flips the attribute. Grid-based so Safari animates it. */}
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
                {/* Per-bullet stagger flows through a --delay CSS var consumed by
                    delay-[var(--delay)] the contract's "dynamic values via CSS
                    var" rule, not an inline style prop. */}
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
                    <p className="font-mono text-fine leading-relaxed text-fg-mid">
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
