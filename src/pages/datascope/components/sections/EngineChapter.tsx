/**
 * EngineChapter chapter 2 on /datascope: the deterministic core, which is the
 * whole product when AI is off.
 *
 * Fits in: second chapter of DataScopePage.
 * Note:    the spine is the README's architecture flowchart, top to bottom,
 *          and each load-bearing seam sits beside the station it lives at. On
 *          small screens the seam drops under its station and the spine line
 *          (drawn per row on the <li>) stays continuous.
 */
import { cn } from '@/utils';
import { Chapter } from '../ui/Chapter';
import { Code } from '../ui/Code';
import { SourceLink } from '../ui/SourceLink';
import { ENGINE_SPECS, ENGINE_STATIONS, type Seam, type Station } from '../../data/datascopeData';

function SeamCard({ seam }: { seam: Seam }) {
  return (
    <article className="rounded-xl border border-white/10 bg-ds-panel p-5 sm:p-6">
      <p className="font-jetbrains text-micro uppercase tracking-mega text-text-tertiary">Load-bearing seam</p>
      <div className="mt-1.5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="font-jetbrains text-base font-semibold text-ds-amber">{seam.name}</h3>
        <SourceLink source={seam.source} href={seam.href} />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-text-secondary">{seam.body}</p>
      {seam.code && (
        <Code code={seam.code} lang="ts" className="mt-4" label={`${seam.name}, excerpt from ${seam.source}`} />
      )}
    </article>
  );
}

function BranchChip({ label, ai }: NonNullable<Station['branch']>) {
  return (
    <p
      className={cn(
        'relative mt-3 inline-flex items-center gap-2 rounded-lg border px-2.5 py-1.5 font-jetbrains text-fine',
        ai
          ? 'border-dashed border-ds-violet/50 bg-ds-violet/[0.06] text-ds-violet-soft'
          : 'border-white/12 bg-white/[0.03] text-text-secondary',
      )}
    >
      <span aria-hidden="true">{ai ? '┄▸' : '└▸'}</span>
      {label}
    </p>
  );
}

export function EngineChapter() {
  const last = ENGINE_STATIONS.length - 1;

  return (
    <Chapter
      id="engine"
      title="It works with the AI switched off."
      lede={
        <p>
          Files are read, parsed, profiled and queried by DuckDB-Wasm in a Web Worker. With AI off the app makes no
          network requests after load, which you can check in DevTools. The headline capability is understanding
          structure: what tables you have, what the columns mean, how they relate, and what's wrong with them.
        </p>
      }
    >
      <ol aria-label="How a dropped file becomes a view">
        {ENGINE_STATIONS.map((station, i) => (
          <li key={station.nodes.join()} className="relative grid grid-cols-1 gap-x-12 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)]">
            <span
              aria-hidden="true"
              className={cn(
                'absolute left-[11px] w-px bg-white/[0.12]',
                i === 0 ? 'top-[11px]' : 'top-0',
                i === last ? 'h-[11px]' : 'bottom-0',
              )}
            />
            <div className="relative pb-6 pl-10 lg:pb-14">
              {station.nodes.map((node, j) => (
                <div key={node} className={cn('relative flex min-h-[23px] items-center', j > 0 && 'mt-5')}>
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute -left-10 grid size-[23px] place-items-center rounded-full border bg-ds-canvas',
                      station.seam && j === station.nodes.length - 1
                        ? 'border-ds-amber/60'
                        : 'border-white/15',
                    )}
                  >
                    <span className="size-[7px] rounded-full bg-ds-amber" />
                  </span>
                  <span className="font-jetbrains text-sm font-medium text-text-primary">{node}</span>
                </div>
              ))}
              {station.caption && (
                <p className="mt-2 max-w-[15rem] text-sm leading-relaxed text-text-tertiary">{station.caption}</p>
              )}
              {station.branch && <BranchChip {...station.branch} />}
            </div>
            {station.seam ? (
              <div className="pb-12 pl-10 lg:pb-14 lg:pl-0">
                <SeamCard seam={station.seam} />
              </div>
            ) : (
              <div aria-hidden="true" className="hidden lg:block" />
            )}
          </li>
        ))}
      </ol>

      <div className="mt-16 border-t border-white/[0.06] pt-12">
        <h3 className="font-jetbrains text-fine uppercase tracking-mega text-text-tertiary">
          What keeps a browser tab alive
        </h3>
        <dl className="mt-8 grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2">
          {ENGINE_SPECS.map((spec) => (
            <div key={spec.term}>
              <dt className="font-grotesk text-lg font-semibold text-text-primary">{spec.term}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-text-secondary">{spec.body}</dd>
              <dd className="mt-3">
                <SourceLink source={spec.source} href={spec.href} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Chapter>
  );
}
