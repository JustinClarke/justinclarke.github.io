/**
 * GroundingLadderChart experiment 10 as a single-series line: answer
 * correctness at each rung of raw rows added to a prompt that already holds
 * computed facts.
 *
 * Fits in: the Experiments chapter.
 * Note:    the SVG draws only the line, the wash and the gridlines (stretched
 *          to the plot with non-scaling strokes). Markers and every label are
 *          HTML placed by CSS variables, so text keeps its real size on a
 *          phone instead of shrinking with a viewBox. One series, so no legend
 *          box: the caption names it. Endpoints are labelled; the middle two
 *          values live in the hover readout, each point's accessible name and
 *          the table.
 */
import type { CSSProperties } from 'react';
import { cn } from '@/utils';
import { SourceLink } from '../ui/SourceLink';
import { GROUNDING_LADDER } from '../../data/datascopeData';

const Y_MIN = 50;
const Y_MAX = 80;
const Y_TICKS = [80, 70, 60, 50];

const rungs = GROUNDING_LADDER.rungs;
const tick = (rows: string) => (rows === 'all' ? 'every row' : `${rows} rows`);
const xOf = (i: number) => 8 + (i * 84) / (rungs.length - 1);
const yOf = (v: number) => ((Y_MAX - v) / (Y_MAX - Y_MIN)) * 100;
const place = (x: number, y: number) => ({ '--x': `${x}%`, '--y': `${y}%` }) as CSSProperties;

export function GroundingLadderChart() {
  const points = rungs.map((r, i) => `${xOf(i)},${yOf(r.correct)}`).join(' ');
  const area = `${xOf(0)},100 ${points} ${xOf(rungs.length - 1)},100`;
  const first = rungs[0];
  const last = rungs[rungs.length - 1];

  return (
    <figure className="rounded-2xl border border-white/10 bg-ds-panel p-5 sm:p-7">
      <figcaption>
        <p className="font-grotesk text-lg font-semibold text-text-primary">
          Correct answers as raw rows are added
        </p>
        <p className="mt-1 text-sm text-text-tertiary">
          Raw rows added to a prompt that already holds computed facts. Experiment 10 · {GROUNDING_LADDER.calls}{' '}
          calls, 102 per rung · {GROUNDING_LADDER.model}
        </p>
      </figcaption>

      <div className="relative mt-6 h-64 sm:h-72">
        {/* y tick labels */}
        <div aria-hidden="true" className="absolute top-0 bottom-8 left-0 w-10 font-jetbrains text-micro tabular-nums text-text-tertiary">
          {Y_TICKS.map((t) => (
            <span key={t} style={place(0, yOf(t))} className="absolute top-(--y) right-2 -translate-y-1/2">
              {t}%
            </span>
          ))}
        </div>

        <div className="absolute inset-y-0 right-0 left-10">
          <div className="absolute inset-x-0 top-0 bottom-8">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" className="absolute inset-0 size-full overflow-visible">
              {Y_TICKS.map((t) => (
                <line
                  key={t}
                  x1="0"
                  x2="100"
                  y1={yOf(t)}
                  y2={yOf(t)}
                  vectorEffect="non-scaling-stroke"
                  className="stroke-white/[0.07]"
                  strokeWidth="1"
                />
              ))}
              <polygon points={area} className="fill-ds-amber/10" />
              <polyline
                points={points}
                fill="none"
                vectorEffect="non-scaling-stroke"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
                className="stroke-ds-amber"
              />
            </svg>

            {rungs.map((r, i) => {
              const isFirst = i === 0;
              const isLast = i === rungs.length - 1;
              return (
                <span
                  key={r.rows}
                  role="img"
                  aria-label={`${r.label}: ${r.correct}% correct`}
                  style={place(xOf(i), yOf(r.correct))}
                  className="group absolute top-(--y) left-(--x) grid size-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full"
                >
                  <span className="size-3 rounded-full bg-ds-amber ring-2 ring-ds-panel transition-transform group-hover:scale-125" />
                  {/* Start label above (the line leaves downward); end label below, clear of the line arriving from above. */}
                  {(isFirst || isLast) && (
                    <span
                      aria-hidden="true"
                      className={cn(
                        'absolute font-grotesk text-base font-semibold whitespace-nowrap text-text-primary',
                        isFirst ? 'bottom-full left-1/2 mb-0.5' : 'top-full right-1/2 mt-0.5',
                      )}
                    >
                      {r.correct}%
                    </span>
                  )}
                  <span
                    aria-hidden="true"
                    className={cn(
                      'pointer-events-none absolute z-10 hidden whitespace-nowrap rounded-lg border border-white/10 bg-ds-elev px-3 py-2 shadow-xl group-hover:block',
                      isFirst && 'top-full left-0 mt-2',
                      isLast && 'right-0 bottom-full mb-2',
                      !isFirst && !isLast && 'top-full left-1/2 mt-2 -translate-x-1/2',
                    )}
                  >
                    <span className="block font-grotesk text-sm font-semibold text-text-primary">{r.correct}% correct</span>
                    <span className="block font-jetbrains text-fine text-text-secondary">{r.label} · 102 calls</span>
                  </span>
                </span>
              );
            })}
          </div>

          {/* x tick labels */}
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-6 font-jetbrains text-fine text-text-tertiary">
            {rungs.map((r, i) => (
              <span
                key={r.rows}
                style={place(xOf(i), 0)}
                className={cn(
                  'absolute top-1 left-(--x) whitespace-nowrap',
                  i === 0 ? '-translate-x-[15%]' : i === rungs.length - 1 ? '-translate-x-[85%]' : '-translate-x-1/2',
                )}
              >
                {tick(r.rows)}
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-6 text-sm leading-relaxed text-text-secondary">
        From {first.correct}% to {last.correct}%: every rung of real rows on top of computed facts made answers
        worse. The result was screened for pretraining contamination on the public fixtures before it was accepted,
        and the product's context strategy was reversed on it.
      </p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <SourceLink source={GROUNDING_LADDER.source} href={GROUNDING_LADDER.href} />
        <details className="w-full sm:w-auto">
          <summary className="cursor-pointer font-jetbrains text-fine uppercase tracking-mega text-text-tertiary transition-colors hover:text-text-secondary">
            View as table
          </summary>
          <table className="mt-3 w-full text-left text-sm">
            <caption className="sr-only">Grounding ladder correctness by rung</caption>
            <thead>
              <tr className="border-b border-white/10 font-jetbrains text-micro uppercase tracking-mega text-text-tertiary">
                <th scope="col" className="pb-2 pr-6 font-normal">Rung</th>
                <th scope="col" className="pb-2 pr-6 text-right font-normal">Calls</th>
                <th scope="col" className="pb-2 text-right font-normal">Correct</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {rungs.map((r) => (
                <tr key={r.rows} className="border-b border-white/[0.06] last:border-0">
                  <th scope="row" className="py-2 pr-6 font-normal text-text-secondary">{r.label}</th>
                  <td className="py-2 pr-6 text-right text-text-secondary">102</td>
                  <td className="py-2 text-right text-text-primary">{r.correct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      </div>
    </figure>
  );
}
