/**
 * ClosingBand the last call to action on /datascope, just before the
 * site-wide footer (TheCloser).
 *
 * Fits in: after the Frontier chapter.
 * Note:    DuckChat's repository is private, so it is offered as a walkthrough
 *          rather than linked; a link would 404 for a visitor.
 */
import { Github } from 'lucide-react';
import { ActionLink } from '../ui/ActionLink';
import { DataScopeLogo } from '../ui/DataScopeLogo';
import { DATASCOPE_APP_URL, DATASCOPE_REPO_URL } from '../../data/datascopeData';

export function ClosingBand() {
  return (
    <section
      aria-labelledby="ds-closing-title"
      className="relative isolate overflow-hidden border-t border-white/[0.06] px-4 py-24 sm:px-6 md:py-32 lg:px-8"
    >
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-1/2 -z-10 h-[360px] w-[min(1000px,90vw)] -translate-x-1/2 translate-y-1/3 rounded-full bg-radial from-ds-amber/[0.08] via-ds-violet/[0.04] to-transparent to-70%"
      />
      <div className="mx-auto max-w-3xl text-center">
        <DataScopeLogo className="text-4xl" />
        <h2
          id="ds-closing-title"
          className="mt-8 text-balance font-grotesk text-3xl font-semibold leading-tight tracking-[-0.03em] text-text-primary sm:text-[2.6rem]"
        >
          The quickest way to judge it is to use it.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-text-secondary sm:text-lg">
          Open DataScope, load a sample, then switch your network off and keep going. DuckChat's repository is
          private; I'm happy to walk through it on a call.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <ActionLink href={DATASCOPE_APP_URL} variant="primary" trackAs="datascope_closing">
            Open the live app
          </ActionLink>
          <ActionLink
            href={DATASCOPE_REPO_URL}
            trackAs="datascope_github_closing"
            icon={<Github aria-hidden="true" className="size-4" />}
          >
            Read the source
          </ActionLink>
        </div>
      </div>
    </section>
  );
}
