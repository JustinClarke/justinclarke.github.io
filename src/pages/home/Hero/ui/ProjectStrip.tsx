/**
 * ProjectStrip the DataScope row along the bottom of the sidebar's featured
 * tile, under the Off The Pace hero.
 *
 * Fits in: passed as the `footer` of the featured CommandButton in SidebarMenu.
 * Note:    a miniature of the /datascope hero it leads to: same wordmark,
 *          headline, live pill, ds-* palette and fonts, so the click lands
 *          somewhere that already looks familiar. The copy is lifted from that
 *          hero, which is backed by datascopeData.
 */
import { DataScopeLogo } from '@/pages/datascope/components/ui/DataScopeLogo';

interface ProjectStripProps {
  onClick: () => void;
}

// No tooltip on purpose: the cursor-following tooltip would sit on the headline.
export const ProjectStrip = ({ onClick }: ProjectStripProps) => (
  <button
    onClick={onClick}
    aria-label="DataScope: drop data in, get answers out. View project"
    className="@container group/strip relative w-full shrink-0 overflow-hidden text-left bg-ds-panel border-t border-edge-soft focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ds-amber/60"
  >
    {/* The hero's two blooms, amber high and violet low */}
    <span
      aria-hidden
      className="pointer-events-none absolute -left-16 -top-16 h-40 w-96 rounded-full bg-radial from-ds-amber/[0.09] to-transparent to-60% transition-opacity duration-700 opacity-70 group-hover/strip:opacity-100"
    />
    <span
      aria-hidden
      className="pointer-events-none absolute -bottom-20 left-1/3 h-40 w-80 rounded-full bg-radial from-ds-violet/[0.08] to-transparent to-60% transition-opacity duration-700 opacity-70 group-hover/strip:opacity-100"
    />

    {/* Accent spine, the amber twin of the hero's red one */}
    <span
      aria-hidden
      className="absolute left-0 top-2 bottom-2 z-20 w-[3px] rounded-r-sm bg-ds-amber/25 transition-all duration-300 group-hover/strip:top-0 group-hover/strip:bottom-0 group-hover/strip:bg-ds-amber group-hover/strip:shadow-[0_0_10px_var(--color-ds-amber)]"
    />

    <div className="relative z-10 flex items-center gap-4 px-3 py-3 md:py-3.5">
      <div className="flex min-w-0 flex-col gap-1.5">
        <div className="flex items-center gap-3">
          <DataScopeLogo className="text-xl md:text-2xl" />
          <span className="inline-flex items-center gap-1.5 rounded-full border border-ds-ok/25 bg-ds-ok/[0.06] px-2 py-0.5 font-jetbrains text-micro uppercase tracking-mega text-ds-ok">
            <span className="size-1.5 rounded-full bg-ds-ok shadow-[0_0_8px_var(--color-ds-ok)]" />
            Live
          </span>
        </div>
        <p className="font-grotesk text-base font-bold leading-tight tracking-[-0.03em] text-text-primary md:text-lg">
          Drop data in. Get answers <span className="text-ds-amber">out</span>.
        </p>
      </div>

      <div className="ml-auto hidden flex-col items-end gap-2 font-jetbrains text-micro uppercase tracking-mega @lg:flex">
        <span className="whitespace-nowrap">Local LLM Inference</span>
        <span className="whitespace-nowrap text-text-tertiary">DuckDB inside the tab</span>
      </div>

      <span className="ml-auto inline-block font-mono text-label leading-none text-ds-amber transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] opacity-0 -translate-x-3 group-hover/strip:opacity-100 group-hover/strip:translate-x-0 @lg:ml-0">
        →
      </span>
    </div>
  </button>
);
