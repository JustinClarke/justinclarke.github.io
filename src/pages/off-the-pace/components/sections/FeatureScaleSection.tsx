import React, { forwardRef } from 'react';
import { STATS } from '../../data/projectStats';

interface FeatureScaleSectionProps {
  id: string;
}

const METRICS = [
  { value: String(STATS.races), label: 'Races Processed', sub: 'across 7 seasons' },
  { value: STATS.telemetryRowsPerSeason, label: 'Telemetry Rows', sub: 'per season' },
  { value: String(STATS.dbtModels), label: 'dbt Models', sub: 'in the pipeline' },
  { value: String(STATS.tests), label: 'CI Tests', sub: 'passing' },
];

export const FeatureScaleSection = forwardRef<HTMLElement, FeatureScaleSectionProps>(({ id }, ref) => {
  return (
    <section id={id} ref={ref} className="w-full scroll-mt-32 reveal-element">
      <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-white/[0.08] border border-white/[0.08] rounded-2xl overflow-hidden">
        {METRICS.map(({ value, label, sub }) => (
          <div key={label} className="group flex flex-col gap-1 p-8 md:p-10 hover:bg-white/[0.02] transition-colors duration-300 relative">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-f1-red/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="font-noto text-4xl md:text-5xl font-black text-white tracking-tighter leading-none">
              {value}
            </span>
            <span className="font-jetbrains text-[10px] uppercase tracking-[0.2em] text-white/70 font-semibold mt-2">
              {label}
            </span>
            <span className="font-jetbrains text-[9px] uppercase tracking-widest text-white/25">
              {sub}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
});

FeatureScaleSection.displayName = 'FeatureScaleSection';
