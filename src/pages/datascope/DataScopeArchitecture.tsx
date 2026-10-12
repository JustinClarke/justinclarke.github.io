/**
 * DataScopeArchitecture.tsx
 * The technical engineering and evaluation deep-dive page (/datascope/architecture).
 * Focuses on system seams, small-model on-device frontiers, AST guards, and eval rigor.
 */
import { SEO } from '@/components/layout';
import { routeMeta } from '@/content';
import { DataScopeNav } from './components/ui/DataScopeNav';
import { KeynoteLighting } from './components/ui/KeynoteLighting';
import { DataScopeClosingCTA } from './components/sections/DataScopeClosingCTA';
import { CANONICAL_STATS } from './data/datascopeData';
import {
  Terminal,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  FileCode2,
  Layers,
  FlaskConical,
  GitBranch,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function DataScopeArchitecture() {
  const navigate = useNavigate();

  return (
    <div
      data-theme-lock="dark"
      className="datascope-scope min-h-screen bg-[#07080b] text-white font-sans selection:bg-[#863bff]/40 selection:text-white overflow-x-hidden relative"
    >
      <SEO {...routeMeta('/datascope/architecture')} />

      <DataScopeNav />
      <KeynoteLighting />

      <main className="relative z-10 pt-28 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <h1 className="font-noto text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            The engineering behind{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #863bff 0%, #00d4ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              DataScope & DuckChat.
            </span>
          </h1>

          <p className="font-jetbrains text-xs text-white/50 mt-4 leading-relaxed uppercase tracking-[0.1em] max-w-xl">
            Memory accounting, AST guard guarantees, 15-probe on-device capability frontier,
            and immutable eval manifests.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-8 font-jetbrains text-xs">
            <button
              onClick={() => navigate('/datascope')}
              className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-colors"
            >
              ← Overview
            </button>
            <a
              href="https://github.com/JustinClarke/DataScope"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-white/[0.04] hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors"
            >
              GitHub ↗
            </a>
          </div>
        </div>

        {/* SECTION 1: The Four Load-Bearing Seams */}
        <section className="mb-20">
          <div className="border-b border-white/10 pb-4 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Layers className="w-5 h-5 text-datascope" />
              <h2 className="font-noto text-2xl font-bold text-white">
                1. Four Load-Bearing Architectural Seams
              </h2>
            </div>
            <span className="font-mono text-micro text-white/50">Zero direct couplings</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-[#090b11]/80 border border-white/10">
              <h3 className="font-jetbrains font-bold text-base text-white mb-2 flex items-center gap-2">
                <span className="text-datascope">Seam 01:</span>
                <span>QueryEngine Abstraction</span>
              </h3>
              <p className="font-sans text-xs text-white/70 leading-relaxed mb-4">
                Profiling, semantic classification, and relationship inference are strictly written
                against a clean TypeScript <code>QueryEngine</code> contract, never against DuckDB-Wasm
                directly. This allows swapping DuckDB for embedded SQLite, Pyodide, or mock engines in
                unit testing with zero code churn.
              </p>
              <div className="p-3 rounded-xl bg-black/60 border border-white/5 font-mono text-[11px] text-white/60">
                app/services/QueryEngine.ts: query(sql, params) → ArrowTable
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#090b11]/80 border border-white/10">
              <h3 className="font-jetbrains font-bold text-base text-white mb-2 flex items-center gap-2">
                <span className="text-[#863bff]">Seam 02:</span>
                <span>ViewSpec Layout Artifact</span>
              </h3>
              <p className="font-sans text-xs text-white/70 leading-relaxed mb-4">
                The UI renderer consumes a strictly validated, versioned <code>ViewSpec</code> schema
                and <strong>never executes raw model output or arbitrary HTML/JS</strong>. A
                deterministic producer paints the layout first; AI engines can only compose within
                the grammar declared legal by the capability broker.
              </p>
              <div className="p-3 rounded-xl bg-black/60 border border-white/5 font-mono text-[11px] text-white/60">
                types/ViewSpec.ts: safe layout grammar with execution sandbox
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#090b11]/80 border border-white/10">
              <h3 className="font-jetbrains font-bold text-base text-white mb-2 flex items-center gap-2">
                <span className="text-[#f2a33c]">Seam 03:</span>
                <span>DuckChat AST Guard & Repair</span>
              </h3>
              <p className="font-sans text-xs text-white/70 leading-relaxed mb-4">
                The LLM never queries the database directly. Natural language generates candidate SQL,
                which is parsed into an AST. A read-only guard verifies that all statements are
                strictly <code>SELECT</code> or <code>WITH</code>. Mechanically decidable faults
                (missing GROUP BY keys, sign reversals) are rewritten before execution.
              </p>
              <div className="p-3 rounded-xl bg-black/60 border border-white/5 font-mono text-[11px] text-white/60">
                duckchat/src/repair.js: AST rewrites with +6/72 benchmark boost
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#090b11]/80 border border-white/10">
              <h3 className="font-jetbrains font-bold text-base text-white mb-2 flex items-center gap-2">
                <span className="text-emerald-400">Seam 04:</span>
                <span>Verifiable Citation Engine</span>
              </h3>
              <p className="font-sans text-xs text-white/70 leading-relaxed mb-4">
                Every numerical claim authored by the model is submitted to an automated citation
                validator. The validator executes the cited query against DuckDB-Wasm and verifies that
                each numerical figure appears in the result set. Any claim lacking exact mathematical
                grounding is stripped.
              </p>
              <div className="p-3 rounded-xl bg-black/60 border border-white/5 font-mono text-[11px] text-white/60">
                eval/chat/12-verified-claims: 40/40 first-pass validity
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: The Small-Model Capability Frontier */}
        <section className="mb-20">
          <div className="border-b border-white/10 pb-4 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Cpu className="w-5 h-5 text-[#863bff]" />
              <h2 className="font-noto text-2xl font-bold text-white">
                2. Mapping the On-Device SQL Capability Frontier
              </h2>
            </div>
            <span className="font-mono text-micro text-viz-accent">Experiment 16 Sweep</span>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-[#090b11]/90 border border-white/10 mb-8">
            <p className="font-sans text-sm text-white/70 leading-relaxed mb-6">
              Across 15 probes and 5 small local models (Gemini Nano, Qwen3 1.7B, Qwen3 0.6B,
              Qwen2.5-Coder 0.5B, and Qwen2.5-Coder 1.5B) evaluated over flat, one-join, and 4-table
              schemas, we scored execution-verified correctness at N≥3.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-jetbrains">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                <span className="text-micro uppercase text-text-tertiary">Qwen3 1.7B (WebGPU)</span>
                <div className="text-2xl font-black text-emerald-400 mt-1">24 / 24 (100%)</div>
                <p className="font-sans text-xs text-white/60 mt-2">
                  Clears flat, one-join, and four-table fixtures stably at N≥3 on client WebGPU.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                <span className="text-micro uppercase text-text-tertiary">Qwen2.5-Coder 0.5B</span>
                <div className="text-2xl font-black text-red-400 mt-1">12 / 24 (50%)</div>
                <p className="font-sans text-xs text-white/60 mt-2">
                  Clears none stably. The same 4 join questions fail across every run regardless of
                  temperature.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                <span className="text-micro uppercase text-text-tertiary">The Grain-Error Class</span>
                <div className="text-2xl font-black text-amber-400 mt-1">Open Frontier</div>
                <p className="font-sans text-xs text-white/60 mt-2">
                  SQL that executes cleanly with zero runtime errors but returns the wrong aggregation
                  grain. Retries cannot trigger because the query runs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: Engineered Reproducibility */}
        <section className="mb-12">
          <div className="border-b border-white/10 pb-4 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FlaskConical className="w-5 h-5 text-emerald-400" />
              <h2 className="font-noto text-2xl font-bold text-white">
                3. Engineered Reproducibility in the Eval Programme
              </h2>
            </div>
            <span className="font-mono text-micro text-emerald-400">Append-only run logging</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-[#090b11]/80 border border-white/10">
              <div className="font-jetbrains text-xs font-bold text-datascope mb-2 uppercase">
                Preregistered Criteria
              </div>
              <p className="font-sans text-xs text-white/70 leading-relaxed">
                Acceptance criteria and quantitative pass/fail gates are committed in READMEs before
                any inference budget is spent. Mechanical gates are kept strictly separate from
                human-scored qualitative assessments.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#090b11]/80 border border-white/10">
              <div className="font-jetbrains text-xs font-bold text-[#863bff] mb-2 uppercase">
                Immutable Run Artifacts
              </div>
              <p className="font-sans text-xs text-white/70 leading-relaxed">
                Manifest-first allocation, refuse-to-overwrite filesystem semantics, automated secret
                redaction, and recorded JSON run files. Experiments can be rescored at zero model cost
                from recorded transcripts.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#090b11]/80 border border-white/10">
              <div className="font-jetbrains text-xs font-bold text-emerald-400 mb-2 uppercase">
                Adversarial Review First
              </div>
              <p className="font-sans text-xs text-white/70 leading-relaxed">
                Experimental designs undergo rigorous review before calling APIs. In Experiment 20,
                adversarial review caught 5 blocking design flaws before a single dollar was spent on
                inference, converting it into a falsifiable ablation.
              </p>
            </div>
          </div>
        </section>

        <DataScopeClosingCTA />
      </main>
    </div>
  );
}
