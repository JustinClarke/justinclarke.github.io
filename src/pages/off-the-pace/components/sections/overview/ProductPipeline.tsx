/**
 * ProductPipeline the three-stage architecture diagram (Ingest to Model to
 * Output) plus a mock terminal showing the resulting table schema.
 *
 * Fits in: the overview, explaining how the data flows.
 * Note:    The connecting line between stages is an inline `<svg>` with an
 *          animated gradient stroke (`.sb-flow-dash`), purely decorative.
 */
import { Database, Network, LineChart } from 'lucide-react';
import { STATS } from '../../../data/projectStats';

export function ProductPipeline() {
  return (
    <div className="flex flex-col gap-10">
      <div className="max-w-xl">
        <span className="font-jetbrains text-micro text-f1-red uppercase tracking-mega mb-4 block font-semibold">
          Architecture
        </span>
        <h2 className="text-3xl md:text-4xl font-noto font-black text-white uppercase tracking-tighter mb-4">
          The Data Pipeline.
        </h2>
        <p className="text-text-tertiary text-sm font-jetbrains leading-relaxed">
          A headless physics engine transforming raw telemetry into clean, causal features.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {/* Animated Data Stream Pipeline Connecting Line */}
        <div className="hidden md:block absolute top-[5.25rem] left-20 right-20 h-4 -z-10 overflow-hidden pointer-events-none">
          <svg className="w-full h-full" fill="none" viewBox="0 0 800 16" preserveAspectRatio="none">
            <path d="M 0 8 L 800 8" stroke="rgba(255,255,255,0.04)" strokeWidth="2" />
            <path d="M 0 8 L 800 8" stroke="url(#pipeline-grad)" strokeWidth="2" className="sb-flow-dash" />
            <defs>
              <linearGradient id="pipeline-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--color-f1-red)" stopOpacity="0.8" />
                <stop offset="50%" stopColor="var(--color-emerald)" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.8" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* 01 Ingest */}
        <div className="relative flex flex-col p-8 bg-brand-card/60 backdrop-blur-xl saturate-150 border border-white/10 rounded-[2rem] hover:border-f1-red/30 hover:bg-[#131313]/80 hover:shadow-[0_12px_40px_rgba(225,6,0,0.2)] transition-all duration-500 group">
          <div className="w-16 h-16 rounded-2xl bg-transparent border-2 border-f1-red/60 flex items-center justify-center mb-6 shadow-sm group-hover:scale-105 group-hover:bg-f1-red group-hover:border-f1-red group-hover:shadow-[0_0_20px_rgba(225,6,0,0.4)] transition-all duration-500">
            <Database className="w-8 h-8 text-f1-red group-hover:text-white transition-colors duration-300" />
          </div>
          <span className="font-jetbrains text-micro uppercase tracking-widest text-text-tertiary mb-2 font-mono">01 / Ingest</span>
          <h3 className="font-noto text-xl font-bold text-text-primary mb-3 group-hover:text-white transition-colors">FastF1 Telemetry</h3>
          <p className="text-xs text-text-tertiary leading-relaxed font-jetbrains">
            {STATS.races} races × 4 datasets  - laps, weather, race control, and {STATS.telemetryHz}Hz
            car telemetry  - extracted locally into Hive-partitioned Parquet.
          </p>
        </div>

        {/* 02 Model */}
        <div className="relative flex flex-col p-8 bg-brand-card/60 backdrop-blur-xl saturate-150 border border-white/10 rounded-[2rem] hover:border-emerald-500/30 hover:bg-[#131313]/80 hover:shadow-[0_12px_40px_rgba(16,185,129,0.2)] transition-all duration-500 group">
          <div className="w-16 h-16 rounded-2xl bg-transparent border-2 border-emerald-500/60 flex items-center justify-center mb-6 shadow-sm group-hover:scale-105 group-hover:bg-emerald-500 group-hover:border-emerald-500 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-500">
            <Network className="w-8 h-8 text-emerald-500 group-hover:text-white transition-colors duration-300" />
          </div>
          <span className="font-jetbrains text-micro uppercase tracking-widest text-text-tertiary mb-2 font-mono">02 / Model</span>
          <h3 className="font-noto text-xl font-bold text-text-primary mb-3 group-hover:text-white transition-colors">dbt DAG</h3>
          <p className="text-xs text-text-tertiary leading-relaxed font-jetbrains">
            {STATS.dbtModels} models in DuckDB applying physics invariants to isolate car
            performance from tyre degradation, traffic, and fuel load.
          </p>
        </div>

        {/* 03 Output */}
        <div className="relative flex flex-col p-8 bg-brand-card/60 backdrop-blur-xl saturate-150 border border-white/10 rounded-[2rem] hover:border-violet-500/30 hover:bg-[#131313]/80 hover:shadow-[0_12px_40px_rgba(139,92,246,0.2)] transition-all duration-500 group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/[0.02] blur-[40px] rounded-full pointer-events-none" />
          <div className="w-16 h-16 rounded-2xl bg-transparent border-2 border-violet-500/60 flex items-center justify-center mb-6 shadow-sm group-hover:scale-105 group-hover:bg-violet-500 group-hover:border-violet-500 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all duration-500 relative z-10">
            <LineChart className="w-8 h-8 text-violet-500 group-hover:text-white transition-colors duration-300" />
          </div>
          <span className="font-jetbrains text-micro uppercase tracking-widest text-text-tertiary mb-2 relative z-10 font-mono">03 / Output</span>
          <h3 className="font-noto text-xl font-bold text-text-primary mb-3 relative z-10 group-hover:text-white transition-colors">Causal Predictors</h3>
          <p className="text-xs text-text-tertiary leading-relaxed font-jetbrains relative z-10">
            Clean, counterfactual pace metrics ready for XGBoost models and simulation engines.
          </p>
        </div>
      </div>

      {/* Terminal Database Record spec */}
      <div className="relative border border-white/10 bg-brand-card/60 backdrop-blur-xl saturate-150 rounded-2xl p-6 overflow-hidden shadow-sm mt-4">
        {/* Decorative scanline overlay */}
        <div className="absolute inset-0 bg-dots-dark opacity-[0.25] pointer-events-none" />
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4 relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/10" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/10" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/10" />
            <span className="text-micro font-mono text-text-tertiary ml-2 uppercase tracking-wider">schema // mart/fct_lap_residuals.sql</span>
          </div>
          <div className="flex items-center gap-2 text-micro text-emerald-400 font-mono font-bold bg-emerald-500/5 border border-emerald-500/10 px-2.5 py-1 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            COMPILE_SUCCESS
          </div>
        </div>

        {/* Terminal Body */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center relative z-10">
          <div className="lg:col-span-2 flex flex-col gap-3">
            <p className="font-jetbrains text-xs text-text-secondary leading-relaxed">
              The pipeline compiles into <span className="font-semibold text-white font-mono bg-white/[0.04] border border-white/10 px-1.5 py-0.5 rounded">fct_lap_residuals</span>  - a 1-lap-grain partition matrix where each of the 8 additive telemetry residuals is independently verified and CI-guarded.
            </p>
            <p className="font-jetbrains text-micro text-text-tertiary">
              Downstream consumers: XGBoost Regression, Survival Modeling, Monte Carlo Race Simulator.
            </p>
          </div>
          
          {/* Visual Column Schema Spec */}
          <div className="bg-graphite-900/50 border border-white/5 rounded-xl p-4 font-mono text-micro text-text-tertiary flex flex-col gap-2 shadow-[inset_0_1.5px_4px_rgba(0,0,0,0.02)]">
            <div className="flex justify-between border-b border-white/5 pb-1.5 font-bold text-text-tertiary">
              <span>COLUMN</span>
              <span>TYPE</span>
            </div>
            <div className="flex justify-between">
              <span className="text-f1-red font-semibold">lap_id</span>
              <span>VARCHAR (PK)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-400 font-semibold">residual_skill</span>
              <span>FLOAT64</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-400 font-semibold">residual_dirty_air</span>
              <span>FLOAT64</span>
            </div>
            <div className="flex justify-between">
              <span className="text-amber-400 font-semibold">residual_tyre_deg</span>
              <span>FLOAT64</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
