import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '@/utils';
import { ScrollReveal, MagneticButton, BackToTerminal, SpotlightCard, Badge } from '@/ui';
import { TheCloser, SEO } from '@/components/layout';
import { RelatedProjects } from '@/components/projects';

/* ─────────────────────────── DATA ─────────────────────────── */

const DATA_STREAMS = [
  'PIPELINE: SENTIMENT → ARCHETYPE → ACTION',
  'RETENTION_WINDOW: 90_DAY_PREDICTION',
  'ACTIVE_NODES: 8_ARCHETYPES',
  'TRUST_LAYER: CONSENT_MONITORING_LIVE',
  'AUTH: EXEC_DASHBOARD_LIVE',
];

type RiskTier = 'safe-high' | 'safe-low' | 'risk-high' | 'risk-low';

const ARCHETYPES: { name: string; tag: string; desc: string; tier: RiskTier; index: number }[] = [
  { name: 'Purposeful Driver',    tag: 'High · Safe · Intrinsic', desc: 'The backbone. High performance, zero flight risk, intrinsically powered.',                       tier: 'safe-high', index: 0 },
  { name: 'Competitive Anchor',   tag: 'High · Safe · Extrinsic', desc: 'Predictable, stable output. Reward-dependent retention.',                                         tier: 'safe-high', index: 1 },
  { name: 'Frustrated Visionary', tag: 'High · Risk · Intrinsic', desc: 'High value but grinding against friction. Autonomy mismatch.',                                    tier: 'risk-high', index: 2 },
  { name: 'Undervalued Achiever', tag: 'High · Risk · Extrinsic', desc: 'Output king with a reward gap. Retention window is closing.',                                     tier: 'risk-high', index: 3 },
  { name: 'Dormant Potential',    tag: 'Low · Safe · Intrinsic',  desc: 'Stable but underperforming. Environment or role mismatch.',                                       tier: 'safe-low',  index: 4 },
  { name: 'Quiet Coaster',        tag: 'Low · Safe · Extrinsic',  desc: 'Presenteeism risk. Needs environmental or incentive shift.',                                      tier: 'safe-low',  index: 5 },
  { name: 'Burning Idealist',     tag: 'Low · Risk · Intrinsic',  desc: 'Burnout trajectory. Meaning remains but energy is eroded.',                                       tier: 'risk-low',  index: 6 },
  { name: 'Exit Risk',            tag: 'Low · Risk · Extrinsic',  desc: 'Priority intervention. Immediate reward or structural fix needed.',                               tier: 'risk-low',  index: 7 },
];

const TIER_META: Record<RiskTier, { label: string; color: string; glow: string; border: string; dot: string }> = {
  'safe-high': { label: 'Stable',    color: 'text-emerald-400',  glow: 'shadow-[0_0_24px_rgba(52,211,153,0.15)]',  border: 'border-emerald-500/20', dot: 'bg-emerald-400' },
  'risk-high': { label: 'At Risk',   color: 'text-amber-400',    glow: 'shadow-[0_0_24px_rgba(251,191,36,0.15)]',  border: 'border-amber-500/20',   dot: 'bg-amber-400'   },
  'safe-low':  { label: 'Dormant',   color: 'text-sky-400',      glow: 'shadow-[0_0_24px_rgba(56,189,248,0.12)]',  border: 'border-sky-500/20',     dot: 'bg-sky-400'     },
  'risk-low':  { label: 'Critical',  color: 'text-rose-400',     glow: 'shadow-[0_0_24px_rgba(251,113,133,0.18)]', border: 'border-rose-500/20',    dot: 'bg-rose-400'    },
};

const QUANT_SCORES = [
  { label: 'Engagement Index',  value: '7.2',       pct: 72,  desc: 'Real-time psychological investment metric.' },
  { label: 'Attrition Risk',    value: '14%',        pct: 14,  desc: 'Derived probability of exit within 90 days.' },
  { label: 'Motivation Score',  value: 'Intrinsic',  pct: 80,  desc: 'Categorical driver: Meaning vs. Reward.' },
  { label: 'Confidence Score',  value: '88%',        pct: 88,  desc: 'Self-reported capability vs. goal difficulty.' },
  { label: 'Overload Index',    value: '2.4',        pct: 48,  desc: 'Wait-time to output ratio. Burnout predictor.' },
  { label: 'Burnout Risk',      value: 'Low',        pct: 22,  desc: 'Aggregated sentiment from Q10/Q11 inputs.' },
  { label: 'Stability Index',   value: 'Optimal',    pct: 91,  desc: 'Manager-Employee trust alignment score.' },
];

const DASHBOARD_PANELS = [
  { id: 'overview',  title: 'Executive Overview', desc: 'Cohort snapshots and critical findings.', num: '01' },
  { id: 'archetype', title: 'Archetype Analysis', desc: '8-way taxonomy breakdown with retention windows.', num: '02' },
  { id: 'risk',      title: 'Risk Intelligence',  desc: 'Attrition intent mapping and silent burnout alerts.', num: '03' },
  { id: 'trust',     title: 'Trust & Consent',    desc: 'Ethical dimension monitoring tracking discomfort.', num: '04' },
];

const STACK = [
  { l: 'Core',       v: 'React + TS'  },
  { l: 'AI',         v: 'Gemini 1.5'  },
  { l: 'Database',   v: 'Firestore'   },
  { l: 'Motion',     v: 'Framer'      },
  { l: 'Charts',     v: 'Recharts'    },
  { l: 'Sync',       v: 'Real-time'   },
  { l: 'Diagnostic', v: '13-Axis'     },
  { l: 'Latency',    v: '<40ms'       },
];

/* ─────────────────────────── SUB-COMPONENTS ─────────────────────────── */

/** Pulsing orbital rings behind the hero heading */
const OrbitalRings = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
    {[320, 480, 640, 820].map((size, i) => (
      <motion.div
        key={size}
        className="absolute rounded-full border border-white/[0.04]"
        style={{ width: size, height: size }}
        animate={{ scale: [1, 1.04, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4 + i * 1.2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.7 }}
      />
    ))}
    {/* central glow */}
    <div className="absolute w-[280px] h-[280px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.04)_0%,transparent_70%)]" />
  </div>
);

/** Animated score bar for the quant section */
const ScoreBar = ({ pct, delay = 0 }: { pct: number; delay?: number }) => (
  <div className="h-px w-full bg-white/[0.06] mt-3 overflow-hidden rounded-full">
    <motion.div
      className="h-full bg-gradient-to-r from-white/60 to-white/20 rounded-full"
      initial={{ width: 0 }}
      whileInView={{ width: `${pct}%` }}
      transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
    />
  </div>
);

/** Grain overlay SVG filter */
const GrainOverlay = () => (
  <div
    className="pointer-events-none fixed inset-0 z-[200] opacity-[0.025]"
    style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundRepeat: 'repeat', backgroundSize: '128px' }}
    aria-hidden="true"
  />
);

/** Section label pill */
const SectionLabel = ({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) => (
  <span className={cn(
    'inline-flex items-center gap-2 font-mono text-[9px] md:text-[10px] tracking-[0.45em] uppercase font-black',
    dark ? 'text-white/25' : 'text-black/25'
  )}>
    <span className={cn('w-4 h-px', dark ? 'bg-white/20' : 'bg-black/20')} />
    {children}
    <span className={cn('w-4 h-px', dark ? 'bg-white/20' : 'bg-black/20')} />
  </span>
);

/* ─────────────────────────── PAGE ─────────────────────────── */

export const HRArchetypePage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStream, setActiveStream] = useState(0);
  const [hoveredArch, setHoveredArch] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setActiveStream(prev => (prev + 1) % DATA_STREAMS.length), 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#050505] text-white font-sans selection:bg-white/20 overflow-x-hidden">
      <SEO
        title="HR Archetype System"
        description="AI-driven HR analytics: an 8-archetype retention engine that predicts employee attrition 90 days out using Gemini, Firestore, and a 13-axis diagnostic."
        path="/project/hr-archetype"
        schemaType="SoftwareApplication"
      />

      <GrainOverlay />
      <BackToTerminal />

      {/* ── FIXED HUD ─────────────────────────────────────────── */}
      <div
        className="fixed top-10 right-10 z-[100] hidden md:flex gap-3 items-center"
        role="status"
        aria-label="System status"
        aria-live="polite"
      >
        <div className="px-4 py-2 rounded-full border border-white/10 bg-black/40 backdrop-blur-xl flex items-center gap-3 shadow-2xl">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
          </span>
          <span className="font-mono text-[9px] tracking-[0.35em] uppercase text-white/60 font-bold">Sync · 40ms · Live</span>
        </div>
        <a
          href="https://yourarchetype.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2 rounded-full bg-white text-black font-mono text-[9px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-500 shadow-2xl border border-black/5"
          aria-label="Take the HR Archetype Diagnostic"
        >
          Take Diagnostic ↗
        </a>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative h-screen flex flex-col items-center justify-between px-6 md:px-24 overflow-hidden py-12 md:py-20 gap-y-12">

        {/* Background: grid + orbital rings */}
        <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:44px_44px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(255,255,255,0.03)_0%,transparent_70%)]" />
        </div>

        <div className="relative z-10 max-w-7xl w-full flex-grow flex flex-col items-center justify-center">
          <OrbitalRings />

          <ScrollReveal direction="up">
            <div className="flex flex-col items-center text-center relative z-10">

              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="mb-10 md:mb-12"
              >
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-2xl">
                  <span className="font-mono text-[9px] md:text-[10px] tracking-[0.55em] uppercase font-black text-white/50">
                    Workforce Retention Intelligence
                  </span>
                </div>
              </motion.div>

              {/* Display heading */}
              <h1 className="sr-only">HR Archetype System - Behavioral Intelligence & Retention Prediction Engine</h1>
              <motion.div
                aria-hidden="true"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="font-noto text-[14vw] sm:text-[7rem] md:text-[9rem] font-black leading-[0.78] tracking-tighter mb-10 md:mb-12 uppercase break-words max-w-5xl mx-auto"
              >
                Archetype<br />
                <span className="text-white relative italic font-playfair lowercase font-normal">System.</span>
              </motion.div>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.38 }}
                className="font-mono text-base md:text-xl text-white/35 max-w-2xl leading-relaxed font-medium mb-12 md:mb-16 px-4 md:px-0 mx-auto text-center"
              >
                Transforming workforce sentiment into{' '}
                <span className="text-white font-black italic">retention decisions</span>.{' '}
                A diagnostic platform classifying employee risk across 8 behavioral archetypes - so HR leads act before attrition becomes visible.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.52 }}
                className="flex flex-wrap justify-center gap-4 md:gap-5 w-full px-4 md:px-0"
              >
                <MagneticButton as="div">
                  <a
                    href="https://yourarchetype.vercel.app/dashboard"
                    target="_blank"
                    className="px-8 md:px-10 py-4 md:py-4.5 rounded-2xl bg-white text-black font-mono text-[11px] font-black tracking-widest uppercase shadow-[0_0_40px_rgba(255,255,255,0.12)] hover:shadow-[0_0_56px_rgba(255,255,255,0.2)] transition-shadow block text-center"
                  >
                    Launch Dashboard
                  </a>
                </MagneticButton>
                <MagneticButton as="div">
                  <a
                    href="https://yourarchetype.vercel.app/"
                    target="_blank"
                    className="px-8 md:px-10 py-4 md:py-4.5 rounded-2xl border border-white/15 bg-white/[0.04] text-white font-mono text-[11px] font-black tracking-widest uppercase backdrop-blur-xl hover:bg-white/[0.07] transition-colors block text-center"
                  >
                    Take the Diagnostic
                  </a>
                </MagneticButton>
              </motion.div>
            </div>
          </ScrollReveal>
        </div>

        {/* Hero bottom: live log + key stats */}
        <div className="relative w-full z-20 overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center border-t border-white/[0.07] pt-10 md:pt-12 gap-10">

            {/* Streaming log */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="font-mono text-[9px] tracking-[0.35em] uppercase font-black text-white/20">System_Runtime_Logs</span>
              </div>
              <div className="font-mono text-[11px] text-white/35 h-5 flex items-center">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={activeStream}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.35 }}
                  >
                    {DATA_STREAMS[activeStream]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            {/* Stat strip */}
            <div className="flex gap-10 md:gap-16">
              {QUANT_SCORES.slice(0, 3).map(stat => (
                <div key={stat.label} className="flex flex-col gap-1 text-right">
                  <span className="font-mono text-[9px] text-white/20 uppercase font-black tracking-widest">{stat.label}</span>
                  <span className="font-noto text-2xl md:text-3xl font-black text-white tabular-nums">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 01 - 8-ARCHETYPE TAXONOMY (white)
      ══════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-40 px-6 md:px-12 bg-white text-black relative overflow-hidden">

        {/* Subtle top-right radial */}
        <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.03)_0%,transparent_70%)]" aria-hidden="true" />

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-32 mb-16 md:mb-28 items-end">
            <ScrollReveal direction="left">
              <div className="flex flex-col gap-6">
                <SectionLabel>Behavioral Science</SectionLabel>
                <h2 className="font-noto text-5xl md:text-[7rem] font-black tracking-tighter uppercase leading-[0.82]">
                  The Taxonomy<br />
                  <span className="text-black/15 italic">of Intent.</span>
                </h2>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <p className="font-mono text-base md:text-lg text-black/45 leading-relaxed max-w-xl">
                A 3-axis behavioral model mapping{' '}
                <span className="text-black font-black italic">Engagement × Retention Risk × Motivation Driver</span>.
                We don't just segment users - we predict trajectories.
              </p>
            </ScrollReveal>
          </div>

          {/* Archetype grid */}
          <ul
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-black/[0.06] border border-black/[0.06]"
            aria-label="Eight employee archetypes"
          >
            {ARCHETYPES.map((arch, i) => {
              const meta = TIER_META[arch.tier];
              return (
                <ScrollReveal key={arch.name} delay={i * 0.04}>
                  <li
                    className="bg-white p-7 md:p-9 flex flex-col group list-none cursor-default h-full transition-colors duration-300 hover:bg-stone-50"
                    onMouseEnter={() => setHoveredArch(i)}
                    onMouseLeave={() => setHoveredArch(null)}
                  >
                    {/* Risk tier badge */}
                    <div className="flex items-center justify-between mb-7">
                      <span className="font-mono text-[8px] uppercase font-black text-black/20 tracking-widest">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className={cn(
                        'font-mono text-[8px] uppercase font-black tracking-widest px-2.5 py-1 rounded-full border transition-opacity',
                        meta.color, meta.border,
                        hoveredArch === i ? 'opacity-100' : 'opacity-50'
                      )}>
                        {meta.label}
                      </span>
                    </div>

                    {/* Axis tags */}
                    <span className="font-mono text-[9px] uppercase font-black text-black/25 mb-4 leading-relaxed group-hover:text-black/40 transition-colors">
                      {arch.tag}
                    </span>

                    <h3 className="font-noto text-xl md:text-2xl font-black uppercase mb-4 leading-none flex-1">{arch.name}</h3>
                    <p className="font-mono text-[11px] text-black/35 leading-relaxed">{arch.desc}</p>

                    {/* Colored bottom line */}
                    <motion.div
                      className={cn('h-px mt-7 rounded-full', meta.dot.replace('bg-', 'bg-').replace('-400', '-300'))}
                      initial={{ scaleX: 0, originX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      transition={{ duration: 0.7, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                      viewport={{ once: true }}
                    />
                  </li>
                </ScrollReveal>
              );
            })}
          </ul>

          {/* Tier legend */}
          <div className="mt-10 flex flex-wrap gap-6 justify-end">
            {(Object.entries(TIER_META) as [RiskTier, typeof TIER_META[RiskTier]][]).map(([, meta]) => (
              <div key={meta.label} className="flex items-center gap-2">
                <div className={cn('w-1.5 h-1.5 rounded-full', meta.dot)} />
                <span className="font-mono text-[9px] uppercase font-black text-black/30 tracking-widest">{meta.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 02 - QUANTITATIVE ENGINE (dark)
      ══════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-40 px-6 md:px-12 bg-[#050505] relative overflow-hidden border-t border-white/[0.05]">

        {/* Vertical accent line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/[0.03] pointer-events-none" aria-hidden="true" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 md:gap-32 items-center">

          {/* Left: scores */}
          <ScrollReveal direction="left">
            <div className="flex flex-col gap-10 md:gap-14">
              <div className="flex flex-col gap-5">
                <SectionLabel dark>Methodological Rigor</SectionLabel>
                <h2 className="font-noto text-5xl md:text-[7rem] font-black tracking-tighter uppercase leading-[0.82]">
                  Engine<br />
                  <span className="text-white/25">Scoring.</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {QUANT_SCORES.map((score, i) => (
                  <div key={score.label} className="flex flex-col">
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="font-mono text-[9px] uppercase font-black text-white/20 tracking-widest">{score.label}</span>
                      <span className="font-noto text-lg font-black text-white tabular-nums">{score.value}</span>
                    </div>
                    <ScoreBar pct={score.pct} delay={i * 0.08} />
                    <span className="font-mono text-[9px] text-white/30 mt-2 leading-tight">{score.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Right: Gemini AI panel */}
          <ScrollReveal direction="right">
            <div className="relative p-8 md:p-12 rounded-[28px] md:rounded-[40px] bg-white text-black overflow-hidden group shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
              {/* Inner grid texture */}
              <div className="absolute inset-0 opacity-[0.04] pointer-events-none group-hover:scale-[1.03] transition-transform duration-1000">
                <div className="absolute inset-0 bg-[linear-gradient(black_1px,transparent_1px),linear-gradient(90deg,black_1px,transparent_1px)] bg-[size:22px_22px]" />
              </div>

              <div className="relative z-10 flex flex-col gap-8">
                <div className="flex items-center justify-between border-b border-black/[0.07] pb-8">
                  <h4 className="font-noto text-lg md:text-xl font-black uppercase">Gemini AI Analysis</h4>
                  <span className="font-mono text-[9px] uppercase font-black tracking-widest px-3 py-1.5 rounded-full bg-black text-white">Live Insights</span>
                </div>

                <div className="space-y-8">
                  {/* Quote */}
                  <p className="font-mono text-sm font-medium italic leading-relaxed text-black/70">
                    "Based on the aggregate Stability Index, the 'Frustrated Visionary' cohort shows a 22% increase in burnout risk correlated with workload telemetry. Recommendation: Deploy autonomy-first intervention."
                  </p>

                  {/* 90-day bar */}
                  <div className="flex flex-col gap-2.5 pt-7 border-t border-black/[0.07]">
                    <div className="flex justify-between items-center font-mono text-[10px] font-black uppercase">
                      <span className="text-black/50">Intervention Lead Time</span>
                      <span className="text-black">90 Days</span>
                    </div>
                    <div className="h-1 w-full bg-black/[0.06] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: '100%' }}
                        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                        viewport={{ once: true }}
                        className="h-full bg-gradient-to-r from-black to-black/50 rounded-full"
                      />
                    </div>
                    <p className="font-mono text-[9px] text-black/35 uppercase font-bold leading-tight mt-1">
                      Window before predicted exit - designed for proactive retention.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 03 - THE DASHBOARD (white)
      ══════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-40 px-6 md:px-12 bg-white text-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center gap-6 md:gap-10 mb-16 md:mb-28 px-4 md:px-0">
            <SectionLabel>Engineering Artifact</SectionLabel>
            <h2 className="font-noto text-[13vw] sm:text-8xl md:text-[9rem] font-black tracking-tighter uppercase leading-none">
              The Dashboard.
            </h2>
            <p className="font-mono text-base md:text-lg text-black/40 leading-relaxed max-w-2xl">
              A 7-panel command centre powered by Firestore{' '}
              <span className="text-black font-black italic">onSnapshot</span>{' '}
              listeners for sub-40ms reactive updates.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {DASHBOARD_PANELS.map((panel, i) => (
              <ScrollReveal key={panel.id} delay={i * 0.08}>
                <div className="group relative aspect-[4/5] rounded-[20px] md:rounded-[28px] bg-[#080808] text-white p-8 md:p-10 overflow-hidden flex flex-col justify-between shadow-[0_20px_60px_rgba(0,0,0,0.25)] hover:-translate-y-2 transition-transform duration-500">

                  {/* Grid texture */}
                  <div className="absolute inset-0 opacity-[0.12] pointer-events-none group-hover:opacity-[0.2] transition-opacity duration-700">
                    <div className="absolute inset-0 bg-[linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] bg-[size:20px_20px]" />
                  </div>

                  {/* Bottom gradient bleed */}
                  <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

                  <div className="relative z-10">
                    <span className="font-mono text-[9px] uppercase font-black text-white/30 block mb-5">Panel_{panel.num}</span>
                    <h3 className="font-noto text-2xl md:text-3xl font-black uppercase leading-tight">{panel.title}</h3>
                  </div>

                  <p className="relative z-10 font-mono text-[11px] text-white/35 leading-relaxed group-hover:text-white/55 transition-colors duration-300">
                    {panel.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 04 - TRUST DIMENSION (dark)
      ══════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-40 px-6 md:px-12 bg-[#050505] relative overflow-hidden border-t border-white/[0.05]">

        {/* Large ghost text bg */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden" aria-hidden="true">
          <span className="font-noto text-[18vw] font-black uppercase tracking-tighter text-white/[0.014] leading-none">TRUST</span>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <ScrollReveal>
            <div className="flex flex-col items-center text-center gap-10 md:gap-14">

              {/* Icon */}
              <div className="relative">
                <div className="w-16 h-16 rounded-full border border-white/[0.12] flex items-center justify-center">
                  <svg className="w-7 h-7 text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <motion.div
                  className="absolute inset-0 rounded-full border border-white/[0.06]"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}
                />
              </div>

              <h2 className="font-noto text-5xl md:text-[7.5rem] font-black tracking-tighter uppercase leading-[0.85]">
                The Trust<br />
                <span className="text-white/15">Dimension.</span>
              </h2>

              <p className="font-mono text-base md:text-lg text-white/35 leading-relaxed max-w-2xl px-4 md:px-0">
                Most workforce tools measure performance.{' '}
                <span className="text-white font-black">This one measures trust.</span>{' '}
                The 13th diagnostic dimension captures how employees feel about being monitored - giving organisations an ethical guardrail that prevents surveillance-driven attrition from compounding the problem it was meant to solve.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/[0.06] w-full mt-8 md:mt-16 border-t border-white/[0.08] pt-16 md:pt-20">
                {[
                  { title: 'Ethical Analytics', body: 'Modeling tracking discomfort as a core diagnostic metric to prevent surveillance-driven attrition.' },
                  { title: 'Presentation Ready', body: 'Integrated Presentation Mode with arrow-key navigation and automated AI notes export for executive briefings.' },
                ].map(item => (
                  <div key={item.title} className="flex flex-col gap-4 text-left px-0 md:px-8 first:md:pl-0 last:md:pr-0">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-px bg-white/20" />
                      <h4 className="font-noto font-black uppercase text-sm text-white/80">{item.title}</h4>
                    </div>
                    <p className="font-mono text-[11px] text-white/25 leading-relaxed">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 05 - TECH STACK (white)
      ══════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-40 px-6 md:px-12 bg-white text-black relative overflow-hidden border-t border-black/[0.05]">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="flex flex-col items-center text-center gap-10 md:gap-14">
              <SectionLabel>Technical Stack</SectionLabel>
              <h2 className="font-noto text-5xl md:text-[7.5rem] font-black tracking-tighter uppercase leading-none">The Stack.</h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-0 w-full mt-4 border border-black/[0.07] divide-x divide-y divide-black/[0.07]">
                {STACK.map((item, i) => (
                  <motion.div
                    key={item.l}
                    className="flex flex-col items-start gap-1.5 p-7 md:p-8 group hover:bg-black/[0.02] transition-colors"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: i * 0.06, duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <span className="font-mono text-[9px] uppercase font-black text-black/20 tracking-widest">{item.l}</span>
                    <span className="font-noto text-xl md:text-2xl font-black group-hover:translate-x-0.5 transition-transform duration-200">{item.v}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <RelatedProjects currentProjectId="hr-archetype" />

      <footer className="w-full border-t border-white/[0.05]">
        <TheCloser />
      </footer>
    </div>
  );
};
