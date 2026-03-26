export function NarrativeOpener() {
  const causes = [
    'Car baseline', 'Fuel mass', 'Tyre chemistry', 'Rubber evolution',
    'Air density', 'Dirty-air wake', 'Driver skill'
  ];

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <h1 className="text-3xl md:text-5xl text-white leading-[1.1] tracking-tight font-black uppercase">
        In F1, the stopwatch is the <br className="hidden md:block" />
        <span className="text-f1-red">worst liar</span> in the paddock.
      </h1>
      <div className="w-12 h-0.5 bg-f1-red" />
      <p className="font-jetbrains text-sm text-white/60 leading-relaxed max-w-2xl">
        Every lap time hides seven physically-grounded causes. This engine separates them:causally, additively, and to the millisecond:to isolate true performance.
      </p>

      <div className="flex flex-wrap gap-2 max-w-3xl mt-2 select-none">
        {causes.map((c) => (
          <span
            key={c}
            className="font-jetbrains text-[9px] font-bold uppercase tracking-wider text-white/50 bg-white/[0.03] border border-white/5 px-2.5 py-1.5 rounded-lg hover:border-white/10 transition-colors"
          >
            {c}
          </span>
        ))}
      </div>
      <p className="font-jetbrains text-[10px] text-white/40 leading-relaxed max-w-xl mt-4">
        Five XGBoost models (degradation P10/P50/P90, cliff classifier,
        stint-life regressor) trained on these features, all beat a per-cohort baseline.
      </p>
    </div>
  );
}
