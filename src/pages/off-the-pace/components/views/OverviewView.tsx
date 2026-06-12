/**
 * OverviewView assembles the story-first Overview page body: a vertical stack
 * of narrative sections from NarrativeOpener through ClosingCTA, plus the page
 * footer.
 *
 * Fits in: lazy-loaded by OffThePaceOverview inside a <Suspense> boundary.
 * Note:    Every child sits in a `.reveal-element` wrapper that starts hidden
 *          (via CSS) and gets a `.visible` class when it scrolls into view.
 *
 * For beginners ----------------------------------------------------------------
 * IntersectionObserver is a browser tool that watches elements and tells you
 * when they enter the viewport, far cheaper than checking on every scroll. The
 * useEffect below builds one observer, points it at every `.reveal-element` on
 * the page, and on first sighting adds `.visible` (which the CSS animates) then
 * calls `unobserve` so each element only animates once. `disconnect()` in the
 * cleanup tears it all down when the page leaves.
 * -----------------------------------------------------------------------------
 */
import { useEffect } from 'react';
import { StatsRibbon } from '../sections/overview/StatsRibbon';
import { ProductPipeline } from '../sections/overview/ProductPipeline';
import { BusinessValue } from '../sections/overview/BusinessValue';
import { NarrativeOpener } from '../sections/overview/NarrativeOpener';
import { TechStackBand } from '../sections/overview/TechStackBand';
import { InsightCallout } from '../sections/overview/InsightCallout';
import { ClosingCTA } from '../sections/overview/ClosingCTA';
import { HonestyStrip } from '../sections/overview/HonestyStrip';
import { WorkflowLayers } from '../sections/overview/WorkflowLayers';
import { STATS } from '../../data/projectStats';

export function OverviewView() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.reveal-element').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="font-sans min-h-screen pt-16 md:pt-24 animate-page-fade">
      {/* ── TOP SECTION: DARK GRAPHITE ── */}
      <div className="bg-graphite-900 text-white pb-16 md:pb-24">
        <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col gap-24 pt-8">
          <div className="reveal-element">
            <NarrativeOpener />
          </div>

          <div className="reveal-element" style={{ transitionDelay: '60ms' }}>
            <StatsRibbon />
            <TechStackBand />
          </div>

          <div className="reveal-element" style={{ transitionDelay: '70ms' }}>
            <WorkflowLayers />
          </div>
        </div>
      </div>

      <div className="bg-graphite-900 text-white relative overflow-hidden">
        {/* Background Grids & Radial Glows */}
        <div className="absolute inset-0 bg-dots-dark opacity-70 pointer-events-none" />
        <div className="absolute top-[10%] left-[-10%] w-[50vw] h-[50vw] bg-[radial-gradient(closest-side,rgba(225,6,0,0.04),transparent)] pointer-events-none" />
        <div className="absolute top-[40%] right-[-10%] w-[45vw] h-[45vw] bg-[radial-gradient(closest-side,rgba(16,185,129,0.03),transparent)] pointer-events-none" />
        <div className="absolute bottom-[10%] left-[20%] w-[40vw] h-[40vw] bg-[radial-gradient(closest-side,rgba(139,92,246,0.04),transparent)] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col relative z-10">
          <div className="reveal-element py-16 md:py-24" style={{ transitionDelay: '60ms' }}>
            <ProductPipeline />
          </div>

          <div className="reveal-element py-16 md:py-24" style={{ transitionDelay: '60ms' }}>
            <BusinessValue />
          </div>

          <div className="reveal-element py-16 md:py-24" style={{ transitionDelay: '60ms' }}>
            <InsightCallout />
          </div>

          <div className="reveal-element py-16 md:py-24" style={{ transitionDelay: '60ms' }}>
            <HonestyStrip />
          </div>

        </div>
      </div>

      <ClosingCTA />

      <footer className="relative z-10 border-t border-white/5 bg-graphite-950/80 backdrop-blur-sm py-4 px-8 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left font-jetbrains text-[10px] text-white/40 tracking-wider">
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <span className="text-white/30">Built by</span>
          <span className="text-white/80 font-semibold">Justin Clarke</span>
          <span className="hidden sm:inline text-white/10">|</span>
          <span className="text-white/30">Licensed</span>
          <span className="text-white/80 font-semibold">AGPL-3.0</span>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <span className="text-f1-red font-black tracking-tighter">OFF THE PACE</span>
          <span className="hidden sm:inline text-white/10">·</span>
          <span className="text-white/30">F1 Causal Pace Engine</span>
          <span className="hidden sm:inline text-white/10">·</span>
          <span className="text-white/80 font-semibold">{STATS.seasonRange}</span>
        </div>
        <div className="flex items-center gap-2.5 text-emerald-400 font-bold uppercase tracking-widest text-[9px] bg-emerald-500/5 px-2.5 py-1 rounded border border-emerald-500/10 shrink-0">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </span>
          Pipeline Healthy
        </div>
      </footer>
    </div>
  );
}
