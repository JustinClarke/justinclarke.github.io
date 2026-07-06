/**
 * HonestyStrip a build-status board that labels each feature built / fitted /
 * in-progress / planned, so the page never overclaims what is shipped.
 *
 * Fits in: the overview, near the end, as a candour note.
 * Note:    The status-to-styling map lives in `badge`; the list itself lives in
 *          `BUILD_STATUS` (data file). Change copy in the data, look in the map.
 */
import { BUILD_STATUS, type BuildStatus } from '../../../data/projectStats';

const badge: Record<BuildStatus, { label: string; cls: string }> = {
  built:   { label: '✓ Built',       cls: 'text-emerald-400 bg-emerald-500/5 border-emerald-500/10' },
  fitted:  { label: '✓ Fitted',      cls: 'text-emerald-400 bg-emerald-500/5 border-emerald-500/10' },
  wip:     { label: '⟳ In progress', cls: 'text-amber-400 bg-amber-500/5 border-amber-500/10' },
  planned: { label: '⊙ Planned',     cls: 'text-text-tertiary bg-white/[0.03] border-white/10' },
};

export function HonestyStrip() {
  return (
    <div className="flex flex-col gap-4">
      <div className="max-w-xl">
        <span className="font-jetbrains text-micro text-text-tertiary uppercase tracking-mega mb-3 block font-semibold">
          Build Status
        </span>
        <p className="text-text-tertiary text-xs font-jetbrains leading-relaxed">
          This project is built layer-by-layer. Planned items are designed and specced, not yet shipped.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {BUILD_STATUS.map((item) => {
          const b = badge[item.status];
          return (
            <div
              key={item.label}
              className="flex items-center justify-between px-4 py-2.5 bg-graphite-850 border border-white/5 rounded-xl"
            >
              <span className="font-jetbrains text-xs text-text-secondary">{item.label}</span>
              <span className={`font-jetbrains text-micro uppercase tracking-wider border px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap ml-3 ${b.cls}`}>
                {b.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
