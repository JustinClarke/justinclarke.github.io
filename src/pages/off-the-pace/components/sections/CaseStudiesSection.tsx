import { ArrowRight, Calendar, ExternalLink } from 'lucide-react';
import { CASE_STUDIES } from '../../data/caseStudies';

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

            {/* CSS Teaser Visual (Lap 59 decomposition for Sao Paulo) */}
            {study.id === 'sao-paulo-2021' && (
              <div className="bg-graphite-950/50 rounded p-4 border border-white/5 flex flex-col gap-3">
                <div className="flex justify-between items-end mb-1 text-[9px] font-jetbrains uppercase tracking-wider text-white/40">
                  <span>Lap 59 Overtake Decomposition</span>
                  <span>Gap: 1.69s</span>
                </div>
                
                {/* HAM Bar */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[10px] font-jetbrains text-white/60">
                    <span className="text-emerald-400">HAM</span>
                    <span>72.38s</span>
                  </div>
                  <div className="h-4 w-full bg-white/5 rounded overflow-hidden flex relative group/bar cursor-default">
                    <div className="h-full bg-white/20 w-[95%]" title="Structural Pace" />
                    <div className="h-full bg-emerald-500 w-[5%] -ml-[5%]" title="Driver Skill Residual (-3.11s)" />
                  </div>
                </div>

                {/* VER Bar */}
                <div className="flex flex-col gap-1 mt-2">
                  <div className="flex justify-between text-[10px] font-jetbrains text-white/60">
                    <span className="text-f1-red">VER</span>
                    <span>74.07s</span>
                  </div>
                  <div className="h-4 w-full bg-white/5 rounded overflow-hidden flex relative group/bar cursor-default">
                    <div className="h-full bg-white/20 w-[100%]" title="Structural Pace" />
                    <div className="h-full bg-f1-red w-[2%] -ml-[2%]" title="Driver Skill Residual (-1.51s)" />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-3 pt-3 border-t border-white/5">
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
