# Patterns & Operations

Engineering patterns, animation system, and build pipeline.

---

## Engineering patterns

### Terminal engine (`Hero/engine.ts`)

Pure TypeScript with zero React dependencies fully testable in isolation.

- **Registry pattern.** `COMMANDS` map keys command strings to handlers returning `{ lines: TerminalLine[]; effect? }`. Side effects (`scroll`, `contact`, `download`, `snake`) are returned as a discriminator `Hero.tsx` reads that and dispatches. The engine never touches the DOM.
- **Boot sequence.** Seven phases driven from `TerminalHeader.tsx`, gated on `preloaderComplete` event. Lines render one at a time via `async/await` with `max(400ms, text.length * 15ms)` per line.

### SQL ERD connector (`SqlErd.tsx`)

Cubic Bezier paths link entities: `M x1,y1 C x1+40,y1 x2-40,y2 x2,y2`. ±40px control offsets keep curves readable for nearby tables. Crow's-foot markers at the one-to-many end. FK lines inherit the source table's accent colour.

### DAG edge system (`ExpertisePipeline/DagEdge.tsx`)

Edges are SVG `<path>` elements whose coordinates are derived from `getBoundingClientRect()` at render time. A `ResizeObserver` on the grid container increments a tick counter to force re-renders after layout changes, keeping edge geometry accurate.

### Scroll-driven reveal

Two patterns coexist:
- **`<ScrollReveal>`** (`ui/ScrollReveal.tsx`): `IntersectionObserver` per component, opt-in with React tree co-location. Use this for new code.
- **`initScrollAnimations()`** (`utils/animations.ts`): global observer + `MutationObserver`, scans for `[data-reveal]` attributes.

Both respect `prefers-reduced-motion` and clean up `will-change` after 2000ms.

### Elevator scroll (`utils/scroll.ts`)

Custom scroll-to-section with exponential in-out easing (factor 20 for dramatic accel/decel). Recalculates the target offset every frame to stay accurate if the layout shifts mid-scroll. Falls back to instant `scrollTo` under reduced motion.

### Provider pattern

`ModalProvider`, `HelmetProvider`, and `ThemeProvider` live above the router. Consumed via hooks (`useModal()`, `useTheme()`). Avoids prop-drilling across the deep component tree.

### F1 hook/widget separation (`useF1Telemetry` + `F1TelemetryWidget`)

All simulation state and interval loops live in the `useF1Telemetry()` hook. `F1TelemetryWidget.tsx` is a pure renderer consuming the hook and sub-components from `bento/f1/`. The only DOM-bound logic left in the widget is the log container `scrollTop` effect (needs a ref the hook cannot hold).

### Performance targets

Chrome and Safari: LCP < 1.2s, FID < 50ms, CLS = 0.00, scroll frame time < 16ms.

**Never use `will-change` globally** Safari has a finite compositor budget and evicts layers. Apply only to elements that animate continuously for >5 seconds. **Prefer `useMotionValue` over `useState` for per-frame updates** bypasses React's render loop.

---

## Animation system

### Framer Motion (`config/animations.ts`)

```typescript
SPRINGS = {
  soft:   { type: 'spring', stiffness: 100, damping: 20 },
  snappy: { type: 'spring', stiffness: 300, damping: 30 },
}

EASING = {
  quintic:  [0.16, 1, 0.3, 1],   // Cinematic deceleration
  smooth:   [0.22, 1, 0.36, 1],  // General smooth
}
```

`AnimatePresence` with `mode="wait"` governs the F1 panel crossfade and `ThemeToggle` icon swap. Preloader exit uses `blur(20px)` + `scale(1.05)` + 1.8s quintic ease.

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

`ThemeToggle` wraps sun/moon icons in `AnimatePresence mode="wait"`. Icons rotate ±30° with `opacity: 0→1`. When `useReducedMotion()` returns true, animation props are omitted.

---

## Build & deploy

### NPM scripts

| Command | Purpose |
|:---|:---|
| `npm run dev` | Vite dev server on port 3000 |
| `npm run build` | `tsc --noEmit && vite build && node scripts/inject-metadata.js` |
| `npm run preview` | Serve production `dist/` locally |
| `npm run lint` | `tsc --noEmit` + Tailwind token audit (`scripts/check-tailwind-tokens.mjs`) |

### Build pipeline

1. **`tsc --noEmit`** type-check, no emit. Strict mode. Fails build on errors.
2. **`vite build`** esbuild minify, CSS code-split, manual chunks:
   - `vendor-react`: `react`, `react-dom`, `react-router-dom`
   - `vendor-animation`: `framer-motion`
   - `vendor-ui`: `lucide-react`, `@radix-ui/react-dialog`
3. **`node scripts/inject-metadata.js`** reads `dist/index.html`, writes per-route `<title>` / OG / Twitter tags into sub-directories under `dist/`. **Update the `ROUTES` array in this script whenever a route is added or removed.**

### CI/CD

Two workflows:

- **`.github/workflows/ci.yml`** runs on pull requests to `main`. `npm ci` → `npm run lint` (types + Tailwind token audit). Node 20. This is the gate that blocks bad code.
- **`.github/workflows/deploy.yml`** runs on push to `main` (and manual dispatch). `npm ci` → `npm run build` → deploy `dist/` to GitHub Pages. Node 24. Injects the Umami analytics env vars (`VITE_UMAMI_*`) at build time. One deploy at a time (`cancel-in-progress: true`).

### Static file checklist

- `.nojekyll` prevents Jekyll processing (required for `_docs/`, `_` prefixed folders)
- `public/robots.txt` allows all crawlers
- `public/sitemap.xml` all public routes with priority weights; keep in sync with `inject-metadata.js` routes

---

## Tailwind token contract

Enforced by `scripts/check-tailwind-tokens.mjs`, which runs as part of `npm run lint` and blocks CI on violations.

1. **No raw hex for tokenised colours.** If a colour exists in `src/index.css` as a `--color-*` token, use the utility (`text-f1-red`, `bg-brand-primary`) or CSS var (`var(--color-f1-red)`) never the literal hex.
2. **New colours go into `@theme` first.** Any colour used ≥ 2 times must become a token before its second use. No exceptions.
3. **JS colour constants live in `src/config/constants.ts` only.** When JS genuinely needs raw hex (canvas/SVG draw calls, Framer Motion values), keep it there. The token gate script verifies this file mirrors `@theme`.
4. **Static inline styles → utilities.** `style={{ zIndex: 40 }}` becomes `z-40`. Inline `style` is reserved for JS-dynamic values only.
5. **Dynamic values flow through CSS vars:**
   ```tsx
   // instead of: style={{ backgroundColor: accent }}
   <span
     style={{ '--accent': accent } as React.CSSProperties}
     className="bg-(--accent) shadow-[0_0_6px_var(--accent)]"
   />
   ```
6. **Reusable animations are `--animate-*` tokens** consumed as `animate-*` utilities. Hand-written `.class { animation: … }` only for one-off keyframes.

Escape hatch (rare): add `// tw-allow-hex` on the same line as the violation to bypass the gate. Must be justified in review.

---

## SEO

Dynamic meta per route via `<SEO>` component (`components/layout/SEO.tsx`):
- Sets `<title>`, `<meta name="description">`, Open Graph, and Twitter Card tags via `react-helmet-async`.
- `<Schema>` component writes JSON-LD structured data (`CreativeWork`, `SoftwareApplication`).
- `themeColor` meta tag is driven by `useTheme()` updates when the user toggles theme.
- `scripts/inject-metadata.js` bakes per-route tags into static `dist/` HTML so social media scrapers (which don't run JS) see the correct metadata.

