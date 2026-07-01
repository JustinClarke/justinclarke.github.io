/**
 * CareerTimeline the dual-column work/education history section.
 *
 * Fits in: Home.tsx, lazy-loaded below the fold.
 * Note:    only ONE card can be open at a time across BOTH columns, because
 *          the single `expandedId` lives here in the shared parent.
 *
 * For beginners ----------------------------------------------------------------
 * The actual CV data lives in src/data/timeline.ts; this file filters it into
 * a work column and an education column and stamps out a <TimelineCard> per
 * entry. The key React idea is "lifting state up": the open/closed card is
 * remembered here in the parent, and each card is merely TOLD whether it is
 * the open one via props compare an HTML <details> element, which remembers
 * its own open state and so can't be coordinated with its siblings.
 * -----------------------------------------------------------------------------
 */
import { useState } from 'react';
import { ScrollReveal } from '@/ui';
import { Briefcase, GraduationCap, Hand } from 'lucide-react';
import { InteractiveHint } from '@/ui/InteractiveHint';
import { ENTRIES } from '@/data/timeline';
import { TimelineCard } from './TimelineCard';
import { YearProgressBar } from './YearProgressBar';
import { debug } from '@/utils';

// LEARN: silent-by-default logger. Enable in the browser console with
//    localStorage.debug = 'timeline'  then refresh (see src/utils/debug.ts).
const log = debug('timeline');

export const CareerTimeline = () => {
  // LEARN: the id of the one expanded card, or null when all are closed.
  //    'mba' starts open so the section doesn't look inert on first scroll.
  const [expandedId, setExpandedId] = useState<string | null>('mba');

  // LEARN: .filter() makes two new arrays from the one data file the same
  //    entries are never mutated, just dealt into two piles.
  const workEntries = ENTRIES.filter(e => e.type === 'work');
  const eduEntries = ENTRIES.filter(e => e.type === 'edu');

  const toggleCard = (id: string) => {
    log('toggle', id);
    // LEARN: clicking the open card closes it (null); clicking any other card
    //    opens that one which implicitly closes the previous one, since only
    //    one id can be stored.
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
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-fg/30 font-bold whitespace-nowrap">
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
                <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-brand-primary/40 font-bold">
                  Professional
                </span>
                <div className="flex-1 h-px bg-brand-primary/10" />
              </div>
            </ScrollReveal>
            <div className="space-y-3">
              {/* LEARN: .map() turns each data entry into a component the JSX
                  equivalent of a for-loop that prints one card per item.
                  `delay={i * 0.08}` staggers the reveal: card 0 at 0s, card 1
                  at 0.08s, and so on down the column. */}
              {workEntries.map((entry, i) => (
                <ScrollReveal key={entry.id} delay={i * 0.08} distance={14}>
                  {/* LEARN: `() => toggleCard(entry.id)` wraps the call in a new
                      function so it runs on click, not during render and each
                      card's copy remembers its own entry.id (a closure). */}
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
                <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-amber/40 font-bold">
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
