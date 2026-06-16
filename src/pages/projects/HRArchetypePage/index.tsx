/**
 * HRArchetypePage the project case-study page for the AI-powered HR
 * Archetype System: an 8-archetype, 13-axis employee retention engine
 * built with Gemini 1.5, Firestore real-time listeners, and Recharts.
 *
 * Fits in: one of five project pages, reachable via /project/hr-archetype.
 *          Rendered lazily by App.tsx inside the page-transition wrapper.
 * Note:    useScroll + useTransform drive the thin progress bar pinned at
 *          the top of the page - they read the container's scroll position
 *          directly, without touching React state, so scrolling stays smooth.
 *
 * For beginners ----------------------------------------------------------------
 * useScroll watches how far the user has scrolled inside containerRef.
 * useTransform converts that 0→1 progress fraction into a CSS width string
 * ("0%" → "100%"). Both are from Framer Motion and update via an internal
 * motion value - not useState - so the progress bar never triggers a
 * re-render of the whole page; only the bar's own DOM node updates.
 * -----------------------------------------------------------------------------
 */
import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/utils';
import { ScrollReveal, MagneticButton } from '@/ui';
import { TheCloser, SEO } from '@/components/layout';
import { RelatedProjects } from '@/components/projects';

/* ─────────────────────────── DATA ─────────────────────────── */

const DATA_STREAMS = [
  'PIPELINE: SENTIMENT → ARCHETYPE → ACTION',
  'RETENTION_WINDOW: 90_DAY_PREDICTION',
  'ACTIVE_NODES: 8_ARCHETYPES · 13_AXIS_DIAGNOSTIC',
  'TRUST_LAYER: CONSENT_MONITORING_LIVE',
  'AUTH: EXEC_DASHBOARD_LIVE · SYNC: <40ms',
];

type RiskTier = 'safe-high' | 'safe-low' | 'risk-high' | 'risk-low';

const ARCHETYPES: { name: string; tag: string; desc: string; tier: RiskTier; key: string }[] = [
  { name: 'Purposeful Driver',    key: 'high+safe+intrinsic',   tag: 'High · Safe · Intrinsic',  desc: 'The backbone. High performance, zero flight risk, intrinsically powered.',        tier: 'safe-high' },
  { name: 'Competitive Anchor',   key: 'high+safe+extrinsic',   tag: 'High · Safe · Extrinsic',  desc: 'Predictable, stable output. Reward-dependent retention.',                          tier: 'safe-high' },
  { name: 'Frustrated Visionary', key: 'high+atrisk+intrinsic', tag: 'High · Risk · Intrinsic',  desc: 'High value but grinding against friction. Autonomy mismatch.',                     tier: 'risk-high' },
  { name: 'Undervalued Achiever', key: 'high+atrisk+extrinsic', tag: 'High · Risk · Extrinsic',  desc: 'Output king with a reward gap. Retention window is closing.',                      tier: 'risk-high' },
  { name: 'Dormant Potential',    key: 'low+safe+intrinsic',    tag: 'Low · Safe · Intrinsic',   desc: 'Stable but underperforming. Environment or role mismatch.',                        tier: 'safe-low'  },
  { name: 'Quiet Coaster',        key: 'low+safe+extrinsic',    tag: 'Low · Safe · Extrinsic',   desc: 'Presenteeism risk. Needs environmental or incentive shift.',                       tier: 'safe-low'  },
  { name: 'Burning Idealist',     key: 'low+atrisk+intrinsic',  tag: 'Low · Risk · Intrinsic',   desc: 'Burnout trajectory. Meaning remains but energy is eroded.',                        tier: 'risk-low'  },
  { name: 'Exit Risk',            key: 'low+atrisk+extrinsic',  tag: 'Low · Risk · Extrinsic',   desc: 'Priority intervention. Immediate reward or structural fix needed.',                tier: 'risk-low'  },
];

const TIER_META: Record<RiskTier, { label: string; color: string; border: string; dot: string; bg: string; glow: string }> = {
  'safe-high': { label: 'Stable',   color: 'text-emerald-400', border: 'border-emerald-500/20', dot: 'bg-emerald-400', bg: 'bg-emerald-400/8',  glow: 'rgba(52,211,153,0.15)'  },
  'risk-high': { label: 'At Risk',  color: 'text-amber-400',   border: 'border-amber-500/20',   dot: 'bg-amber-400',   bg: 'bg-amber-400/8',    glow: 'rgba(251,191,36,0.15)'  },
  'safe-low':  { label: 'Dormant',  color: 'text-sky-400',     border: 'border-sky-500/20',     dot: 'bg-sky-400',     bg: 'bg-sky-400/8',      glow: 'rgba(56,189,248,0.12)'  },
  'risk-low':  { label: 'Critical', color: 'text-rose-400',    border: 'border-rose-500/20',    dot: 'bg-rose-400',    bg: 'bg-rose-400/8',     glow: 'rgba(251,113,133,0.18)' },
};

const QUANT_SCORES = [
  { label: 'Engagement Index',  value: '7.2',       pct: 72, desc: 'Real-time psychological investment.'       },
  { label: 'Attrition Risk',    value: '14%',       pct: 14, desc: 'Exit probability within 90 days.'          },
  { label: 'Motivation Score',  value: 'Intrinsic', pct: 80, desc: 'Categorical driver: Meaning vs. Reward.'   },
  { label: 'Confidence Score',  value: '88%',       pct: 88, desc: 'Capability vs. goal difficulty.'           },
  { label: 'Overload Index',    value: '2.4',       pct: 48, desc: 'Wait-time / output ratio. Burnout proxy.'  },
  { label: 'Burnout Risk',      value: 'Low',       pct: 22, desc: 'Aggregated from Q10/Q11 sentiment.'        },
  { label: 'Stability Index',   value: 'Optimal',   pct: 91, desc: 'Manager-employee trust alignment.'         },
];

const ARCHETYPE_WEIGHTS = [
  { name: 'Purposeful Driver',    w: 20, tier: 'safe-high' as RiskTier },
  { name: 'Competitive Anchor',   w: 18, tier: 'safe-high' as RiskTier },
  { name: 'Frustrated Visionary', w: 15, tier: 'risk-high' as RiskTier },
  { name: 'Undervalued Achiever', w: 14, tier: 'risk-high' as RiskTier },
  { name: 'Dormant Potential',    w: 12, tier: 'safe-low'  as RiskTier },
  { name: 'Quiet Coaster',        w: 11, tier: 'safe-low'  as RiskTier },
  { name: 'Burning Idealist',     w:  5, tier: 'risk-low'  as RiskTier },
  { name: 'Exit Risk',            w:  5, tier: 'risk-low'  as RiskTier },
];

const STACK = [
  { l: 'Core',        v: 'React + TS'  },
  { l: 'AI',          v: 'Gemini 1.5'  },
  { l: 'Database',    v: 'Firestore'   },
  { l: 'Motion',      v: 'Framer'      },
  { l: 'Charts',      v: 'Recharts'    },
  { l: 'Sync',        v: '<40ms Live'  },
  { l: 'Diagnostic',  v: '13-Axis'     },
  { l: 'Accuracy',    v: '94.2%'       },
];

const RISK_MATRIX = [
  { quad: 'Retain',     color: 'text-emerald-400', border: 'border-emerald-500/20', eng: 'High', risk: 'Low',  action: 'Protect autonomy. Growth paths.' },
  { quad: 'Urgent Fix', color: 'text-amber-400',   border: 'border-amber-500/20',   eng: 'High', risk: 'High', action: 'Address workload & burnout immediately.' },
  { quad: 'Monitor',    color: 'text-sky-400',     border: 'border-sky-500/20',     eng: 'Low',  risk: 'Low',  action: 'Re-evaluate role alignment.' },
  { quad: 'Exit Risk',  color: 'text-rose-400',    border: 'border-rose-500/20',    eng: 'Low',  risk: 'High', action: 'Offboarding or radical role transformation.' },
];

const AXES = [
  { label: 'Engagement', v: 0.82 },
  { label: 'Autonomy',   v: 0.85 },
  { label: 'Growth',     v: 0.73 },
  { label: 'Recognition',v: 0.68 },
  { label: 'Stability',  v: 0.41 },
  { label: 'Purpose',    v: 0.91 },
];

/* ─────────────────────────── SUB-COMPONENTS ─────────────────────────── */

const GrainOverlay = () => (
  <div
    className="pointer-events-none fixed inset-0 z-[200] opacity-[0.025]"
    style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundRepeat: 'repeat', backgroundSize: '128px' }}
    aria-hidden
  />
);

const Label = ({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) => (
  <span className={cn('inline-flex items-center gap-2 font-mono text-[9px] md:text-[10px] tracking-[0.45em] uppercase font-black', dark ? 'text-white/25' : 'text-black/25')}>
    <span className={cn('w-4 h-px', dark ? 'bg-white/20' : 'bg-black/20')} />
    {children}
    <span className={cn('w-4 h-px', dark ? 'bg-white/20' : 'bg-black/20')} />
  </span>
);

const ScoreBar = ({ pct, delay = 0, color = 'from-white/60 to-white/20' }: { pct: number; delay?: number; color?: string }) => (
  <div className="h-px w-full bg-white/[0.06] mt-2.5 overflow-hidden rounded-full">
    <motion.div
      className={cn('h-full bg-gradient-to-r rounded-full', color)}
      initial={{ width: 0 }}
      whileInView={{ width: `${pct}%` }}
      transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
    />
  </div>
);

/**
 * Spider (radar) chart drawn as an SVG polygon with animated dots per axis.
 *
 * LEARN: This component converts data values (0–1 fractions) into x,y
 *    coordinates using trigonometry. Each axis is evenly spaced around a
 *    circle: angle = (i / total) * 2π (a full rotation). Multiplying by
 *    the data value scales the radius outward - a 0.91 "Purpose" score
 *    reaches 91% of the maximum radius. Math.cos / Math.sin convert the
 *    angle to x/y offsets just like in high-school unit circle diagrams.
 */
const SpiderChart = ({ size = 120 }: { size?: number }) => {
  const cx = size / 2;
  const cy = size / 2;
  const R = size * 0.36;
  const points = AXES.map((ax, i) => {
    const a = (i / AXES.length) * Math.PI * 2 - Math.PI / 2;
    return { x: cx + ax.v * R * Math.cos(a), y: cy + ax.v * R * Math.sin(a), lx: cx + (R + 16) * Math.cos(a), ly: cy + (R + 16) * Math.sin(a) };
  });
  const polyline = points.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
      {[0.33, 0.66, 1].map(f => (
        <circle key={f} cx={cx} cy={cy} r={R * f} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
      ))}
      {AXES.map((_, i) => {
        const a = (i / AXES.length) * Math.PI * 2 - Math.PI / 2;
        return <line key={i} x1={cx} y1={cy} x2={cx + R * Math.cos(a)} y2={cy + R * Math.sin(a)} stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />;
      })}
      <motion.polygon
        points={polyline}
        fill="rgba(255,255,255,0.06)"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="0.8"
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />
      {points.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x} cy={p.y} r="2"
          fill="white"
          initial={{ opacity: 0, r: 0 }}
          whileInView={{ opacity: [0.4, 1, 0.4], r: 2 }}
          transition={{ duration: 2, delay: 0.4 + i * 0.07, repeat: Infinity, repeatType: 'loop' }}
          viewport={{ once: true }}
        />
      ))}
      {points.map((p, i) => (
        <text key={`l-${i}`} x={p.lx} y={p.ly} textAnchor="middle" dominantBaseline="middle" fontSize="5" fill="rgba(255,255,255,0.25)" fontFamily="monospace" fontWeight="bold">
          {AXES[i].label.slice(0, 4).toUpperCase()}
        </text>
      ))}
    </svg>
  );
};

/* Archetype distribution bar chart */
const DistributionBars = () => {
  const total = ARCHETYPE_WEIGHTS.reduce((s, a) => s + a.w, 0);
  return (
    <div className="flex flex-col gap-2.5">
      {ARCHETYPE_WEIGHTS.map((arch, i) => {
        const meta = TIER_META[arch.tier];
        const pct = (arch.w / total) * 100;
        return (
          <div key={arch.name} className="flex items-center gap-3">
            <span className="font-mono text-[8px] text-white/30 w-[120px] shrink-0 uppercase tracking-wider truncate">{arch.name}</span>
            <div className="flex-1 h-px bg-white/[0.06] overflow-hidden rounded-full relative">
              <motion.div
                className={cn('absolute inset-y-0 left-0 rounded-full', meta.dot)}
                style={{ opacity: 0.7 }}
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                transition={{ duration: 0.9, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
              />
            </div>
            <span className="font-mono text-[8px] text-white/20 tabular-nums w-6 text-right">{arch.w}%</span>
          </div>
        );
      })}
    </div>
  );
};

/* ─────────────────────────── PAGE ─────────────────────────── */

export const HRArchetypePage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStream, setActiveStream] = useState(0);
  // LEARN: hoveredArch stores the index (0-7) of the archetype card the mouse
  //    is over, or null if none. Each card reads this value and dims/brightens
  //    its tier badge accordingly - this is "lifted state": the state lives in
  //    the parent so multiple children can react to the same hover.
  const [hoveredArch, setHoveredArch] = useState<number | null>(null);
  // LEARN: useScroll tracks how far the user has scrolled inside containerRef.
  //    scrollYProgress is a Framer Motion "motion value" (0 = top, 1 = bottom).
  //    useTransform maps that range to CSS widths so the progress bar grows
  //    from "0%" to "100%" as the page scrolls - without re-rendering anything.
  const { scrollYProgress } = useScroll({ container: containerRef });
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  useEffect(() => {
    const interval = setInterval(() => setActiveStream(prev => (prev + 1) % DATA_STREAMS.length), 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-surface-primary text-text-base font-sans selection:bg-black/10 overflow-x-hidden">
      <SEO
        title="HR Archetype System"
        description="AI-driven HR analytics: an 8-archetype retention engine that predicts employee attrition 90 days out using Gemini, Firestore, and a 13-axis diagnostic."
        path="/project/hr-archetype"
        schemaType="SoftwareApplication"
      />
      <GrainOverlay />

      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[300] h-px bg-white/[0.04]" aria-hidden>
        <motion.div className="h-full bg-white/30" style={{ width: progressWidth }} />
      </div>



      {/* Fixed HUD */}
      <div className="fixed top-10 right-10 z-[100] hidden md:flex gap-3 items-center" role="status" aria-live="polite">
        <div className="px-4 py-2 rounded-full border border-white/10 bg-black/40 backdrop-blur-xl flex items-center gap-3 shadow-2xl">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
          </span>
          <span className="font-mono text-[9px] tracking-[0.35em] uppercase text-white/60 font-bold">Sync · 40ms · Live</span>
        </div>
        <a
          href="https://yourarchetype.vercel.app/"
          target="_blank" rel="noopener noreferrer"
          className="px-5 py-2 rounded-full bg-white text-black font-mono text-[9px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-500 shadow-2xl border border-black/5"
        >
          Take Diagnostic ↗
        </a>
      </div>

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="relative h-screen flex flex-col items-center justify-between px-6 md:px-24 py-12 md:py-20 overflow-hidden gap-y-12 bg-brand-bg text-white">
        <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:44px_44px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(255,255,255,0.03)_0%,transparent_70%)]" />
        </div>

        {/* Orbital rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden>
          {[320, 480, 640, 820].map((size, i) => (
            <motion.div
              key={size}
              className="absolute rounded-full border border-white/[0.04]"
              style={{ width: size, height: size }}
              animate={{ scale: [1, 1.04, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 4 + i * 1.2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.7 }}
            />
          ))}
          <div className="absolute w-[280px] h-[280px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.04)_0%,transparent_70%)]" />
        </div>

        <div className="relative z-10 max-w-7xl w-full flex-grow flex flex-col items-center justify-center">
          <ScrollReveal direction="up">
            <div className="flex flex-col items-center text-center relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="mb-10 md:mb-12"
              >
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-2xl">
                  <span className="font-mono text-[9px] md:text-[10px] tracking-[0.55em] uppercase font-black text-white/50">
                    Workforce Retention Intelligence
                  </span>
                </div>
              </motion.div>

              <h1 className="sr-only">HR Archetype System – Behavioural Intelligence & Retention Prediction Engine</h1>
              <motion.div
                aria-hidden
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="font-noto text-[14vw] sm:text-[7rem] md:text-[9rem] font-black leading-[0.78] tracking-tighter mb-10 md:mb-12 uppercase max-w-5xl mx-auto"
              >
                Archetype<br />
                <span className="italic font-playfair lowercase font-normal">System.</span>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.38 }}
                className="font-mono text-base md:text-xl text-white/35 max-w-2xl leading-relaxed font-medium mb-12 md:mb-16 px-4 md:px-0"
              >
                Transforming workforce sentiment into{' '}
                <span className="text-white font-black italic">retention decisions</span>.{' '}
                A 13-axis diagnostic classifying employee risk across 8 behavioural archetypes  -  so HR leads act before attrition becomes visible.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.52 }}
                className="flex flex-wrap justify-center gap-4 md:gap-5"
              >
                <MagneticButton as="div">
                  <a
                    href="https://yourarchetype.vercel.app/dashboard"
                    target="_blank" rel="noopener noreferrer"
                    className="px-8 md:px-10 py-4 rounded-2xl bg-white text-black font-mono text-[11px] font-black tracking-widest uppercase shadow-[0_0_40px_rgba(255,255,255,0.12)] hover:shadow-[0_0_56px_rgba(255,255,255,0.2)] transition-shadow block"
                  >
                    Launch Dashboard
                  </a>
                </MagneticButton>
                <MagneticButton as="div">
                  <a
                    href="https://yourarchetype.vercel.app/"
                    target="_blank" rel="noopener noreferrer"
                    className="px-8 md:px-10 py-4 rounded-2xl border border-white/15 bg-white/4 text-white font-mono text-[11px] font-black tracking-widest uppercase backdrop-blur-xl hover:bg-white/[0.07] transition-colors block"
                  >
                    Take the Diagnostic
                  </a>
                </MagneticButton>
              </motion.div>
            </div>
          </ScrollReveal>
        </div>

        {/* Hero footer: live log + key stats */}
        <div className="relative w-full z-20">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center border-t border-white/[0.07] pt-10 md:pt-12 gap-10">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="font-mono text-[9px] tracking-[0.35em] uppercase font-black text-white/20">System_Runtime_Logs</span>
              </div>
              <div className="font-mono text-[11px] text-white/35 h-5 flex items-center">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={activeStream}
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.35 }}
                  >
                    {DATA_STREAMS[activeStream]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
            <div className="flex gap-10 md:gap-16">
              {QUANT_SCORES.slice(0, 3).map(stat => (
                <div key={stat.label} className="flex flex-col gap-1 text-right">
                  <span className="font-mono text-[9px] text-white/20 uppercase font-black tracking-widest">{stat.label}</span>
                  <span className="font-noto text-2xl md:text-3xl font-black tabular-nums">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 01  -  ARCHETYPE TAXONOMY (white)
      ══════════════════════════════════════════ */}
      <section className="py-24 md:py-36 px-6 md:px-12 bg-white text-black relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.03)_0%,transparent_70%)]" aria-hidden />

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-28 mb-14 md:mb-24 items-end">
            <ScrollReveal direction="left">
              <div className="flex flex-col gap-6">
                <Label>Behavioural Science</Label>
                <h2 className="font-noto text-5xl md:text-[7rem] font-black tracking-tighter uppercase leading-[0.82]">
                  The<br />Taxonomy<br />
                  <span className="text-black/15 italic">of Intent.</span>
                </h2>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div className="flex flex-col gap-6">
                <p className="font-mono text-base md:text-lg text-black/45 leading-relaxed">
                  A 3-axis behavioural model mapping{' '}
                  <span className="text-black font-black italic">Engagement × Retention Risk × Motivation Driver</span>.
                  {' '}8 archetypes. Each with a distinct trajectory and intervention playbook.
                </p>
                {/* Legend */}
                <div className="flex flex-wrap gap-4 pt-2">
                  {(Object.entries(TIER_META) as [RiskTier, typeof TIER_META[RiskTier]][]).map(([, meta]) => (
                    <div key={meta.label} className="flex items-center gap-2">
                      <div className={cn('w-1.5 h-1.5 rounded-full', meta.dot)} />
                      <span className="font-mono text-[9px] uppercase font-black text-black/30 tracking-widest">{meta.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* LEARN: ARCHETYPES.map() turns the data array into a list of <li>
              cards. Each card registers its index via onMouseEnter so the
              parent's hoveredArch state knows which one is active. */}
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-black/[0.06] border border-black/[0.06]" aria-label="Eight employee archetypes">
            {ARCHETYPES.map((arch, i) => {
              const meta = TIER_META[arch.tier];
              return (
                <ScrollReveal key={arch.name} delay={i * 0.04}>
                  <li
                    className="bg-white p-7 md:p-9 flex flex-col group list-none cursor-default h-full transition-colors duration-300 hover:bg-stone-50"
                    onMouseEnter={() => setHoveredArch(i)}
                    onMouseLeave={() => setHoveredArch(null)}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-mono text-[8px] uppercase font-black text-black/20 tracking-widest">{String(i + 1).padStart(2, '0')}</span>
                      <span className={cn(
                        'font-mono text-[8px] uppercase font-black tracking-widest px-2.5 py-1 rounded-full border transition-opacity',
                        meta.color, meta.border, hoveredArch === i ? 'opacity-100' : 'opacity-50'
                      )}>
                        {meta.label}
                      </span>
                    </div>
                    <span className="font-mono text-[9px] uppercase font-black text-black/25 mb-3 leading-relaxed">{arch.tag}</span>
                    <h3 className="font-noto text-xl md:text-2xl font-black uppercase mb-3 leading-none flex-1">{arch.name}</h3>
                    <p className="font-mono text-[11px] text-black/35 leading-relaxed">{arch.desc}</p>
                    <motion.div
                      className={cn('h-px mt-6 rounded-full', meta.dot)}
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
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 02  -  ENGINE + RADAR (dark, 2-col)
      ══════════════════════════════════════════ */}
      <section className="py-24 md:py-36 px-6 md:px-12 bg-brand-bg text-white relative overflow-hidden border-t border-white/[0.05]">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/[0.03] pointer-events-none" aria-hidden />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 md:gap-28 items-start">

          {/* LEFT  -  scoring metrics */}
          <ScrollReveal direction="left">
            <div className="flex flex-col gap-10 md:gap-12">
              <div className="flex flex-col gap-5">
                <Label dark>Methodological Rigor</Label>
                <h2 className="font-noto text-5xl md:text-[6.5rem] font-black tracking-tighter uppercase leading-[0.82]">
                  Engine<br />
                  <span className="text-white/25">Scoring.</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                {QUANT_SCORES.map((score, i) => (
                  <div key={score.label} className="flex flex-col">
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="font-mono text-[9px] uppercase font-black text-white/20 tracking-widest">{score.label}</span>
                      <span className="font-noto text-lg font-black tabular-nums">{score.value}</span>
                    </div>
                    <ScoreBar pct={score.pct} delay={i * 0.08} />
                    <span className="font-mono text-[9px] text-white/25 mt-1.5 leading-tight">{score.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* RIGHT  -  radar + distribution */}
          <ScrollReveal direction="right">
            <div className="flex flex-col gap-10">

              {/* Radar card */}
              <div className="relative p-8 rounded-[28px] bg-white/[0.03] border border-white/[0.08] overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="font-mono text-[9px] uppercase font-black text-white/20 tracking-widest block mb-1">13-Axis · Diagnostic</span>
                    <h4 className="font-noto text-lg font-black uppercase">Behavioural Radar</h4>
                  </div>
                  <span className="font-mono text-[8px] uppercase font-black tracking-widest px-3 py-1.5 rounded-full bg-white/[0.06] text-white/40">Purposeful Driver</span>
                </div>
                <div className="flex items-center justify-center py-2">
                  <SpiderChart size={160} />
                </div>
                <div className="grid grid-cols-3 gap-0 border-t border-white/[0.06] mt-4 pt-5">
                  {[{ v: '90 Days', l: 'Window' }, { v: '12.4%', l: 'Attrition Rate' }, { v: '94.2%', l: 'Accuracy' }].map(m => (
                    <div key={m.l} className="flex flex-col items-center text-center px-2">
                      <span className="font-noto text-xl md:text-2xl font-black">{m.v}</span>
                      <span className="font-mono text-[8px] uppercase text-white/25 tracking-widest mt-0.5">{m.l}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Distribution bars */}
              <div className="p-8 rounded-[28px] bg-white/[0.03] border border-white/[0.08]">
                <div className="mb-5">
                  <span className="font-mono text-[9px] uppercase font-black text-white/20 tracking-widest block mb-1">Realistic Workplace</span>
                  <h4 className="font-noto text-lg font-black uppercase">Archetype Distribution</h4>
                </div>
                <DistributionBars />
              </div>

            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 03  -  RISK MATRIX + AI INSIGHT (white)
      ══════════════════════════════════════════ */}
      <section className="py-24 md:py-36 px-6 md:px-12 bg-white text-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-28 mb-14 md:mb-24 items-end">
            <ScrollReveal direction="left">
              <div className="flex flex-col gap-6">
                <Label>Risk Intelligence</Label>
                <h2 className="font-noto text-5xl md:text-[6.5rem] font-black tracking-tighter uppercase leading-[0.82]">
                  The<br />Matrix.
                </h2>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <p className="font-mono text-base md:text-lg text-black/45 leading-relaxed">
                Every employee falls into one quadrant of the{' '}
                <span className="text-black font-black italic">Engagement × Risk</span>{' '}
                matrix. The dashboard surfaces the quadrant in real time  -  with a prescribed intervention for each.
              </p>
            </ScrollReveal>
          </div>

          {/* 2×2 matrix */}
          <ScrollReveal>
            <div className="grid grid-cols-2 gap-px bg-black/[0.08] border border-black/[0.08] mb-14 md:mb-24">
              {RISK_MATRIX.map((q, i) => (
                <motion.div
                  key={q.quad}
                  className="bg-white p-8 md:p-10 flex flex-col gap-4 group hover:bg-stone-50 transition-colors duration-300 cursor-default"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center justify-between">
                    <span className={cn('font-mono text-[8px] uppercase font-black tracking-widest', q.color)}>{q.quad}</span>
                    <div className="flex gap-2 font-mono text-[8px] uppercase text-black/25">
                      <span>Eng: {q.eng}</span>
                      <span>·</span>
                      <span>Risk: {q.risk}</span>
                    </div>
                  </div>
                  <p className="font-mono text-[11px] text-black/40 leading-relaxed">{q.action}</p>
                  <motion.div
                    className={cn('h-px rounded-full', q.color.replace('text-', 'bg-').replace('-400', '-400/40'))}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 0.6, delay: i * 0.08 + 0.2 }}
                    viewport={{ once: true }}
                    style={{ originX: 0 }}
                  />
                </motion.div>
              ))}
            </div>
          </ScrollReveal>

          {/* AI insight card */}
          <ScrollReveal direction="up">
            <div className="relative p-8 md:p-12 rounded-[28px] md:rounded-[40px] bg-pitch text-white overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.25)] group">
              <div className="absolute inset-0 opacity-[0.04] pointer-events-none group-hover:opacity-[0.07] transition-opacity duration-700">
                <div className="absolute inset-0 bg-[linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] bg-[size:22px_22px]" />
              </div>
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div className="flex flex-col gap-5">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[9px] uppercase font-black tracking-widest px-3 py-1.5 rounded-full bg-white text-black">Gemini AI · Live Insight</span>
                  </div>
                  <p className="font-mono text-sm font-medium italic leading-relaxed text-white/65">
                    "The 'Frustrated Visionary' cohort shows a 22% increase in burnout risk correlated with workload telemetry. Recommendation: Deploy autonomy-first intervention before the 90-day window closes."
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center font-mono text-[10px] font-black uppercase">
                    <span className="text-white/40">Intervention Lead Time</span>
                    <span>90 Days</span>
                  </div>
                  <div className="h-1 w-full bg-white/[0.08] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '100%' }}
                      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                      viewport={{ once: true }}
                      className="h-full bg-gradient-to-r from-white to-white/40 rounded-full"
                    />
                  </div>
                  <p className="font-mono text-[9px] text-white/25 uppercase font-bold">
                    Window before predicted exit  -  designed for proactive retention.
                  </p>
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/[0.06]">
                    {[{ v: '7-panel', l: 'Dashboard' }, { v: 'onSnapshot', l: 'Realtime' }, { v: 'Arrow-Key', l: 'Presentation Mode' }, { v: 'CSV + TXT', l: 'Export' }].map(m => (
                      <div key={m.l} className="flex flex-col">
                        <span className="font-noto text-sm font-black">{m.v}</span>
                        <span className="font-mono text-[8px] uppercase text-white/25 tracking-widest">{m.l}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 04  -  TRUST + STACK (dark)
      ══════════════════════════════════════════ */}
      <section className="py-24 md:py-36 px-6 md:px-12 bg-brand-bg text-white relative overflow-hidden border-t border-white/[0.05]">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden" aria-hidden>
          <span className="font-noto text-[18vw] font-black uppercase tracking-tighter text-white/[0.014] leading-none">TRUST</span>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 md:gap-28 items-stretch">

          {/* Trust dimension */}
          <ScrollReveal direction="left">
            <div className="flex flex-col h-full gap-8">
              {/* Header row  -  matches stack header height */}
              <div className="flex items-start gap-5">
                <div className="relative w-12 h-12 rounded-full border border-white/[0.12] flex items-center justify-center shrink-0 mt-1">
                  <svg className="w-5 h-5 text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <motion.div
                    className="absolute inset-0 rounded-full border border-white/[0.06]"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <Label dark>Ethical Dimension</Label>
                  <h2 className="font-noto text-5xl md:text-[5.5rem] font-black tracking-tighter uppercase leading-[0.82]">
                    The Trust<br />
                    <span className="text-white/15">Dimension.</span>
                  </h2>
                </div>
              </div>

              <p className="font-mono text-sm md:text-base text-white/35 leading-relaxed">
                Most workforce tools measure performance.{' '}
                <span className="text-white font-black">This one measures trust.</span>{' '}
                The 13th axis captures how employees feel about being monitored  -  an ethical guardrail that prevents surveillance-driven attrition from compounding the very problem it was meant to solve.
              </p>

              {/* Detail rows  -  flex-1 pushes them to fill remaining height alongside stack */}
              <div className="flex flex-col flex-1 justify-end gap-px bg-white/[0.06]">
                {[
                  { title: 'Ethical Analytics',  body: 'Tracking discomfort modelled as a core diagnostic metric to prevent surveillance-driven attrition.' },
                  { title: 'Presentation Mode',   body: 'Arrow-key navigation + automated AI notes export for executive briefings.' },
                ].map(item => (
                  <div key={item.title} className="flex flex-col gap-3 p-6 bg-brand-bg">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-px bg-white/20" />
                      <h4 className="font-noto font-black uppercase text-sm text-white/80">{item.title}</h4>
                    </div>
                    <p className="font-mono text-[11px] text-white/25 leading-relaxed pl-7">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Tech stack */}
          <ScrollReveal direction="right">
            <div className="flex flex-col h-full gap-8">
              {/* Header row  -  matches trust header height */}
              <div className="flex flex-col gap-3">
                <Label dark>Technical Stack</Label>
                <h2 className="font-noto text-5xl md:text-[5.5rem] font-black tracking-tighter uppercase leading-[0.82]">
                  The<br />
                  <span className="text-white/25">Stack.</span>
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-0 border border-white/[0.07] divide-x divide-y divide-white/[0.07]">
                {STACK.map((item, i) => (
                  <motion.div
                    key={item.l}
                    className="flex flex-col items-start gap-1.5 p-6 md:p-7 group hover:bg-white/[0.03] transition-colors"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: i * 0.06, duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <span className="font-mono text-[9px] uppercase font-black text-white/20 tracking-widest">{item.l}</span>
                    <span className="font-noto text-xl md:text-2xl font-black group-hover:translate-x-0.5 transition-transform duration-200">{item.v}</span>
                  </motion.div>
                ))}
              </div>

              {/* Live sync callout  -  pinned to bottom via mt-auto */}
              <div className="mt-auto flex items-center gap-4 p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <p className="font-mono text-[10px] text-white/35 leading-relaxed">
                  Firestore <span className="text-white font-black">onSnapshot</span> listeners deliver sub-40ms reactive updates to all 7 dashboard panels simultaneously.
                </p>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>

      <RelatedProjects currentProjectId="hr-archetype" />

      <footer className="w-full border-t border-border-subtle">
        <TheCloser />
      </footer>
    </div>
  );
};
