/**
 * DecompositionExplainer the "same lap, seven causes" chart: two drivers on the
 * SAME lap, each a horizontal bar split into coloured segments. Segment widths
 * are SECONDS-proportional on a single shared scale, so HAM vs VER read true  -
 * the bigger bar really did have the bigger measured swing.
 *
 * Fits in: the thesis centrepiece, mounted on both the Overview and Architecture
 *          pages. Data is the real São Paulo 2021 L59 overtake pair from
 *          decompositions.ts; colours are the --color-term-* tokens.
 *
 * For beginners ----------------------------------------------------------------
 * Each segment's `width` is `|seconds| / maxTotal * 100%`, where `maxTotal` is
 * the larger of the two drivers' total absolute swing. Because both bars share
 * that denominator, a wider segment literally means more seconds - no arbitrary
 * percentages. `title` gives the native hover tooltip with the signed value.
 * -----------------------------------------------------------------------------
 */
import { LINKS } from '../../../data/projectStats';
import { SAO_PAULO_L59, TERM_ABBR, toLapClock } from '../../../data/decompositions';

const DRIVERS = [SAO_PAULO_L59.ham, SAO_PAULO_L59.ver];

// Shared seconds scale: the larger total absolute swing fills the bar; the other
// driver's bar is shorter in exact proportion. This is what makes it read true.
const MAX_TOTAL_ABS = Math.max(
  ...DRIVERS.map((d) => d.terms.reduce((sum, t) => sum + Math.abs(t.seconds), 0)),
);

// Legend mirrors the identity-term order (label + token colour), single-sourced.
const LEGEND = SAO_PAULO_L59.ham.terms.map((t) => ({ label: t.label, color: t.color }));

export function DecompositionExplainer() {
  return (
    <div className="rounded-3xl bg-graphite-800/40 border border-white/5 px-8 md:px-12 py-12 md:py-16 flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <span className="font-jetbrains text-[10px] text-f1-red uppercase tracking-[0.2em] mb-3 block font-semibold">
            The Decomposition
          </span>
          <h2 className="text-2xl md:text-3xl font-noto font-black text-white/90 uppercase tracking-tighter">
            Same lap. Seven causes.
          </h2>
        </div>
        <p className="font-jetbrains text-[11px] text-white/50 max-w-sm leading-relaxed">
          2021 São Paulo Grand Prix · Lap 59 (the overtake) ·{' '}
          <a
            href={`${LINKS.docs}/findings/sao-paulo-2021`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/40 underline underline-offset-2 hover:text-white/70 transition-colors"
          >
            fct_lap_residuals
          </a>
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {DRIVERS.map((driver) => {
          const skill = driver.terms.find((t) => t.key === 'driver_skill_residual_s')!;
          return (
            <div key={driver.driver}>
              <div className="flex justify-between font-jetbrains text-xs text-white/60 mb-2">
                <span className="font-bold text-white text-sm">{driver.driver}</span>
                <span>
                  {toLapClock(driver.grossLapTime_s)} ·{' '}
                  <span className={`font-bold ${skill.seconds >= 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                    driver_skill: {skill.seconds >= 0 ? '+' : '−'}{Math.abs(skill.seconds).toFixed(3)}s
                  </span>
                </span>
              </div>
              <div className="h-7 bg-white/[0.04] border border-white/10 rounded-lg flex overflow-hidden">
                {driver.terms.map((seg) => {
                  const widthPct = (Math.abs(seg.seconds) / MAX_TOTAL_ABS) * 100;
                  if (widthPct < 0.4) return null; // skip ~zero terms (e.g. rubber)
                  const signed = `${seg.seconds >= 0 ? '+' : '−'}${Math.abs(seg.seconds).toFixed(3)}s`;
                  return (
                    <div
                      key={seg.key}
                      className="h-full flex items-center justify-center font-jetbrains text-[9px] font-bold text-white/80 border-r border-white/5 last:border-r-0 select-none overflow-hidden"
                      style={{ width: `${widthPct}%`, backgroundColor: seg.color }}
                      title={`${seg.label} ${signed}`}
                    >
                      {widthPct >= 7 ? TERM_ABBR[seg.key] : ''}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <p className="font-jetbrains text-[11px] text-white/45 leading-relaxed max-w-xl">
        On the overtake lap the red <span className="text-f1-red font-semibold">SKILL</span> segment  -
        the only part the driver controls  - was{' '}
        <span className="text-white/70 font-semibold">−3.110s</span> for Hamilton against{' '}
        <span className="text-white/70 font-semibold">−1.517s</span> for Verstappen: a 1.60s execution
        edge the stopwatch hid behind near-identical lap times. Everything else is physics  - and now
        it's measured.
      </p>

      <div className="flex flex-wrap gap-x-6 gap-y-3 pt-2 border-t border-white/[0.06]">
        {LEGEND.map((item) => (
          <span key={item.label} className="font-jetbrains text-[10px] text-white/45 flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
