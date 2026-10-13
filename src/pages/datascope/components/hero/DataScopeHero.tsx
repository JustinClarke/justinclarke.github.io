/**
 * DataScopeHero the first chapter of /datascope: what DataScope is, and a way into
 * the live app in one click.
 *
 * Fits in: first section of DataScopePage, id "product" (ChapterNav's first
 *          step).
 * Note:    a deliberate spin on the app's own front door rather than a copy
 *          of it. It keeps the brand (wordmark, headline, palette, Space
 *          Grotesk, the particle field) but swaps the app's controls for a
 *          launch pad that hands off to the real app, so nothing here pretends
 *          to be the product.
 */
import { ArrowDown, Github } from 'lucide-react';
import { smoothScrollTo } from '@/utils';
import { ActionLink } from '../ui/ActionLink';
import { DataScopeLogo } from '../ui/DataScopeLogo';
import { ParticleField } from '../ui/ParticleField';
import { LaunchPad } from './LaunchPad';
import { DATASCOPE_APP_HOST, DATASCOPE_APP_URL, DATASCOPE_REPO_URL, HERO_STATS } from '../../data/datascopeData';

export function DataScopeHero() {
  return (
    <section
      id="product"
      aria-labelledby="product-title"
      className="relative isolate flex min-h-svh flex-col overflow-hidden px-4 pt-24 pb-6 sm:px-6 sm:pt-28 lg:px-8"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <ParticleField />
        <div className="absolute left-1/2 top-[14%] h-[500px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-radial from-ds-amber/[0.07] to-transparent to-60%" />
        <div className="absolute left-[18%] top-[62%] h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-radial from-ds-violet/[0.06] to-transparent to-60%" />
      </div>

      <div className="mx-auto grid grid-cols-1 w-full max-w-7xl flex-1 items-center gap-12 py-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,31rem)] lg:gap-14 xl:gap-20">
        <div>
          <a
            href={DATASCOPE_APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-ds-ok/25 bg-ds-ok/[0.06] px-3 py-1 font-jetbrains text-micro uppercase tracking-mega text-ds-ok transition-colors hover:border-ds-ok/50"
          >
            <span className="size-1.5 rounded-full bg-ds-ok shadow-[0_0_8px_var(--color-ds-ok)]" />
            Live at {DATASCOPE_APP_HOST}
            <span className="sr-only">(opens in a new tab)</span>
          </a>

          <DataScopeLogo glow className="mt-8 flex w-fit text-[2.5rem] sm:text-5xl" />

          <h1
            id="product-title"
            className="mt-7 font-grotesk text-[2.6rem] font-bold leading-[1.04] tracking-[-0.035em] text-text-primary sm:text-6xl"
          >
            <span className="sr-only">DataScope: </span>
            Drop data in.
            <br />
            Get answers <span className="text-ds-amber">out</span>.
          </h1>

          <p className="mt-6 max-w-[34rem] text-pretty text-base leading-relaxed text-text-secondary sm:text-lg">
            An analytics workspace that runs entirely in your browser. Drop in CSV, Parquet or JSON and a DuckDB
            engine inside the tab profiles, joins and charts it, with nothing uploaded. AI is optional, and it
            answers to an evaluation programme whose results have twice changed the product's direction.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ActionLink href={DATASCOPE_APP_URL} variant="primary" trackAs="datascope_hero">
              Open the live app
            </ActionLink>
            <ActionLink href="#engine" icon={<ArrowDown aria-hidden="true" className="size-4" />}>
              How it works
            </ActionLink>
            <ActionLink
              href={DATASCOPE_REPO_URL}
              trackAs="datascope_github"
              icon={<Github aria-hidden="true" className="size-4" />}
            >
              Source
            </ActionLink>
          </div>

          <dl className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-white/10 pt-6">
            {HERO_STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <dt className="order-2 mt-1 text-xs leading-snug text-text-tertiary">{stat.label}</dt>
                <dd className="order-1 font-grotesk text-2xl font-semibold tabular-nums text-text-primary">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <LaunchPad />
      </div>

      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 border-t border-white/10 pt-5 font-jetbrains text-micro uppercase tracking-mega text-text-tertiary">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="flex items-center gap-2 text-text-secondary">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-ds-ok shadow-[0_0_8px_var(--color-ds-ok)]" />
            In-browser
          </span>
          <span aria-hidden="true" className="hidden h-3 w-px bg-white/15 sm:block" />
          <span>No uploads · No accounts · No tracking</span>
        </p>
        <a
          href="#engine"
          onClick={(e) => {
            e.preventDefault();
            smoothScrollTo('#engine', 1.4, 80);
          }}
          className="hidden shrink-0 items-center gap-2 transition-colors hover:text-text-secondary sm:flex"
        >
          How it's built
          <ArrowDown aria-hidden="true" className="size-3.5" />
        </a>
      </div>
    </section>
  );
}
