# Architecture

Consolidated reference for the portfolio's structure, design system, routing, and UI primitives.

**Live:** [justinclarke.github.io](https://justinclarke.github.io)

---

## Stack at a glance

| Layer | Technology | Version | Rationale |
|:---|:---|:---|:---|
| **Runtime** | React | 19.x | Concurrent rendering, `createRoot` |
| **Routing** | React Router | 7.x | Client-side routing with animated transitions |
| **Styling** | Tailwind CSS | 4.x | CSS-first `@theme` tokens, `@utility` directives |
| **Animation** | Framer Motion | 12.x | Spring physics, `AnimatePresence`, `useMotionValue` |
| **Modals** | Radix UI Dialog | 1.x | Accessible modal primitives |
| **SEO** | react-helmet-async | 3.x | Dynamic meta tags + JSON-LD structured data |
| **Icons** | Lucide React | 0.5.x | Tree-shakeable SVG icons |
| **Bundler** | Vite | 6.x | Sub-second HMR, esbuild minification, manual chunks |
| **Language** | TypeScript | 5.8 | Strict mode enforcement |

---

## Source layout

```
src/
├── app/
│   ├── App.tsx                    Root router + page transitions + preloader lifecycle
│   ├── main.tsx                   React 19 createRoot + BrowserRouter + RootProviders
│   └── providers/
│       ├── RootProviders.tsx      HelmetProvider → ThemeProvider → ErrorBoundary → ModalProvider
│       ├── ThemeProvider.tsx      Light/dark theme context (useTheme hook)
│       ├── ModalProvider.tsx      Contact-modal context (useModal hook)
│       └── index.ts
│
├── pages/
│   ├── home/
│   │   ├── Home.tsx               Home composition: Hero + 4 lazy sections
│   │   ├── CareerTimeline.tsx     Accordion career dossier
│   │   ├── TimelineCard.tsx       One expandable timeline entry
│   │   ├── YearProgressBar.tsx    2018→2028 career progress rail
│   │   ├── TheCloser.tsx          Footer contact section (also re-exported from components/layout)
│   │   ├── ExpertisePipeline/
│   │   │   ├── index.tsx          DAG skill visualization orchestrator
│   │   │   ├── data.ts            SKILLS, ALL_EDGES, NARRATIVES constants
│   │   │   ├── DagEdge.tsx        Single SVG cubic-bezier edge
│   │   │   └── SkillColumn.tsx    One stage column of skill cards
│   │   └── Hero/
│   │       ├── index.tsx          Terminal orchestrator
│   │       ├── engine.ts          Pure TS command engine (zero React)
│   │       ├── SnakeGame.tsx      Embedded snake game
│   │       └── ui/                WindowChrome, TerminalHeader, TerminalBody,
│   │                              SidebarMenu, CommandButton, ProjectShowcase
│   │
│   ├── off-the-pace/              F1 case study self-contained page module
│   │   ├── OffThePaceOverview.tsx /f1 route
│   │   ├── OffThePaceSource.tsx   /off-the-pace route
│   │   ├── data/projectStats.ts   F1 project metrics (single source of truth)
│   │   └── components/
│   │       ├── views/             OverviewView, SourceView
│   │       ├── sections/          ~12 content sections
│   │       └── ui/                OffThePacePreloader, ExpandableTabs, etc.
│   │
│   ├── projects/                  5 standard case study pages (all barrels → folder/index.tsx)
│   │   ├── SpotifyEnginePage/     /project/spotify-engine
│   │   ├── SqlDisasterPage/       /project/sql-disaster (+ SqlErd component)
│   │   ├── HRArchetypePage/       /project/hr-archetype
│   │   ├── LiteStorePage.tsx      /project/litestore
│   │   └── CapitalBudgetingPage.tsx /project/capital-budgeting
│   │
│   ├── Connect.tsx                /connect + /contact
│   ├── TheLongVersion.tsx         /the-long-version (light-themed editorial)
│   └── NotFound.tsx               404 catch-all
│
├── components/
│   ├── NowPlaying.tsx             Last.fm now-playing pill
│   ├── analytics/                 Analytics.tsx (Umami loader, prod-only) see _docs/analytics.md
│   ├── layout/                    BackToTop, SEO, Schema, Preloader, CustomCursor, TheCloser
│   │   └── TheCloser.tsx          Re-exports from pages/home/TheCloser
│   ├── modals/                    ContactModal (Radix), ContactForm (→Web3Forms), EmailModal
│   ├── projects/
│   │   ├── FeaturedProjects.tsx   Home bento grid
│   │   ├── RelatedProjects.tsx    Other-projects strip
│   │   ├── SqlErd.tsx             Interactive SVG ERD
│   │   └── bento/                 BentoCard (tile shell), ProjectIcon
│   └── bento/                     Content widgets (F1Telemetry, LiteStore, Spotify, etc.)
│       └── f1/                    HudHeader, ControlsBar, TrackMap, TelemetryPanel, CausalPanel
│
├── ui/                            Reusable primitives (SpotlightCard, MagneticButton,
│                                  ScrollReveal, SectionContainer, Badge, ThemeToggle,
│                                  BackToTerminal, ErrorBoundary, SkeletonLoader,
│                                  ConfirmPrompt, FireParticles, InteractiveHint)
│
├── hooks/                         useF1Telemetry, useTheme (via providers), useReducedMotion,
│                                  useParallax, useSpotlight, useMousePositionMotion,
│                                  useLastFm, useBentoCycle, useTerminalBoot,
│                                  useTerminalSession, useFirstVisit
│
├── data/                          portfolio, projects, skills, f1, bento, timeline
├── config/                        animations, constants (JS hex values), tooltips
├── utils/                         animations, scroll, tooltips, metrics, track (Umami), cn
├── types/                         All TypeScript interfaces (index.ts)
├── vite-env.d.ts                  import.meta.env types (incl. VITE_UMAMI_*)
└── index.css                      Design token system: @theme + @utility + keyframes (~2,200 ln)
```

---

## Design system

### Colour tokens light/dark model

Every Tailwind colour utility resolves to `var(--color-*)` at runtime. Overriding those custom properties under `:root.dark` / `:root:not(.dark)` flips every token-based utility for free, with zero markup changes.

**Semantic adaptive tokens** (flip with theme):

| Token | Dark | Light |
|:---|:---|:---|
| `--surface-primary` | `#050505` | `#ffffff` |
| `--surface-secondary` | `#0c0c0c` | `#f5f5f5` |
| `--surface-elevated` | `#111111` | `#ffffff` |
| `--text-base` | `#ffffff` | `#000000` |
| `--text-secondary` | `rgba(255,255,255,0.7)` | `rgba(0,0,0,0.7)` |
| `--text-tertiary` | `rgba(255,255,255,0.4)` | `rgba(0,0,0,0.4)` |
| `--border-default` | `rgba(255,255,255,0.08)` | `rgba(0,0,0,0.08)` |
| `--border-subtle` | `rgba(255,255,255,0.05)` | `rgba(0,0,0,0.05)` |

Tailwind utilities: `bg-surface-primary`, `text-text-base`, `border-border-default`, etc.

**Always-dark brand tokens** (invariant):

| Token | Value | Usage |
|:---|:---|:---|
| `--color-brand-primary` | `#00c8b4` | Interactive accents, active states |
| `--color-brand-bg` | `#050505` | Hard dark bg for always-dark sections |
| `--color-brand-card` | `#0c0c0c` | Card surfaces in always-dark contexts |
| `--color-f1-red` | `#E10600` | F1 / Off The Pace accent |

**Always-dark sections** use `data-theme-lock="dark"` (F1 telemetry widget, terminal hero, Off The Pace). Project case-study pages respond to the full theme toggle.

### Theme toggle

`ThemeProvider` stores preference in `localStorage['theme']`. Falls back to `prefers-color-scheme`, then dark. A blocking inline script in `<head>` reads the stored value before first paint (FOUC guard). `ThemeToggle` component lives in `src/ui/ThemeToggle.tsx` placed in `SidebarMenu`.

### Typography

| Context | Font | Weight | Notes |
|:---|:---|:---|:---|
| Section headings | Noto Sans | 900 | Cinematic impact |
| Body / UI | Inter | 300–700 | High-readability sans |
| Italic accents | Playfair Display | 800 italic | Premium contrast in technical text |
| Terminal / metadata | IBM Plex Mono | 400–700 | Technical voice |
| F1 / OTP telemetry | JetBrains Mono | 400–700 | Deferred-loaded |

### Spacing tokens

| Token | Mobile | Desktop | Utility |
|:---|:---|:---|:---|
| Section Y | `5rem` | `7rem` | `.section-layout` |
| Container X | `2rem` | `4rem` | `.container-layout` |
| Narrative gap | `3rem` | `4.5rem` | `.narrative-gap` |
| Component gap | `1.5rem` | `2rem` | `.component-gap` |

### Tailwind token contract

1. No raw hex for tokenised colours use the utility (`text-f1-red`) or CSS var (`var(--color-f1-red)`).
2. New colours used ≥2 times must become `@theme` tokens before the second use.
3. JS hex constants live in `src/config/constants.ts` only. Audited by `scripts/check-tailwind-tokens.mjs`.
4. Static inline styles → utilities (`style={{ zIndex: 40 }}` → `z-40`).
5. Dynamic values via CSS vars: `style={{ '--accent': accent }}` + `className="bg-(--accent)"`.

---

## Route table

| Path | Component | Notes |
|:---|:---|:---|
| `/` | `Home` | Preloader on first desktop visit |
| `/project/spotify-engine` | `SpotifyEnginePage` | |
| `/project/sql-disaster` | `SqlDisasterPage` | Includes interactive ERD |
| `/project/litestore` | `LiteStorePage` | |
| `/project/capital-budgeting` | `CapitalBudgetingPage` | |
| `/project/hr-archetype` | `HRArchetypePage` | |
| `/f1` | `OffThePaceOverview` | F1 case study visual presentation |
| `/off-the-pace` | `OffThePaceSource` | F1 case study technical/data read |
| `/the-long-version` | `TheLongVersionPage` | Light-themed editorial; slower transition |
| `/connect`, `/contact` | `ConnectPage` | |
| `*` | `NotFound` | |

Every route component is `React.lazy()` Vite creates a separate bundle chunk per lazy import. Home page runs a second layer of lazy loading for below-fold sections. `inject-metadata.js` must be updated when routes are added/removed.

### Page transitions

Dual-phase state machine in `App.tsx`: fade-out → scroll reset → fade-in. Scroll reset fires after the exit animation so the jump is hidden in the dark. Safari-specific: scroll only fires if `document.visibilityState === 'visible'` to prevent jump on tab switch.

| Class | Animation | Duration |
|:---|:---|:---|
| `.page-enter` | `translateY(15px) → 0` + fade | 1.0s |
| `.page-enter-slow` | `translateY(20px) → 0` + fade | 1.6s |
| `.page-exit` | fade + `translateY(-15px)` | 0.4s |
| `.page-exit-slow` | fade + `translateY(-20px)` | 0.6s |

### GitHub Pages SPA routing

`public/404.html` encodes unknown paths into query strings (`/?/project/litestore`). The `index.html` inline script decodes them back with `history.replaceState` before React mounts, automatically stripping trailing slashes to keep URLs clean and normalized.

---

## UI primitives (`src/ui/`)

No business logic rendering and visual behaviour only. Every component accepts `className` for extension.

| Component | File | Purpose |
|:---|:---|:---|
| `SpotlightCard` | `SpotlightCard.tsx` | Cursor-tracking radial gradient spotlight on card hover |
| `MagneticButton` | `MagneticButton.tsx` | Framer Motion scale physics on hover/tap |
| `ScrollReveal` | `ScrollReveal.tsx` | IntersectionObserver-based fade/slide reveal |
| `SectionContainer` | `SectionContainer.tsx` | Semantic `<section>` wrapper applying spacing tokens |
| `Badge` | `Badge.tsx` | Pill-shaped status badge with variant styles |
| `ThemeToggle` | `ThemeToggle.tsx` | Sun/moon icon button; calls `useTheme().toggle` |
| `BackToTerminal` | `BackToTerminal.tsx` | Navigation link back to hero terminal section |
| `ErrorBoundary` | `ErrorBoundary.tsx` | Class-based React error boundary at the root |
| `SkeletonLoader` | `SkeletonLoader.tsx` | Shimmer placeholder (text / card / project-grid) |
| `InteractiveHint` | `InteractiveHint.tsx` | Desktop/mobile hover-instruction chip |
| `FireParticles` | `FireParticles.tsx` | Canvas particle effect (SQL Disaster hero) |

**Performance rules:**
- `SpotlightCard` uses CSS vars (`--mouse-x/y`) bound to `MotionValue` gradient repositions without React re-renders.
- `ScrollReveal` uses native `IntersectionObserver`, not scroll event listeners.
- `ThemeToggle` respects `useReducedMotion()` for the icon crossfade animation.
