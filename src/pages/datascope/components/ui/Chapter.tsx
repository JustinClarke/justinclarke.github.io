/**
 * Chapter one level deeper on /datascope: a numbered eyebrow, a headline, a
 * lede, then whatever that chapter needs to show.
 *
 * Fits in: wraps every section after the hero. ChapterNav finds chapters by
 *          their id, so the id here must match CHAPTERS in datascopeData.ts.
 * Note:    the header is fixed in shape on purpose; the content under it is
 *          where each chapter differs (a spine, a diff viewer, charts, a matrix).
 */
import type { ReactNode } from 'react';
import { CHAPTERS, type ChapterId } from '../../data/datascopeData';

interface ChapterProps {
  id: ChapterId;
  title: ReactNode;
  lede: ReactNode;
  children: ReactNode;
}

export function Chapter({ id, title, lede, children }: ChapterProps) {
  const index = CHAPTERS.findIndex((c) => c.id === id);
  const chapter = CHAPTERS[index];

  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="relative scroll-mt-20 border-t border-white/[0.06] px-4 py-24 sm:px-6 md:py-32 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <header className="max-w-3xl">
          <p className="flex items-center gap-3 font-jetbrains text-fine uppercase tracking-mega text-text-tertiary">
            <span className="tracking-normal text-ds-amber tabular-nums">{String(index + 1).padStart(2, '0')}</span>
            <span aria-hidden="true" className="h-px w-8 bg-white/15" />
            <span>{chapter.label}</span>
          </p>
          <h2
            id={`${id}-title`}
            className="mt-5 text-balance font-grotesk text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-text-primary sm:text-[2.6rem]"
          >
            {title}
          </h2>
          <div className="mt-5 max-w-2xl space-y-4 text-pretty text-base leading-relaxed text-text-secondary sm:text-lg">
            {lede}
          </div>
        </header>
        <div className="mt-14 md:mt-16">{children}</div>
      </div>
    </section>
  );
}
