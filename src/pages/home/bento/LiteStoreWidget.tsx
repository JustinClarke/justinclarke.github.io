/**
 * LiteStoreWidget the "LiteStore" bento card (a production SaaS storefront). Its
 * signature visual is a row of Lighthouse gauge rings the familiar circular
 * audit dials that sweep up to their score on mount, paired with a live Core
 * Web Vitals strip that cycles through LCP/FID/CLS/TTFB/INP. Figures are
 * illustrative, not a live feed.
 *
 * Fits in: one card in the homepage featured-projects bento grid.
 * Note:    one timer advances the highlighted Core Web Vital; the gauge rings
 *          animate their stroke-dashoffset from empty to the score once.
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gauge, TrendingUp } from 'lucide-react';

const VITALS = [
  { id: 'lcp', label: 'LCP', value: '0.6s', target: '< 2.5s', color: 'var(--color-litestore)', score: 98 },
  { id: 'fid', label: 'FID', value: '12ms', target: '< 100ms', color: 'var(--color-litestore-2)', score: 99 },
  { id: 'cls', label: 'CLS', value: '0.02', target: '< 0.1', color: 'var(--color-litestore-3)', score: 96 },
  { id: 'ttfb', label: 'TTFB', value: '120ms', target: '< 800ms', color: 'var(--color-litestore-4)', score: 94 },
  { id: 'inp', label: 'INP', value: '88ms', target: '< 200ms', color: 'var(--color-litestore-5)', score: 95 },
];

const LIGHTHOUSE = [
  { label: 'Perf', value: 98, color: 'var(--color-litestore)' },
  { label: 'A11y', value: 92, color: 'var(--color-litestore-2)' },
  { label: 'Best Prac', value: 95, color: 'var(--color-litestore-4)' },
  { label: 'SEO', value: 100, color: 'var(--color-litestore-5)' },
];

// Ring geometry: r=16 → circumference ≈ 100.53; the dash is that whole length,
// and the stroke offset below hides the unfilled part.
const R = 16;
const CIRC = 2 * Math.PI * R;

function GaugeRing({ label, value, color, delay }: { label: string; value: number; color: string; delay: number }) {
  return (
    <div className="flex flex-col items-center gap-1 min-w-0">
      <div className="relative w-11 h-11 md:w-12 md:h-12">
        <svg viewBox="0 0 40 40" className="w-full h-full -rotate-90">
          <circle cx="20" cy="20" r={R} fill="none" className="stroke-fg/[0.08]" strokeWidth={3} />
          <motion.circle
            cx="20" cy="20" r={R}
            fill="none"
            style={{ stroke: color }}
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray={CIRC}
            initial={{ strokeDashoffset: CIRC }}
            animate={{ strokeDashoffset: CIRC * (1 - value / 100) }}
            transition={{ duration: 1.3, delay, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        <span
          className="absolute inset-0 flex items-center justify-center font-mono text-fine md:text-xs font-black"
          style={{ color }}
        >
          {value}
        </span>
      </div>
      <span className="font-mono text-micro md:text-micro text-fg-faint uppercase tracking-wider leading-none whitespace-nowrap">
        {label}
      </span>
    </div>
  );
}

export function LiteStoreWidget() {
  const [vitalTicker, setVitalTicker] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVitalTicker(prev => (prev + 1) % VITALS.length);
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  const activeVital = VITALS[vitalTicker];

  return (
    <div className="flex flex-col h-full justify-between gap-1.5 md:gap-2 min-h-0 text-left select-none">

      {/* Header */}
      <div className="flex flex-col gap-1 w-full border-b border-edge-soft pb-2 shrink-0">
        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          <span className="flex h-2 w-2 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-litestore" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-litestore" />
          </span>
          <span className="font-mono text-micro sm:text-micro font-bold border border-litestore/40 text-litestore px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 bg-litestore/5">
            WORK XP
          </span>
          <h3 className="font-noto text-sm xs:text-base sm:text-lg font-black tracking-tight text-fg uppercase leading-none">
            LITESTORE
          </h3>
        </div>

        {/* Dynamic Telemetry Subheader */}
        <div className="hidden lg:flex flex-nowrap items-center gap-x-2 gap-y-0.5 font-mono text-micro sm:text-micro text-fg-faint mt-0.5 leading-none select-none pr-16 xs:pr-20 sm:pr-24 whitespace-nowrap">
          <span className="text-fg-faint font-medium">PROD HEALTHY</span>
          <span>•</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={vitalTicker}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.2 }}
              className="uppercase font-medium font-mono text-fg-faint"
            >
              {activeVital.label}: {activeVital.value}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Description Block */}
      <div className="relative rounded-lg border-t border-r border-b border-t-edge-soft border-r-edge-soft border-b-edge-soft bg-bento-subtle backdrop-blur-sm px-3 py-2 shrink-0">
        <p className="text-fine sm:text-caption leading-relaxed text-fg-soft">
          Full-stack • <span className="font-semibold text-fg">Retail-as-a-Service platform</span> built with <span className="font-semibold text-fg">Next.js </span> and <span className="font-semibold text-fg">TailwindCSS</span>, featuring <span className="font-semibold text-fg">33 space/brand pages</span>, a <span className="font-semibold text-litestore-2">serverless inquiry pipeline</span>, and <span className="font-semibold text-fg">GA4 telemetry</span> for analytics.
        </p>
      </div>

      {/* Main Panel  Lighthouse gauge rings + live Core Web Vital */}
      <div className="hidden lg:flex flex-grow min-h-0 flex-col gap-2">

        {/* Lighthouse gauges */}
        <div className="bg-bento-inset border border-edge-soft rounded-xl px-3 py-2.5 flex flex-col gap-2 flex-grow justify-center min-h-0">
          <span className="font-mono text-micro text-fg-faint uppercase tracking-widest">Lighthouse Audit</span>
          <div className="flex items-center justify-between gap-1.5">
            {LIGHTHOUSE.map((s, i) => (
              <GaugeRing key={s.label} {...s} delay={0.12 * i} />
            ))}
          </div>
        </div>

        {/* Live Core Web Vital */}
        <div className="bg-bento-inset border border-edge-soft rounded-lg px-3 py-2 flex items-center justify-between gap-2 shrink-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeVital.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 min-w-0"
            >
              <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: activeVital.color }} />
              <span className="font-mono text-fine md:text-xs font-black uppercase" style={{ color: activeVital.color }}>
                {activeVital.label}
              </span>
              <span className="font-mono text-fine md:text-xs font-black text-fg">
                {activeVital.value}
              </span>
              <span className="font-mono text-micro md:text-micro text-fg-soft shrink-0 truncate">
                target {activeVital.target}
              </span>
            </motion.div>
          </AnimatePresence>
          <span className="font-mono text-micro md:text-micro text-fg-faint uppercase tracking-widest shrink-0">
            RUM p75
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="hidden lg:flex flex-wrap gap-x-3 gap-y-1 justify-between items-center border-t border-edge-soft pt-1.5 text-fg-soft font-mono text-micro md:text-micro shrink-0">
        <div className="flex items-center gap-1.5">
          <Gauge size={9} className="shrink-0" />
          <span>0.6s LCP · 80% Faster</span>
        </div>
        <div className="flex items-center gap-1.5 text-litestore">
          <TrendingUp size={9} className="shrink-0" />
          <span>Inquiry Pipeline · GA4 + Vercel</span>
        </div>
      </div>

      {/* Mobile-only Tech Stack */}
      <div className="lg:hidden flex flex-wrap gap-1 mt-1 shrink-0">
        {['Next.js', 'Tailwind', 'GA4', 'Vercel'].map(tech => (
          <span key={tech} className="font-mono text-micro sm:text-micro px-2 py-0.5 bg-litestore/10 border border-litestore/30 rounded text-litestore font-bold uppercase tracking-wider">
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
