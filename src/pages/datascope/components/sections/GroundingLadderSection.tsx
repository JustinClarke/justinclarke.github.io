/**
 * GroundingLadderSection.tsx
 * The scientific research showcase:
 * - 408-call Grounding Ladder experiment (71.6% down to 56.9% correctness)
 * - Three falsified internal hypotheses that changed product architecture
 */
import { motion, useReducedMotion } from 'framer-motion';
import { GROUNDING_LADDER_DATA, FALSIFIED_HYPOTHESES } from '../../data/datascopeData';
import {
  TrendingDown,
  CheckCircle2,
  XCircle,
  FlaskConical,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export function GroundingLadderSection() {
  const reduce = useReducedMotion() ?? false;

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto border-t border-white/[0.08]">
      {/* Header */}
      <div className="flex flex-col max-w-2xl mx-auto mb-14">
        <h2 className="font-noto text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
          The Grounding Ladder —{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #863bff 0%, #00d4ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            what 408 calls taught us.
          </span>
        </h2>
        <p className="font-jetbrains text-xs text-white/50 mt-4 leading-relaxed uppercase tracking-[0.1em] max-w-xl">
          Anyone can show cherry-picked benchmarks. In DataScope, our preregistered eval programme
          repeatedly disproved our own initial assumptions — saving weeks of misguided development
          and driving a fundamentally different architecture.
        </p>
      </div>

      {/* 408-Call Grounding Ladder Visualizer */}
      <div className="rounded-3xl bg-[#090b11]/90 border border-white/10 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl mb-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-jetbrains font-bold text-white mb-1">
              <FlaskConical className="w-4 h-4 text-datascope" />
              <span>Experiment 10: Grounding Ladder Monotonic Decline</span>
            </div>
            <p className="font-sans text-xs text-white/60">
              4 rungs × 102 calls (408 total calls), fixed temperature, Gemini Flash latest.
              Screened against pretraining contamination.
            </p>
          </div>

          <div className="flex items-center gap-3 font-jetbrains">
            <span className="text-xs text-white/60">Result:</span>
            <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-bold text-xs">
              71.6% → 56.9% Correctness
            </span>
          </div>
        </div>

        {/* 4 Ladder Rungs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-8">
          {GROUNDING_LADDER_DATA.map((rung, index) => {
            const isHighest = index === 0;
            const isLowest = index === 3;
            return (
              <div
                key={rung.rung}
                className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                  isHighest
                    ? 'bg-emerald-950/20 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                    : isLowest
                    ? 'bg-red-950/20 border-red-500/30'
                    : 'bg-white/[0.02] border-white/10'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3 font-jetbrains text-micro">
                    <span className="uppercase font-bold text-white/50">Rung 0{rung.rung}</span>
                    <span
                      className={`font-mono font-bold ${
                        isHighest
                          ? 'text-emerald-400'
                          : isLowest
                          ? 'text-red-400'
                          : 'text-[#f2a33c]'
                      }`}
                    >
                      {rung.status}
                    </span>
                  </div>

                  {/* Big Percentage Metric */}
                  <div
                    className={`font-jetbrains text-3xl sm:text-4xl font-black mb-1 ${
                      isHighest
                        ? 'text-emerald-400'
                        : isLowest
                        ? 'text-red-400'
                        : 'text-white'
                    }`}
                  >
                    {rung.correctness}%
                  </div>

                  <div className="font-sans font-bold text-xs text-white/90 mb-2">
                    {rung.rowsInjected}
                  </div>

                  <p className="font-sans text-xs text-white/60 leading-relaxed">
                    {rung.insight}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-micro font-jetbrains text-text-tertiary">
                  <span>102 calls</span>
                  <span>Confidence: 95%</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Epistemic Takeaway */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="font-sans text-xs text-white/80 leading-relaxed">
            <strong className="text-white">Why this changed the product:</strong> The industry
            assumption is that injecting raw data samples helps the model understand table contents.
            Our 408-call ablation established the exact opposite: once the model has computed column
            facts and data types, injecting raw rows pollutes attention tokens and degrades SQL
            correctness. We redesigned context injection around computed facts only.
          </p>
        </div>
      </div>

      {/* The Three Falsified Hypotheses */}
      <div className="mt-12">
        <div className="text-center mb-8">
          <h3 className="font-noto text-2xl sm:text-3xl font-bold text-white">
            Three Shipped Assumptions We Measured and Killed
          </h3>
          <p className="font-sans text-xs sm:text-sm text-white/50 mt-1">
            Real engineering means measuring your own features and having the courage to delete them
            when the numbers disagree.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FALSIFIED_HYPOTHESES.map((hypo) => (
            <div
              key={hypo.id}
              className="p-6 rounded-3xl bg-[#090b11]/80 border border-white/10 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 font-jetbrains text-micro">
                  <span className="font-bold text-[#863bff]">{hypo.code}</span>
                  <span className="text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                    Falsified
                  </span>
                </div>

                <h4 className="font-noto text-lg font-bold text-white mb-2">{hypo.title}</h4>

                <div className="mb-4">
                  <div className="text-micro font-mono uppercase text-text-tertiary mb-0.5">
                    Original Intuition
                  </div>
                  <p className="font-sans text-xs text-white/60 leading-relaxed">
                    {hypo.hypothesis}
                  </p>
                </div>

                <div className="mb-4 p-3 rounded-xl bg-red-950/20 border border-red-500/20">
                  <div className="text-micro font-mono uppercase text-red-400 mb-0.5 font-bold">
                    Measured Reality
                  </div>
                  <p className="font-sans text-xs text-red-200/90 leading-relaxed font-medium">
                    {hypo.measuredResult}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10">
                <div className="text-micro font-mono uppercase text-emerald-400 mb-0.5 font-bold">
                  Architectural Pivot
                </div>
                <p className="font-sans text-xs text-white/80 leading-relaxed">
                  {hypo.architecturalAction}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
