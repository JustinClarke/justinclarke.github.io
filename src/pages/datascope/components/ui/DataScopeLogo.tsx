/**
 * DataScopeLogo the DataScope wordmark: "Data", "Sc", the reticle as the
 * "o", then "pe".
 *
 * Fits in: the hero and the chapter nav on /datascope.
 * Note:    geometry and offsets are copied from the live app's own `Logo`
 *          (DataScope/src/app/WorkbenchShell.tsx), so the two render the same
 *          mark. Size it with a font-size class; everything is in em.
 */
import { cn } from '@/utils';

interface DataScopeLogoProps {
  className?: string;
  /** Soft amber-to-violet bloom behind the mark (hero only). */
  glow?: boolean;
}

export function DataScopeLogo({ className, glow = false }: DataScopeLogoProps) {
  return (
    <div
      role="img"
      aria-label="DataScope"
      className={cn(
        'relative inline-flex select-none items-center font-grotesk font-bold leading-none tracking-[-0.035em]',
        className,
      )}
    >
      {glow && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-6 -inset-y-4 -z-10 rounded-full bg-radial from-ds-amber/25 via-ds-violet/10 to-transparent to-70% blur-2xl"
        />
      )}
      <span className="text-ds-ink">Data</span>
      <span className="text-ds-amber">Sc</span>
      <ReticleGlyph className="mt-[0.18em] -mr-[0.04em] h-[0.75em] w-[0.75em] self-center" />
      <span className="text-ds-amber">pe</span>
    </div>
  );
}

/** The reticle on its own: ring, four crosshair ticks, amber slice, violet core. */
export function ReticleGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={cn('shrink-0 text-ds-ink', className)}>
      <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="9" />
      <path
        d="M50 4 V15 M50 85 V96 M4 50 H15 M85 50 H96"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path d="M50 50 L50 20 A30 30 0 0 1 76 65 Z" className="fill-ds-amber" />
      <circle cx="50" cy="50" r="10" className="fill-ds-violet" />
    </svg>
  );
}
