/**
 * DuckChatRepairLab.tsx
 * The technical showpiece for AI Systems and Applied AI roles:
 * - Deterministic SQL AST repair layer vs expensive model retries
 * - Interactive before-and-after AST code diffs
 * - The 4B vs 9B model efficiency finding
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DUCKCHAT_REPAIRS, type DuckChatRepairExample } from '../../data/datascopeData';
import {
  Wrench,
  AlertOctagon,
  CheckCircle2,
  Cpu,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Zap,
} from 'lucide-react';

export function DuckChatRepairLab() {
  const [selectedRepair, setSelectedRepair] = useState<DuckChatRepairExample>(DUCKCHAT_REPAIRS[0]);

  return (
    <section
      id="datascope-repair-lab"
      className="py-16 md:py-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto border-t border-white/[0.08]"
    >
      {/* Section Header */}
      <div className="flex flex-col max-w-2xl mx-auto mb-14">
        <h2 className="font-noto text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
          AST repair instead of{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #863bff 0%, #00d4ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            another prompt retry.
          </span>
        </h2>
        <p className="font-jetbrains text-xs text-white/50 mt-4 leading-relaxed uppercase tracking-[0.1em] max-w-xl">
          When an LLM emits broken SQL, conventional apps re-prompt — adding 2,000ms of latency,
          doubling inference cost. DuckChat intercepts the AST, deterministically fixes mechanically
          decidable faults in {"<"}1ms, and never calls the model again.
        </p>
      </div>

      {/* Main Repair Workbench */}
      <div className="rounded-3xl bg-[#090b11]/90 border border-white/10 p-6 sm:p-8 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
        {/* Top Control Bar: Tab selector for the 3 repair classes */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-[#f2a33c]" />
            <span className="font-jetbrains font-bold text-sm text-white">
              Deterministic AST Fault Classes
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-jetbrains text-micro">
            {DUCKCHAT_REPAIRS.map((repair) => {
              const isSelected = selectedRepair.id === repair.id;
              return (
                <button
                  key={repair.id}
                  onClick={() => setSelectedRepair(repair)}
                  className={`px-3 py-1.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-[#f2a33c]/20 border-[#f2a33c]/50 text-[#f2a33c] font-bold shadow-[0_0_15px_rgba(242,163,60,0.25)]'
                      : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  {repair.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Prompt and Explanation */}
        <div className="py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/[0.08]">
          <div>
            <div className="text-[10px] font-mono uppercase text-text-tertiary mb-1">
              Natural Language Prompt
            </div>
            <div className="text-base font-sans font-medium text-white">
              "{selectedRepair.prompt}"
            </div>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 font-jetbrains text-xs">
            <AlertOctagon className="w-4 h-4 shrink-0" />
            <span>{selectedRepair.faultClass}</span>
          </div>
        </div>

        {/* Side-by-side SQL Diff */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 py-6">
          {/* Left: Raw Model Defect */}
          <div className="rounded-2xl bg-red-950/20 border border-red-500/30 p-4 font-mono text-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-red-500/20 text-red-400 font-bold uppercase tracking-wider text-micro">
                <span>01. Raw LLM Emission</span>
                <span>Fails Execution / Standard</span>
              </div>
              <pre className="text-white/80 leading-relaxed overflow-x-auto">
                <code>{selectedRepair.rawModelSql}</code>
              </pre>
            </div>
            <div className="mt-4 pt-3 border-t border-red-500/20 text-micro text-red-300/80">
              Violates SQL syntax rules or dialect invariants; requires costly execution retry.
            </div>
          </div>

          {/* Right: DuckChat Repaired Output */}
          <div className="rounded-2xl bg-emerald-950/20 border border-emerald-500/40 p-4 font-mono text-xs flex flex-col justify-between relative shadow-[0_0_30px_rgba(16,185,129,0.1)]">
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-emerald-500/20 text-emerald-400 font-bold uppercase tracking-wider text-micro">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span>02. DuckChat Repaired AST</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                  &lt; 0.2ms Latency
                </span>
              </div>
              <pre className="text-white font-bold leading-relaxed overflow-x-auto">
                <code>{selectedRepair.repairedSql}</code>
              </pre>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-500/20 text-micro text-emerald-300 flex items-center justify-between">
              <span>{selectedRepair.repairReason}</span>
              <span className="font-bold shrink-0">{selectedRepair.resultMetric}</span>
            </div>
          </div>
        </div>

        {/* The 4B vs 9B Model Efficiency Card */}
        <div className="mt-4 p-5 rounded-2xl bg-gradient-to-r from-[#863bff]/15 via-white/[0.02] to-datascope/15 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#863bff]/20 border border-[#863bff]/30 flex items-center justify-center text-viz-accent shrink-0">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="font-noto text-lg font-bold text-white flex items-center gap-2">
                <span>The 4B vs 9B Scaling Discovery</span>
                <span className="text-micro font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                  Fixed Git SHA Sweep
                </span>
              </div>
              <p className="font-sans text-xs text-white/70 max-w-2xl mt-0.5">
                On the 72-question DuckDB benchmark, an edge-optimized 4B model (Qwen 3.5 4B)
                outscored a larger 9B model (<strong>62/66 vs 57/66</strong>) while operating within
                mobile memory budgets. Deterministic repairs contributed <strong>+6/72</strong> with
                zero parameter fine-tuning.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 font-jetbrains">
            <div className="text-right">
              <div className="text-2xl font-black text-datascope">69 / 72</div>
              <div className="text-[10px] uppercase text-white/50">Peak Benchmark Score</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
