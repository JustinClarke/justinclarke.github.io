/**
 * SourceLink the small citation under a claim: the repo path it came from,
 * linked to GitHub when that file is public.
 *
 * Fits in: every chapter on /datascope; the data lives in datascopeData.ts.
 * Note:    DuckChat's repo is private, so its citations render as plain text
 *          rather than as links that would 404 for a visitor.
 */
import { ArrowUpRight, FileCode2 } from 'lucide-react';
import { cn } from '@/utils';
import type { Source } from '../../data/datascopeData';

export function SourceLink({ source, href, className }: Source & { className?: string }) {
  const base = 'inline-flex max-w-full items-start gap-1.5 font-jetbrains text-micro leading-snug text-text-tertiary';
  const label = (
    <>
      <FileCode2 aria-hidden="true" className="size-3 shrink-0" />
      <span className="[overflow-wrap:anywhere]">{source}</span>
    </>
  );

  if (!href) return <span className={cn(base, className)}>{label}</span>;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        base,
        'underline-offset-2 transition-colors hover:text-text-secondary hover:underline focus-visible:text-text-secondary',
        className,
      )}
    >
      {label}
      <ArrowUpRight aria-hidden="true" className="size-3 shrink-0" />
      <span className="sr-only">(source on GitHub, opens in a new tab)</span>
    </a>
  );
}
