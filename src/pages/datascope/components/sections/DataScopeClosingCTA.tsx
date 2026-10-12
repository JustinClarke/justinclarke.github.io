/**
 * DataScopeClosingCTA.tsx
 * Keynote wrap-up, call-to-actions, and footer telemetry.
 */
import { useNavigate } from 'react-router-dom';
import { DataScopeLogo } from '../ui/DataScopeLogo';
import { CANONICAL_STATS } from '../../data/datascopeData';
import { ArrowRight, Terminal, Github, Sparkles } from 'lucide-react';

export function DataScopeClosingCTA() {
  const navigate = useNavigate();

  return (
    <div className="relative border-t border-white/[0.08] overflow-hidden">
      {/* Background radial glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80vw] max-w-[1000px] h-[350px] opacity-25 blur-[120px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, #863bff 0%, var(--color-datascope) 40%, transparent 70%)',
        }}
      />

      <div className="py-20 md:py-28 px-4 sm:px-6 lg:px-12 max-w-5xl mx-auto text-center relative z-10">
        <DataScopeLogo size={40} glow className="mx-auto mb-8" />

        <h2 className="font-noto text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight mb-4">
          Run it on-device. Run it on-edge.{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #863bff 0%, #00d4ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Run it however you like.
          </span>
        </h2>

        <p className="font-sans text-sm sm:text-base text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
          From multi-table DuckDB-Wasm vectorization to DuckChat’s mechanical SQL repair passes and
          preregistered evals, DataScope demonstrates production-grade systems engineering.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 font-jetbrains text-xs">
          <button
            onClick={() => navigate('/datascope/architecture')}
            className="flex items-center gap-2 px-6 py-3.5 rounded-full font-bold text-white bg-gradient-to-r from-[#863bff] to-datascope hover:opacity-95 shadow-[0_0_30px_rgba(134,59,255,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Terminal className="w-4 h-4" />
            <span>Read Architecture & Evals Deep-Dive</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="https://github.com/JustinClarke/DataScope"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold text-white/90 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-white/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Github className="w-4 h-4" />
            <span>DataScope GitHub</span>
          </a>

          <a
            href="https://github.com/JustinClarke/duckchat"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold text-white/80 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/10 transition-all"
          >
            <Sparkles className="w-4 h-4 text-viz-accent" />
            <span>DuckChat Repo</span>
          </a>
        </div>
      </div>

      {/* Modern Keynote Footer */}
      <footer className="border-t border-white/10 bg-black/40 backdrop-blur-xl py-6 px-6 md:px-12 flex flex-col sm:flex-row justify-between items-center gap-4 text-micro font-jetbrains text-white/50 tracking-wider">
        <div className="flex items-center gap-3">
          <span>Engineered by <strong className="text-white">Justin Clarke</strong></span>
          <span className="text-text-muted">|</span>
          <span>License: <strong className="text-white">{CANONICAL_STATS.license}</strong></span>
        </div>

        <div className="flex items-center gap-2 text-white/70">
          <span className="font-bold text-datascope">DATASCOPE</span>
          <span>·</span>
          <span>Client-Native Analytics</span>
          <span>·</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1.5 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Engine Healthy</span>
          </span>
        </div>
      </footer>
    </div>
  );
}
