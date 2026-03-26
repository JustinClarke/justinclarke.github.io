import React from 'react';
import { STATS } from '../../data/projectStats';

interface IngestionSectionProps {
  id: string;
}

const DATASETS = [
  { key: 'laps',          label: 'Laps',          desc: 'Timing, sector splits, tyre data, lap flags' },
  { key: 'telemetry',     label: 'Telemetry',     desc: '10Hz positional + RPM/gear/throttle/DRS/X/Y/Z' },
  { key: 'weather',       label: 'Weather',       desc: 'Air/track temp, humidity, barometric pressure' },
  { key: 'race_control',  label: 'Race Control',  desc: 'SC/VSC windows, penalties, flags, messages' },
];

const SCALE_METRICS = [
  { value: String(STATS.racesIngested), label: 'Races Ingested', sub: 'Bronze coverage : 168' },
  { value: String(STATS.races),         label: 'Races Processed', sub: 'in fct_lap_residuals' },
  { value: STATS.telemetryRowsPerSeason, label: 'Telemetry Rows', sub: 'per season' },
  { value: `${STATS.telemetryHz}Hz`,    label: 'Telemetry Rate', sub: 'positional data' },
];

export const IngestionSection: React.FC<IngestionSectionProps> = ({ id }) => {
  return (
    <section id={id} className="w-full scroll-mt-32 reveal-element">
      <div className="flex flex-col gap-8">

        {/* Header */}
        <div>
          <span className="font-jetbrains text-[10px] text-f1-red uppercase tracking-[0.2em] mb-4 block">
            02 / Ingestion : Bronze Layer
          </span>
          <h2 className="text-3xl md:text-4xl font-noto font-black text-white/90 uppercase tracking-tighter mb-4">
            168 races ingested.<br />4 datasets per race.
          </h2>
          <p className="text-white/55 text-sm max-w-2xl font-jetbrains leading-relaxed">
            FastF1 + OpenF1 → Hive-partitioned Parquet, organised by <code className="text-emerald-400 text-xs">season/race_id/dataset</code>. JSON-Schema contracts validated at ingest. <code className="text-emerald-400 text-xs">data_quality.py</code> gates reject under-lap counts and telemetry gaps before any transform runs.
          </p>
        </div>

        {/* Dataset grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {DATASETS.map((ds) => (
            <div
              key={ds.key}
              className="bg-graphite-800/40 border border-white/5 rounded-xl p-5 hover:bg-graphite-800/70 hover:border-white/10 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-f1-red/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="font-jetbrains text-[9px] uppercase tracking-widest text-f1-red mb-2 font-bold">{ds.label}</div>
              <p className="font-jetbrains text-[11px] text-white/50 leading-relaxed">{ds.desc}</p>
            </div>
          ))}
        </div>

        {/* Ingestion pipeline summary */}
        <div className="bg-graphite-800/20 border border-white/[0.07] rounded-xl p-6 font-jetbrains">
          <div className="text-[9px] uppercase tracking-widest text-white/30 mb-4">Ingestion Pipeline</div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-white/60">
            <span className="px-2.5 py-1 rounded" style={{ backgroundColor: 'color-mix(in srgb, var(--color-viz-info) 15%, transparent)', color: 'var(--color-viz-info)' }}>FastF1</span>
            <span className="text-white/20">→</span>
            <span className="px-2.5 py-1 rounded" style={{ backgroundColor: 'color-mix(in srgb, var(--color-viz-info) 15%, transparent)', color: 'var(--color-viz-info)' }}>OpenF1</span>
            <span className="text-white/20">→</span>
            <span className="px-2.5 py-1 bg-white/[0.04] rounded">JSON-Schema validation</span>
            <span className="text-white/20">→</span>
            <span className="px-2.5 py-1 bg-white/[0.04] rounded">data_quality.py gates</span>
            <span className="text-white/20">→</span>
            <span className="px-2.5 py-1 rounded" style={{ backgroundColor: 'color-mix(in srgb, var(--color-viz-success) 15%, transparent)', color: 'var(--color-viz-success)' }}>Hive-partitioned Parquet</span>
          </div>
          <p className="font-jetbrains text-[10px] text-white/35 mt-4 leading-relaxed">
            Partition key: <code className="text-white/50">season / race_id / dataset</code>. Gates reject under-{40}-lap races and telemetry samples below 8Hz before they reach Silver. {STATS.racesIngested} races ingested; {STATS.races} fully processed in <code className="text-white/50">fct_lap_residuals</code>.
          </p>
        </div>

        {/* Scale stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-white/[0.08] border border-white/[0.08] rounded-2xl overflow-hidden">
          {SCALE_METRICS.map(({ value, label, sub }) => (
            <div key={label} className="group flex flex-col gap-1 p-8 md:p-10 hover:bg-white/[0.02] transition-colors duration-300 relative">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-f1-red/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="font-noto text-4xl md:text-5xl font-black text-white tracking-tighter leading-none">{value}</span>
              <span className="font-jetbrains text-[10px] uppercase tracking-[0.2em] text-white/70 font-semibold mt-2">{label}</span>
              <span className="font-jetbrains text-[9px] uppercase tracking-widest text-white/25">{sub}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
