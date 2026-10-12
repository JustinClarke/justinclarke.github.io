/**
 * EngineeringRigorStrip.tsx
 * The software craftsmanship & supply chain strip:
 * - 2,500+ tests across 231 test files
 * - oxlint, typechecking, CodeQL supply-chain gates
 * - Reproducibility infrastructure (append-only run artifacts)
 */
import { CANONICAL_STATS } from '../../data/datascopeData';
import { ShieldCheck, CheckCircle2, GitCommit, FileCode2, TestTube2, Lock } from 'lucide-react';

export function EngineeringRigorStrip() {
  return (
    <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto border-t border-white/[0.08]">
      <div className="rounded-3xl bg-gradient-to-b from-white/[0.03] to-transparent border border-white/10 p-6 sm:p-10 backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-8 pb-8 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 text-micro font-jetbrains uppercase tracking-widest text-emerald-400 mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Production Codebase Integrity</span>
            </div>
            <h3 className="font-noto text-2xl sm:text-3xl font-black text-white">
              Held to 2,500+ tests across 231 test suites.
            </h3>
            <p className="font-sans text-xs sm:text-sm text-white/60 mt-1 max-w-xl">
              Every pull request passes automated type checking, sub-second linting, security scans,
              and immutable eval run logging before merge.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-jetbrains text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{CANONICAL_STATS.testCount} Vitest Unit Tests</span>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-datascope/10 border border-datascope/30 text-datascope font-jetbrains text-xs font-bold">
              <Lock className="w-3.5 h-3.5" />
              <span>5-Layer Supply Chain Hardening</span>
            </span>
          </div>
        </div>

        {/* 4 Metrics Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 font-jetbrains">
          <div className="flex flex-col">
            <span className="text-micro uppercase text-text-tertiary mb-1">Source Code</span>
            <span className="text-2xl sm:text-3xl font-black text-white">
              {CANONICAL_STATS.sourceLoc}
            </span>
            <span className="text-xs text-white/60 mt-1">Lines of TypeScript under src/</span>
          </div>

          <div className="flex flex-col">
            <span className="text-micro uppercase text-text-tertiary mb-1">Test Suites</span>
            <span className="text-2xl sm:text-3xl font-black text-[#863bff]">
              {CANONICAL_STATS.testFiles}
            </span>
            <span className="text-xs text-white/60 mt-1">167 app + 53 eval + edge test files</span>
          </div>

          <div className="flex flex-col">
            <span className="text-micro uppercase text-text-tertiary mb-1">Eval Programmes</span>
            <span className="text-2xl sm:text-3xl font-black text-datascope">
              {CANONICAL_STATS.evalExperimentsBuilt} Built
            </span>
            <span className="text-xs text-white/60 mt-1">20 preregistered experimental designs</span>
          </div>

          <div className="flex flex-col">
            <span className="text-micro uppercase text-text-tertiary mb-1">Security & Scans</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-400">
              Zero Secrets
            </span>
            <span className="text-xs text-white/60 mt-1">Gitleaks + CodeQL + pip-audit</span>
          </div>
        </div>
      </div>
    </section>
  );
}
