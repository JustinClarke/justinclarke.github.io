# Architecture

How the portfolio is put together stack choices, file layout, design system, and routing.

**Live:** [justinclarke.github.io](https://justinclarke.github.io)

---

## Stack

| Layer | Tech | Version | Why |
|:---|:---|:---|:---|
| **Runtime** | React | 19.x | Concurrent rendering, `createRoot` |
| **Routing** | React Router | 7.x | Client-side with animated transitions |
| **Styling** | Tailwind CSS | 4.x | CSS-first `@theme` tokens, `@utility` directives |
| **Animation** | Framer Motion | 12.x | Spring physics, `AnimatePresence`, `useMotionValue` |
| **Modals** | Radix UI Dialog | 1.x | Accessible modal primitives |
| **SEO** | react-helmet-async | 3.x | Dynamic meta + JSON-LD structured data |
| **Icons** | Lucide React | 0.5.x | Tree-shakeable SVGs (explicit imports only never `import *`) |
| **Bundler** | Vite | 6.x | Sub-second HMR, esbuild minification, manual chunks |
| **Language** | TypeScript | 5.8 | `strict: true` |
| **Tests** | Vitest | 4.x | Terminal engine, NowPlaying, useAIAgent |
| **Lint** | ESLint 9 (flat) + custom gates | 9.x | typescript-eslint, jsx-a11y, react-hooks; token/route/prompt sync |

---

## Content layer (`src/content/`)

This is the template surface everything a fork needs to edit is here as typed TS objects. No CMS, no schema library. See [template.md](template.md) for the forker's path.

| File | What it owns |
|:---|:---|
| `site.ts` | Identity (name, role, email, socials, domain) + `integrations` each of `umami`/`lastFm`/`aiChat`/`contactForm` is config-or-`null`; `null` hides the feature, never crashes |
| `routes.ts` | **The route manifest.** Single source for `App.tsx` routes, metadata injection, the generated sitemap, and screenshots. `routeMeta('/path')` feeds each page's `<SEO>` |
| `home.ts` | Hero + closer copy |
| `career.ts` | Timeline entries (experience, education) |
| `projects.ts` | Project cards (bento grid, related-projects strip) |
| `terminal.ts` | Terminal copy: boot logs, command outputs, easter eggs, sudo escalation |
| `assistant.ts` | AI chat persona: voice, rules, canned answers, lore. Gets compiled into the worker prompt by `npm run build:prompt` |

`site.ts` and `routes.ts` are also imported by Node build scripts (native TS type stripping), so they keep zero non-relative imports and only erasable TypeScript syntax.

---

## Source layout

```
src/
├── app/
│   ├── App.tsx                    Root router (renders content/routes.ts manifest) +
│   │                              page transitions + preloader lifecycle
│   ├── main.tsx                   React 19 createRoot + BrowserRouter + RootProviders
│   └── providers/
│       ├── RootProviders.tsx      HelmetProvider → ThemeProvider → MotionConfig
│       │                          (reducedMotion="user") → ErrorBoundary → ModalProvider
│       ├── ThemeProvider.tsx      Light/dark theme context (useTheme hook)
│       ├── ModalProvider.tsx      Contact-modal context (useModal hook)
│       └── index.ts
│
├── content/                       ★ The template surface see section above
│
├── pages/
│   ├── home/
│   │   ├── Home.tsx               Home composition: Hero + lazy below-fold sections
│   │   ├── CareerTimeline.tsx     Accordion career dossier
│   │   ├── TimelineCard.tsx       One expandable timeline entry
│   │   ├── YearProgressBar.tsx    Career progress rail
│   │   ├── ExpertisePipeline/     DAG skill visualization (orchestrator, data,
│   │   │                          DagEdge, SkillColumn)
│   │   ├── bento/                 Featured-projects grid + widgets
│   │   │   ├── FeaturedProjects.tsx  Bento grid orchestrator (own card shell + cycle)
│   │   │   ├── F1TelemetryWidget.tsx + f1/ (HudHeader, ControlsBar, TrackMap,
│   │   │   │                          TelemetryPanel, CausalPanel, StatusBar)
│   │   │   ├── useF1Telemetry.ts  Simulation state + interval loops (page-scoped)
│   │   │   ├── f1.ts              Telemetry data
│   │   │   └── LiteStore/Spotify/SqlDisaster/BehaviouralRisk widgets
│   │   └── Hero/
│   │       ├── index.tsx          Terminal orchestrator
│   │       ├── engine.ts          Pure TS command engine (zero React, unit-tested)
│   │       ├── games/             SnakeGame, PongGame, SpaceInvadersGame, TetrisGame
│   │       └── ui/                WindowChrome, TerminalHeader, TerminalBody,
│   │                              SidebarMenu, CommandButton, CommandPalette,
│   │                              ProjectShowcase, Typewriter, visuals
│   │
│   ├── off-the-pace/              F1 case study (self-contained page module)
│   │   ├── OffThePaceOverview.tsx /f1 route
│   │   ├── OffThePaceSource.tsx   /off-the-pace route
│   │   ├── data/                  projectStats, caseStudies, decompositions
│   │   └── components/            views/, sections/, ui/ (~30 files)
│   │
│   ├── projects/                  5 case study pages
│   │   ├── SpotifyEnginePage.tsx  /project/spotify-engine
│   │   ├── SqlDisasterPage/       /project/sql-disaster (+ SqlErd satellite)
│   │   ├── HRArchetypePage.tsx    /project/hr-archetype
│   │   ├── LiteStorePage.tsx      /project/litestore
│   │   └── CapitalBudgetingPage.tsx /project/capital-budgeting
│   │
│   ├── studio/                    Design portfolio pages
│   │   ├── StudioPage.tsx         /studio index
│   │   ├── CrescendoPage.tsx      /studio/crescendo (lazy pdf.js viewer)
│   │   ├── StrokTalkPage.tsx      /studio/stroktalk
│   │   └── shared.tsx             SectionLabel shared by both case studies
│   │
│   ├── Connect.tsx                /connect (+ /contact alias)
│   ├── TheLongVersion.tsx         /the-long-version (light-themed editorial)
│   ├── LinkedinBannerPage.tsx     /linkedin-banner (hidden utility route)
│   └── NotFound.tsx               404 catch-all
│
├── components/
│   ├── NowPlaying.tsx             Last.fm now-playing pill (hidden when lastFm: null)
│   ├── analytics/                 Analytics.tsx (Umami loader, prod-only) _docs/analytics.md
│   ├── layout/                    SEO, Schema, Preloader, CustomCursor, TheCloser,
│   │                              CommandDock, AIChatDrawer, GlobalSpotlight
│   ├── modals/                    ContactModal (Radix), ContactForm (→Web3Forms), EmailModal
│   └── projects/                  RelatedProjects (other-projects strip)
│
├── ui/                            Reusable primitives see table below
├── hooks/                         Shared hooks see list below
├── config/                        animations (SPRINGS/EASING), constants (JS hex home)
├── utils/                         cn, debug, metrics, scroll, tooltips, tooltipContent, track
├── types/                         index.ts (shared interfaces), terminal.ts (TerminalLine)
├── vite-env.d.ts                  import.meta.env types (VITE_DEBUG only)
└── index.css                      Design token system: @theme + @utility + keyframes (~2,750 ln)
```

**Shared hooks** (`src/hooks/`): `useAIAgent` (worker chat streaming), `useFirstVisit`, `useLastFm`, `useMousePositionMotion`, `useParallax`, `useReducedMotion`, `useSpotlight`, `useTerminalBoot`, `useTerminalSession`. Theme and modal state come from providers (`useTheme`, `useModal`). `useF1Telemetry` is page-scoped lives with its consumer in `pages/home/bento/`.

---

## Design system

### Colours light/dark

Every Tailwind colour utility resolves to `var(--color-*)` at runtime. Dark values are the `@theme` defaults; `:root:not(.dark)` swaps them for light, and `[data-theme-lock="dark"]` pins surfaces that must stay dark regardless (terminal, games, F1 telemetry, project pages, studio).

**Theme-flipping tokens:**

| Token | Dark | Light | Utility |
|:---|:---|:---|:---|
| `--color-surface` | `#050505` | `#ffffff` | `bg-surface` (page) |
| `--color-surface-2` | `#0c0c0c` | `#f5f5f5` | `bg-surface-2` (cards) |
| `--color-surface-3` | `#111111` | `#ffffff` | `bg-surface-3` (elevated/modal) |
| `--color-fg` | `#ffffff` | `#0a0a0a` | `text-fg` (flat hex so `/N` opacity works) |
| `--color-fg-soft` | white/70 | black/70 | `text-fg-soft` |
| `--color-fg-mid` | white/55 | black/58 | `text-fg-mid` (AA floor for flipping content) |
| `--color-fg-faint` | white/40 | black/45 | `text-fg-faint` (decorative only) |
| `--color-edge` | white/8 | black/10 | `border-edge` |
| `--color-edge-soft` | white/5 | black/2.5 | `border-edge-soft` |

**White-alpha text ramp** (fixed doesn't theme-flip; for dark-locked surfaces). Contrast measured against `#050505`:

| Token | Alpha | Contrast | Role |
|:---|:---|:---|:---|
| `text-text-primary` | /92 | ≈17:1 | Default voice |
| `text-text-secondary` | /70 | ≈10:1 | Supporting copy |
| `text-text-tertiary` | /55 | ≈6.3:1 | **The AA floor** smallest legal content colour |
| `text-text-ghost` | /35 | ≈2.9:1 | Decorative only |
| `text-text-dim` | /15 | | Texture: dividers, watermarks |
| `text-text-muted` | /10 | | Texture: faintest register (dot grids) |

**Brand tokens** (invariant): `--color-brand-primary` `#00c8b4` (accents), `--color-brand-bg` `#050505`, `--color-brand-card` `#0c0c0c`, `--color-f1-red` `#E10600` (Off The Pace).

### Type ramp

Body copy uses the standard Tailwind scale. The dense HUD/telemetry register uses the ramp below **10px is the floor**, enforced by the token gate:

| Token | Size | Used for |
|:---|:---|:---|
| `text-micro` | 10px | The floor HUD labels, telemetry |
| `text-fine` | 11px | Dense UI copy, fine print |
| `text-caption` | 12px | Captions, annotations |
| `text-label` | 13px | Form labels, nav copy |
| `text-display` | 80px | Game countdown numerals |

All four dense sizes share `line-height: 1.4` so swapping between them doesn't reflow. Uppercase micro-labels get `tracking-mega` (0.2em) / `tracking-ultra` (0.3em). One-off sizes ≥10px can stay arbitrary; a size used twice becomes a token.

### Theme toggle

`ThemeProvider` stores preference in `localStorage['theme']`, falls back to `prefers-color-scheme`, then dark. A blocking inline script in `<head>` reads the stored value before first paint (no FOUC). `ThemeToggle` lives in `src/ui/ThemeToggle.tsx`, placed in `SidebarMenu`.

### Typography

Fonts load from Google Fonts CDN, weight sets trimmed to what the site actually uses. The Crescendo studio page self-hosts its display faces as woff2 `@font-face`.

| Context | Font | Token | Notes |
|:---|:---|:---|:---|
| Section headings | Noto Sans | `font-noto` | 400–900 + italic 900 |
| Body / UI | Inter | `font-sans` | 300–700 |
| Terminal / metadata | IBM Plex Mono | `font-mono` | Technical voice |
| F1 / OTP telemetry | JetBrains Mono | `font-jetbrains` | Deferred-loaded |
| Serif accents | DM Serif Text | `font-serif` | Editorial voice |
| Italic accents | Playfair Display | `font-playfair` | 800 italic |
| LinkedIn banner | Outfit | | Utility page only |

### Spacing tokens

| Token | Mobile | Desktop | Utility |
|:---|:---|:---|:---|
| Section Y | `5rem` | `7rem` | `.section-layout` |
| Container X | `2rem` | `4rem` | `.container-layout` |
| Narrative gap | `3rem` | `4.5rem` | `.narrative-gap` |
| Component gap | `1.5rem` | `2rem` | `.component-gap` |

### Tailwind token contract

Full contract in [patterns.md](patterns.md#tailwind-token-contract); the gate (`scripts/check-tailwind-tokens.mjs`) enforces three floors in CI:

1. No raw hex for tokenised colours use the utility (`text-f1-red`) or CSS var.
2. New colours used ≥2 times become `@theme` tokens before the second use.
3. Content text comes from the semantic ramps, never below AA (`text-text-tertiary` / `fg-mid` is the floor).
4. JS hex constants live in `src/config/constants.ts` only.
5. Static inline styles → utilities; dynamic values via CSS vars: `style={{ '--accent': accent }}` + `className="bg-(--accent)"`.

---

## Route table

Built from `src/content/routes.ts` this is the human-readable version, and `scripts/check-route-sync.mjs` (part of `npm run lint`) fails if the two disagree.

| Path | Component | Notes |
|:---|:---|:---|
| `/` | `Home` | Preloader on first desktop visit |
| `/project/spotify-engine` | `SpotifyEnginePage` | dark |
| `/project/sql-disaster` | `SqlDisasterPage` | dark; interactive ERD |
| `/project/litestore` | `LiteStorePage` | dark |
| `/project/capital-budgeting` | `CapitalBudgetingPage` | dark |
| `/project/hr-archetype` | `HRArchetypePage` | dark |
| `/the-long-version` | `TheLongVersionPage` | dark; slower transition |
| `/f1` | `OffThePaceOverview` | F1 case study visual presentation |
| `/off-the-pace` | `OffThePaceSource` | F1 case study technical/data read |
| `/connect` | `ConnectPage` | |
| `/contact` | `ConnectPage` | `aliasOf: '/connect'` same page, own canonical URL |
| `/linkedin-banner` | `LinkedinBannerPage` | `hidden` excluded from injection, sitemap, screenshots |
| `/studio` | `StudioPage` | dark |
| `/studio/crescendo` | `CrescendoPage` | dark |
| `/studio/stroktalk` | `StrokTalkPage` | dark |
| `*` | `NotFound` | App.tsx catch-all (not a manifest entry) |

Every route component is `React.lazy()` Vite chunks each one separately, and the home page lazy-loads below-fold sections too. `App.tsx` maps the manifest through `ROUTE_COMPONENTS: Record<RoutePath, ComponentType>`, which is exhaustive both ways: adding a manifest entry without a component (or deleting a route and leaving its mapping) is a compile error.

Adding a route touches three places: the manifest entry, the lazy import, and the `ROUTE_COMPONENTS` line. Sitemap, metadata injection, and screenshots follow automatically.

### Page transitions

Dual-phase state machine in `App.tsx`: fade-out → scroll reset → fade-in. The scroll reset fires after exit so the jump is hidden. Safari-specific: scroll only fires if `document.visibilityState === 'visible'` (prevents jump on tab switch).

| Class | Animation | Duration |
|:---|:---|:---|
| `.page-enter` | `translateY(15px) → 0` + fade | 1.0s |
| `.page-enter-slow` | `translateY(20px) → 0` + fade | 1.6s |
| `.page-exit` | fade + `translateY(-15px)` | 0.4s |
| `.page-exit-slow` | fade + `translateY(-20px)` | 0.6s |

### SPA routing on GitHub Pages

`public/404.html` encodes unknown paths into query strings (`/?/project/litestore`). An inline script in `index.html` decodes them with `history.replaceState` before React mounts, stripping trailing slashes along the way.

---

## UI primitives (`src/ui/`)

No business logic just rendering and visual behaviour. All accept `className` for extension.

| Component | File | What it does |
|:---|:---|:---|
| `SpotlightCard` | `SpotlightCard.tsx` | Cursor-tracking radial gradient on hover |
| `MagneticButton` | `MagneticButton.tsx` | Framer Motion scale on hover/tap |
| `ScrollReveal` | `ScrollReveal.tsx` | Fade/slide entrance on scroll; plain div under reduced motion |
| `SectionContainer` | `SectionContainer.tsx` | Semantic `<section>` with spacing tokens |
| `Badge` | `Badge.tsx` | Pill-shaped status badge |
| `TechStack` | `TechStack.tsx` | Tech-pill strip for case study pages |
| `ThemeToggle` | `ThemeToggle.tsx` | Sun/moon toggle, calls `useTheme().toggle` |
| `BackToTerminal` | `BackToTerminal.tsx` | Nav link back to hero terminal |
| `ErrorBoundary` | `ErrorBoundary.tsx` | Class-based error boundary at root |
| `SkeletonLoader` | `SkeletonLoader.tsx` | Shimmer placeholder (text / card / grid) |
| `InteractiveHint` | `InteractiveHint.tsx` | Desktop/mobile hover-instruction chip |
| `FireParticles` | `FireParticles.tsx` | Canvas particle effect (SQL Disaster hero) |

**Performance notes:**
- `SpotlightCard` uses CSS vars (`--mouse-x/y`) bound to `MotionValue` the gradient moves without React re-renders.
- `ScrollReveal` renders a plain `div` (no observers, no transforms) when `useReducedMotion()` is true.
- `ThemeToggle` respects `useReducedMotion()` for its icon crossfade.
