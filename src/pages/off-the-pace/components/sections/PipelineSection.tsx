/**
 * PipelineSection the "Transform : DAG & Invariant" visual: a four-stage
 * Bronze->Silver->Gold->Models row, then a stats/lineage grid (stack, test
 * coverage, telemetry rate, model lineage, build time).
 *
 * Fits in: rendered by SourceView under the Pipeline heading.
 * Note:    StageCard is a private sub-component; `isLast` hides the trailing
 *          arrow on the final stage so the chevrons read left-to-right.
 *
 * For beginners ----------------------------------------------------------------
 * StageCard takes a typed props object and `isLast = false` gives that prop a
 * default when a caller omits it. The arrow between stages is conditionally
 * rendered with `{!isLast && (...)}`. Everything else here is static layout -
 * the only dynamic bits are the STATS numbers interpolated into the text.
 * -----------------------------------------------------------------------------
 */
import React from 'react';
import { STATS } from '../../data/projectStats';

interface StageCardProps {
  layer: string;
  title: string;
  desc: string;
  tags: string[];
  isLast?: boolean;
}

const StageCard: React.FC<StageCardProps> = ({ layer, title, desc, tags, isLast = false }) => (
  <div className="relative p-6 border-r border-white/5 last:border-r-0 flex flex-col justify-between group overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    <div>
      <span className="font-jetbrains text-[9px] uppercase tracking-widest text-f1-red block mb-2 font-semibold">
        {layer}
      </span>
      <h4 className="text-sm font-bold text-white/90 mb-3 uppercase tracking-wide">
        {title}
      </h4>
      <p className="font-jetbrains text-[11px] leading-relaxed text-white/50 mb-4">
        {desc}
      </p>
    </div>

    <div className="flex flex-wrap gap-1.5 mt-auto">
      {tags.map((tag) => (
        <span
          key={tag}
          className="font-jetbrains text-[8px] uppercase tracking-wider text-white/30 bg-white/[0.03] border border-white/5 px-2 py-0.5 rounded"
        >
          {tag}
        </span>
      ))}
    </div>

    {!isLast && (
      <div className="hidden lg:flex absolute right-[-10px] top-1/2 -translate-y-1/2 z-20 text-f1-red text-xs font-jetbrains font-bold bg-graphite-900 px-1 select-none">
        →
      </div>
    )}
  </div>
);

export const PipelineSection: React.FC = () => {
  return (
    <div className="w-full" id="pipeline">
      <div className="max-w-6xl mx-auto py-12">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-white/10 rounded-xl overflow-hidden bg-graphite-800/20 divide-y divide-white/5 md:divide-y-0">
          <StageCard
            layer="Layer 0 // Bronze"
            title="Ingestion"
            desc="FastF1 + OpenF1 → Hive-partitioned Parquet. 10Hz positional telemetry, race control messages, pit data, lap times."
            tags={['FastF1', 'OpenF1', 'Parquet', 'Hive']}
          />
          <StageCard
            layer="Layer 1 // Silver"
            title="Staging + Physics"
            desc={`${STATS.intermediateModels} intermediate models. Fuel state, stint geometry, dirty-air OLS (lagged instrument), tyre cliff prediction.`}
            tags={['dbt-core', 'DuckDB', 'OLS', 'Frisch-Waugh']}
          />
          <StageCard
            layer="Layer 2 // Gold"
            title="Feature Marts"
            desc={`${STATS.martTables} production mart tables. fct_lap_residuals, fct_driver_skill_features, fct_cliff_prediction_features, fct_ghost_car_pace, fct_racecraft.`}
            tags={['ML-Ready', '1-Lap Grain', `${STATS.tests} Tests`]}
          />
          <StageCard
            layer="Layer 3 // Models"
            title="ML Targets"
            desc="Five XGBoost models - degradation quantiles (p10/p50/p90), cliff classifier, and stint-life regressor. All trained on fct_cliff_prediction_features, ONNX-exported. Ghost Car app - built."
            tags={['XGBoost', '5 Models', 'ONNX']}
            isLast={true}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 border border-white/10 rounded-xl overflow-hidden bg-white/[0.01] mt-6">

          <div className="lg:col-span-4 p-8 border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col justify-center">
            <span className="font-jetbrains text-[9px] uppercase tracking-widest text-white/30 block mb-4">
              Stack
            </span>
            <div className="flex flex-col gap-3 font-jetbrains text-xs text-white/60">
              <span className="flex items-center gap-2">
                <span className="text-f1-red">→</span> <strong className="text-white">dbt-core</strong> + DuckDB (local)
              </span>
              <span className="flex items-center gap-2">
                <span className="text-f1-red">→</span> <strong className="text-white">FastF1</strong> Python Ingestion
              </span>
              <span className="flex items-center gap-2">
                <span className="text-f1-red">→</span> <strong className="text-white">GitHub Actions</strong> CI
              </span>
              <span className="flex items-center gap-2">
                <span className="text-f1-red">→</span> <strong className="text-white">React + DuckDB-Wasm</strong> (built)
              </span>
              <span className="flex items-center gap-2">
                <span className="text-f1-red">→</span> <strong className="text-white">XGBoost</strong> (built)
              </span>
            </div>
          </div>

          <div className="lg:col-span-4 p-8 border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col justify-between">
            <div>
              <span className="font-jetbrains text-[9px] uppercase tracking-widest text-white/30 block mb-3">
                Test Coverage
              </span>
              <div className="font-jetbrains text-4xl font-extrabold text-white leading-none">
                {STATS.tests}
              </div>
              <p className="font-jetbrains text-[11px] text-white/50 leading-relaxed mt-3">
                schema + singular + invariant tests. 100% pass rate across all {STATS.races} races, every build.
              </p>
            </div>
            <div className="mt-4">
              <span className="inline-block text-[9px] font-jetbrains uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                ● All passing
              </span>
            </div>
          </div>

          <div className="lg:col-span-4 p-8 flex flex-col justify-center">
            <span className="font-jetbrains text-[9px] uppercase tracking-widest text-white/30 block mb-3">
              Telemetry Resolution
            </span>
            <div className="font-jetbrains text-4xl font-extrabold text-white leading-none flex items-baseline gap-1">
              10 <span className="text-f1-red text-lg font-bold">Hz</span>
            </div>
            <p className="font-jetbrains text-[11px] text-white/50 leading-relaxed mt-4">
              Raw positional, RPM, gear, throttle, DRS state, X/Y/Z coordinates from FastF1. ~90M rows per season.
            </p>
          </div>

          <div className="lg:col-span-8 p-8 border-t border-white/5 lg:border-r border-white/5 flex flex-col justify-center bg-white/[0.005]">
            <span className="font-jetbrains text-[9px] uppercase tracking-widest text-white/30 block mb-4">
              Model lineage (simplified DAG path)
            </span>
            <div className="font-jetbrains text-[11px] text-white/60 leading-loose flex flex-col gap-1">
              <div>
                <span className="text-white/40">stg_laps ──→</span>{' '}
                <span className="text-blue-400 font-semibold">int_stint_geometry</span>{' '}
                <span className="text-white/40">──→</span>{' '}
                <span className="text-blue-400 font-semibold">int_lap_fuel_state</span>
              </div>
              <div>
                <span className="text-white/40">stg_telemetry ──→</span>{' '}
                <span className="text-pink-400 font-semibold">int_lap_air_state</span>{' '}
                <span className="text-white/40">──→</span>{' '}
                <span className="text-pink-400 font-semibold">int_dirty_air_tax_component</span>
              </div>
              <div>
                <span className="text-white/40">stg_race_control ──→</span>{' '}
                <span className="text-emerald-400 font-semibold">int_race_control_events</span>{' '}
                <span className="text-white/40">──→</span>{' '}
                <span className="text-emerald-400 font-semibold">int_event_corrections</span>
              </div>
              <div>
                <span className="text-white/40">stg_weather ──→</span>{' '}
                <span className="text-orange-400 font-semibold">int_track_evolution</span>{' '}
                <span className="text-white/40">──→</span>{' '}
                <span className="text-orange-400 font-semibold">int_constructor_structural_pace</span>
              </div>
              <div className="mt-2 text-xs flex items-center gap-2">
                <span className="text-white">⬇ converge</span>
                <span className="text-[10px] font-bold bg-f1-red/10 text-f1-red border border-f1-red/20 px-2 py-0.5 rounded uppercase tracking-wider">
                  int_lap_residual_decomposed ──→ fct_lap_residuals
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 p-8 border-t border-white/5 flex flex-col justify-between">
            <div>
              <span className="font-jetbrains text-[9px] uppercase tracking-widest text-white/30 block mb-3">
                Build Time
              </span>
              <div className="font-jetbrains text-4xl font-extrabold text-white leading-none flex items-baseline gap-1">
                &lt;4 <span className="text-white/40 text-xs uppercase tracking-wider">sec</span>
              </div>
              <p className="font-jetbrains text-[11px] text-white/50 leading-relaxed mt-4">
                Full DAG build locally on DuckDB. Zero cloud warehouse. Zero cloud cost.
              </p>
            </div>
            <div className="mt-4">
              <span className="inline-block text-[9px] font-jetbrains uppercase px-2 py-0.5 rounded-full" style={{ backgroundColor: 'color-mix(in srgb, var(--color-viz-warning) 15%, transparent)', color: 'var(--color-viz-warning)' }}>
                ● make dbt-dev
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
