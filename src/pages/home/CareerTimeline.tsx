/**
 * CareerTimeline the dual-column work/education history section.
 *
 * Fits in: Home.tsx, lazy-loaded below the fold.
 * Note:    only ONE card can be open at a time across BOTH columns, because
 *          the single `expandedId` lives here in the shared parent.
 */
import { useState } from 'react';
import { ScrollReveal } from '@/ui';
import { Briefcase, GraduationCap, Hand } from 'lucide-react';
import { InteractiveHint } from '@/ui/InteractiveHint';
import { ENTRIES } from '@/content/career';
import { TimelineCard } from './TimelineCard';
import { YearProgressBar } from './YearProgressBar';
import { debug } from '@/utils';

// Silent-by-default logger (localStorage.debug = 'timeline'); see utils/debug.ts.
const log = debug('timeline');

export const CareerTimeline = () => {
  // 'mba' starts open so the section doesn't look inert on first scroll.
  const [expandedId, setExpandedId] = useState<string | null>('mba');

  const workEntries = ENTRIES.filter(e => e.type === 'work');
  const eduEntries = ENTRIES.filter(e => e.type === 'edu');

  const toggleCard = (id: string) => {
    log('toggle', id);
    // Single-open accordion: clicking the open card closes it; any other card
    // opens, implicitly closing the previous one since only one id is stored.
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <section id="experience" className="section-layout text-fg scroll-mt-25 border-t border-fg/5 relative overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,200,180,0.02)_1px,transparent_1px)] bg-[length:32px_32px] pointer-events-none" />

      <div className="project-container relative z-10">

        {/* ── Section Header ── */}
        <div className="narrative-gap border-b border-fg/10 pb-12 flex flex-col gap-4">
          <ScrollReveal direction="right" distance={12} className="flex items-center gap-6">
            <span className="font-mono text-micro tracking-[0.4em] uppercase text-fg-mid font-bold whitespace-nowrap">
              Career Timeline
            </span>
            <div className="flex-1 h-px bg-fg/10" />
            <InteractiveHint
              text="SELECT CARDS TO EXPAND DETAILS"
              mobileText="TAP TO EXPAND"
              icon={Hand}
              delay={0.25}
              direction="left"
              className="md:hidden"
            />
          </ScrollReveal>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <ScrollReveal delay={0.1}>
              <h2 className="font-noto text-5xl md:text-7xl font-black tracking-tighter text-fg">
                The full <em className="font-playfair italic font-normal text-brand-primary">record.</em>
              </h2>
            </ScrollReveal>
            <InteractiveHint
              text="SELECT CARDS TO EXPAND DETAILS"
              mobileText="TAP CARDS TO EXPAND"
              icon={Hand}
              delay={0.25}
              direction="left"
              className="hidden md:block"
            />
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
                <span className="font-mono text-micro tracking-ultra uppercase text-brand-primary/40 font-bold">
                  Professional
                </span>
                <div className="flex-1 h-px bg-brand-primary/10" />
              </div>
            </ScrollReveal>
            <div className="space-y-3">
              {/* delay={i * 0.08} staggers the reveal down the column. */}
              {workEntries.map((entry, i) => (
                <ScrollReveal key={entry.id} delay={i * 0.08} distance={14}>
                  <TimelineCard
                    entry={entry}
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
                <GraduationCap className="w-4 h-4 text-amber/50" />
                <span className="font-mono text-micro tracking-ultra uppercase text-amber/40 font-bold">
                  Academic
                </span>
                <div className="flex-1 h-px bg-amber/10" />
              </div>
            </ScrollReveal>
            <div className="space-y-3">
              {eduEntries.map((entry, i) => (
                <ScrollReveal key={entry.id} delay={0.1 + i * 0.08} distance={14}>
                  <TimelineCard
                    entry={entry}
                    isExpanded={expandedId === entry.id}
                    onToggle={() => toggleCard(entry.id)}
                  />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
