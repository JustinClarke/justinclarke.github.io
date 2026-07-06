/**
 * OverviewView assembles the story-first Overview page body: a vertical stack
 * of narrative sections from NarrativeOpener through ClosingCTA, plus the page
 * footer.
 *
 * Fits in: lazy-loaded by OffThePaceOverview inside a <Suspense> boundary.
 * Note:    Every child sits in a `.reveal-element` wrapper that starts hidden
 *          (via CSS) and gets a `.visible` class when it scrolls into view.
 */
import { useRef } from 'react';
import { motion, useInView, useReducedMotion, type Variants } from 'framer-motion';
import { StatsRibbon } from '../sections/overview/StatsRibbon';
import { ProductPipeline } from '../sections/overview/ProductPipeline';
import { NarrativeOpener } from '../sections/overview/NarrativeOpener';
import { TechStackBand } from '../sections/overview/TechStackBand';
import { InsightCallout } from '../sections/overview/InsightCallout';
import { ClosingCTA } from '../sections/overview/ClosingCTA';
import { HonestyStrip } from '../sections/overview/HonestyStrip';
import { DecompositionExplainer } from '../sections/overview/DecompositionExplainer';
import { STATS } from '../../data/projectStats';

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
};

// P1  - three full-bleed radial glows that previously animated forever, even
// offscreen (continuous compositor/paint cost + battery drain). They now only
// loop while the lower section is in view, and collapse to a static faint frame
// for prefers-reduced-motion. Pure decoration, so aria-hidden.
function AmbientGlows() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const reduce = useReducedMotion() ?? false;
  const active = inView && !reduce;

  const glow = (base: number, peak: number, duration: number, delay: number) =>
    active
      ? { scale: [1, 1.05, 1], opacity: [base, peak, base], transition: { duration, repeat: Infinity, ease: 'easeInOut' as const, delay } }
      : { scale: 1, opacity: base };

  return (
    <div ref={ref} className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <motion.div
        animate={glow(0.03, 0.05, 10, 0)}
        className="absolute top-[5%] left-[-10%] w-[60vw] h-[60vw] bg-[radial-gradient(closest-side,rgba(225,6,0,1),transparent)]"
      />
      <motion.div
        animate={glow(0.02, 0.04, 12, 2)}
        className="absolute top-[35%] right-[-10%] w-[50vw] h-[50vw] bg-[radial-gradient(closest-side,rgba(16,185,129,1),transparent)]"
      />
      <motion.div
        animate={glow(0.03, 0.05, 15, 4)}
        className="absolute bottom-[5%] left-[15%] w-[45vw] h-[45vw] bg-[radial-gradient(closest-side,rgba(59,130,246,1),transparent)]"
      />
    </div>
  );
}

export function OverviewView() {
  return (
    <div className="font-sans min-h-screen pt-16 md:pt-24 animate-page-fade">
      {/* ── TOP SECTION: DARK GRAPHITE ── */}
      <div className="bg-graphite-900 text-white pb-16 md:pb-24 relative overflow-hidden">
        {/* Subtle top ambient glow */}
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-f1-red/5 to-transparent pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col gap-24 pt-8 relative z-10">
          <motion.div 
            id="f1-narrative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={revealVariants}
          >
            <NarrativeOpener />
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={revealVariants}
            className="flex flex-col gap-8"
          >
            <StatsRibbon />
            <TechStackBand />
          </motion.div>
        </div>
      </div>

      {/* ── LOWER SECTION: RICH GLASSMORPHISM ── */}
      <div className="bg-brand-bg text-white relative overflow-hidden">
        {/* Background Grids & Radial Glows - Enhanced parallax feel */}
        <div className="absolute inset-0 bg-dots-dark opacity-60 pointer-events-none fixed" />
        
        <AmbientGlows />

        <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col relative z-10">
          {/* W3/W4  - the real decomposition diagram is the centrepiece "how it
              works" payoff, right after the hook. */}
          <motion.div
            id="f1-decomposition"
            className="py-16 md:py-24"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={revealVariants}
          >
            <DecompositionExplainer />
          </motion.div>

          <motion.div
            id="f1-pipeline"
            className="py-16 md:py-24"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={revealVariants}
          >
            <ProductPipeline />
          </motion.div>

          <motion.div
            id="f1-insights"
            className="py-16 md:py-24"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={revealVariants}
          >
            <InsightCallout />
          </motion.div>

          <motion.div 
            id="f1-status" 
            className="py-16 md:py-24"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={revealVariants}
          >
            <HonestyStrip />
          </motion.div>
        </div>
      </div>

      <ClosingCTA />

      <footer className="relative z-10 border-t border-white/10 bg-brand-bg/80 backdrop-blur-md py-6 px-8 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left font-jetbrains text-micro text-text-tertiary tracking-wider">
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <span className="text-text-tertiary">Built by</span>
          <span className="text-text-primary font-semibold">Justin Clarke</span>
          <span className="hidden sm:inline text-text-muted">|</span>
          <span className="text-text-tertiary">Licensed</span>
          <span className="text-text-primary font-semibold">AGPL-3.0</span>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <span className="text-f1-red font-black tracking-tighter">OFF THE PACE</span>
          <span className="hidden sm:inline text-text-muted">·</span>
          <span className="text-text-tertiary">F1 Causal Pace Engine</span>
          <span className="hidden sm:inline text-text-muted">·</span>
          <span className="text-text-primary font-semibold">{STATS.seasonRange}</span>
        </div>
        <div className="flex items-center gap-2.5 text-emerald-400 font-bold uppercase tracking-widest text-micro bg-emerald-500/10 px-3 py-1.5 rounded-md border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)] shrink-0">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
          </span>
          Pipeline Healthy
        </div>
      </footer>
    </div>
  );
}
