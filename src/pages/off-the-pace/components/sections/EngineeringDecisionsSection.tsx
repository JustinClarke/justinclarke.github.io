import { forwardRef } from 'react';
import { STATS } from '../../data/projectStats';

interface EngineeringDecisionsSectionProps {
  id: string;
}

export const EngineeringDecisionsSection = forwardRef<HTMLElement, EngineeringDecisionsSectionProps>(({ id }, ref) => {
  return (
    <section id={id} ref={ref} className="w-full scroll-mt-32 reveal-element">
      <div className="flex flex-col lg:flex-row items-center gap-12">

        <div className="lg:w-1/3 flex flex-col gap-4">
          <span className="font-jetbrains text-[10px] text-[color:var(--color-viz-success)] uppercase tracking-[0.2em] font-semibold">
            02 / Architecture & Scale
          </span>
          <h2 className="text-3xl md:text-4xl font-noto font-black text-white/90 uppercase tracking-tighter">
            Zero Cloud Compute.
          </h2>
          <p className="font-jetbrains text-sm leading-relaxed text-white/50">
            Built a headless dbt pipeline running entirely locally on DuckDB. {STATS.dbtModels} models compile and run {STATS.tests} tests in under {STATS.buildSeconds} seconds. Maximum developer velocity, rigorous CI/CD constraints, and zero cloud costs.
          </p>
        </div>

        <div className="lg:w-2/3 w-full rounded-xl border border-white/10 bg-[#1A1D22] overflow-hidden font-jetbrains shadow-[0_0_50px_rgba(0,0,0,0.55)]">
          <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-3 bg-graphite-800 border-b border-white/5 flex-nowrap overflow-hidden">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-viz-mac-red shrink-0" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full shrink-0" style={{ backgroundColor: 'var(--color-viz-warning)' }} />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-viz-mac-green shrink-0" />
            <span className="ml-2 sm:ml-4 text-[9px] sm:text-[10px] text-white/40 uppercase tracking-widest truncate flex-1 min-w-0">
              assert_additive_identity.sql • CI Gate
            </span>
            <span className="ml-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shrink-0 whitespace-nowrap" style={{ color: 'var(--color-viz-success)' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-status-dot shrink-0" style={{ backgroundColor: 'var(--color-viz-success)' }} />
              CI Enforced
            </span>
          </div>
          <div className="p-6 text-xs md:text-sm text-white/80 overflow-x-auto whitespace-pre leading-loose">
            <span className="text-white/30 italic">
              -- assert_lap_7term_identity  - fails build if 7-term sum ≠ pace_delta_s ± 0.0001s
            </span>{'\n\n'}
            <span className="text-pink-400">SELECT</span> <span className="text-blue-400">count</span>(*) <span className="text-pink-400">FROM</span> fct_lap_residuals{'\n'}
            <span className="text-pink-400">WHERE</span> abs(pace_delta_s - ({'\n'}
            {'  '}fuel_component_s + compound_component_s +{'\n'}
            {'  '}rubber_component_s + ambient_component_s +{'\n'}
            {'  '}constructor_component_s + dirty_air_tax_s +{'\n'}
            {'  '}driver_skill_residual_s{'\n'}
            )) {'>'} <span className="text-orange-400">0.0001</span>
            {'\n\n'}
            <span className="text-[color:var(--color-viz-success)] font-semibold">✓ Finished running {STATS.tests} tests in 3.82s : PASS</span>{'\n'}
            <span className="text-[color:var(--color-viz-success)] font-semibold">✓ assert_lap_7term_identity ... PASS</span>
            <span className="t-cursor ml-1" />
          </div>
        </div>

      </div>
    </section>
  );
});

EngineeringDecisionsSection.displayName = 'EngineeringDecisionsSection';
