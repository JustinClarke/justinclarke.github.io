/**
 * content/routes.ts THE route manifest the one list every route consumer
 * derives from. Add a page here and it exists everywhere at once.
 *
 * Consumers and their set arithmetic (keep this comment honest):
 *   App.tsx <Routes>            → ALL entries (+ its own `*` catch-all)
 *   scripts/inject-metadata.js  → non-hidden, aliases included   (og/meta per route + dist/sitemap.xml)
 *   generated sitemap.xml       → non-hidden, non-alias
 *   scripts/capture-screenshots → non-hidden, non-alias (+ its own 404 probe)
 * Note: like site.ts this is Node-consumed (native TS type stripping), so
 *       imports must stay relative with explicit .ts extensions no `@/`
 *       aliases and only erasable syntax.
 *
 * Before this file, four copies of "what pages exist" lived in four files and
 * drifted apart (scrapers saw different titles than visitors).
 */
import { SITE } from './site.ts';

export interface RouteDef {
  path: string;
  /** Canonical <title>/og:title. Omitted only on hidden/alias routes. */
  title?: string;
  description?: string;
  /** Structured-data type for <Schema>; unset = SEO's default (Person). */
  schemaType?: 'Person' | 'CreativeWork' | 'SoftwareApplication';
  /** App wraps the page in <DarkRoute> (theme locked dark). */
  dark?: boolean;
  /** Route exists in App only; excluded from injection, sitemap, screenshots. */
  hidden?: boolean;
  /** Renders the target's component and metadata; excluded from sitemap + screenshots. */
  aliasOf?: string;
  /** Required unless hidden/alias inject-metadata fails the build if missing. */
  sitemap?: { priority: number; lastmod: string };
  /** dist chunk-name prefixes to <link rel="modulepreload"> for this route. */
  preloadChunks?: string[];
  /** High-priority image to <link rel="preload"> (dist-relative path). */
  preloadImage?: string;
}

export const ROUTES = [
  {
    path: '/',
    title: `${SITE.name} ⋅ Home`,
    description: SITE.defaultDescription,
    sitemap: { priority: 1.0, lastmod: '2026-06-09' },
  },
  {
    path: '/project/spotify-engine',
    title: 'Spotify: Predictive Engine',
    description:
      'MSc Research artifact solving the cold-start problem through 3-dimensional hierarchical similarity and acoustic DNA modeling.',
    schemaType: 'CreativeWork',
    dark: true,
    sitemap: { priority: 0.9, lastmod: '2026-06-09' },
  },
  {
    path: '/project/sql-disaster',
    title: 'SQL Disaster Response System',
    description:
      'SQL case study: an 11-entity relational database modeling Philippine disaster relief logistics - composite keys, NTILE risk tiers, and a live D3 command dashboard. Full ERD inside.',
    schemaType: 'CreativeWork',
    dark: true,
    sitemap: { priority: 0.9, lastmod: '2026-06-09' },
  },
  {
    path: '/project/litestore',
    title: 'LiteStore ⋅ Retail-as-a-Service',
    description:
      'Production Next.js platform: 30+ statically prerendered routes, multi-tenant brand theming, GA4 telemetry, and a Google Sheets pipeline. Shipped solo to litestore.in.',
    schemaType: 'SoftwareApplication',
    dark: true,
    sitemap: { priority: 0.9, lastmod: '2026-06-09' },
  },
  {
    path: '/project/capital-budgeting',
    title: 'Capital Architecture Model',
    description:
      'Engineering a ₱581M feasibility engine for maritime dredging operations. A comparative study of cost-of-capital versus long-term asset yield. Full DCF model inside.',
    schemaType: 'SoftwareApplication',
    dark: true,
    sitemap: { priority: 0.9, lastmod: '2026-06-09' },
  },
  {
    path: '/project/hr-archetype',
    title: 'HR Archetype System',
    description:
      'AI-driven HR analytics: an 8-archetype retention engine that predicts employee attrition 90 days out using Gemini, Firestore, and a 13-axis diagnostic.',
    schemaType: 'SoftwareApplication',
    dark: true,
    sitemap: { priority: 0.9, lastmod: '2026-06-09' },
  },
  {
    path: '/the-long-version',
    title: `${SITE.name} ⋅ the long version`,
    description:
      "What's left when the work is done. A short paper on noticing things, building when bored, and why one obsession leads to another.",
    dark: true,
    sitemap: { priority: 0.7, lastmod: '2026-06-09' },
  },
  {
    path: '/f1',
    title: 'Off The Pace ⋅ Overview',
    description:
      'A causal ML engine isolating the true forces behind Formula 1 lap times - fuel mass, tyre degradation, dirty air, and driver skill  - down to the millisecond.',
    sitemap: { priority: 0.9, lastmod: '2026-06-09' },
    preloadChunks: ['OffThePaceOverview-', 'OverviewView-', 'FeaturedProjects-'],
    preloadImage: '/assets/audif1.avif',
  },
  {
    path: '/off-the-pace',
    title: 'Off The Pace ⋅ Architecture & Engineering',
    description:
      'The engineering behind the F1 Causal Pace Engine: 60 dbt models, 336 CI tests, 5 XGBoost models all beating baseline, and a Frisch-Waugh ghost car simulator.',
    sitemap: { priority: 0.8, lastmod: '2026-06-09' },
    preloadChunks: ['OffThePaceSource-', 'SourceView-'],
    preloadImage: '/assets/audif1.avif',
  },
  {
    path: '/connect',
    title: `${SITE.name} ⋅ Connect`,
    description: `Get in touch or save contact details for ${SITE.name}, ${SITE.role.split(' · ')[0]} based in ${SITE.location}.`,
    sitemap: { priority: 0.8, lastmod: '2026-06-09' },
  },
  {
    path: '/contact',
    aliasOf: '/connect',
  },
  {
    path: '/linkedin-banner',
    hidden: true,
    dark: true,
  },
  {
    path: '/studio',
    title: `Studio ⋅ ${SITE.name}`,
    description: `${SITE.name} UI/UX & visual design portfolio.`,
    dark: true,
    sitemap: { priority: 0.8, lastmod: '2026-07-04' },
  },
  {
    path: '/studio/crescendo',
    title: 'Crescendo Brand Identity ⋅ Justin Clarke',
    description:
      "Brand identity and editorial design for Crescendo GITAM University's flagship student magazine. Senior Illustrator across 120+ pages.",
    dark: true,
    sitemap: { priority: 0.9, lastmod: '2026-07-04' },
  },
  {
    path: '/studio/stroktalk',
    title: 'StrokTalk Speech Rehab App ⋅ Justin Clarke',
    description:
      'UX case study for StrokTalk an iOS speech-and-language rehabilitation app for stroke survivors with aphasia. Five training pillars, an AI doctor loop and accessibility-first design.',
    dark: true,
    sitemap: { priority: 0.9, lastmod: '2026-07-04' },
  },
] as const satisfies readonly RouteDef[];

export type RoutePath = (typeof ROUTES)[number]['path'];

const byPath = (path: string): RouteDef | undefined =>
  (ROUTES as readonly RouteDef[]).find(r => r.path === path);

/**
 * Per-page SEO props from the manifest: `<SEO {...routeMeta('/connect')} />`.
 * Resolves aliases to their target's metadata; the returned `path` stays the
 * one asked for (canonical URL per address, shared copy).
 */
export function routeMeta(path: RoutePath): {
  title: string;
  description: string;
  path: string;
  schemaType?: RouteDef['schemaType'];
} {
  const route = byPath(path);
  const target = route?.aliasOf ? byPath(route.aliasOf) : route;
  if (!route || !target || target.title === undefined || target.description === undefined) {
    throw new Error(`routeMeta: no metadata for route "${path}"`);
  }
  return {
    title: target.title,
    description: target.description,
    path: route.path,
    schemaType: target.schemaType,
  };
}
