/**
 * HarnessChart DataScope's NL-to-SQL harness as a dumbbell: per arm, the
 * share of questions whose SQL executed and the share answered correctly.
 *
 * Fits in: the Correctness chapter.
 * Note:    the gap between the two marks is the chapter's point (runs is not
 *          right), so it's drawn rather than left to subtraction. Executed is
 *          a grey ring and correct an amber dot, so identity never rests on
 *          colour alone; when they coincide the dot sits inside the ring.
 *          Positions are data, so they reach the utilities as CSS variables.
 *          The hover readout only adds to what is already reachable: each row
 *          carries its values as screen-reader text, and a table twin holds
 *          every value for keyboard and print.
 */
import type { CSSProperties } from 'react';
import { cn } from '@/utils';
import { HARNESS } from '../../data/datascopeData';

const TICKS = [0, 25, 50, 75, 100];
const pct = (v: number) => `${(v * 100).toFixed(1)}%`;
const at = (percent: number) => ({ '--x': `${percent}%` }) as CSSProperties;

export function HarnessChart() {
  return (
    <figure className="rounded-2xl border border-white/10 bg-ds-panel p-5 sm:p-7">
      <figcaption className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div>
          <p className="font-grotesk text-lg font-semibold text-text-primary">
            One harness, bracketed by its controls
          </p>
          <p className="mt-1 text-sm text-text-tertiary">
            {HARNESS.questions} labelled questions, five arms, recorded {HARNESS.ranAt}
          </p>
        </div>
        <ul className="flex items-center gap-5 text-xs text-text-secondary" aria-label="Legend">
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className="size-3 rounded-full border-2 border-text-tertiary" />
            SQL executed
          </li>
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className="size-2.5 rounded-full bg-ds-amber" />
            Answer correct
          </li>
        </ul>
      </figcaption>

      <div className="mt-8" role="list" aria-label="Harness arms">
        {HARNESS.arms.map((arm) => {
          const control = 'role' in arm ? arm.role : undefined;
          const lo = Math.min(arm.exec, arm.correct) * 100;
          const hi = Math.max(arm.exec, arm.correct) * 100;
          return (
            <div
              key={arm.id}
              role="listitem"
              className="group relative grid grid-cols-1 gap-x-6 gap-y-2 rounded-lg py-3 sm:grid-cols-[12.5rem_minmax(0,1fr)] sm:items-center sm:px-2 sm:hover:bg-white/[0.025]"
            >
              <div className="min-w-0">
                <p className="flex items-center gap-2 text-sm font-medium text-text-primary">
                  {arm.label}
                  {control && (
                    <span className="rounded border border-white/15 px-1 py-px font-jetbrains text-micro uppercase tracking-mega text-text-tertiary">
                      {control}
                    </span>
                  )}
                </p>
                <p className="font-jetbrains text-fine leading-snug text-text-tertiary">{arm.model}</p>
                <p className="sr-only">
                  {pct(arm.correct)} answered correctly, {pct(arm.exec)} executed
                </p>
              </div>

              <div className="relative h-8">
                {TICKS.map((t) => (
                  <span
                    key={t}
                    aria-hidden="true"
                    style={at(t)}
                    className="absolute inset-y-0 left-(--x) w-px bg-white/[0.07]"
                  />
                ))}
                <span
                  aria-hidden="true"
                  style={{ ...at(lo), '--w': `${hi - lo}%` } as CSSProperties}
                  className="absolute top-1/2 left-(--x) h-0.5 w-(--w) -translate-y-1/2 rounded-full bg-white/20"
                />
                <span
                  aria-hidden="true"
                  style={at(arm.exec * 100)}
                  className="absolute top-1/2 left-(--x) size-[18px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-text-tertiary bg-ds-panel ring-2 ring-ds-panel"
                />
                <span
                  aria-hidden="true"
                  style={at(arm.correct * 100)}
                  className="absolute top-1/2 left-(--x) size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ds-amber ring-2 ring-ds-panel transition-transform group-hover:scale-125"
                />
                {/* Correct never exceeds executed, so the left of the dot is always clear. */}
                <span
                  aria-hidden="true"
                  style={at(100 - arm.correct * 100)}
                  className="absolute top-1/2 right-[calc(var(--x)+0.75rem)] -translate-y-1/2 font-jetbrains text-fine tabular-nums text-text-primary"
                >
                  {pct(arm.correct)}
                </span>

                <span
                  aria-hidden="true"
                  style={at(Math.min(Math.max(arm.correct * 100, 18), 82))}
                  className="pointer-events-none absolute bottom-full left-(--x) z-10 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-ds-elev px-3 py-2 shadow-xl group-hover:block"
                >
                  <span className="block font-grotesk text-sm font-semibold text-text-primary">
                    {pct(arm.correct)} correct
                  </span>
                  <span className="block font-jetbrains text-fine tabular-nums text-text-secondary">
                    {pct(arm.exec)} executed · gap {((arm.exec - arm.correct) * 100).toFixed(1)} pts
                  </span>
                </span>
              </div>
            </div>
          );
        })}

        <div aria-hidden="true" className="grid grid-cols-1 gap-x-6 sm:grid-cols-[12.5rem_minmax(0,1fr)] sm:px-2">
          <span className="hidden sm:block" />
          <div className="relative mt-1 h-4 font-jetbrains text-micro tabular-nums text-text-tertiary">
            {TICKS.map((t) => (
              <span
                key={t}
                style={at(t)}
                className={cn(
                  'absolute top-0 left-(--x)',
                  t === 0 ? '' : t === 100 ? '-translate-x-full' : '-translate-x-1/2',
                )}
              >
                {t}%
              </span>
            ))}
          </div>
        </div>
      </div>

      <details className="mt-6 border-t border-white/[0.06] pt-4">
        <summary className="cursor-pointer font-jetbrains text-fine uppercase tracking-mega text-text-tertiary transition-colors hover:text-text-secondary">
          View as table
        </summary>
        <table className="mt-4 w-full text-left text-sm">
          <caption className="sr-only">Harness results by arm</caption>
          <thead>
            <tr className="border-b border-white/10 font-jetbrains text-micro uppercase tracking-mega text-text-tertiary">
              <th scope="col" className="pb-2 pr-4 font-normal">Arm</th>
              <th scope="col" className="pb-2 pr-4 text-right font-normal">Executed</th>
              <th scope="col" className="pb-2 text-right font-normal">Correct</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {HARNESS.arms.map((arm) => (
              <tr key={arm.id} className="border-b border-white/[0.06] last:border-0">
                <th scope="row" className="py-2 pr-4 font-normal text-text-secondary">
                  {arm.label} <span className="text-text-tertiary">({arm.model})</span>
                </th>
                <td className="py-2 pr-4 text-right text-text-secondary">{pct(arm.exec)}</td>
                <td className="py-2 text-right text-text-primary">{pct(arm.correct)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}
