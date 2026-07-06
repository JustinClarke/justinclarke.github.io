/**
 * InvariantWaterfall the "break the invariant" demo: a live, interactive
 * waterfall that shows the 7-term additive identity reconstructing a real lap
 * time, with the warehouse assertion (`assert_additive_identity`, ±0.0001s)
 * evaluated in the browser. Nudge any coefficient and the reconstruction drifts
 * off the real lap time  - the assertion flips red and a faux CI line prints
 * FAIL, dramatising the invariant the pipeline enforces on every build.
 *
 * Fits in: rendered by PipelineSection on the architecture page (/off-the-pace).
 * Data:    SAO_PAULO_L59.ham (the published finding lap) from decompositions.ts.
 *          Colours are the --color-term-* tokens via each term's `color`.
 * Note:    `perturb` adds seconds to one chosen term, so the reconstructed
 *          total = lap_time + perturb, and the residual the test checks is
 *          simply `perturb`. Everything recomputes from the two state values,
 *          so the chart and the verdict can never disagree.
 */
import { useState } from 'react';
import { SAO_PAULO_L59, toLapClock, TERM_ABBR as ABBR, type IdentityTermKey } from '../../data/decompositions';
import { STATS } from '../../data/projectStats';

const TOL = 1e-4;
const LAP = SAO_PAULO_L59.ham;

// SVG geometry (scales to width via viewBox).
const VB_W = 760;
const VB_H = 280;
const PAD_X = 14;
const PLOT_TOP = 30;
const PLOT_BOTTOM = 244;
const PLOT_H = PLOT_BOTTOM - PLOT_TOP;

const fmtSigned = (n: number) => `${n >= 0 ? '+' : '−'}${Math.abs(n).toFixed(3)}`;

export function InvariantWaterfall() {
  const [selectedKey, setSelectedKey] = useState<IdentityTermKey>('compound_component_s');
  const [perturb, setPerturb] = useState(0);

  // Effective (possibly perturbed) seconds per term, and the running cumulative.
  const baseline = LAP.truePace_s;
  let running = baseline;
  const steps = LAP.terms.map((term) => {
    const seconds = term.seconds + (term.key === selectedKey ? perturb : 0);
    const from = running;
    running += seconds;
    return { ...term, seconds, from, to: running };
  });

  const reconstructed = running;                 // = lap_time + perturb
  const actual = LAP.grossLapTime_s;
  const residual = reconstructed - actual;       // = perturb (by construction)
  const pass = Math.abs(residual) <= TOL;

  // y-scale: auto-fit to every cumulative level so 0.5s steps stay visible even
  // though the lap time itself is ~72s. Larger seconds (slower) sit higher up.
  const levels = [baseline, actual, reconstructed, ...steps.flatMap((s) => [s.from, s.to])];
  const lo = Math.min(...levels) - 0.4;
  const hi = Math.max(...levels) + 0.4;
  const yScale = (v: number) => PLOT_TOP + ((hi - v) / (hi - lo)) * PLOT_H;

  const colW = (VB_W - PAD_X * 2) / steps.length;
  const barW = colW * 0.5;
  const colX = (i: number) => PAD_X + i * colW + (colW - barW) / 2;

  const selectedTerm = LAP.terms.find((t) => t.key === selectedKey)!;

  return (
    <div className="border border-white/10 rounded-xl bg-white/[0.01] overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 p-6 md:p-8 border-b border-white/5">
        <div>
          <span className="font-jetbrains text-micro uppercase tracking-widest text-f1-red block mb-2 font-semibold">
            Transform // The Invariant
          </span>
          <h3 className="text-lg md:text-xl font-noto font-black text-text-primary uppercase tracking-tight">
            The additive identity, live
          </h3>
          <p className="font-jetbrains text-fine text-text-tertiary leading-relaxed mt-2 max-w-xl">
            Every lap, seven measured causes must reconstruct the clock to within{' '}
            <span className="text-text-secondary">±0.0001s</span>  - or{' '}
            <span className="text-text-secondary lowercase">assert_additive_identity</span> fails the build.
            Nudge a coefficient and watch it break.
          </p>
        </div>
        <span className="font-jetbrains text-micro text-text-tertiary tracking-wider font-medium shrink-0">
          {LAP.raceLabel.toUpperCase()} · L{LAP.lap} · {LAP.driver}
        </span>
      </div>

      {/* Waterfall */}
      <div className="px-3 sm:px-6 pt-5">
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full h-auto" role="img"
          aria-label={`Waterfall reconstructing the ${toLapClock(actual)} lap time from a ${toLapClock(baseline)} structural baseline plus seven signed components.`}>
          {/* baseline + lap-time reference lines */}
          {[
            { v: baseline, label: `baseline ${toLapClock(baseline)}`, color: 'rgba(255,255,255,0.25)' },
            { v: actual, label: `lap_time ${toLapClock(actual)}`, color: 'rgba(255,255,255,0.45)' },
          ].map((ref) => (
            <g key={ref.label}>
              <line x1={PAD_X} x2={VB_W - PAD_X} y1={yScale(ref.v)} y2={yScale(ref.v)}
                stroke={ref.color} strokeWidth={1} strokeDasharray="3 3" />
              <text x={VB_W - PAD_X} y={yScale(ref.v) - 4} textAnchor="end"
                className="font-jetbrains" fontSize={9} fill={ref.color}>{ref.label}</text>
            </g>
          ))}

          {/* reconstructed level (only visibly diverges when perturbed) */}
          {!pass && (
            <g>
              <line x1={PAD_X} x2={VB_W - PAD_X} y1={yScale(reconstructed)} y2={yScale(reconstructed)}
                stroke="var(--color-sql-red)" strokeWidth={1.5} strokeDasharray="2 2" />
              <text x={PAD_X} y={yScale(reconstructed) - 4} textAnchor="start"
                className="font-jetbrains" fontSize={9} fill="var(--color-sql-red)">
                reconstructed {toLapClock(reconstructed)}
              </text>
            </g>
          )}

          {/* step bars + connectors */}
          {steps.map((s, i) => {
            const yTop = yScale(Math.max(s.from, s.to));
            const h = Math.max(1.5, Math.abs(yScale(s.from) - yScale(s.to)));
            const x = colX(i);
            const isSel = s.key === selectedKey;
            return (
              <g key={s.key}>
                {i < steps.length - 1 && (
                  <line x1={x + barW} x2={colX(i + 1)} y1={yScale(s.to)} y2={yScale(s.to)}
                    stroke="rgba(255,255,255,0.12)" strokeWidth={1} />
                )}
                <rect x={x} y={yTop} width={barW} height={h} rx={1.5}
                  fill={s.color} opacity={isSel ? 1 : 0.82}
                  stroke={isSel ? 'rgba(255,255,255,0.9)' : 'transparent'} strokeWidth={isSel ? 1.5 : 0}
                  style={{ transition: 'y 0.3s ease, height 0.3s ease' }} />
                {/* value label */}
                <text x={x + barW / 2} y={yTop - 5} textAnchor="middle"
                  className="font-jetbrains tabular-nums" fontSize={8.5}
                  fill={isSel ? '#fff' : 'rgba(255,255,255,0.6)'}>
                  {fmtSigned(s.seconds)}
                </text>
                {/* axis code */}
                <text x={x + barW / 2} y={PLOT_BOTTOM + 16} textAnchor="middle"
                  className="font-jetbrains" fontSize={8.5}
                  fill={isSel ? '#fff' : 'rgba(255,255,255,0.4)'}>
                  {ABBR[s.key]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Verdict + CI console */}
      <div className="px-6 md:px-8 pt-2 pb-5 flex flex-col gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <span
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md font-jetbrains text-fine font-bold uppercase tracking-wider border"
            style={{
              color: pass ? 'var(--color-emerald)' : 'var(--color-sql-red)',
              borderColor: pass ? 'color-mix(in srgb, var(--color-emerald) 35%, transparent)' : 'color-mix(in srgb, var(--color-sql-red) 35%, transparent)',
              backgroundColor: pass ? 'color-mix(in srgb, var(--color-emerald) 10%, transparent)' : 'color-mix(in srgb, var(--color-sql-red) 10%, transparent)',
            }}
          >
            {pass ? '✓' : '✗'} {pass ? 'identity holds' : 'identity broken'}
          </span>
          <span className="font-jetbrains text-fine text-text-tertiary tabular-nums">
            |residual| = <span className="text-text-secondary">{Math.abs(residual).toFixed(6)}s</span>{' '}
            {pass ? '≤' : '>'} 1.0e-4
          </span>
        </div>

        {/* faux CI output */}
        <div className="font-jetbrains text-micro sm:text-fine leading-relaxed bg-black/40 border border-white/5 rounded-lg p-3 sm:p-4 overflow-x-auto">
          <div className="text-text-tertiary">$ dbt test --select assert_additive_identity</div>
          {pass ? (
            <div className="text-emerald-400">
              PASS  assert_additive_identity · {STATS.tests}/{STATS.tests} tests passed
            </div>
          ) : (
            <>
              <div className="text-red-400">FAIL  assert_additive_identity</div>
              <div className="text-text-tertiary pl-4">
                in fct_lap_residuals (race {LAP.raceId}, {LAP.driver}, lap {LAP.lap})
              </div>
              <div className="text-text-tertiary pl-4">
                reconstructed {reconstructed.toFixed(4)}s ≠ lap_time {actual.toFixed(4)}s
                {'  '}(|Δ| = {Math.abs(residual).toFixed(4)}s)
              </div>
              <div className="text-red-400/90">1 of {STATS.tests} tests failed</div>
            </>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="px-6 md:px-8 py-5 border-t border-white/5 bg-white/[0.01] flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-jetbrains text-micro uppercase tracking-widest text-text-tertiary mr-1">Perturb</span>
          {LAP.terms.map((term) => {
            const isSel = term.key === selectedKey;
            return (
              <button
                key={term.key}
                type="button"
                onClick={() => setSelectedKey(term.key)}
                aria-pressed={isSel}
                className="font-jetbrains text-micro uppercase tracking-wider px-2.5 py-1 rounded border transition-colors duration-200 focus-ring"
                style={{
                  color: isSel ? '#fff' : 'rgba(255,255,255,0.5)',
                  borderColor: isSel ? term.color : 'rgba(255,255,255,0.1)',
                  backgroundColor: isSel ? 'color-mix(in srgb, var(--sel) 22%, transparent)' : 'transparent',
                  ['--sel' as string]: term.color,
                }}
              >
                {ABBR[term.key]}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <label className="flex-1 flex items-center gap-3">
            <span className="sr-only">Perturb {selectedTerm.label} coefficient, in seconds</span>
            <input
              type="range"
              min={-0.5}
              max={0.5}
              step={0.005}
              value={perturb}
              onChange={(e) => setPerturb(parseFloat(e.target.value))}
              className="flex-1 accent-f1-red cursor-pointer"
              aria-label={`Perturb ${selectedTerm.label} coefficient in seconds`}
              aria-valuetext={`${fmtSigned(perturb)} seconds`}
            />
            <span className="font-jetbrains text-fine text-text-secondary tabular-nums w-28 shrink-0">
              {selectedTerm.label.split(' ')[0]} {fmtSigned(perturb)}s
            </span>
          </label>
          <button
            type="button"
            onClick={() => setPerturb(0)}
            disabled={perturb === 0}
            className="font-jetbrains text-micro uppercase tracking-wider px-3 py-1.5 rounded border border-white/10 text-text-tertiary hover:text-white hover:border-white/25 disabled:opacity-30 disabled:cursor-default transition-colors focus-ring"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
