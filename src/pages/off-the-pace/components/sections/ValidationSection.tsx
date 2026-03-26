import React from 'react';
import { STATS, BUILD_STATUS, type BuildStatus } from '../../data/projectStats';

interface ValidationSectionProps {
  id: string;
}

// Re-exported for consumers still using ModelStatus name
export type ModelStatus = BuildStatus;

const badgeStyles: Record<BuildStatus, string> = {
  built:   'px-2 py-0.5 rounded-full whitespace-nowrap',
  fitted:  'px-2 py-0.5 rounded-full whitespace-nowrap',
  wip:     'px-2 py-0.5 rounded-full whitespace-nowrap',
  planned: 'px-2 py-0.5 rounded-full whitespace-nowrap',
};

const badgeStylesInline: Record<BuildStatus, React.CSSProperties> = {
  built:   { backgroundColor: 'color-mix(in srgb, var(--color-viz-success) 15%, transparent)', color: 'var(--color-viz-success)' },
  fitted:  { backgroundColor: 'color-mix(in srgb, var(--color-viz-success) 15%, transparent)', color: 'var(--color-viz-success)' },
  wip:     { backgroundColor: 'color-mix(in srgb, var(--color-viz-warning) 15%, transparent)', color: 'var(--color-viz-warning)' },
  planned: { backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'rgba(255, 255, 255, 0.4)' },
};

const labelPrefix: Record<BuildStatus, string> = {
  built:   '✓ Built',
  fitted:  '✓ Fitted',
  wip:     '⟳ In progress',
  planned: '⊙ Planned',
};

interface StatusItemProps {
  label: string;
  status: BuildStatus;
}

const StatusItem: React.FC<StatusItemProps> = ({ label, status }) => (
  <div className="flex justify-between items-center py-2.5 border-b border-white/5 last:border-b-0 gap-3">
    <span className="font-jetbrains text-xs text-white/70">{label}</span>
    <span className={`font-jetbrains text-[9px] uppercase tracking-wider border ${badgeStyles[status]} shrink-0`} style={badgeStylesInline[status]}>
      {labelPrefix[status]}
    </span>
  </div>
);

export const ValidationSection: React.FC<ValidationSectionProps> = ({ id }) => {
  return (
    <section id={id} className="w-full scroll-mt-32 reveal-element">
      <div className="max-w-6xl mx-auto py-16">
        <span className="font-jetbrains text-[10px] text-f1-red uppercase tracking-[0.2em] mb-4 block">
          07 / Validation
        </span>
        <h2 className="text-3xl md:text-4xl font-noto font-black text-white/90 uppercase tracking-tighter mb-4">
          Trained 2018–2024.<br />2025 is the holdout.
        </h2>
        <p className="text-white/55 text-sm max-w-xl font-jetbrains leading-relaxed mb-8">
          The 2025 season is a designated reproducible out-of-sample holdout. Until it ingests, headline numbers come from the final TimeSeriesSplit fold (2024). The switch to a true holdout requires no code change.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

          <div className="terminal rounded-xl border border-white/10 bg-[#1A1D22] overflow-hidden font-jetbrains shadow-2xl flex flex-col justify-between">
            <div className="flex items-center gap-2 px-4 py-3 bg-graphite-800 border-b border-white/5">
              <div className="w-2.5 h-2.5 rounded-full bg-viz-mac-red" />
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--color-viz-warning)' }} />
              <div className="w-2.5 h-2.5 rounded-full bg-viz-mac-green" />
              <span className="ml-2 text-[10px] text-white/40 uppercase tracking-widest">
                make test-all • CI Gate
              </span>
            </div>
            <div className="p-6 text-xs md:text-sm text-white/80 leading-loose flex-1 overflow-x-auto">
              <div><span className="text-[color:var(--color-viz-success)]">$</span> <span className="text-white">make test-all</span></div>
              <div className="text-white/30 mt-1">cd transform && dbt build --profiles-dir profiles --target ci</div>
              <div className="mt-4 text-[color:var(--color-viz-success)] font-semibold">✓ {STATS.dbtModels} models complete</div>
              <div className="text-[color:var(--color-viz-success)] font-semibold">✓ {STATS.tests} dbt tests pass</div>
              <div className="text-[color:var(--color-viz-success)] font-semibold">✓ assert_lap_7term_identity .... PASS</div>
              <div className="text-[color:var(--color-viz-success)] font-semibold">✓ fct_lap_residuals row count stable</div>
              <div className="text-[color:var(--color-viz-success)] font-semibold">✓ fct_driver_skill_features contract</div>
              <div className="mt-2 text-white/30">cd ml && python -m pytest tests/</div>
              <div className="text-[color:var(--color-viz-success)] font-semibold">✓ {STATS.mlTests} ML tests pass</div>
              <div className="mt-4 text-[color:var(--color-viz-success)] font-bold">Done. {STATS.dbtModels} models, {STATS.tests} + {STATS.mlTests} tests, 0 failures.</div>
              <span className="t-cursor mt-1" />
            </div>
          </div>

          <div className="bg-graphite-800/20 border border-white/10 rounded-xl p-8 flex flex-col justify-between hover:border-white/20 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-f1-red/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div>
              <span className="font-jetbrains text-[9px] uppercase tracking-widest text-white/30 block mb-4">
                Project Status  - built vs planned
              </span>
              <div className="flex flex-col">
                {BUILD_STATUS.map((item) => (
                  <StatusItem key={item.label} label={item.label} status={item.status} />
                ))}
              </div>
              <p className="font-jetbrains text-[10px] text-white/35 mt-5 leading-relaxed">
                Planned items are designed and specced; not yet implemented. Ghost Car and the frontend are app-layer concerns built on top of the shipped transform and ML stack.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
