/**
 * LaunchPad the hero's way into the live app: the five bundled datasets as
 * links that open DataScope with that sample already loading, plus a target
 * for the visitor's own file.
 *
 * Fits in: the right column of DataScopeHero.
 * Note:    a sample link carries `?sample=<id>`, which the app's IngestionPanel
 *          reads on load. A dropped file cannot follow: a page can't hand a
 *          File to another origin through a link, and DataScope's COOP
 *          same-origin header (needed for DuckDB's threaded build) severs any
 *          window-to-window handoff too. So a drop anywhere on the page is
 *          caught (the browser would otherwise navigate away to the file) and
 *          answered with a one-click way into the app, where the file goes.
 */
import { useEffect, useRef, useState, type DragEvent } from 'react';
import { ArrowUpRight, CloudSun, Ship, ShoppingCart, Star, TrendingUp, Upload, type LucideIcon } from 'lucide-react';
import { cn, track } from '@/utils';
import { DATASCOPE_APP_URL, SAMPLES, sampleUrl, type SampleId } from '../../data/datascopeData';

/** Same glyph and accent per sample as the app's SamplePicker. */
const SAMPLE_LOOK: Record<SampleId, { Icon: LucideIcon; tint: string }> = {
  ecommerce: { Icon: ShoppingCart, tint: 'bg-ds-amber/10 text-ds-amber' },
  titanic: { Icon: Ship, tint: 'bg-viz-info/10 text-viz-info' },
  stock_prices: { Icon: TrendingUp, tint: 'bg-ds-ok/10 text-ds-ok' },
  product_reviews: { Icon: Star, tint: 'bg-viz-warning/10 text-viz-warning' },
  weather: { Icon: CloudSun, tint: 'bg-ds-indigo/10 text-ds-indigo' },
};

const ROW =
  'group flex w-full items-center gap-3.5 rounded-xl border px-3.5 py-3 text-left transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ds-amber';

function OpenChip() {
  return (
    <span className="flex shrink-0 items-center gap-1 rounded-lg border border-white/15 px-2.5 py-1.5 text-xs font-semibold text-text-secondary transition-colors duration-200 group-hover:border-ds-amber group-hover:bg-ds-amber group-hover:text-ds-amber-ink">
      Open
      <ArrowUpRight aria-hidden="true" className="size-3.5" />
    </span>
  );
}

const hasFiles = (e: { dataTransfer: DataTransfer | null }) =>
  Array.from(e.dataTransfer?.types ?? []).includes('Files');

export function LaunchPad() {
  const [dragDepth, setDragDepth] = useState(0);
  const [dropped, setDropped] = useState(false);
  const noticeRef = useRef<HTMLDivElement>(null);

  // Catch a file dropped anywhere on the page, not just on the target.
  useEffect(() => {
    const onDragOver = (e: globalThis.DragEvent) => {
      if (hasFiles(e)) e.preventDefault();
    };
    const onDrop = (e: globalThis.DragEvent) => {
      if (!hasFiles(e)) return;
      e.preventDefault();
      setDragDepth(0);
      setDropped(true);
      track('datascope-file-drop');
    };
    window.addEventListener('dragover', onDragOver);
    window.addEventListener('drop', onDrop);
    return () => {
      window.removeEventListener('dragover', onDragOver);
      window.removeEventListener('drop', onDrop);
    };
  }, []);

  useEffect(() => {
    if (dropped) noticeRef.current?.focus();
  }, [dropped]);

  const dragging = dragDepth > 0;
  const onTargetDrag = (delta: 1 | -1) => (e: DragEvent) => {
    if (hasFiles(e)) setDragDepth((d) => Math.max(0, d + delta));
  };

  return (
    <div className="relative w-full rounded-2xl border border-white/10 bg-ds-panel/90 p-5 shadow-[0_40px_80px_-24px_rgba(0,0,0,0.85),0_0_0_1px_color-mix(in_oklab,var(--color-ds-amber)_6%,transparent)] backdrop-blur-md sm:p-6">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-grotesk text-lg font-semibold text-text-primary">Try it on real data</h2>
        <span className="font-jetbrains text-micro uppercase tracking-mega text-text-tertiary">New tab</span>
      </div>
      <p className="mt-1 text-pretty text-sm leading-relaxed text-text-secondary">
        Pick a dataset and DataScope opens with it already loading. Start with the warehouse: four tables, so you
        get joins and the schema graph.
      </p>

      <ul className="mt-5 space-y-2" aria-label="Sample datasets">
        {SAMPLES.map((sample, i) => {
          const { Icon, tint } = SAMPLE_LOOK[sample.id];
          return (
            <li key={sample.id}>
              <a
                href={sampleUrl(sample.id)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('outbound-click', { channel: 'datascope_sample', sample: sample.id })}
                className={cn(
                  ROW,
                  'bg-ds-canvas hover:border-ds-amber/45 hover:bg-ds-elev',
                  i === 0 ? 'border-ds-amber/30' : 'border-white/10',
                )}
              >
                <span className={cn('grid size-10 shrink-0 place-items-center rounded-lg', tint)}>
                  <Icon aria-hidden="true" className="size-[18px]" strokeWidth={1.75} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-text-primary transition-colors group-hover:text-ds-amber">
                    {sample.label}
                  </span>
                  <span className="mt-0.5 block font-jetbrains text-fine leading-snug text-text-tertiary">
                    {sample.shape}
                  </span>
                </span>
                <OpenChip />
                <span className="sr-only">(opens DataScope in a new tab)</span>
              </a>
            </li>
          );
        })}
      </ul>

      <div className="mt-5 flex items-center gap-3 font-jetbrains text-micro uppercase tracking-mega text-text-tertiary">
        <span aria-hidden="true" className="h-px flex-1 bg-white/10" />
        or your own file
        <span aria-hidden="true" className="h-px flex-1 bg-white/10" />
      </div>

      {dropped ? (
        <div
          ref={noticeRef}
          tabIndex={-1}
          role="status"
          className="mt-3 rounded-xl border border-ds-amber/40 bg-ds-amber/[0.06] p-4 outline-none"
        >
          <p className="text-sm font-semibold text-text-primary">Your file stayed on your machine.</p>
          <p className="mt-1 text-pretty text-sm leading-relaxed text-text-secondary">
            One site can't hand a file to another, and DataScope never uploads one. Open the app and drop it
            there; it's parsed in that tab.
          </p>
          <div className="mt-3 flex items-center gap-3">
            <a
              href={DATASCOPE_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                track('outbound-click', { channel: 'datascope_own_file' });
                setDropped(false);
              }}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-ds-amber px-4 font-grotesk text-sm font-semibold text-ds-amber-ink transition-[filter] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ds-amber"
            >
              Open DataScope
              <ArrowUpRight aria-hidden="true" className="size-4" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
            <button
              type="button"
              onClick={() => setDropped(false)}
              className="text-sm text-text-tertiary underline-offset-2 hover:text-text-secondary hover:underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      ) : (
        <a
          href={DATASCOPE_APP_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('outbound-click', { channel: 'datascope_own_file' })}
          onDragEnter={onTargetDrag(1)}
          onDragLeave={onTargetDrag(-1)}
          className={cn(
            ROW,
            'mt-3 border-dashed',
            dragging
              ? 'border-ds-amber bg-ds-amber/[0.08]'
              : 'border-white/20 hover:border-ds-amber/45 hover:bg-ds-elev',
          )}
        >
          <span
            className={cn(
              'grid size-10 shrink-0 place-items-center rounded-lg transition-colors',
              dragging ? 'bg-ds-amber/15 text-ds-amber' : 'bg-white/[0.05] text-text-secondary',
            )}
          >
            <Upload aria-hidden="true" className="size-[18px]" strokeWidth={1.75} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-medium text-text-primary">
              {dragging ? 'Drop to open DataScope' : 'Open the app with your own data'}
            </span>
            <span className="mt-0.5 block font-jetbrains text-fine leading-snug text-text-tertiary">
              CSV, TSV, Parquet, JSON or ZIP
            </span>
          </span>
          <OpenChip />
          <span className="sr-only">(opens DataScope in a new tab)</span>
        </a>
      )}
    </div>
  );
}
