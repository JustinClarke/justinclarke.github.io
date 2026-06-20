/**
 * CaseStudiesSection the "Attributed Findings" band: one card per case study,
 * with a hand-built CSS decomposition chart shown only for the São Paulo entry.
 *
 * Fits in: rendered on both the Overview and Source pages.
 * Note:    The teaser chart is gated on `study.id === 'sao-paulo-2021'`, so new
 *          case studies render as plain cards until they get their own visual.
 *
 * For beginners ----------------------------------------------------------------
 * `{condition && <JSX/>}` is conditional rendering: if the condition is false,
 * React draws nothing; if true, it draws the JSX. That is how the decomposition
 * chart appears for one study and is skipped for the rest. The bars themselves
 * are just divs whose `w-[95%]` widths encode the numbers visually.
 * -----------------------------------------------------------------------------
 */
import { ArrowRight, Calendar } from 'lucide-react';
import { CASE_STUDIES } from '../../data/caseStudies';
import { SAO_PAULO_STINT } from '../../data/decompositions';

export function CaseStudiesSection({ id }: { id?: string }) {
  return (
    <div id={id} className="w-full flex flex-col gap-12 relative">
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-f1-red/5 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
      
      <div className="flex flex-col gap-3 relative z-10">
        <span className="font-jetbrains text-[10px] text-f1-red uppercase tracking-[0.2em] block">
          Real-World Application
        </span>
        <h2 className="text-3xl md:text-4xl font-noto font-black text-white/90 uppercase tracking-tighter">
          Attributed Findings
        </h2>
        <p className="text-white/50 text-sm font-jetbrains leading-relaxed max-w-xl">
          The 7-term identity isn't just theory. It produces precise, debate-ending answers to historic F1 moments by separating constructor pace, driver skill, and strategic variables.
        </p>
      </div>

      <div className="flex flex-col gap-6 relative z-10 w-full">
        {CASE_STUDIES.map((study) => (
          <div 
            key={study.id}
            className="w-full bg-white/[0.02] border border-white/5 rounded-lg p-6 md:p-10 flex flex-col gap-8 group hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 relative overflow-hidden"
          >
            {/* Top row */}
            <div className="flex justify-between items-start gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-white/40 font-jetbrains text-[10px] uppercase tracking-wider mb-2">
                  <Calendar className="w-3.5 h-3.5" />
                  {study.date}
                </div>
                <h3 className="text-2xl font-noto font-black text-white/90 tracking-tight">
                  {study.title}
                </h3>
                <p className="text-f1-red/90 font-jetbrains text-xs tracking-wide uppercase">
                  {study.subtitle}
                </p>
              </div>
            </div>

            {/* Finding */}
            <p className="text-white/70 text-sm leading-relaxed font-sans">
              {study.finding}
            </p>

            {/* W8  - the full final-stint table (laps 45->71), reconciled with the
                published finding. The L59 overtake row is highlighted. */}
            {study.id === 'sao-paulo-2021' && (
              <div className="bg-graphite-950/50 rounded-lg p-4 md:p-5 border border-white/5 flex flex-col gap-3">
                <div className="flex justify-between items-end text-[9px] font-jetbrains uppercase tracking-wider text-white/40">
                  <span>Final stint · laps 45→71 · fct_lap_residuals</span>
                  <span>L59 overtake · gap 1.69s</span>
                </div>

                <div className="overflow-x-auto -mx-1 px-1">
                  <table className="w-full border-collapse font-jetbrains text-[10px] sm:text-[11px] min-w-[440px]">
                    <thead>
                      <tr className="text-white/35 uppercase tracking-wider text-[8px] sm:text-[9px]">
                        <th className="text-left font-medium py-1.5 pr-2">Lap</th>
                        <th className="text-left font-medium py-1.5 pr-2">Drv</th>
                        <th className="text-right font-medium py-1.5 px-2">Tyre&nbsp;age</th>
                        <th className="text-right font-medium py-1.5 px-2">Lap&nbsp;time</th>
                        <th className="text-right font-medium py-1.5 px-2">Compound</th>
                        <th className="text-right font-medium py-1.5 px-2">Skill</th>
                        <th className="text-right font-medium py-1.5 pl-2">Air</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SAO_PAULO_STINT.map((r) => {
                        const overtake = r.lap === 59;
                        return (
                          <tr key={`${r.lap}-${r.driver}`} className={`border-t border-white/5 ${overtake ? 'bg-f1-red/[0.07]' : ''}`}>
                            <td className="py-1.5 pr-2 text-white/50 tabular-nums">{r.lap}</td>
                            <td className={`py-1.5 pr-2 font-bold ${r.driver === 'HAM' ? 'text-emerald-400' : 'text-f1-red'}`}>{r.driver}</td>
                            <td className="py-1.5 px-2 text-right text-white/55 tabular-nums">{r.tyreAge}</td>
                            <td className="py-1.5 px-2 text-right text-white/80 tabular-nums">{r.lapTime_s.toFixed(2)}s</td>
                            <td className="py-1.5 px-2 text-right text-amber-400/90 tabular-nums">+{r.compoundPenalty_s.toFixed(2)}</td>
                            <td className="py-1.5 px-2 text-right text-emerald-400 tabular-nums">{r.driverSkill_s.toFixed(2)}</td>
                            <td className="py-1.5 pl-2 text-right text-white/40 tabular-nums">{r.dirtyAir_s.toFixed(2)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <p className="font-jetbrains text-[9px] text-white/35 leading-relaxed">
                  Positive = slower than the field baseline. By L71 Verstappen's tyres cost{' '}
                  <span className="text-amber-400/90">+14.08s</span>; he answered with a{' '}
                  <span className="text-emerald-400">−12.86s</span> skill residual  - the structural
                  battle his strategy could not win.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mt-1 pt-3 border-t border-white/5">
                  {study.metrics.map((metric, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <span className="text-[9px] font-jetbrains text-white/40 uppercase">{metric.label}</span>
                      <span className={`font-jetbrains text-xs font-bold ${metric.highlight ? 'text-emerald-400' : 'text-white/80'}`}>
                        {metric.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="mt-4 pt-6 border-t border-white/[0.05] flex items-center justify-start">
              <a 
                href={study.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-f1-red text-white font-jetbrains text-xs font-bold uppercase tracking-widest rounded transition-all duration-300 shadow-[0_0_20px_rgba(225,6,0,0.25)] hover:bg-[#ff1a0d] hover:shadow-[0_0_35px_rgba(225,6,0,0.5)] group/cta"
              >
                Read full analysis 
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
              </a>
            </div>
          </div>
        ))}
        
        {/* Subtle hint for future case studies */}
        <div className="w-full flex items-center justify-center py-4">
          <div className="flex items-center gap-6 opacity-30 hover:opacity-50 transition-opacity duration-500 w-full max-w-lg mx-auto">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <span className="font-jetbrains text-[9px] text-white uppercase tracking-[0.3em] whitespace-nowrap text-center">
              More findings processing
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}
