/**
 * LiteStoreWidget the "LiteStore" bento card (a production SaaS storefront). A
 * self-running ops dashboard that rotates Core Web Vitals, Lighthouse scores, and
 * A/B experiment results. The figures are illustrative, not a live feed.
 *
 * Fits in: one card in the homepage featured-projects bento grid.
 * Note:    two timers tick two counters (highlighted vital, active experiment);
 *          a Lighthouse/Telemetry toggle swaps which panel shows.
 *
 * For beginners ----------------------------------------------------------------
 * Same shape as the other bento cards: useState holds the counters, useEffect
 * runs the timers, Framer Motion's <AnimatePresence key={...}> cross-fades a
 * panel when its key changes, and cn(...) chooses classes from what's active.
 * -----------------------------------------------------------------------------
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gauge, Zap, TrendingUp } from 'lucide-react';
import { cn } from '@/utils';

// LEARN: the card's content as plain data arrays; the JSX below loops over these
//    with `.map`, so the markup stays short and the data is easy to edit.
const VITALS = [
  { id: 'lcp', label: 'LCP', value: '0.6s', target: '< 2.5s', color: 'var(--color-litestore)', score: 98 },
  { id: 'fid', label: 'FID', value: '12ms', target: '< 100ms', color: 'var(--color-litestore-2)', score: 99 },
  { id: 'cls', label: 'CLS', value: '0.02', target: '< 0.1', color: 'var(--color-litestore-3)', score: 96 },
  { id: 'ttfb', label: 'TTFB', value: '120ms', target: '< 800ms', color: 'var(--color-litestore-4)', score: 94 },
  { id: 'inp', label: 'INP', value: '88ms', target: '< 200ms', color: 'var(--color-litestore-5)', score: 95 },
];

const LIGHTHOUSE = [
  { label: 'Performance', value: 98 },
  { label: 'Accessibility', value: 92 },
  { label: 'Best Practices', value: 95 },
  { label: 'SEO', value: 100 },
];

const EXPERIMENTS = [
  { label: 'checkout-v3.cta', uplift: '+20.4%', stage: 'Checkout', status: 'WINNER' },
  { label: 'pdp-gallery-swipe', uplift: '+6.8%', stage: 'Product', status: 'ROLLED OUT' },
  { label: 'cart-drawer-edge', uplift: '+3.1%', stage: 'Cart', status: 'RAMPING' },
  { label: 'hero-copy-test-b', uplift: '+1.4%', stage: 'Landing', status: 'MONITOR' },
  { label: 'pricing-stickyfoot', uplift: '+9.2%', stage: 'Checkout', status: 'WINNER' },
];

export function LiteStoreWidget() {
  // LEARN: `uiMode` is which panel shows; the other two are counters the timers
  //    advance. Each useState returns [value, setter]; a setter call re-renders.
  const [uiMode, setUiMode] = useState<'lighthouse' | 'telemetry'>('lighthouse');
  const [activeExperiment, setActiveExperiment] = useState(0);
  const [vitalTicker, setVitalTicker] = useState(0);

  // LEARN: two near-identical timers, one per counter. `% length` loops the
  //    index; the returned cleanup clears the timer on unmount. (Same both.)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveExperiment(prev => (prev + 1) % EXPERIMENTS.length);
    }, 11000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setVitalTicker(prev => (prev + 1) % VITALS.length);
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  const activeVital = VITALS[vitalTicker];
  const activeExp = EXPERIMENTS[activeExperiment];

  return (
    <div className="flex flex-col h-full justify-between gap-1.5 md:gap-2 min-h-0 text-left select-none">

      {/* Header */}
      <div className="flex flex-col gap-1 w-full border-b border-white/5 pb-2 shrink-0">
        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          <span className="flex h-2 w-2 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-litestore" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-litestore" />
          </span>
          <span className="font-mono text-[8px] sm:text-[9px] font-bold border border-litestore/40 text-litestore px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 bg-litestore/5">
            PROD SAAS
          </span>
          <h3 className="font-noto text-sm xs:text-base sm:text-lg font-black tracking-tight text-white uppercase leading-none">
            LITESTORE
          </h3>
        </div>

        {/* Dynamic Telemetry Subheader */}
        <div className="hidden lg:flex flex-nowrap items-center gap-x-2 gap-y-0.5 font-mono text-[9px] sm:text-[10px] text-neutral-500 mt-0.5 leading-none select-none pr-16 xs:pr-20 sm:pr-24 whitespace-nowrap">
          <span className="text-neutral-500 font-medium">PROD HEALTHY</span>
          <span>•</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={vitalTicker}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.2 }}
              className="uppercase font-medium font-mono text-neutral-500"
            >
              {activeVital.label}: {activeVital.value}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="hidden lg:flex items-center justify-between py-1.5 px-3 bg-white/[0.02] border border-white/5 rounded-xl shrink-0 gap-3">
        <div className="flex items-center gap-2">
          <Zap size={11} className="text-litestore animate-pulse" />
          <span className="font-mono text-[9px] md:text-[10px] font-bold text-neutral-400 tracking-wider uppercase">VERCEL EDGE · Next.js</span>
        </div>
        {/* LEARN: e.stopPropagation() keeps the click from bubbling to the whole
            card's handler, so a toggle switches the panel without navigating. */}
        <div className="bg-neutral-950 border border-white/5 p-0.5 rounded-lg flex shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); setUiMode('lighthouse'); }}
            className={cn(
              "px-1.5 sm:px-2 py-0.5 rounded font-mono text-[9px] md:text-[10px] uppercase font-bold tracking-wider transition-all",
              uiMode === 'lighthouse' ? "bg-white/10 text-white" : "text-neutral-500 hover:text-neutral-300"
            )}
          >
            Lighthouse
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setUiMode('telemetry'); }}
            className={cn(
              "px-1.5 sm:px-2 py-0.5 rounded font-mono text-[9px] md:text-[10px] uppercase font-bold tracking-wider transition-all",
              uiMode === 'telemetry' ? "bg-litestore/15 border border-litestore/30 text-litestore" : "text-neutral-500 hover:text-neutral-300"
            )}
          >
            Telemetry
          </button>
        </div>
      </div>

      {/* Main Panel */}
      {/* LEARN: the two panels carry different keys, so AnimatePresence slides one
          out and the other in whenever uiMode flips. */}
      <div className="hidden lg:flex flex-grow min-h-0 flex flex-col gap-2.5">
        <AnimatePresence mode="wait">

          {uiMode === 'lighthouse' ? (
            <motion.div
              key="lighthouse-panel"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-2 flex-grow min-h-0"
            >
              {/* Vitals rail */}
              {/* LEARN: one cell per vital. cn() scales/dims the cell matching the
                  current vitalTicker, so the highlight walks the rail on a timer. */}
              <div className="grid grid-cols-5 gap-1 bg-black/40 border border-white/5 rounded-xl p-2 shrink-0">
                {VITALS.map((v, i) => (
                  <div key={v.id} className="flex flex-col items-center gap-0.5">
                    <span
                      className={cn(
                        "font-mono text-[11px] md:text-xs font-black transition-all duration-300",
                        vitalTicker === i ? "scale-110" : "opacity-60"
                      )}
                      style={{ color: v.color }}
                    >
                      {v.score}
                    </span>
                    <span className="font-mono text-[7px] text-neutral-600 uppercase tracking-tighter text-center leading-tight">
                      {v.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Lighthouse score bars */}
              <div className="bg-black/40 border border-white/5 rounded-xl p-2 md:p-2.5 flex-grow flex flex-col justify-between min-h-0">
                <span className="font-mono text-[7px] text-neutral-500 uppercase tracking-widest mb-0.5">Lighthouse Audit</span>
                <div className="flex flex-col gap-0.5 flex-grow justify-center min-h-0">
                  {LIGHTHOUSE.map((s, i) => (
                    <div key={s.label} className="flex items-center gap-1.5 min-h-0">
                      <span className="font-mono text-[7px] text-neutral-400 w-20 shrink-0 leading-none whitespace-nowrap">{s.label}</span>
                      <div className="flex-grow h-0.5 bg-white/5 rounded-full overflow-hidden min-w-0">
                        <motion.div
                          className="h-full bg-litestore rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${s.value}%` }}
                          transition={{ duration: 1.2, delay: 0.1 * i, ease: [0.16, 1, 0.3, 1] }}
                        />
                      </div>
                      <span className="font-mono text-[8px] font-black text-litestore w-5 text-right shrink-0">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="telemetry-panel"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-2 flex-grow min-h-0"
            >
              {/* Active experiment card */}
              <div className="bg-bento-panel border border-white/10 rounded-xl p-2.5 md:p-3 shrink-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">Active Experiment</span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={activeExperiment}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="font-mono text-[9px] px-1.5 py-0.5 rounded border border-litestore/30 bg-litestore/10 text-litestore font-bold uppercase"
                    >
                      {activeExp.status}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeExperiment}
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -3 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="font-mono text-[10px] md:text-xs text-white font-bold truncate mb-1">
                      {activeExp.label}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm md:text-base font-black text-litestore">{activeExp.uplift}</span>
                      <span className="font-mono text-[9px] text-neutral-500 uppercase">CVR · {activeExp.stage}</span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Experiment queue */}
              <div className="flex-grow bg-black/40 border border-white/5 rounded-xl p-2 md:p-2.5 flex flex-col gap-1.5 min-h-0 overflow-hidden">
                <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest shrink-0">A/B Backlog · 18 shipped</span>
                {EXPERIMENTS.map((e, i) => (
                  <div
                    key={e.label}
                    className={cn(
                      "flex items-center justify-between gap-2 px-2 py-1 rounded-lg transition-all duration-300",
                      activeExperiment === i ? "bg-litestore/10 border border-litestore/20" : "border border-transparent"
                    )}
                  >
                    <span className={cn(
                      "font-mono text-[9px] truncate",
                      activeExperiment === i ? "text-white font-bold" : "text-neutral-500"
                    )}>
                      {e.label}
                    </span>
                    <span className={cn(
                      "font-mono text-[9px] font-black shrink-0",
                      activeExperiment === i ? "text-litestore" : "text-neutral-600"
                    )}>
                      {e.uplift}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="hidden lg:flex flex-wrap gap-x-3 gap-y-1 justify-between items-center border-t border-white/5 pt-1.5 text-neutral-400 font-mono text-[8px] md:text-[9px] shrink-0">
        <div className="flex items-center gap-1.5">
          <Gauge size={9} className="shrink-0" />
          <span>0.6s LCP · 80% Faster</span>
        </div>
        <div className="flex items-center gap-1.5 text-litestore">
          <TrendingUp size={9} className="shrink-0" />
          <span>+20.4% CVR · GA4 + Vercel</span>
        </div>
      </div>

      {/* Mobile-only Tech Stack */}
      <div className="lg:hidden flex flex-wrap gap-1 mt-1 shrink-0">
        {['Next.js', 'Tailwind', 'GA4', 'Vercel'].map(tech => (
          <span key={tech} className="font-mono text-[8px] sm:text-[9px] px-2 py-0.5 bg-litestore/10 border border-litestore/30 rounded text-litestore font-bold uppercase tracking-wider">
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
