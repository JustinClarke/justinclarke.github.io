# Justin Clarke Portfolio

A high-fidelity, interactive engineering portfolio built as a system interface: a functional terminal hero, a causal-ML F1 case study, live data widgets, and five technical case studies. Not a static gallery a demonstration of production-grade frontend architecture.

**Live:** [justinclarke.github.io](https://justinclarke.github.io)

```
React 19  ·  TypeScript 5.8 (strict)  ·  Tailwind CSS 4  ·  Framer Motion 12  ·  Vite 6
```

---

## Highlights

- **Functional CLI hero** a pure-TypeScript terminal engine (zero React, fully unit-tested) with 15+ commands, fuzzy command guessing, and side effects that drive scroll, modals, and an embedded Snake game.
- **F1 Causal Pace Engine** (`/f1`, `/off-the-pace`) a self-contained case-study module presenting a causal-ML model with live telemetry widgets and a data/engineering deep-dive.
- **Five case studies** Retail-as-a-Service (Next.js SaaS), an 11-entity disaster-response database with an interactive ERD, MSc Spotify research, behavioural HR AI, and a capital-budgeting financial model.
- **Tailwind-first design system** every colour is a `@theme` token; a CI gate ([`scripts/check-tailwind-tokens.mjs`](scripts/check-tailwind-tokens.mjs)) blocks raw hex. Light/dark themes flip the entire UI via CSS-var overrides, zero markup changes.
- **Privacy-first analytics** cookieless [Umami](https://umami.is), prod-only, SPA route changes tracked automatically. See [`_docs/analytics.md`](_docs/analytics.md).
- **Performance-engineered** `useMotionValue` over `setState` for per-frame work, `React.lazy` per route + below-fold, no global `will-change` (Safari compositor budget), build-time per-route metadata for JS-less social scrapers.

---

## Quick start

```bash
git clone https://github.com/JustinClarke/justinclarke.github.io.git
cd justinclarke.github.io
npm install
npm run dev        # Vite dev server on http://localhost:3000
```

| Command | Action |
|:---|:---|
| `npm run dev` | Dev server (port 3000) |
| `npm run build` | `tsc` → Vite build → per-route metadata injection |
| `npm run preview` | Serve the production build |
| `npm run lint` | Type-check + Tailwind token audit (CI gate) |
| `npm run test` | Vitest unit tests (terminal engine, NowPlaying) |

Requires Node 20+. Deploys to GitHub Pages on push to `main` ([`deploy.yml`](.github/workflows/deploy.yml)); pull requests are linted by [`ci.yml`](.github/workflows/ci.yml).

---

## Stack

| Layer | Tech |
|:---|:---|
| Framework | React 19 (concurrent rendering, `createRoot`) |
| Language | TypeScript 5.8, strict |
| Styling | Tailwind CSS 4 CSS-first `@theme` tokens |
| Animation | Framer Motion 12 |
| Routing | React Router 7, animated page transitions |
| Modals | Radix UI Dialog |
| SEO | react-helmet-async + build-time metadata injection |
| Analytics | Umami (cookieless) |
| Bundler | Vite 6 esbuild minify, manual vendor chunks |

---

## Documentation

The heavy lifting lives in [`_docs/`](_docs/):

| Doc | What's inside |
|:---|:---|
| [architecture.md](_docs/architecture.md) | Stack, full source layout, design-system tokens, route table, UI primitives |
| [patterns.md](_docs/patterns.md) | Terminal engine, SQL ERD pathing, DAG edges, scroll system, animation system, build pipeline |
| [analytics.md](_docs/analytics.md) | Umami setup, custom events, configuration, verification |
| [maintenance.md](_docs/maintenance.md) | Pre-push checklist, lint contract, deploy pipeline |

The Tailwind token contract is enforced in [`_docs/patterns.md` Tailwind token contract](_docs/patterns.md#tailwind-token-contract).

---

> Built by **Justin Clarke**.
> The interface respects `prefers-reduced-motion` throughout.
