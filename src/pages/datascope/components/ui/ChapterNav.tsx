/**
 * ChapterNav the floating glass pill on /datascope: the wordmark (back to
 * top), the chapters, and the way out to the live app.
 *
 * Fits in: rendered once by DataScopePage. Same glass-pill language as the
 *          Off The Pace PersistentNav, portalled into document.body so fixed
 *          positioning is measured against the viewport.
 * Note:    labels are sentence case at text-label, not tracked uppercase; a
 *          row of six spaced-out capitals read as a game HUD. Below lg the
 *          list collapses to the chapter in view. The active chapter comes
 *          from an IntersectionObserver band across the middle of the viewport.
 */
import { useEffect, useState, type MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { ArrowUpRight } from 'lucide-react';
import { cn, smoothScrollTo, track } from '@/utils';
import { CHAPTERS, DATASCOPE_APP_URL, type ChapterId } from '../../data/datascopeData';
import { ReticleGlyph } from './DataScopeLogo';

function useActiveChapter(): ChapterId {
  const [active, setActive] = useState<ChapterId>('product');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id as ChapterId);
        }
      },
      { rootMargin: '-45% 0px -54% 0px' },
    );
    for (const { id } of CHAPTERS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return active;
}

/** The hero is "the top", so the wordmark stands in for it rather than a list item. */
const LISTED = CHAPTERS.filter((c) => c.id !== 'product');

export function ChapterNav() {
  const active = useActiveChapter();
  const current = LISTED.find((c) => c.id === active);

  const jump = (e: MouseEvent<HTMLAnchorElement>, id: ChapterId) => {
    if (e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    smoothScrollTo(id === 'product' ? 0 : `#${id}`, 1.4, 80);
  };

  return createPortal(
    <nav
      aria-label="DataScope case study"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 md:pt-5"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-24 bg-linear-to-b from-ds-canvas/85 via-ds-canvas/40 to-transparent"
      />
      <div className="pointer-events-auto flex items-center gap-0.5 rounded-full border border-white/[0.08] bg-ds-canvas/80 p-1 shadow-[0_8px_32px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl">
        <a
          href="#product"
          onClick={(e) => jump(e, 'product')}
          aria-label="DataScope, back to top"
          className="flex items-center gap-2 rounded-full py-1.5 pr-3 pl-2 transition-colors hover:bg-white/[0.06] focus-visible:outline-2 focus-visible:outline-ds-amber"
        >
          <ReticleGlyph className="size-4" />
          <span className="font-grotesk text-sm font-semibold tracking-[-0.01em] text-text-primary">DataScope</span>
        </a>

        <span aria-hidden="true" className="mx-1 hidden h-4 w-px bg-white/10 lg:block" />

        <ol className="hidden items-center lg:flex">
          {LISTED.map((chapter) => {
            const isActive = chapter.id === active;
            return (
              <li key={chapter.id}>
                <a
                  href={`#${chapter.id}`}
                  onClick={(e) => jump(e, chapter.id)}
                  aria-current={isActive ? 'location' : undefined}
                  className={cn(
                    'block rounded-full px-3 py-1.5 text-label transition-colors focus-visible:outline-2 focus-visible:outline-ds-amber',
                    isActive ? 'bg-white/10 text-text-primary' : 'text-text-tertiary hover:text-text-primary',
                  )}
                >
                  {chapter.label}
                </a>
              </li>
            );
          })}
        </ol>

        {current && (
          <p className="px-2 text-label text-text-secondary lg:hidden">
            <span aria-hidden="true" className="mr-2 text-text-ghost">/</span>
            {current.label}
          </p>
        )}

        <a
          href={DATASCOPE_APP_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('outbound-click', { channel: 'datascope_nav' })}
          className="ml-1 inline-flex items-center gap-1 rounded-full bg-ds-amber py-1.5 pr-3 pl-3.5 text-label font-semibold text-ds-amber-ink transition-[filter] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ds-amber"
        >
          Open app
          <ArrowUpRight aria-hidden="true" className="size-3.5" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </div>
    </nav>,
    document.body,
  );
}
