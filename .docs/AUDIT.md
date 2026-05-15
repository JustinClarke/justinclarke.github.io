# Site Audit & Tailwind UI Migration Plan

**Date:** 2026-05-15
**Repo:** `justinclarke.github.io`
**Stack:** React 19 · Vite 6 · TS 5.8 · Tailwind 4.1 (`@tailwindcss/vite`) · framer-motion 12 · react-router 7 · radix-ui dialog · lucide-react · D3
**LOC:** ~10.4k across `src/`

This document is split in two:

1. **Part 1 — Audit findings**: bugs, dead code, security/perf/a11y issues, architectural debt, and best-practice violations, organized by severity.
2. **Part 2 — Tailwind UI migration**: which Tailwind UI / Tailwind Plus blocks map cleanly to current screens, what should be hand-rolled, and the recommended migration order.

---

## Part 1 — Audit Findings

### 🔴 P0 — Bugs (will break in production or are already broken)

#### 1.1 `RelatedProjects` passes a prop that doesn't exist on `SectionContainer`
`src/components/projects/RelatedProjects.tsx:25` uses `contentMaxWidth="max-w-6xl"`. `SectionContainer` (`src/ui/SectionContainer.tsx:9-20`) does **not** accept that prop — its API is `containerVariant: 'site' | 'project' | 'none'`. TypeScript should be flagging this; if it isn't, it's because `SectionContainer`'s prop type uses an interface and the prop is silently dropped. Fix:

```tsx
<SectionContainer
  className="bg-[#050505] py-24 md:py-32 border-t border-white/5"
  containerVariant="site"
>
```

#### 1.2 `dangerouslySetInnerHTML`-free JSON-LD is correct, but `Schema` social URLs are wrong
`src/components/layout/Schema.tsx:28-31` lists `https://github.com/justinclarke` and `https://linkedin.com/in/justinclarke` — these don't match the real handles (`JustinClarke` / `justinsavioclarke`) used everywhere else. Schema.org `sameAs` is read by Google for entity disambiguation; wrong URLs there leak to Knowledge Graph.

#### 1.3 `useEffect` dep bug in `Hero.tsx`
`src/components/home/Hero.tsx:28-45` puts `bootStep` in the effect deps but the effect installs a one-time event listener + 4.5s safety timeout. Every re-render that touches `bootStep` (which is most of them during boot) re-installs the listener and re-arms the timeout. Should be `[]` with a ref-guard, or split into two effects.

#### 1.4 `getLineColor` doesn't match the term theme system
`src/components/home/Hero.tsx:113-131` returns `text-acc-bi` for `pu`, but `acc-bi` isn't a Tailwind theme color (it's `--color-acc-bi` in `@theme` — needs `text-[color:var(--color-acc-bi)]` or to be added to `tailwind.config.ts`). Currently rendering as the default color silently. Same problem for `text-blue-500` (used for `b` / `info`) — it works, but it doesn't match the `[data-term="info"]` styling defined in `index.css`. Two systems in conflict.

#### 1.5 `tsconfig` references a folder that doesn't exist
`tsconfig.json:44` excludes `"src old"`. Either confirm it exists outside the repo, or remove the line. Also: `tailwind.config.ts` exists alongside `@theme` directives in `index.css` — Tailwind 4 uses **either** the config file OR `@theme` blocks. Right now both define color tokens (the config maps `brand-primary` → `var(--color-brand-primary)`, then `@theme` defines the variable) — that works but is redundant. The config file can be deleted entirely with Tailwind 4's CSS-first config.

#### 1.6 `useReducedMotion` collision
`framer-motion` already exports a `useReducedMotion` hook. The local `src/hooks/useReducedMotion.ts` shadows it. Components like `CustomCursor.tsx:2-3` import the local one (`@/hooks`) while others may not — confusing. Pick one. Prefer the framer one for components that already import from framer.

#### 1.7 Preloader race condition
`src/components/layout/Preloader.tsx:96-102` dispatches `preloaderComplete` and sets `body.overflow = 'auto'` from inside `setTimeout`, but `App.tsx:21-32` also has a 3500ms fallback timer that calls `initTooltips/initScrollAnimations` regardless. If the Preloader is slow (or in StrictMode runs twice in dev), both fire. Use a ref-guard or a one-shot flag.

#### 1.8 Two scroll listeners on `BackToTop` without throttling
`src/components/layout/BackToTop.tsx:9-23` writes state on every scroll event (passive but still triggers a render). `setScrollProgress` causes a render at 60fps minimum. Throttle with `requestAnimationFrame` or use a `useMotionValue`.

#### 1.9 `cards/*` files have unused `index: number` prop
`ProjectCardSql`, `Spotify`, `LiteStore`, `HR`, `Capital` all declare `index: number` and never use it. Likely originally for stagger delay; now harmless dead weight on every props object. Either use it or drop it.

#### 1.10 `motion.div` parent + Tailwind `transition-all` conflict
Already fixed in `CareerTimeline.tsx` (chevron jitter). Same pattern still present elsewhere — e.g. `SpotightCard` uses `motion.div` plus `transition-opacity duration-300` on the same element (line 57-58). Audit every `motion.*` with a Tailwind `transition-*` class — they fight.

#### 1.11 `process.env.GEMINI_API_KEY` is bundled into the client
`vite.config.ts:11-14` injects `GEMINI_API_KEY` as a global. **Anything** in `import.meta.env` or `process.env` becomes literal in your bundle. Even if the key is "missing", a future commit could leak it. The `gemini.ts` util `console.warn`s but still resolves the key into the build. If the Gemini features aren't shipping, delete the wiring entirely. If they are, this is a critical security gap — Gemini must be proxied server-side.

#### 1.12 `manualChunks` references a package not installed
`vite.config.ts:38-41` lists `@radix-ui/react-dialog` and `lucide-react` in `vendor-ui`. Both are actually dev-deps in `package.json`. They're imported at runtime — so they MUST be runtime deps. Move them.

```json
// package.json — currently in devDependencies, must be in dependencies:
"@radix-ui/react-dialog": "^1.1.15",
// lucide-react is correctly in dependencies, ignore
```

---

### 🟠 P1 — Architectural debt & duplication (cleanup, but functional)

#### 2.1 The five `ProjectCard*` cards are 95% identical
`ProjectCardSql.tsx`, `ProjectCardLiteStore.tsx`, `ProjectCardSpotify.tsx`, `ProjectCardHR.tsx`, `ProjectCardCapital.tsx` are line-for-line copies that differ in:
- Accent color hex
- Top eyebrow label
- Headline metric value + sub label
- Status pill text
- Bottom-right CTA label

That's a **single component with a config map**. Right now changing one detail (e.g. metric grid layout) means touching 5 files. Refactor:

```tsx
// src/components/projects/cards/ProjectCard.tsx
const CARD_CONFIG: Record<string, CardConfig> = {
  'sql-disaster': { accent: '#ef4444', accentClass: 'red-500', eyebrow: 'RELATIONAL ARCHITECTURE', headline: '11', headlineUnit: 'ENTITIES', sub: 'Core + Junction Tables', cta: 'Case Study', status: { text: 'OPERATIONAL', pulse: true } },
  'litestore':    { /* … */ },
  // …
};

export const ProjectCard = ({ project }: { project: Project }) => {
  const cfg = CARD_CONFIG[project.id];
  // …single JSX body
};
```

This removes ~400 LOC and one entire layer of `index.ts`.

#### 2.2 The five project pages re-implement the same structural shell
Each `pages/projects/*Page.tsx` (300-800 LOC) has the same skeleton: SEO + BackToTerminal + full-bleed hero + status HUD + alternating dark/light sections + RelatedProjects + TheCloser footer. Extract a `<ProjectPageShell>` that takes title/eyebrow/heroVisual/sections as props or composition. The hand-tuned visuals belong to each page, but the chrome around them does not.

#### 2.3 `index.css` is 970 lines and houses ~10 conceptual systems
- Tailwind v4 `@theme` tokens
- `@utility` definitions (12+)
- Section/container layout primitives
- Animation keyframes (30+)
- Theme attribute system (`[data-term=*]`)
- Hybrid reveal system
- Component-specific selectors (`.exp-body`, `.skill-pill-anim`, `.resume-pulse-*`)
- Scroll-driven parallax
- Element-specific hover overrides

Split into:
```
src/styles/
  theme.css           # @theme + design tokens
  utilities.css       # @utility shortcuts (border-studio, section-layout, etc.)
  animations.css      # keyframes + .reveal system
  components.css      # one selector per concrete component
index.css             # @import everything
```

This unblocks code review and stops devs from scrolling past 800 lines to find a keyframe.

#### 2.4 Two parallel reveal systems
- `ScrollReveal` component (`src/ui/ScrollReveal.tsx`) — IntersectionObserver per-component
- `initScrollAnimations()` in `utils/animations.ts` — global observer + mutation observer scanning the whole DOM

Both run simultaneously. The global one observes `[data-reveal]` attributes which `ScrollReveal` also sets. Pick one. Recommend the React component — observers should live with the React tree, not in imperative DOM scanning.

The global `MutationObserver` watching `#root` for every DOM change (`utils/animations.ts:86-93`) is a meaningful perf cost on a SPA that mutates often.

#### 2.5 Two mouse-position hooks, both used
- `useMousePosition` (state-based, re-renders on every move)
- `useMousePositionMotion` (motion-value, no renders)

The state-based one (`useMousePosition.ts`) is imported by nothing in the audited code; grep confirms. Delete it. Same audit needed for `useNetworkAnimation` — used to be wired to a `NeuralNetCanvas.tsx` that's now deleted (git status shows `D src/components/home/NeuralNetCanvas.tsx`).

#### 2.6 `useProject` + `services/api.ts` is dead
`fetchProjects` and `fetchProjectById` simulate latency with `setTimeout` and return static data. `useProject` is never imported (each project page renders its own static content). Delete both files; if you want async-ish behavior to "feel real" you don't actually want it.

#### 2.7 Color tokens live in 4 places
1. `@theme { --color-* }` in `index.css`
2. `tailwind.config.ts` mapping them to Tailwind colors
3. Inline hex (`#00c8b4`, `#a855f7`, `#1db954`, `#f59e0b`, `#ef4444`) scattered across cards, pages, visuals
4. `THEME.colors` in `src/config/constants.ts`

A grep for `#00c8b4` returns >40 hits across `.tsx`. Same for `#f59e0b`. The brand color IS already `--color-brand-primary` — every inline hex is a missed reference. Find/replace pass needed:

```
#00c8b4  → var(--color-brand-primary) or class:bg-brand-primary/text-brand-primary
#f59e0b  → --color-acc-creative? or new --color-acc-amber
#a855f7  → --color-acc-bi
#1db954  → --color-viz-spotify
#ef4444  → --color-viz-error (close enough)
```

#### 2.8 `text-acc-*` classes don't exist in the Tailwind config
`tailwind.config.ts:18-47` exposes `brand.*`, `border.studio.*`, `term.*`, `viz.*`, `light.*`. The `--color-acc-lang/cloud/bi/creative` tokens defined in `@theme` are NOT exposed as Tailwind utilities. Components like `FeaturedProjects.tsx:103` use `text-acc-bi` which silently falls back. Add:

```ts
// tailwind.config.ts → theme.extend.colors
acc: {
  lang: 'var(--color-acc-lang)',
  cloud: 'var(--color-acc-cloud)',
  bi: 'var(--color-acc-bi)',
  creative: 'var(--color-acc-creative)',
},
```

Or — since you're on Tailwind 4 — just delete `tailwind.config.ts` and rely on `@theme` directly. Tailwind 4 auto-generates utilities from `@theme`.

#### 2.9 Inconsistent path aliases
`tsconfig.json:19-39` defines fine-grained aliases (`@/ui`, `@/hooks`, `@/utils`, `@/types`). `vite.config.ts:15-25` defines a different set (`@/shared`, `@/modals`, `@/providers`, `@/data`, `@/pages`, `@/config`). Several pages import via aliases that only exist in one of the two configs — works because of the catch-all `@/*`. Sync them.

#### 2.10 `ENTRIES` in `CareerTimeline.tsx` duplicates `experiences` and `education` in `data/portfolio.ts`
Same data, different shape. The `data/portfolio.ts` arrays are dead unless something else reads them. (Grep: only `closerMetadata` is imported by `TheCloser`.) Delete `experiences` and `education`, move the single source of truth into the component or into a typed data file.

#### 2.11 `TerminalEngine.ts` data is fragile
The `parts: [...]` mechanism in `TerminalLine` is clever but has ~6 hand-aligned uses of spaces for column alignment (`'IDENTITY:  '`, `'FOCUS:     '`, `'LOCATION:  '`). Use CSS grid in the rendering layer, not whitespace in the data.

#### 2.12 Three font families loading from Google Fonts
`index.html:48-56` preloads Inter + IBM Plex Mono, then deferred-loads Noto Sans + DM Serif Text + Playfair Display. That's 5 families. Each is a CWV cost (LCP, CLS if fonts swap). Realistically only Inter (sans) and IBM Plex (mono) carry the design — DM Serif Text is never used (`@theme` defines `--font-serif: "DM Serif Text"` but no component references `font-serif`). Playfair is used only for italic emphasis in headings. Noto is used heavily.

Recommendation:
- Drop DM Serif Text entirely (zero usages)
- Subset all fonts with `&text=` parameters or self-host woff2 subsets
- Consider whether Playfair italic and Noto Sans black duplicate the visual role — both are display weights

#### 2.13 `prefersReducedMotion` is half-respected
- ✅ `useReducedMotion` hook exists
- ✅ Preloader respects it
- ✅ `ScrollReveal` respects it
- ✅ `elevatorScroll` respects it
- ❌ `CareerTimeline` chevron motion ignores it
- ❌ `FeaturedProjects` LayoutGroup animation ignores it
- ❌ Every `animate={{ scale: [...] }}` infinite loop ignores it
- ❌ `SnakeGame` and `EQVisualizer` SVG animations ignore it (game is okay; cosmetic visualizer is not)

Add a global `MotionConfig reducedMotion="user"` from framer-motion at the App level — that respects the OS preference for **all** framer animations site-wide with one wrapper.

```tsx
// App.tsx
<MotionConfig reducedMotion="user">
  {/* …existing tree */}
</MotionConfig>
```

#### 2.14 `data/portfolio.ts` imports `Experience`, `Education` from `@/types` but those types are dead
Grep confirms `experiences` and `education` consts are unused (data is replicated in `CareerTimeline.tsx`). Removing them removes ~70 LOC.

#### 2.15 `Visuals.tsx` is one file with five 100-line SVG components
Each visual is conceptually one component. Co-locate them with their parent card or split into `src/components/projects/visuals/{SqlVisual,LiteStoreVisual,…}.tsx`. The 665-line file is hard to navigate.

#### 2.16 Custom cursor + Tailwind `cursor-text`/etc don't coordinate
`CustomCursor.tsx` replaces the native cursor on hover-capable + non-reduced-motion devices. But `Hero.tsx:141` sets `cursor-text` on the terminal frame, and various buttons elsewhere don't get explicit cursor classes. With `CustomCursor` active, the native cursor is hidden globally — so the explicit `cursor-*` classes are visually meaningless. Either remove them, or remove the custom cursor.

---

### 🟡 P2 — Accessibility issues

#### 3.1 Color contrast violations
- `text-white/20` and `text-white/15` on `bg-[#050505]` are below WCAG AA contrast (calculated ratio ≈ 2.0:1). Used in dozens of places (footer copyright, page meta strips, "Cache.Purged" etc.). The portfolio tone *is* low-contrast moodboard-style — but flag every label/metadata text where information is being conveyed. Hover doesn't help screen readers.
- `text-black/20` on `bg-white` in the capital page (`CapitalBudgetingPage.tsx:227`+) — same issue inverted.

Action: replace **informational** opacity classes with `text-white/40` minimum (≈ 3.0:1 against `#050505`). Decorative labels can stay low if marked `aria-hidden`.

#### 3.2 Decorative motion as primary CTAs
`ResumePulse` (`index.css:903-930`) makes the resume button blink BRIGHT teal then fade. This is **visible flashing** at 6.25%, 18.75%, 31.25%, 43.75% — that's ~4 flashes in 5 seconds. WCAG 2.1 SC 2.3.1 forbids more than 3 flashes per second; you're under but the brightness range (0% → 100% glow) is large. Consider removing the high-intensity peaks or gate the entire animation behind `useReducedMotion`.

#### 3.3 Skip link works, but only one
`App.tsx:53-55` adds a skip-to-content link — good. But terminal project pages (e.g. `SpotifyEnginePage`) don't have a main landmark with `id="main-content"`. The skip link silently fails on those routes.

#### 3.4 Modal focus management
`ContactModal.tsx` uses Radix Dialog — that's accessible by default. ✅
But `ContactForm.tsx:60` uses `placeholder="YOUR NAME"` as the only visible label-equivalent text (the actual `<label>` is in mono uppercase 9px and labeled `[INPUT_NAME]` — confusing and not human-friendly). Placeholders are not labels. Either use `aria-label` properly or rewrite labels in plain language.

#### 3.5 SVG icons missing `aria-hidden`
Many `<svg>` instances (chevrons, decorative icons, the JC monogram in TheCloser) lack `aria-hidden="true"`. Screen readers read them as "unlabeled image". Add aria-hidden to decorative SVGs; add `aria-label` to interactive ones.

#### 3.6 Snake game keyboard trap
`SnakeGame.tsx:148-179` listens for arrow keys + Escape on `window`. While the game is open, arrow keys are intercepted globally. The Escape handler does exit, which is correct. But the game has no announced state to AT users — `aria-live` updates on score/death would help.

#### 3.7 `BackToTerminal` is `fixed top-12 left-12 z-[100]` on every project page
That covers a 24×56px region on mobile right where users tap. Test with a phone in landscape. Consider only showing the desktop version >= md and using a different mobile pattern (slide-down menu or sticky header pattern).

#### 3.8 `tabindex` and focus rings
`focus-ring` utility is defined in `index.css:74-79` but rarely applied. Most buttons rely on browser defaults (which are stripped via `outline-none` in inputs). Audit every `<button>` for `:focus-visible` styling.

---

### 🟢 P3 — Performance

#### 4.1 Home page `radial-gradient` animation
`pages/Home.tsx:27-49` uses `setInterval` at 20fps (50ms) to update CSS background via React state. That's **20 renders/second of the entire `<main>`** with a non-trivial inline `style` object. The breathing teal effect is barely perceptible. Replace with CSS @property + `@keyframes` (free) or remove entirely.

#### 4.2 Preloader has a Mutation Observer scanning all of `#root`
Already mentioned. Once it fires per IntersectionObserver scan, it does, and the observer survives the lifetime of the page. Replace by trusting the `ScrollReveal` React component.

#### 4.3 `parallax-slow/fast` keyframes use experimental `animation-timeline: scroll()`
Safari + older Firefox don't support this — they'll just not animate, which is fine, but the rules are bytes in CSS for the 60% of users on those browsers. Wrap in `@supports (animation-timeline: scroll())`.

#### 4.4 `framer-motion` is imported by ~22 files
With Vite's tree-shaking it'll still bundle the same code, but many of these uses are trivial (a single `motion.div` for a fade-in). Replace those with CSS animations or `[data-reveal]` — the existing system already does this. Reserve framer for layout animations (LayoutGroup in FeaturedProjects, AnimatePresence in routing).

#### 4.5 `EQVisualizer` in `SpotifyEnginePage` renders 80 motion components
`SpotifyEnginePage.tsx:87-119` mounts 80 separate `<motion.div>` instances, each animating `scaleY` and `opacity` on an infinite loop. On a phone GPU this is hundreds of layers per frame. Either:
- Drop to ~20 bars
- Use one `<svg>` with 80 `<rect>` and a single CSS @keyframes
- Gate behind `prefersReducedMotion`

#### 4.6 No image optimization story
There are no actual `<img>` tags in the audited code — but if you add any, you have no `loading="lazy"`, no `srcset`, no AVIF/WebP. Set it up before adding screenshots.

#### 4.7 `dist/` and `node_modules` are committed-adjacent
`.gitignore` should exclude `dist`. Check `git status` shows it's not tracked — likely fine, but verify with `git ls-files dist`.

---

### 🔵 P4 — Code quality nits

- `React` import in every file is unnecessary in React 19 with the new JSX transform. Bundle is unaffected but every file has dead-weight imports.
- `cn` from `@/utils` and template-string `className` mixed in same file (e.g. `Badge.tsx:42-49` uses template literals; `MagneticButton.tsx:34` uses `cn()`). Pick one.
- `as any` cast in `MagneticButton.tsx:27` — typed `Component` properly:
  ```tsx
  const Component = as === 'div' ? motion.div : as === 'span' ? motion.span : motion.button;
  ```
  React/TS should resolve this without `any`.
- `// @ts-ignore` x2 in `SpotlightCard.tsx:61, 75` — the `--mouse-x` CSS var assignment is the right idea but needs `React.CSSProperties & Record<string, string>` cast instead of suppressing.
- `// @ts-ignore` in `utils/gemini.ts:7` — should be `import.meta.env` not `process.env` in Vite.
- Inline `console.warn`/`console.error` in `gemini.ts`. Replace with a real logger or remove.
- Inline `data-tooltip={TOOLTIPS[…]}` lookups duplicated across cards. Move into a `<Tooltip>` wrapper or augment `Badge` to do it.
- Multiple `<motion.div>` with `whileInView={{…}} viewport={{ once: true }}` plus a separate `ScrollReveal` wrapper around it = doubled animation triggers.
- `metadata.json` at repo root (`{ "title": "..." }`?) — what is this file? If unused, remove.
- `README.md` is 12.7KB but the repo has a `.docs/` folder with project documentation. Decide: README is for visitors, `.docs/` for contributors. Don't duplicate.
- `public/sitemap.xml` and `public/robots.txt` are modified per git status — make sure they reference the correct domain (`justinclarke.github.io`, not a stale variant).

---

## Part 2 — Tailwind UI / Tailwind Plus Migration

### Reality check first

**Tailwind UI** (now "Tailwind Plus") is a paid library of pre-built Tailwind components. Its catalog is split into:
1. **Marketing components** — heroes, features, pricing, testimonials, CTAs, headers, footers, blog templates, contact forms, banners
2. **Application UI** — sidebars, navbars, forms, lists, modals, dropdowns, tables, command palettes
3. **Ecommerce components** — product cards, shopping carts, checkout, category pages
4. **Templates** — full Next.js / Astro / HTML templates (Studio, Salient, Catalyst, etc.)

This site is a **single-developer portfolio with a strong custom design language** (terminal aesthetic, Spotify/SQL/HR-themed accent palettes per project, complex typography mix of Noto + Playfair + IBM Plex). 90% of what's on screen has no Tailwind UI equivalent because Tailwind UI is opinionated, brand-neutral, and aimed at SaaS dashboards.

**So: the goal isn't to replace the design — it's to swap out the parts where you're hand-rolling a generic pattern that Tailwind UI already solves better.**

### What MUST stay hand-rolled

- **`Hero` (terminal)** — the entire selling proposition of the site. No equivalent block.
- **`CareerTimeline`** — custom two-column timeline with type-colored spines.
- **`ExpertisePipeline`** — bespoke "pipeline stages" pattern.
- **Project visuals (`Visuals.tsx`, `SqlErd.tsx`)** — these ARE the portfolio content.
- **`TheCloser` footer with CTA** — already on-brand.
- **`Preloader`** — bespoke branding moment.
- **`SnakeGame`** — easter egg.
- **The five project case study pages** — these tell the story; Tailwind UI's article blocks would dilute them.

### What SHOULD migrate / reference Tailwind UI patterns

Tailwind UI is a *reference library* here, not a wholesale replacement. Pull the JSX/structure for proven patterns and re-skin them. The references below are public block names — you copy/lift the HTML semantics + accessibility patterns, then theme them with your own tokens.

#### 5.1 `ContactModal` → Tailwind UI · "Application UI · Overlays · Modal dialogs"
Currently uses Radix Dialog (which is excellent). Lift Tailwind UI's "Slide-over with branded header" pattern for the form layout — better mobile flow, more accessible defaults, and aligns with Tailwind UI's labels/focus states. Keep Radix as the primitive layer.

#### 5.2 `ContactForm` → Tailwind UI · "Application UI · Forms · Form layouts · Stacked"
Your current form uses `placeholder` as visible label-equivalent and a custom `[INPUT_NAME]` mono label that's confusing for non-technical users. Tailwind UI's stacked form layouts have label-above-input with proper `<label for>` association, helper text slots, and inline validation. Lift that and re-skin in terminal aesthetic.

#### 5.3 `BackToTop` → Tailwind UI · "Marketing · Sections · Footers" (overlay pattern)
The current implementation is fine but uses 2 SVG icons + state-based scroll listener. Tailwind UI doesn't have a direct equivalent, but their pattern of "fixed action button with progress" is in the "Application UI · Navigation · Tabs / Action buttons" section. Worth a glance for the focus state.

#### 5.4 `BackToTerminal` button → Tailwind UI · "Marketing · Elements · Buttons" (chevron-back primary)
A standard pattern. Currently has two responsive variants (desktop pill + mobile compact). Migrate the button structure to the Tailwind UI primary-button-with-leading-icon pattern, keep the responsive split.

#### 5.5 `ErrorBoundary` fallback → Tailwind UI · "Marketing · Page Examples · 404 pages"
The current fallback (`ErrorBoundary.tsx:36-62`) and `NotFound.tsx` both have custom error layouts. Both could lift Tailwind UI's "Centered with footer links" 404 template. Keeps semantic structure consistent with rest of web while letting you re-skin the branding.

#### 5.6 `RelatedProjects` → Tailwind UI · "Marketing · Sections · Stats sections" or "Feature sections · With cards"
Current implementation is solid. Tailwind UI's card-grid patterns have better keyboard navigation + focus rings that would harden a11y here without changing visual design.

#### 5.7 `FeaturedProjects` tabs → Tailwind UI · "Application UI · Navigation · Tabs · Underlined with auto-grow"
You already have a custom tab with `LayoutGroup` for the underline animation. Tailwind UI's Headless UI Tabs (`@headlessui/react`) gives you keyboard nav (arrows, Home, End), ARIA tabs/tablist/tabpanel roles, and focus management for free. Keep the LayoutGroup motion underline, but wrap the structure in `<Tab.Group><Tab.List><Tab>...`.

```bash
npm install @headlessui/react
```

#### 5.8 `ArchivePage` hero stats grid → Tailwind UI · "Marketing · Sections · Stats sections · Three columns with bottom border"
The "Total Assets / System Ops / Encryption" tri-stat block (`ArchivePage.tsx:180-192`) maps 1:1 onto this Tailwind UI block. Lift the markup, keep your typography.

#### 5.9 Project page metric grids → Tailwind UI · "Marketing · Sections · Stats sections · With description"
Every project page has a "Core Metrics" 4-cell grid (e.g. `CapitalBudgetingPage.tsx:137-152`). Standardize on Tailwind UI's pattern → cleaner gap, semantic `<dl><dt><dd>` markup, better screen reader output.

#### 5.10 Notebook listing in `SpotifyEnginePage` → Tailwind UI · "Application UI · Lists · Stacked lists · Striped"
The `NOTEBOOKS.map(...)` listing (lines 571-615) is exactly the stacked-list pattern. Migrate to that JSX structure with proper `<ul role="list"><li>` semantics, hover/focus states, and trailing chevron — keeps your custom border-radius/styling.

#### 5.11 `Badge` → Tailwind UI · "Application UI · Elements · Badges"
Multi-variant badge already exists in `src/ui/Badge.tsx`. Tailwind UI's badge collection (small/large, with dot, with X, pill/rounded) covers more variants. Adopt the API/sizes; keep your color tokens.

#### 5.12 SEO/Meta — no Tailwind UI overlap
React Helmet Async is the right tool; SEO.tsx is fine. Just fix the `Schema` URLs (P0 #1.2).

### What I'd consider buying/licensing Tailwind Plus for

If the budget is there, **Tailwind Plus' "Salient" or "Studio" template** could replace `pages/ArchivePage.tsx` and the case-study page shells almost wholesale. These templates are designed for portfolio/agency sites. You'd lose the *custom-feeling* aesthetic but gain:

- Better mobile behavior
- Consistent dark/light mode (currently inconsistent)
- Accessibility wins that take weeks to retrofit otherwise
- A proper blog/article system if you ever want to add one

For a single-developer portfolio, my honest recommendation: **don't pay**. Use the publicly-visible Tailwind UI HTML on their preview pages as a structural reference + Headless UI (free) for the interactive primitives that actually matter (tabs, dialogs, listboxes, comboboxes, popovers).

### Headless UI is the actually-free win

`@headlessui/react` (made by the Tailwind team, MIT-licensed) gives:
- `<Dialog>` — could replace Radix Dialog (or keep Radix; both are fine)
- `<Tab.Group>` — fixes `FeaturedProjects` tabs accessibility
- `<Disclosure>` — would simplify `CareerTimeline` accordion + `skill-body` mobile accordion
- `<Listbox>` — if you ever add a project filter
- `<Combobox>` — if you ever add a terminal command palette upgrade
- `<Popover>` — could replace the custom `data-tooltip` system (or keep it, the custom one is fine)
- `<Transition>` — alternative to many small framer-motion uses

**Recommended add:** install Headless UI, migrate Tabs and Disclosure first. Both improve a11y without changing the visual design.

```bash
npm install @headlessui/react
```

---

## Recommended order of operations

### Phase 0 — Stop the bleeding (1 day)
1. Fix the P0 bugs (1.1–1.12). All small, all surgical.
2. Add `<MotionConfig reducedMotion="user">` wrapper in `App.tsx`.
3. Move `@radix-ui/react-dialog` to `dependencies`.
4. Either delete the Gemini wiring or move it server-side.

### Phase 1 — Consolidation (2-3 days)
5. Refactor 5 project cards → 1 + config map (P1 #2.1). Massive win.
6. Extract `ProjectPageShell` component for the project page chrome (P1 #2.2). Each page becomes ~150 LOC instead of 600.
7. Pick ONE reveal system, delete the other (P1 #2.4).
8. Delete dead code: `useMousePosition`, `useNetworkAnimation`, `useProject`, `services/api.ts`, `data/portfolio.ts` experiences/education exports (P1 #2.5, #2.6, #2.14).
9. Split `index.css` into theme/utilities/animations/components files (P1 #2.3).
10. Replace inline hex colors with CSS vars + Tailwind classes (P1 #2.7, #2.8).

### Phase 2 — Tailwind UI migration (2-3 days)
11. `npm install @headlessui/react`.
12. Migrate `FeaturedProjects` tabs to `<Tab.Group>` (keep LayoutGroup motion).
13. Migrate `CareerTimeline` accordion to `<Disclosure>`.
14. Rewrite `ContactForm` labels to Tailwind UI stacked form pattern.
15. Restructure project metric grids using `<dl>` semantics.
16. Wrap notebook listings in proper `<ul role="list">` semantics.

### Phase 3 — Accessibility + perf hardening (1-2 days)
17. Audit contrast on every `text-white/*` and `text-black/*` opacity below 40 (P2 #3.1).
18. Add `aria-hidden` to every decorative SVG (P2 #3.5).
19. Ensure each route has a `<main id="main-content">` landmark (P2 #3.3).
20. Drop DM Serif Text from font loading (P1 #2.12).
21. Replace 80-bar EQVisualizer with SVG single-element animation (P3 #4.5).
22. Throttle `BackToTop` scroll listener with `useMotionValue` or rAF (P0 #1.8).

### Phase 4 — Polish (ongoing)
23. Audit every `motion.*` + Tailwind `transition-*` pair for conflicts (P0 #1.10).
24. Replace decorative `framer-motion` uses with CSS animations.
25. Co-locate visuals next to their cards.

---

## Quick wins (do today)

These are zero-risk drive-by fixes worth doing in a single PR:

- **Fix RelatedProjects prop bug** (P0 #1.1)
- **Fix Schema.org sameAs URLs** (P0 #1.2)
- **Add MotionConfig reducedMotion=user** (P2 #3.2, #2.13)
- **Move @radix-ui/react-dialog to dependencies** (P0 #1.12)
- **Delete `data/portfolio.ts` dead exports** (P1 #2.14)
- **Delete `useMousePosition.ts`, `useNetworkAnimation.ts`, `useProject.ts`, `services/api.ts`** (P1 #2.5, #2.6)
- **Remove `metadata.json` if unused** (P4)
- **Add `aria-hidden` to ~50 decorative SVGs** (P2 #3.5)

These alone remove ~500 LOC and tighten a11y + bundle.
