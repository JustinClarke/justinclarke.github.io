/**
 * MLImpactSection section "06 / Machine Learning": an overview panel of ML
 * facts beside five model cards, each comparing a model's eval metric to its
 * baseline.
 *
 * Fits in: rendered by SourceView's ML block.
 * Note:    ModelCard is a private sub-component; its "beats baseline" maths
 *          flips direction depending on whether higher or lower is better.
 *
 * For beginners ----------------------------------------------------------------
 * `.toFixed(3)` formats a number to a fixed number of decimal places (a string).
 * `model.metric.includes('↑')` checks whether the metric label contains an
 * up-arrow, i.e. "higher is better"; if so the improvement is eval/baseline-1,
 * otherwise it is how far eval dropped below baseline. `.toLocaleString()` adds
 * thousands separators (110440 -> "110,440").
 * -----------------------------------------------------------------------------
 */
import React, { forwardRef } from 'react';
import { ML_MODELS, ML_FACTS } from '../../data/projectStats';

interface MLImpactSectionProps {
  id: string;
}

export const MLImpactSection = forwardRef<HTMLElement, MLImpactSectionProps>(({ id }, ref) => {
  return (
    <section id={id} ref={ref} className="w-full scroll-mt-32 reveal-element">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left: ML layer overview */}
        <div className="lg:col-span-4 bg-graphite-800/80 backdrop-blur-md border border-white/10 rounded-2xl p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-f1-red/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <div>
            <span className="font-jetbrains text-[10px] text-f1-red uppercase tracking-[0.2em] mb-4 block">
              06 / Machine Learning
            </span>
            <h2 className="text-3xl md:text-4xl font-noto font-black text-white/90 mb-4 uppercase tracking-tighter leading-none">
              Five XGBoost Models.
            </h2>
            <p className="font-jetbrains text-sm leading-relaxed text-white/55">
              A quantile trio (p10/p50/p90) for degradation pace, a cliff-timing classifier, and a stint-life regressor. All trained on the <code className="text-emerald-400 text-xs">fct_cliff_prediction_features</code> mart with {ML_FACTS.featureCount} features across {ML_FACTS.trainRows.toLocaleString()} laps. Every model beats a strong per-cohort baseline.
            </p>
          </div>
          <div className="mt-6 pt-6 border-t border-white/10 flex flex-col gap-2 font-jetbrains text-[10px] text-white/40">
            <div className="flex justify-between">
              <span>Calibration (p10–p90)</span>
              <span className="text-emerald-400">{ML_FACTS.calibrationEmpirical} empirical ({ML_FACTS.calibrationN.toLocaleString()} laps)</span>
            </div>
            <div className="flex justify-between">
              <span>Mean interval width</span>
              <span className="text-white/60">{ML_FACTS.meanIntervalWidth}s</span>
            </div>
            <div className="flex justify-between">
              <span>ONNX parity</span>
              <span className="text-white/60">all 5 boosters · atol=1e-5</span>
            </div>
            <div className="flex justify-between">
              <span>Leakage probe (race_year)</span>
              <span className="text-amber-400">{ML_FACTS.leakageProbeAccuracy} → excluded</span>
            </div>
          </div>
        </div>

        {/* Right: 5 model cards */}
        <div className="lg:col-span-8 flex flex-col h-full gap-3 md:gap-4">
          {ML_MODELS.map((model) => (
            <ModelCard key={model.name} model={model} />
          ))}
        </div>
      </div>
    </section>
  );
});

MLImpactSection.displayName = 'MLImpactSection';

interface ModelCardProps {
  model: typeof ML_MODELS[number];
}

const ModelCard: React.FC<ModelCardProps> = ({ model }) => {
  // LEARN: small numbers (< 1) get 3 decimals, larger ones 2, so each metric
  //    reads sensibly. beatsPct then expresses the gain as a percentage, sign
  //    and direction chosen by whether the metric is "up good" or "down good".
  const evalStr     = model.eval     < 1 ? model.eval.toFixed(3)      : model.eval.toFixed(2);
  const baselineStr = model.baseline < 1 ? model.baseline.toFixed(3)  : model.baseline.toFixed(2);
  const beatsPct = model.metric.includes('↑')
    ? `+${((model.eval / model.baseline - 1) * 100).toFixed(0)}%`
    : `−${((1 - model.eval / model.baseline) * 100).toFixed(0)}%`;

  return (
    <div className="flex-1 bg-graphite-800/40 border border-white/5 rounded-xl px-4 md:px-6 py-4 md:py-3 lg:py-4 hover:bg-graphite-800/70 hover:border-white/10 transition-all duration-300 relative overflow-hidden group flex items-center gap-3 md:gap-6 min-h-[72px]">
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-f1-red/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      {/* Model name + desc */}
      <div className="flex-1 min-w-0">
        <h3 className="font-jetbrains text-xs font-bold text-white/90 uppercase tracking-wide flex items-center gap-2 mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-f1-red shrink-0" />
          {model.label}
        </h3>
        <div className="font-jetbrains text-[9px] text-white/35 uppercase tracking-wider truncate">{model.name}</div>
      </div>
      {/* Metric */}
      <div className="shrink-0 text-right font-jetbrains">
        <div className="text-[9px] text-white/30 uppercase tracking-wider mb-1">{model.metric}</div>
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-bold text-white/90">{evalStr}</span>
          <span className="text-[10px] text-white/35">vs {baselineStr}</span>
        </div>
        <div className="text-[9px] text-emerald-400 font-bold mt-0.5">{beatsPct} vs baseline</div>
      </div>
      {/* Built chip */}
      <span className="shrink-0 font-jetbrains text-[9px] uppercase tracking-wider border px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
        ✓ Built
      </span>
    </div>
  );
};
