# Patterns & Operations

How the trickier parts work, the animation system, and the build pipeline.

---

## Engineering patterns

### Terminal engine (`Hero/engine.ts`)

Pure TypeScript, zero React dependencies testable in complete isolation.

- **Registry pattern.** `COMMANDS` maps command strings to handlers that return `{ lines: TerminalLine[]; effect? }`. Side effects (scroll, contact, download, game launches) come back as a discriminator `Hero.tsx` reads that and dispatches. The engine never touches the DOM.
- **Logic/copy split.** Static output blocks, easter eggs, and personality all live in `src/content/terminal.ts`. The engine only has dynamic logic (argument parsing, sudo escalation, fuzzy guessing). A fork rewrites the words without touching the engine.
- **Boot sequence.** Seven phases driven from `TerminalHeader.tsx`, gated on the preloader (via `sessionStorage.preloader_shown`, written synchronously by `App.tsx`). Staggered reveals use CSS `animation-delay` no `async/await` loop.
- **Output typing.** Lines are pushed to React state immediately. The "typing" effect is pure CSS `animation-delay` staggers on individual spans.

### Content layer & degradation contract

`src/content/site.ts` declares every third-party integration as config-or-`null`:

| Integration | When `null` |
|:---|:---|
| `umami` | `<Analytics>` renders nothing |
| `lastFm` | `<NowPlaying>` renders nothing |
| `aiChat` | CommandDock AI button hidden; terminal `ask` says "not configured" |
| `contactForm` | Contact modal drops the form, shows a plain "email me" panel |

Consumers hide their entry point they don't crash. This is what makes the repo forkable: a deployment with zero external services still builds and renders properly (unit tests cover the null paths).

`src/content/routes.ts` is the route manifest. `App.tsx`, `scripts/inject-metadata.js` (per-route meta + sitemap), and `scripts/capture-screenshots.js` all derive from it, and `scripts/check-route-sync.mjs` keeps the docs' route table honest in CI. Pages pull metadata with `<SEO {...routeMeta('/path')} />`.

### SQL ERD connector (`SqlErd.tsx`)

Cubic Bezier paths link entities: `M x1,y1 C x1+40,y1 x2-40,y2 x2,y2`. The ±40px control offsets keep curves readable for nearby tables. Crow's-foot markers at the one-to-many end. FK lines inherit the source table's accent colour.

### DAG edge system (`ExpertisePipeline/DagEdge.tsx`)

Edges are SVG `<path>` elements with coordinates from `getBoundingClientRect()` at render time. A `ResizeObserver` on the grid container increments a tick counter to force re-renders after layout changes, keeping edge geometry accurate.

### Scroll-driven reveal (`ui/ScrollReveal.tsx`)

Framer Motion `whileInView`: content fades and slides in (default 20px, `direction` picks the axis, `delay`/`once`/`threshold` tune it) on first scroll into view. Under `prefers-reduced-motion`, it renders a plain `div` content visible immediately, no observers, no transforms. Used in about 14 places across the site.

### Elevator scroll (`utils/scroll.ts`)

Custom scroll-to-section with exponential in-out easing (factor 20 for dramatic accel/decel). Calculates target offset once on activation, not every frame. Falls back to instant `scrollTo` under reduced motion.

### Provider pattern

`HelmetProvider`, `ThemeProvider`, `MotionConfig reducedMotion="user"`, `ErrorBoundary`, and `ModalProvider` stack above the router in `RootProviders.tsx`. Consumed via hooks (`useModal()`, `useTheme()`). The `MotionConfig` layer degrades every Framer Motion animation to instant under `prefers-reduced-motion` in one move.

### F1 hook/widget separation (`useF1Telemetry` + `F1TelemetryWidget`)

All simulation state and interval loops live in `useF1Telemetry()`. `F1TelemetryWidget.tsx` is a pure renderer consuming the hook and sub-components from `bento/f1/`. The only DOM-bound logic left in the widget is a `scrollTop` effect for the log container (needs a ref the hook can't hold). Both live in `pages/home/bento/` page-scoped, not shared.

### Performance

Measured numbers live in [baseline-2026-07.md](baseline-2026-07.md) (Lighthouse, simulated throttling, `npm run preview`): as of the 2026-07-05 pass, simulated-mobile LCP is 4.9–6.2s and page weight 564–826KB across four measured pages (worst pre-audit case was 25.5MB / 125.7s on `/studio/crescendo`), with CLS ≤ 0.006 and TBT ≤ 110ms everywhere; `/` desktop LCP ≈ 2.1s. It's a no-SSR SPA, so FCP ≈ LCP ≈ TTI and the lever is the critical chunk chain.

A few rules I stick to:
- **No global `will-change`** Safari has a finite compositor budget and evicts layers. Only apply it to elements animating continuously for >5 seconds.
- **`useMotionValue` over `useState`** for per-frame updates bypasses React's render loop.
- **Never `import *` from lucide-react** a wildcard once put the entire icon library (~150KB gz) on every page.

---

## Animation system

### Framer Motion (`config/animations.ts`)

```typescript
SPRINGS = {
  soft:   { type: 'spring', stiffness: 100, damping: 20 },
  snappy: { type: 'spring', stiffness: 300, damping: 30 },
}

EASING = {
  quintic:  [0.16, 1, 0.3, 1],   // Smooth deceleration
  smooth:   [0.22, 1, 0.36, 1],  // General smooth
}
```

`AnimatePresence` with `mode="wait"` handles the F1 panel crossfade and `ThemeToggle` icon swap. Preloader exit uses `blur(20px)` + `scale(1.05)` + 1.8s quintic ease.

### CSS keyframes (`index.css`)

40+ keyframes covering:
- **Page transitions:** `page-fade-in/out` (`translateY` ± 15px + opacity)
- **Breathing / pulse:** `pulse-opacity`, `breathe`, `dotPulse`, `ctaGlow`
- **Sidebar visuals:** `sbFlowDash`, `sbBreathe`, `sbFlicker`, `sbLedCascade`, `sbScanX`, `sbBarPulse`
- **Special effects:** `scanline`, `shimmer`, `floatOrb`, `travelLight`, `vinylSpin`, `skill-pill-glow`
- **CSS scroll-driven:** `parallax-slow` / `parallax-fast` via `animation-timeline: scroll()`

### CSS Grid accordion

Height animations without JS measurement:
```css
.exp-body { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 400ms; }
.exp-body[data-open="true"] { grid-template-rows: 1fr; }
.exp-body > div { overflow: hidden; }
```

### Theme toggle animation

`ThemeToggle` wraps sun/moon icons in `AnimatePresence mode="wait"`. Icons rotate ±30° with `opacity: 0→1`. Under `useReducedMotion()`, animation props are omitted entirely.

---

## Build & deploy

### NPM scripts

| Command | What it does |
|:---|:---|
| `npm run dev` | Vite dev server on port 3000 |
| `npm run build` | `tsc && vite build && node scripts/inject-metadata.js` |
| `npm run preview` | Serve production `dist/` locally |
| `npm run lint` | Types + token gate + route/prompt sync + ESLint (the CI gate see maintenance.md) |
| `npm test` | Vitest (terminal engine, NowPlaying, useAIAgent, degradation contract) |
| `npm run build:prompt` | Regenerate `worker/system-prompt.js` from `_resume.yaml` + `content/assistant.ts` |
| `npm run screenshots` / `screenshots:matrix` | Playwright screenshots across all manifest routes (1 or 3 breakpoints) |

### Build pipeline

1. **`tsc`** type-check only, no emit (`noEmit: true`). Strict mode. Fails build on any error.
2. **`vite build`** esbuild minify, CSS code-split, manual chunks (`vendor-react`, `vendor-animation`, `vendor-ui`). A `transformIndexHtml` plugin fills `%SITE_TITLE%` / `%SITE_DESCRIPTION%` / `%SITE_URL%` from `content/site.ts`.
3. **`node scripts/inject-metadata.js`** reads the route manifest, writes per-route `<title>` / OG / Twitter tags into `dist/`, adds `<link rel="modulepreload">` / image preloads, and generates `dist/sitemap.xml`. No hand-maintained route list, no committed sitemap the manifest is the source, and the build fails if a non-hidden route is missing title/description or sitemap data.

### CI/CD

Two workflows, both Node 24:

- **`ci.yml`** (pull requests to `main`): `npm ci` → `npm run lint` → `npm test`. This is the gate.
- **`deploy.yml`** (push to `main` + manual dispatch): `npm ci` → `npm run build` → deploy `dist/` to GitHub Pages. No env plumbing config is baked into `src/content/site.ts`. One deploy at a time (`cancel-in-progress: true`).

The AI chat worker deploys separately (`cd worker && npx wrangler deploy`) see maintenance.md.

### Static files

- `.nojekyll` prevents Jekyll processing (needed for `_` prefixed folders)
- `public/robots.txt` allows all crawlers, points at `/sitemap.xml`
- `sitemap.xml` is generated into `dist/` by `inject-metadata.js` no committed copy to go stale (`/contact` as an alias and `hidden` routes are excluded)

---

## Tailwind token contract

Enforced by `scripts/check-tailwind-tokens.mjs` (runs as part of `npm run lint`). Three floors: tokenised hex, ≥10px type, ≥45-alpha text contrast.

1. **No raw hex for tokenised colours.** If a colour exists as a `--color-*` token, use the utility (`text-f1-red`, `bg-brand-primary`) or CSS var not the literal hex.
2. **New colours → `@theme` first.** Anything used ≥2 times must be a token before its second use.
3. **Text colour from the ramp; never below AA.** Content text uses `text-text-primary`/`-secondary`/`-tertiary` (dark-locked) or the theme-flipping `fg-*` family. `text-white/N` and `text-fg/N` below `/45` are blocked; `-ghost`/`-dim`/`-muted` are decorative only.
4. **Type from the ramp; never below 10px.** `text-micro`(10) / `text-fine`(11) / `text-caption`(12) / `text-label`(13) for the dense register; standard scale for body copy. A size used ≥2 times becomes a token.
5. **JS hex constants in `src/config/constants.ts` only.** When JS genuinely needs raw hex (canvas, Framer Motion values), that's where it goes.
6. **Static inline styles → utilities.** `style={{ zIndex: 40 }}` becomes `z-40`. Inline `style` is reserved for dynamic values.
7. **Dynamic values through CSS vars:**
   ```tsx
   // instead of: style={{ backgroundColor: accent }}
   <span
     style={{ '--accent': accent } as React.CSSProperties}
     className="bg-(--accent) shadow-[0_0_6px_var(--accent)]"
   />
   ```
8. **Reusable animations are `--animate-*` tokens** consumed as `animate-*` utilities. Hand-written `.class { animation: … }` only for one-off keyframes.

Escape hatches (rare, justified in review, marker on the line): `tw-allow-hex`, `tw-allow-micro` (sub-10px decorative glyphs), `tw-allow-contrast` (sub-45 decorative text). The two `@media (max-height: …)` viewport-fit blocks in `index.css` are the one sanctioned hand-written-CSS exception.

---

## SEO

Dynamic meta per route via `<SEO>` (`components/layout/SEO.tsx`):
- Pages call `<SEO {...routeMeta('/path')} />` title/description/canonical come from the route manifest, so visitors and scrapers see the same copy.
- Defaults (site name, og:image, socials) come from `content/site.ts`; `<Schema>` writes JSON-LD (`Person`, `CreativeWork`, `SoftwareApplication`) from the same source.
- `themeColor` meta tag updates when the user toggles theme.
- `scripts/inject-metadata.js` bakes per-route tags into static `dist/` HTML so social scrapers (which don't run JS) see the right metadata.
