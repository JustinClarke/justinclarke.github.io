/**
 * content/site.ts WHO this site belongs to and WHAT services it talks to.
 * Fork the repo? This is the first file you edit.
 *
 * Fits in: imported by components (via @/content), by routes.ts, and by the
 *          Node build scripts (inject-metadata, build-system-prompt) directly.
 * Note:    this file is consumed by Node build scripts through native TS type
 *          stripping, so it must keep ZERO imports and use only erasable
 *          TypeScript syntax (no enums, no `@/` aliases). No import.meta.env
 *          either Node can't evaluate it.
 */

/**
 * The graceful-degradation contract: each integration is either a config
 * object (feature ON) or `null` (feature OFF). Consumers must render nothing
 * / hide the entry point when their integration is null never crash.
 *   umami: null  → Analytics renders nothing
 *   lastFm: null → NowPlaying renders nothing
 *   aiChat: null → CommandDock AI button hidden, terminal `ask` prints a
 *                  "not configured on this deployment" line
 *   contactForm: null → contact modal drops the form and falls back to a
 *                  plain "email me" panel
 */
export interface SiteConfig {
  /** Full display name, used in titles and schema. */
  name: string;
  /** Split needed by the Connect page's vCard (N: field wants last;first). */
  firstName: string;
  lastName: string;
  role: string;
  tagline: string;
  /** Canonical origin, no trailing slash. */
  url: string;
  /** Bare host, e.g. for the Umami data-domains attribute. */
  domain: string;
  email: string;
  location: string;
  timezone: string;
  social: {
    /** github.com/<github> */
    github: string;
    /** linkedin.com/in/<linkedin> */
    linkedin: string;
    /** cal.com/<cal> */
    cal: string;
  };
  /** Public path to the downloadable resume. */
  resumePdf: string;
  /** <title> / og:title fallback when a page sets none. */
  defaultTitle: string;
  /** Meta description fallback when a page sets none. */
  defaultDescription: string;
  /** Public path to the share image (1200×630). */
  ogImage: string;
  ogImageAlt: string;
  integrations: {
    umami: { websiteId: string; src: string } | null;
    lastFm: { username: string; apiKey: string } | null;
    aiChat: { workerUrl: string } | null;
    contactForm: { web3formsKey: string } | null;
  };
}

// Typed as SiteConfig, not `as const satisfies SiteConfig`: the latter keeps
// each `integrations` field narrowed to whatever literal is written here, so
// the moment a fork sets one to `null` (the documented, encouraged way to
// turn a feature off), consumer code doing `if (SITE.integrations.x)` was
// narrowing against a bare `null` type and failing to compile (`never`) on
// the truthy branch. An explicit `SiteConfig` annotation keeps every field at
// its real union type regardless of which literal is chosen.
export const SITE: SiteConfig = {
  name: 'Justin Clarke',
  firstName: 'Justin',
  lastName: 'Clarke',
  role: 'Analytics Engineer · Full-Stack',
  tagline: 'Data to decisions & decisions into products',
  url: 'https://justinclarke.github.io',
  domain: 'justinclarke.github.io',
  email: 'justinsavioclarke@outlook.com',
  location: 'Dubai, UAE',
  timezone: 'Asia/Dubai',
  social: {
    github: 'JustinClarke',
    linkedin: 'justinsavioclarke',
    cal: 'justinclarke',
  },
  resumePdf: '/resources/JustinClarke_resume.pdf',
  defaultTitle: 'Justin Clarke ⋅ Analytics Engineer ⋅ Full-Stack',
  defaultDescription:
    'Portfolio of Justin Clarke. Case studies in analytics engineering, data architecture, and high-fidelity data systems - built with SQL, Python, and React.',
  ogImage: '/assets/og.png',
  ogImageAlt: 'Justin Clarke - Analytics Engineer portfolio',
  integrations: {
    umami: {
      websiteId: '066d3deb-ac4b-494d-9eb8-c3fe3c42e22d',
      src: 'https://cloud.umami.is/script.js',
    },
    // The Last.fm API key is public-by-design: it already ships in the client
    // bundle today, and Last.fm keys are read-only scrobble lookups.
    lastFm: {
      username: 'justincalrke', // (sic) that spelling is the real account
      apiKey: '8322aaa4ef7c1cfe94f42acdf682c940',
    },
    aiChat: {
      workerUrl: 'https://portfolio-ai.justinclarke.workers.dev',
    },
    // Web3Forms access keys are public-by-design (they ship in the client
    // bundle and only route mail to the account that owns the key).
    contactForm: {
      web3formsKey: '6b1b9e0e-0b29-4780-8840-a38403e63790',
    },
  },
};
