/**
 * RepairViewer four of DuckChat's eight deterministic repairs as before and
 * after SQL, with the changed tokens marked.
 *
 * Fits in: the Language chapter.
 * Note:    an ARIA tablist (vertical on lg, a horizontal scroller below it)
 *          with roving tabindex: arrows move between repairs, Home/End jump.
 */
import { useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { cn } from '@/utils';
import { Code, diffSpans } from '../ui/Code';
import { SourceLink } from '../ui/SourceLink';
import { REPAIRS } from '../../data/datascopeData';

const KIND_LABEL = {
  structural: { text: 'any model', className: 'border-white/15 text-text-tertiary' },
  fit: { text: 'model-gated', className: 'border-ds-violet/40 text-ds-violet-soft' },
} as const;

export function RepairViewer() {
  const [index, setIndex] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();
  const repair = REPAIRS[index];
  const marks = useMemo(() => diffSpans(repair.before, repair.after), [repair]);

  const select = (next: number) => {
    const wrapped = (next + REPAIRS.length) % REPAIRS.length;
    setIndex(wrapped);
    tabs.current[wrapped]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const moves: Record<string, number> = {
      ArrowDown: index + 1,
      ArrowRight: index + 1,
      ArrowUp: index - 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: REPAIRS.length - 1,
    };
    if (e.key in moves) {
      e.preventDefault();
      select(moves[e.key]);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-ds-panel">
      <div className="flex flex-col lg:flex-row">
        <div
          role="tablist"
          aria-label="Repairs"
          aria-orientation="vertical"
          className="flex gap-1 overflow-x-auto border-b border-white/10 p-2 lg:w-72 lg:shrink-0 lg:flex-col lg:overflow-visible lg:border-r lg:border-b-0"
        >
          {REPAIRS.map((r, i) => {
            const selected = i === index;
            return (
              <button
                key={r.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`${baseId}-tab-${r.id}`}
                aria-selected={selected}
                aria-controls={`${baseId}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setIndex(i)}
                onKeyDown={onKeyDown}
                className={cn(
                  'shrink-0 rounded-lg px-3.5 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ds-amber',
                  selected ? 'bg-ds-elev' : 'hover:bg-white/[0.04]',
                )}
              >
                <span
                  className={cn(
                    'flex items-center gap-2 text-sm font-medium',
                    selected ? 'text-text-primary' : 'text-text-secondary',
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn('size-1.5 rounded-full', selected ? 'bg-ds-amber' : 'bg-white/20')}
                  />
                  {r.name}
                </span>
                <span className="mt-1 flex items-center gap-2 pl-3.5 font-jetbrains text-micro text-text-tertiary">
                  {r.fn}
                  <span className={cn('rounded border px-1 py-px', KIND_LABEL[r.kind].className)}>
                    {KIND_LABEL[r.kind].text}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`${baseId}-panel`}
          aria-labelledby={`${baseId}-tab-${repair.id}`}
          className="min-w-0 flex-1 p-5 sm:p-7"
        >
          {repair.question && (
            <p className="mb-4 font-jetbrains text-fine text-text-tertiary">
              Question: <span className="text-text-primary">"{repair.question}"</span>
            </p>
          )}
          <div className="grid grid-cols-1 gap-3">
            <figure className="min-w-0">
              <figcaption className="mb-2 font-jetbrains text-micro uppercase tracking-mega text-viz-error">
                The model wrote
              </figcaption>
              <Code code={repair.before} lang="sql" mark={marks.before} label="SQL as the model wrote it" />
            </figure>
            <figure className="min-w-0">
              <figcaption className="mb-2 flex items-center gap-2 font-jetbrains text-micro uppercase tracking-mega text-ds-ok">
                <span aria-hidden="true">↓</span>
                What actually runs
                <span className="normal-case tracking-normal text-text-tertiary">after {repair.fn}()</span>
              </figcaption>
              <Code code={repair.after} lang="sql" mark={marks.after} label="SQL after the repair" />
            </figure>
          </div>

          <div className="mt-7 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h4 className="font-jetbrains text-micro uppercase tracking-mega text-text-tertiary">Why code fixes it</h4>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{repair.why}</p>
            </div>
            <div>
              <h4 className="font-jetbrains text-micro uppercase tracking-mega text-text-tertiary">When it holds back</h4>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{repair.declines}</p>
            </div>
          </div>

          <SourceLink source={repair.source} className="mt-7" />
        </div>
      </div>

      <p className="border-t border-white/10 px-5 py-4 text-xs leading-relaxed text-text-tertiary sm:px-7">
        Structural repairs are true whoever wrote the SQL, so they run for any model. Model-gated repairs match one
        model's habits and run only for the models they were tested against (qwen3.5 at 4B and 9B).
      </p>
    </div>
  );
}
