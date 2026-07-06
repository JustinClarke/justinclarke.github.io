/**
 * WhatMakesThisHard three "problem to solution" cards framing the hard parts
 * of the project as error codes with system resolutions.
 *
 * Fits in: the overview, after the pipeline explainer.
 * Note:    Purely presentational. All three cards share one block of JSX driven
 *          by the `problems` array edit the data, not the markup.
 */
const problems = [
  {
    number: '01',
    code: 'ERR_CONFOUNDER_BIAS',
    title: 'Simultaneous Confounders',
    problem: 'Tyre age, fuel load, and traffic change at the same time, biasing simple regression models.',
    solution: 'Calibrated teammate panel controls that isolate tyre wear from weight change.',
  },
  {
    number: '02',
    code: 'ERR_CIRCULAR_WAKE',
    title: 'Dirty-Air Endogeneity',
    problem: 'Relative pace determines track position, creating circular causality with trailing wake.',
    solution: 'Lagged instruments isolating wake tax via the Frisch-Waugh-Lovell theorem.',
  },
  {
    number: '03',
    code: 'ERR_DRIFT_VIOLATION',
    title: 'Additive Invariance',
    problem: 'Model components must sum exactly to the observed lap time without drift.',
    solution: 'Automated CI test assertion validating zero-drift constraints per lap row.',
  },
];

export function WhatMakesThisHard() {
  return (
    <div className="flex flex-col gap-10">
      <div className="max-w-xl">
        <span className="font-jetbrains text-micro text-text-tertiary uppercase tracking-mega mb-4 block font-semibold">
          Complexity
        </span>
        <h2 className="text-3xl md:text-4xl font-noto font-black text-white uppercase tracking-tighter mb-4">
          Three Engineering Problems
        </h2>
        <p className="text-text-tertiary text-sm font-jetbrains leading-relaxed">
          Known failure modes in sports analytics, each with an explicit solution in this codebase.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {problems.map((item) => (
          <div
            key={item.number}
            className="group relative p-7 bg-graphite-850 border border-white/5 rounded-2xl hover:border-red-500/20 hover:bg-graphite-800 hover:shadow-[0_12px_40px_rgba(239,68,68,0.08)] transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            {/* Warning pulse in the top corner */}
            <div className="absolute top-5 right-5 flex items-center gap-1.5 bg-red-500/5 px-2 py-0.5 rounded border border-red-500/10">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_6px_rgba(239,68,68,0.4)]" />
              <span className="font-mono text-micro text-red-400 font-bold tracking-wider">ACTIVE_WARN</span>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <span className="font-jetbrains text-micro font-bold text-red-500 tracking-widest uppercase">
                  {item.code}
                </span>
                <h3 className="font-noto text-lg font-black text-text-primary uppercase tracking-tight">
                  {item.title}
                </h3>
              </div>
              <p className="font-jetbrains text-xs text-text-tertiary leading-relaxed pr-6">
                {item.problem}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex flex-col gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.3)]" />
                <span className="font-jetbrains text-micro uppercase tracking-widest text-emerald-400 font-bold">
                  ✓ SYSTEM RESOLUTION
                </span>
              </div>
              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-3 font-mono text-micro text-emerald-400 leading-relaxed">
                <span className="text-emerald-500/40 mr-1">&gt;</span> {item.solution}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
