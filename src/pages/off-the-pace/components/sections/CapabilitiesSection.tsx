/**
 * CapabilitiesSection section "01 / Capabilities & Problems Solved": a "hard
 * problems" zone (three causal-identification challenges) above a feature-
 * capabilities grid (ghost car, overtake graph, etc.).
 *
 * Fits in: the opening technical section on the Source page.
 * Note:    Each card carries its own `accent` colour in its data object, fed
 *          into inline gradients/borders so one block of JSX serves every card.
 */
import React from 'react';
import { Ghost, Radio, TrendingDown, Gauge, Crosshair, Flag } from 'lucide-react';

interface CapabilitiesSectionProps {
  id: string;
}

const problems = [
  {
    number: '01',
    code: 'ERR_CONFOUNDER_BIAS',
    title: 'Simultaneous Confounders',
    problem: 'Tyre age, fuel load, and traffic change at the same time naïve regression models confound them all.',
    solution: 'Calibrated teammate-panel controls that isolate tyre wear from weight change and constructor pace.',
    accent: 'var(--color-f1-red)',
  },
  {
    number: '02',
    code: 'ERR_CIRCULAR_WAKE',
    title: 'Dirty-Air Endogeneity',
    problem: 'Relative pace determines track position, creating circular causality with the trailing-car wake tax.',
    solution: 'Lagged instruments (Frisch-Waugh-Lovell) isolating wake tax without circular causation.',
    accent: 'var(--color-viz-warning)',
  },
  {
    number: '03',
    code: 'ERR_DRIFT_VIOLATION',
    title: 'Additive Invariance',
    problem: 'The seven components must reconstruct the observed lap time exactly any drift poisons downstream ML.',
    solution: 'CI-enforced singular test assert_lap_7term_identity fails the build if identity breaks.',
    accent: 'var(--color-acc-bi)',
  },
];

const capabilities: {
  Icon: React.ComponentType<any>;
  title: string;
  desc: string;
  tags: string[];
  accent: string;
  status: 'built' | 'planned';
}[] = [
  {
    Icon: Ghost,
    title: 'Ghost Car',
    desc: 'Counterfactual lap reconstruction recombines driver skill residuals with any constructor baseline. dbt models built; React visualisation built.',
    tags: ['fct_ghost_car_pace', 'fct_ghost_race_finish'],
    accent: 'var(--color-f1-red)',
    status: 'built',
  },
  {
    Icon: Radio,
    title: 'Overtake Graph',
    desc: 'On-track pass detection via driver_ahead_id swaps. Filters pit-cycle gains, SC restarts, and lapping traffic.',
    tags: ['int_overtakes', 'fct_racecraft'],
    accent: 'var(--color-viz-info)',
    status: 'built',
  },
  {
    Icon: TrendingDown,
    title: 'Tyre Cliff Predictor',
    desc: 'Multi-horizon XGBoost targets for degradation jumps. 5 models, 38 features, 110K training laps.',
    tags: ['fct_cliff_prediction', 'XGBoost'],
    accent: 'var(--color-viz-success)',
    status: 'built',
  },
  {
    Icon: Gauge,
    title: 'Powertrain Fingerprint',
    desc: 'Per-lap driving style signature gear changes, RPM profiles, throttle %, DRS share, short-shift index.',
    tags: ['int_lap_powertrain'],
    accent: 'var(--color-viz-warning)',
    status: 'built',
  },
  {
    Icon: Crosshair,
    title: 'Pit Strategy Value',
    desc: 'Classifies each pit call as optimal, overran, undercut_forced, or early.',
    tags: ['int_pit_strategy_value', 'fct_stint'],
    accent: 'var(--color-viz-accent)',
    status: 'built',
  },
  {
    Icon: Flag,
    title: 'Race Control',
    desc: 'SC/VSC windows, red-flag laps, and penalties parsed with precise lap-level neutralisation.',
    tags: ['stg_race_control', 'int_events'],
    accent: 'var(--color-acc-creative)',
    status: 'built',
  },
];

export const CapabilitiesSection: React.FC<CapabilitiesSectionProps> = ({ id }) => {
  return (
    <section id={id} className="w-full scroll-mt-32 reveal-element">
      {/* Header */}
      <div className="mb-16">
        <span className="font-jetbrains text-micro text-f1-red uppercase tracking-mega mb-4 block">
          01 / Capabilities &amp; Problems Solved
        </span>
        <h2 className="text-3xl md:text-4xl font-noto font-black text-text-primary uppercase tracking-tighter mb-4">
          What this system does.<br />What makes it hard.
        </h2>
        <p className="text-text-tertiary text-sm max-w-2xl font-jetbrains leading-relaxed">
          A headless physics pipeline producing ML-ready feature marts from raw 10Hz F1 telemetry. Three causal identification problems each with an explicit engineering solution baked into the codebase.
        </p>
      </div>

      {/* ── HARD PROBLEMS ZONE ── */}
      <div className="mb-20">
        {/* Zone label */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center">
              <span className="absolute w-3 h-3 rounded-full animate-ping" style={{ backgroundColor: 'color-mix(in srgb, var(--color-f1-red) 20%, transparent)' }} />
              <span className="relative w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-f1-red)', boxShadow: '0 0 8px color-mix(in srgb, var(--color-f1-red) 50%, transparent)' }} />
            </div>
            <span className="font-jetbrains text-micro uppercase tracking-[0.25em] font-bold" style={{ color: 'var(--color-f1-red)' }}>
              Active Identification Problems
            </span>
          </div>
          <div className="flex-1 h-px" style={{ backgroundImage: 'linear-gradient(to right, color-mix(in srgb, var(--color-f1-red) 20%, transparent), transparent)' }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {problems.map((item) => (
            <div
              key={item.code}
              className="group relative bg-graphite-850 border border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-500 hover:border-white/[0.12] hover:shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
            >
              {/* Animated top border accent */}
              <div
                className="absolute inset-x-0 top-0 h-[2px] opacity-40 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(90deg, transparent, ${item.accent}, transparent)` }}
              />

              {/* Radial glow on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at top center, ${item.accent}08, transparent 60%)` }}
              />

              <div className="relative p-7 flex flex-col h-full">
                {/* Number + Code header */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex flex-col gap-1.5">
                    <span
                      className="font-noto text-[32px] font-black leading-none tracking-tighter"
                      style={{ color: `${item.accent}20` }}
                    >
                      {item.number}
                    </span>
                    <span
                      className="font-jetbrains text-micro uppercase tracking-mega font-bold"
                      style={{ color: item.accent }}
                    >
                      {item.code}
                    </span>
                  </div>

                  {/* Warning badge */}
                  <div
                    className="flex items-center gap-1.5 px-2 py-1 rounded-md border"
                    style={{
                      backgroundColor: `${item.accent}08`,
                      borderColor: `${item.accent}15`,
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{
                        backgroundColor: item.accent,
                        boxShadow: `0 0 6px ${item.accent}60`,
                      }}
                    />
                    <span
                      className="font-mono text-micro font-bold tracking-wider uppercase"
                      style={{ color: `${item.accent}cc` }}
                    >
                      ACTIVE
                    </span>
                  </div>
                </div>

                {/* Title + Problem */}
                <h4 className="font-noto text-[15px] font-extrabold text-text-primary uppercase tracking-tight mb-3 leading-snug">
                  {item.title}
                </h4>
                <p className="font-jetbrains text-fine text-text-tertiary leading-relaxed flex-1">
                  {item.problem}
                </p>

                {/* Resolution block terminal-style */}
                <div className="mt-6 pt-4 border-t border-white/[0.04]">
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.4)]" />
                    <span className="font-jetbrains text-micro uppercase tracking-mega text-emerald-400 font-bold">
                      ✓ Resolution
                    </span>
                  </div>
                  <div className="bg-emerald-500/[0.04] border border-emerald-500/[0.08] rounded-lg p-3">
                    <p className="font-mono text-micro text-emerald-300/80 leading-relaxed">
                      <span className="text-emerald-500/40 mr-1 select-none">&gt;</span>
                      {item.solution}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CAPABILITIES ZONE ── */}
      <div>
        {/* Zone label */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
            <span className="font-jetbrains text-micro uppercase tracking-[0.25em] text-emerald-400 font-bold">
              Feature Capabilities
            </span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-emerald-500/20 to-transparent" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {capabilities.map((cap) => (
            <div
              key={cap.title}
              className="group relative rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-0.5"
            >
              {/* Outer glow border via background trick */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{ background: `linear-gradient(135deg, ${cap.accent}18, transparent 50%)` }}
              />

              {/* Inner card */}
              <div className="relative m-px bg-graphite-850 rounded-2xl border border-white/[0.06] group-hover:border-white/[0.1] transition-all duration-500 h-full">
                {/* Top accent line */}
                <div
                  className="absolute top-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(90deg, transparent, ${cap.accent}60, transparent)` }}
                />

                <div className="relative p-6 flex flex-col h-full">
                  {/* Header row: icon + title + status */}
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border transition-all duration-500 group-hover:shadow-[0_0_16px_var(--glow)]"
                      style={{
                        backgroundColor: `${cap.accent}0a`,
                        borderColor: `${cap.accent}20`,
                        '--glow': `${cap.accent}25`,
                      } as React.CSSProperties}
                    >
                      <cap.Icon
                        className="w-[18px] h-[18px] transition-transform duration-500 group-hover:scale-110"
                        style={{ color: cap.accent }}
                        strokeWidth={1.5}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-noto text-label font-extrabold text-text-primary uppercase tracking-tight leading-snug">
                        {cap.title}
                      </h4>
                      <span
                        className="inline-block mt-1 font-mono text-micro font-bold uppercase tracking-[0.15em] px-1.5 py-0.5 rounded border"
                        style={{
                          color: cap.status === 'planned' ? 'var(--color-amber)' : 'var(--color-viz-success)',
                          borderColor: cap.status === 'planned' ? 'rgba(245,158,11,0.2)' : 'rgba(74,222,128,0.15)',
                          backgroundColor: cap.status === 'planned' ? 'rgba(245,158,11,0.06)' : 'rgba(74,222,128,0.04)',
                        }}
                      >
                        {cap.status === 'planned' ? '◆ Planned' : '● Built'}
                      </span>
                    </div>
                  </div>

                  {/* Description kept short */}
                  <p className="font-jetbrains text-fine text-text-tertiary leading-relaxed mb-auto">
                    {cap.desc}
                  </p>

                  {/* Tags row */}
                  <div className="flex flex-wrap gap-1.5 mt-5 pt-4 border-t border-white/[0.03]">
                    {cap.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-micro uppercase tracking-wider px-2 py-0.5 rounded border border-white/[0.05] bg-white/[0.015] text-text-ghost group-hover:text-text-tertiary group-hover:border-white/[0.08] transition-all duration-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
