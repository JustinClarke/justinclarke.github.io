import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils';
import { ScrollReveal } from '@/ui';
import {
  Briefcase,
  GraduationCap,
  ChevronDown,
  Zap,
} from 'lucide-react';
import { TOOLTIPS } from '@/config/tooltips';

/* ── Data ──────────────────────────────────────────────── */

interface Entry {
  id: string;
  type: 'work' | 'edu';
  title: string;
  subtitle: string;
  period: string;
  start: number;
  end: number;
  badge?: string;
  ongoing?: boolean;
  tags: string[];
  bullets: string[];
  metrics?: { value: string; label: string }[];
  concurrent?: string;
}

const ENTRIES: Entry[] = [
  {
    id: 'vns',
    type: 'work',
    title: 'VNS Solutions',
    subtitle: 'Analytics Engineer',
    period: 'Jan 2024 – Jan 2026',
    start: 2024.0,
    end: 2026.0,
    tags: ['Microsoft Fabric', 'Power BI', 'SQL', 'Python'],
    metrics: [
      { value: '↓ 12+ hrs/wk', label: 'Manual work automated' },
      { value: 'End-to-end', label: 'Analytics loop ownership' },
    ],
    bullets: [
      'Owned the product analytics loop: usage insights → architecture decisions → engineering priorities',
      'Built KPI dashboards and event-tracking analytics in Power BI / Microsoft Fabric',
      'Developed backend APIs and internal tools supporting the analytics stack',
    ],
  },
  {
    id: 'litestore',
    type: 'work',
    title: 'LiteStore',
    subtitle: 'Technical Lead, Full Stack & Web Performance',
    period: 'Apr 2021 – Apr 2023',
    start: 2021.34,
    end: 2023.3,
    tags: ['Next.js', 'AWS', 'Vercel', 'GA4'],
    concurrent: 'BTech → MSc',
    metrics: [
      { value: '↑ 20%', label: 'Conversion via A/B tests' },
      { value: '3.0s → 0.6s', label: 'Page load (SSR + caching)' },
    ],
    bullets: [
      'Sole engineer on a production serverless platform — BTech final year through MSc completion at Queen Mary',
      'Built event tracking and behavioural telemetry pipelines (GA4) feeding conversion + funnel dashboards',
      'CI/CD pipelines with automated testing · SSR + edge caching for 5× page load improvement',
    ],
  },
  {
    id: 'drop',
    type: 'work',
    title: 'Drop',
    subtitle: 'Frontend Developer',
    period: 'Jan – Apr 2021',
    start: 2021.0,
    end: 2021.28,
    tags: ['React', 'TypeScript'],
    concurrent: 'During BTech',
    bullets: [
      'Built and shipped React frontend features within a fast-paced agile team.',
    ],
  },
  {
    id: 'mba',
    type: 'edu',
    title: 'Birla Institute of Technology and Science, Pilani',
    subtitle: 'MBA in Business Analytics',
    period: 'Feb 2026 – 2028',
    start: 2026.1,
    end: 2028.5,
    ongoing: true,
    tags: ['Analytics', 'Strategy', 'ML'],
    bullets: [
      'Intersection of data analytics and business strategy. Evening programme — fully available for full-time roles.',
    ],
  },
  {
    id: 'msc',
    type: 'edu',
    title: 'Queen Mary, University of London',
    subtitle: 'MSc in Computer Science',
    period: '2022 – 2023',
    start: 2022.75,
    end: 2023.75,
    // badge: 'Distinction',
    tags: ['Python', 'ML', 'Research'],
    // concurrent: 'With LiteStore',
    bullets: [
      'Distinction in semi-structured data analysis · ML model for music recommendation · completed alongside the LiteStore Tech Lead role',
    ],
  },
  {
    id: 'btech',
    type: 'edu',
    title: 'Gandhi Institute of Technology and Management',
    subtitle: 'BTech, Computer Science & Engineering',
    period: '2018 – 2022',
    start: 2018.6,
    end: 2022.5,
    badge: 'Distinction',
    tags: ['C/C++', 'Algorithms', 'Maths'],
    bullets: [
      'Algorithms, optimisation, and advanced mathematics. Entered the workforce in the final years — Drop and LiteStore both began before graduation.',
    ],
  },
];

/* ── Timeline Card ─────────────────────────────────────── */

interface TimelineCardProps {
  entry: Entry;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}

const TimelineCard: React.FC<TimelineCardProps> = ({ entry, index, isExpanded, onToggle }) => {
  const isWork = entry.type === 'work';
  const accentColor = isWork ? 'brand-primary' : '[#f59e0b]';

  return (
    <div className="relative pl-10 md:pl-16 pb-2">
      {/* Timeline spine connector */}
      <div className={cn(
        "absolute left-[11.5px] md:left-[20.5px] top-0 bottom-0 w-px",
        isWork ? "bg-brand-primary/15" : "bg-[#f59e0b]/15"
      )} />

      {/* Node */}
      <div className={cn(
        "absolute left-0 md:left-2 top-6 w-[23px] h-[23px] md:w-[25px] md:h-[25px] rounded-full flex items-center justify-center z-10 transition-all duration-500",
        isWork
          ? "bg-brand-bg border-2 border-brand-primary/60 shadow-[0_0_20px_rgba(0,200,180,0.25)]"
          : "bg-brand-bg border-2 border-[#f59e0b]/60 shadow-[0_0_20px_rgba(245,158,11,0.25)]",
        isExpanded && (isWork
          ? "border-brand-primary shadow-[0_0_30px_rgba(0,200,180,0.5)]"
          : "border-[#f59e0b] shadow-[0_0_30px_rgba(245,158,11,0.5)]")
      )}>
        {isWork ? (
          <Briefcase className={cn(
            "w-3 h-3 transition-colors duration-300",
            isExpanded ? "text-brand-primary" : "text-brand-primary/60"
          )} />
        ) : (
          <GraduationCap className={cn(
            "w-3 h-3 transition-colors duration-300",
            isExpanded ? "text-[#f59e0b]" : "text-[#f59e0b]/60"
          )} />
        )}
      </div>

      {/* Card */}
      <div
        className={cn(
          "group relative rounded-2xl border overflow-hidden cursor-pointer transition-all duration-500",
          isWork
            ? "bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05] hover:border-brand-primary/20"
            : "bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.04] hover:border-[#f59e0b]/20",
          isExpanded && (isWork
            ? "bg-brand-primary/[0.05] border-brand-primary/20 shadow-[0_20px_60px_-15px_rgba(0,200,180,0.12)]"
            : "bg-[#f59e0b]/[0.05] border-[#f59e0b]/20 shadow-[0_20px_60px_-15px_rgba(245,158,11,0.12)]")
        )}
        onClick={onToggle}
      >
        {/* Top accent line */}
        <div className={cn(
          "absolute top-0 left-0 right-0 h-[1px] transition-opacity duration-500",
          isWork
            ? "bg-gradient-to-r from-transparent via-brand-primary/40 to-transparent"
            : "bg-gradient-to-r from-transparent via-[#f59e0b]/40 to-transparent",
          isExpanded ? "opacity-100" : "opacity-0"
        )} />

        {/* Header (always visible) */}
        <div className="p-5 md:p-6" data-tooltip={TOOLTIPS[entry.id as keyof typeof TOOLTIPS] || ''}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {/* Period + badges row */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={cn(
                  "font-mono text-[9px] tracking-[0.2em] uppercase font-bold",
                  isWork ? "text-brand-primary/70" : "text-[#f59e0b]/70"
                )}>
                  {entry.period}
                </span>
                {entry.ongoing && (
                  <span className={cn(
                    "inline-flex items-center gap-1.5 font-mono text-[8px] tracking-[0.15em] font-bold uppercase px-2 py-0.5 rounded-full",
                    isWork
                      ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/20"
                      : "bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20"
                  )}>
                    <span className={cn(
                      "w-1 h-1 rounded-full animate-pulse",
                      isWork ? "bg-brand-primary" : "bg-[#f59e0b]"
                    )} />
                    Active
                  </span>
                )}
                {entry.badge && (
                  <span className={cn(
                    "font-mono text-[8px] tracking-[0.15em] font-bold uppercase px-2 py-0.5 rounded-full",
                    isWork
                      ? "bg-brand-primary/8 text-brand-primary/60 border border-brand-primary/15"
                      : "bg-[#f59e0b]/8 text-[#f59e0b]/70 border border-[#f59e0b]/15"
                  )}>
                    {entry.badge}
                  </span>
                )}
                {entry.concurrent && (
                  <span className="font-mono text-[8px] tracking-wider text-white/25 font-bold uppercase">
                    ⟷ {entry.concurrent}
                  </span>
                )}
              </div>

              {/* Title + subtitle */}
              <h3 className={cn(
                "font-noto text-lg md:text-xl font-black text-white tracking-tight leading-tight transition-colors duration-300",
                isWork ? "group-hover:text-brand-primary" : "group-hover:text-[#f59e0b]",
                isExpanded && (isWork ? "text-brand-primary" : "text-[#f59e0b]")
              )}>
                {entry.title}
              </h3>
              <span className="font-mono text-[10px] tracking-tight text-white/35 font-bold uppercase block mt-0.5">
                {entry.subtitle}
              </span>
            </div>

            {/* Expand chevron */}
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className={cn(
                "flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center border border-white/5",
                isWork
                  ? "bg-brand-primary/5 text-brand-primary/60 group-hover:bg-brand-primary/10 group-hover:text-brand-primary group-hover:border-brand-primary/20"
                  : "bg-[#f59e0b]/5 text-[#f59e0b]/60 group-hover:bg-[#f59e0b]/10 group-hover:text-[#f59e0b] group-hover:border-[#f59e0b]/20",
                isExpanded && (isWork
                  ? "bg-brand-primary/15 text-brand-primary border-brand-primary/30"
                  : "bg-[#f59e0b]/15 text-[#f59e0b] border-[#f59e0b]/30")
              )}
            >
              <ChevronDown className="w-4 h-4" strokeWidth={2.5} />
            </motion.div>
          </div>

          {/* HUD Accent Brackets */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-white/5 rounded-tl-2xl group-hover:border-white/10 transition-colors pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-white/5 rounded-br-2xl group-hover:border-white/10 transition-colors pointer-events-none" />


          {/* Inline metrics (always visible for work entries with metrics) */}
          {isWork && entry.metrics && (
            <div className="flex flex-wrap gap-4 mt-4">
              {entry.metrics.map((m, i) => (
                <div key={i} className="flex items-baseline gap-2">
                  <Zap className="w-2.5 h-2.5 text-brand-primary/50 flex-shrink-0 mt-0.5" />
                  <span className="font-noto text-sm font-black text-white tabular-nums tracking-tight">
                    {m.value}
                  </span>
                  <span className="font-mono text-[10px] text-white/30 font-bold uppercase tracking-wider">
                    {m.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Tags (always visible) */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {entry.tags.map(tag => {
              const tagKey = tag.toLowerCase().replace(/[\s\/]/g, '');
              const tagTooltip = TOOLTIPS[tagKey as keyof typeof TOOLTIPS];
              return (
                <span
                  key={tag}
                  className={cn(
                    "font-mono text-[8px] px-2 py-0.5 rounded-md font-bold tracking-widest uppercase transition-colors duration-300",
                    isWork
                      ? "bg-brand-primary/5 border border-brand-primary/10 text-brand-primary/40 group-hover:text-brand-primary/60"
                      : "bg-[#f59e0b]/5 border border-[#f59e0b]/10 text-[#f59e0b]/40 group-hover:text-[#f59e0b]/60"
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
        <div
          className="exp-body"
          data-open={isExpanded}
        >
          <div className="min-h-0">
            <div className={cn(
              "px-5 md:px-6 pb-6 pt-2",
              isWork ? "border-t border-brand-primary/10" : "border-t border-[#f59e0b]/10"
            )}>
              <div className="space-y-2.5">
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
                      isWork ? "bg-brand-primary/40" : "bg-[#f59e0b]/30"
                    )} />
                    <p className="font-mono text-[11px] leading-relaxed text-white/50">
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

/* ── Year Progress Bar ─────────────────────────────────── */

const YEAR_START = 2018;
const YEAR_END = 2028;

const YearProgressBar: React.FC = () => {
  const currentYear = 2026;
  const totalSpan = YEAR_END - YEAR_START;
  const progressPercent = ((currentYear - YEAR_START) / totalSpan) * 100;
  const ticks = [2018, 2020, 2022, 2024, 2026, 2028];

  return (
    <div className="relative mt-6 md:mt-10 mb-10 md:mb-14">
      {/* Background track */}
      <div className="relative h-[2px] bg-white/5 rounded-full overflow-visible">
        {/* Fill */}
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-primary/60 via-brand-primary to-brand-primary/80 rounded-full"
          initial={{ width: 0 }}
          whileInView={{ width: `${progressPercent}%` }}
          transition={{ duration: 1.4, ease: [0.23, 1, 0.32, 1], delay: 0.3 }}
          viewport={{ once: true }}
        />
        {/* Leading glow dot with arrow head */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 z-10"
          initial={{ left: 0, opacity: 0 }}
          whileInView={{ left: `${progressPercent}%`, opacity: 1 }}
          transition={{ duration: 1.4, ease: [0.23, 1, 0.32, 1], delay: 0.3 }}
          viewport={{ once: true }}
          style={{ marginLeft: '-6px' }}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute w-2.5 h-2.5 rounded-full bg-brand-primary shadow-[0_0_15px_rgba(0,200,180,0.6)]" />
            <div className="absolute left-[70%] w-0 h-0 border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent border-l-[5px] border-l-brand-primary" />
          </div>
        </motion.div>
      </div>

      {/* Tick marks */}
      <div className="relative flex justify-between mt-3">
        {ticks.map((year) => {
          const pct = ((year - YEAR_START) / totalSpan) * 100;
          const isCurrent = year === currentYear;
          const isPast = year < currentYear;
          return (
            <div
              key={year}
              className="flex flex-col items-center"
              style={{ position: 'absolute', left: `${pct}%`, transform: 'translateX(-50%)' }}
            >
              <div className={cn(
                "w-px h-2 mb-1",
                isCurrent ? "bg-brand-primary" : isPast ? "bg-white/15" : "bg-white/5"
              )} />
              <span className={cn(
                "font-mono text-[9px] tabular-nums font-bold",
                isCurrent ? "text-brand-primary" : isPast ? "text-white/25" : "text-white/10"
              )}>
                {year}
              </span>
              {isCurrent && (
                <span className="font-mono text-[7px] tracking-[0.2em] uppercase text-brand-primary/60 font-bold mt-0.5">
                  Now
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};



/* ── Main Section ──────────────────────────────────────── */

export const CareerTimeline = () => {
  const [expandedId, setExpandedId] = useState<string | null>('mba');

  const workEntries = ENTRIES.filter(e => e.type === 'work');
  const eduEntries = ENTRIES.filter(e => e.type === 'edu');

  const toggleCard = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <section id="experience" className="section-layout text-white scroll-mt-25 border-t border-white/5 relative overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,200,180,0.02)_1px,transparent_1px)] bg-[length:32px_32px] pointer-events-none" />

      <div className="project-container relative z-10">

        {/* ── Section Header ── */}
        <div className="narrative-gap border-b border-white/10 pb-12 flex flex-col gap-4">
          <ScrollReveal direction="right" distance={12} className="flex items-center gap-6">
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-white/30 font-bold whitespace-nowrap">
              Career Record
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </ScrollReveal>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <ScrollReveal delay={0.1}>
              <h2 className="font-noto text-5xl md:text-7xl font-black tracking-tighter text-white">
                The full <em className="font-playfair italic font-normal text-brand-primary">record.</em>
              </h2>
            </ScrollReveal>
            {/* <ScrollReveal delay={0.2}>
              <div className="flex items-center gap-6 font-mono text-[9px] tracking-[0.2em] uppercase font-bold">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-[2px] bg-brand-primary rounded-full" />
                  <span className="text-brand-primary/70">Professional</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-[2px] bg-[#f59e0b] rounded-full" />
                  <span className="text-[#f59e0b]/70">Academic</span>
                </div>
              </div>
            </ScrollReveal> */}
          </div>
        </div>

        {/* ── Year Progress ── */}
        <ScrollReveal distance={10}>
          <YearProgressBar />
        </ScrollReveal>

        {/* ── Dual-column layout (desktop) / Stacked (mobile) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14">

          {/* Professional column */}
          <div>
            <ScrollReveal distance={8}>
              <div className="flex items-center gap-3 mb-6">
                <Briefcase className="w-4 h-4 text-brand-primary/50" />
                <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-brand-primary/40 font-bold">
                  Professional
                </span>
                <div className="flex-1 h-px bg-brand-primary/10" />
              </div>
            </ScrollReveal>
            <div className="space-y-3">
              {workEntries.map((entry, i) => (
                <ScrollReveal key={entry.id} delay={i * 0.08} distance={14}>
                  <TimelineCard
                    entry={entry}
                    index={i}
                    isExpanded={expandedId === entry.id}
                    onToggle={() => toggleCard(entry.id)}
                  />
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Education column */}
          <div>
            <ScrollReveal distance={8} delay={0.1}>
              <div className="flex items-center gap-3 mb-6">
                <GraduationCap className="w-4 h-4 text-[#f59e0b]/50" />
                <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#f59e0b]/40 font-bold">
                  Academic
                </span>
                <div className="flex-1 h-px bg-[#f59e0b]/10" />
              </div>
            </ScrollReveal>
            <div className="space-y-3">
              {eduEntries.map((entry, i) => (
                <ScrollReveal key={entry.id} delay={0.1 + i * 0.08} distance={14}>
                  <TimelineCard
                    entry={entry}
                    index={i}
                    isExpanded={expandedId === entry.id}
                    onToggle={() => toggleCard(entry.id)}
                  />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>


        {/* ── Certification ── */}
        <ScrollReveal delay={0.3} distance={8}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-14 pt-10 border-t border-white/5">
            <div className="flex flex-col gap-1.5">
              <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/20 font-bold">
                Certification in Progress
              </span>
              <span className="font-noto text-xl md:text-2xl font-black text-white tracking-tight">
                Microsoft PL-300: Power BI Data Analyst
              </span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] animate-pulse" />
              <span className="font-mono text-[9px] tracking-[0.2em] font-bold uppercase text-[#f59e0b] px-2 py-1 bg-[#f59e0b]/5 rounded-[4px]">
                Expected Jun 2026
              </span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
