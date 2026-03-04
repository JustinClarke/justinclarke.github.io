import type { Project } from '@/types';

export const ProjectShowcase = ({ project }: { project: Project }) => {
  const metrics = project.pageMetrics ?? [];

  return (
    <div className="h-full w-full flex flex-col justify-end">

      {/* Full-bleed photo */}
      <div className="hidden md:block absolute -inset-3 pointer-events-none overflow-hidden rounded-lg">
        <div className="absolute inset-0 transition-transform duration-[1200ms] ease-out scale-100 group-hover/btn:scale-[1.04] flex items-center justify-center">
          <img
            src="/assets/audif1.webp"
            alt="Audi F1"
            style={{ transform: 'scale(1.3) translateY(-10%) translateX(-3%)', transformOrigin: 'center', objectFit: 'contain' }}
          />
        </div>
      </div>

      {/* Bottom gradient */}
      <div
        className="hidden md:block absolute -inset-3 pointer-events-none z-[5] rounded-lg"
        style={{
          background: 'linear-gradient(to top, rgba(11,15,18,1) 0%, rgba(11,15,18,0.9) 22%, rgba(11,15,18,0.5) 50%, rgba(11,15,18,0.1) 72%, transparent 100%)',
        }}
      />

      {/* Hover border */}
      <div
        className="hidden md:block absolute -inset-3 rounded-lg pointer-events-none z-30 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"
        style={{
          border: '1px solid rgba(180,20,30,0.2)',
          boxShadow: '0 25px 60px -15px rgba(120,8,20,0.45)',
        }}
      />

      {/* ── MOBILE ── */}
      <div className="flex md:hidden items-center w-full">
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <div className="flex items-center justify-between w-full">
            <span className="font-noto font-black italic tracking-tight text-[16px] leading-none text-white uppercase truncate">
              {project.title}
            </span>
            {project.id === 'off-the-pace' && (
              <img src="/assets/f1.svg" alt="Formula 1" className="h-[9px] w-auto shrink-0 drop-shadow-[0_0_6px_rgba(225,6,0,0.6)] ml-2" />
            )}
          </div>
          {project.id === 'off-the-pace' && (
            <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-f1-red/80 font-bold -mt-0.5">
              causal decomposition
            </span>
          )}
          <div className="flex items-center gap-2 mt-0.5">
            {metrics.slice(0, 2).map((m, i) => (
              <div key={i} className="flex items-center gap-1 font-mono text-[9px]">
                {i === 0 && <span className="w-1.5 h-1.5 rounded-full bg-[#bb1a2a] animate-pulse" style={{ boxShadow: '0 0 5px rgba(187,26,42,0.5)' }} />}
                <span className="font-bold text-white">{m.val}</span>
                <span className="text-f1-grey-dark uppercase tracking-wider text-[7px]">{m.label}</span>
                {i < 1 && <span className="text-white/15 mx-0.5">·</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── DESKTOP ── */}
      <div className="hidden md:flex relative z-10 flex-col gap-5">

        {/* Title */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5">
            <div className="font-noto font-black italic tracking-tight text-[26px] lg:text-[30px] leading-[0.9] text-white uppercase">
              {project.title}
            </div>
            {project.id === 'off-the-pace' && (
              <img src="/assets/f1.svg" alt="Formula 1" className="shrink-0 h-[15px] lg:h-[17px] w-auto drop-shadow-[0_0_8px_rgba(225,6,0,0.7)]" />
            )}
          </div>
          {project.id === 'off-the-pace' && (
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-f1-red/85 font-bold">
              causal decomposition
            </span>
          )}
        </div>

        {/* Telemetry stat cluster */}
        {metrics.length > 0 && (
          <div className="flex flex-col gap-3">
            {/* Baseline rule with sector tick */}
            <div className="relative h-px w-full bg-white/[0.08]">
              <div className="absolute left-0 top-0 h-px w-10 bg-[#bb1a2a] transition-all duration-500 group-hover/btn:w-full shadow-[0_0_6px_rgba(187,26,42,0.6)]" />
            </div>

            <div className="flex items-stretch">
              {metrics.map((m, i) => (
                <div
                  key={i}
                  className={`flex flex-col gap-1.5 pr-6 ${i > 0 ? 'pl-6 border-l border-white/[0.08]' : ''}`}
                >
                  <span className="font-mono font-bold text-[17px] leading-none text-white tabular-nums tracking-tight">
                    {m.val}
                  </span>
                  <span className="font-mono text-[7px] text-f1-grey-dark uppercase tracking-[0.22em] whitespace-nowrap">
                    {m.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
