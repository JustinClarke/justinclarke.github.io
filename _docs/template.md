# Using this repo as a template

Fork the repo, edit data files, replace assets, and you've got your own portfolio without touching component code. TypeScript does the validation: the compiler and lint gates tell you what's left to fix at every step.

**Requirements:** Node 24+, npm.

```bash
git clone https://github.com/<you>/<you>.github.io.git
cd <you>.github.io
npm install
npm run dev        # http://localhost:3000
```

---

## 1. Make it yours: `src/content/`

Everything a fork needs to change lives in one directory of typed TS objects. Start at the top:

| File | What you change |
|:---|:---|
| **`site.ts`** | **Start here.** Name, role, tagline, email, domain, socials, resume path, SEO defaults and the `integrations` block (next section) |
| `routes.ts` | Route manifest which pages exist, their titles/descriptions/sitemap entries |
| `home.ts` | Hero headline and footer copy |
| `career.ts` | Timeline entries (experience, education) |
| `projects.ts` | Project cards for the home grid and related-projects strips |
| `terminal.ts` | Terminal copy: boot logs, command outputs, easter eggs |
| `assistant.ts` | AI chat persona (only matters if you deploy the worker step 5) |

The site pulls identity from these files everywhere components never hardcode a name, URL, or analytics id. `index.html`'s title/meta placeholders are filled from `site.ts` at build time.

> **After editing these files, run `npm run build:prompt`.** The lint gate checks that the AI worker's generated system prompt (`worker/system-prompt.js`) is in sync with your content and that check runs even if you never deploy the worker, so a stale prompt fails `npm run lint` regardless of `aiChat` being `null`.

## 2. Integrations: everything optional is `null`-able

In `site.ts`, each third-party service is either a config object or `null`. **`null` turns the feature off cleanly** no crashes, no dangling buttons:

| Integration | What it provides | When `null` |
|:---|:---|:---|
| `umami` | Privacy-first analytics ([umami.is](https://umami.is)) | Script never loads |
| `lastFm` | "Now playing" music pill | Pill hidden |
| `aiChat` | AI assistant in terminal + chat drawer | Entry points hidden; `ask` says it's not configured |
| `contactForm` | Contact form ([web3forms.com](https://web3forms.com)) | Falls back to a plain "email me" panel |

Set all four to `null` to launch with zero external services, then add them back whenever you're ready. The keys are all public-by-design (they ship in any client bundle).

## 3. Replace the assets

- `public/favicon.svg` your icon
- Your resume PDF put it in `public/resources/` and update `site.ts → resumePdf`
- Share image `site.ts → ogImage` names a 1200×630 image under `public/`; make sure the file exists at that path
- `public/assets/` project imagery referenced by case study pages (you'll likely delete most of this)

## 4. Delete case studies you don't need

Case study pages are inherently personal the design goal is that **removal is trivial**, not that they're generic. For each page you drop (e.g. `/project/litestore`):

1. Delete its entry in `src/content/routes.ts`.
2. `npm run lint` TypeScript errors everywhere the route is still referenced: the stale `ROUTE_COMPONENTS` line and lazy import in `App.tsx`, plus any links in `AIChatDrawer.tsx` and `FeaturedProjects.tsx`. They're all `RoutePath`-typed, so you literally can't leave a dangling link just delete each flagged reference.
3. If the project had a bento tile on the home page: removing its `<BentoCard>` leaves a gap the grid is hand-laid-out, not generated from `projects.ts` so rebalance manually (span another card, move a widget into the slot). The compiler gets you to *valid*; the layout is yours to make *good*.
4. Delete the page file under `src/pages/`, its card in `content/projects.ts`, and its assets under `public/assets/`.
5. Update the route table in `_docs/architecture.md` `npm run lint` checks docs against the manifest and fails until they match.

Adding your own page is the same three touches in reverse (manifest entry, lazy import, `ROUTE_COMPONENTS` line) sitemap, metadata, and screenshots all follow from the manifest.

## 5. Optional: the AI chat worker

The assistant is a small Cloudflare Worker (free tier works). Skip deploying it by leaving `aiChat: null` but still run `npm run build:prompt` after content edits (see step 1): the prompt-sync check is unconditional.

1. Fill in `_docs/_resume.yaml` (facts) and `src/content/assistant.ts` (persona).
2. `npm run build:prompt` regenerates `worker/system-prompt.js`. Don't edit that file by hand; `npm run lint` fails if it's stale.
3. Set your origin in `worker/wrangler.toml` → `ALLOWED_ORIGINS`.
4. `cd worker && npx wrangler deploy`, then put the deployed URL in `site.ts → integrations.aiChat.workerUrl`.

## 6. Deploy

The repo deploys to **GitHub Pages** out of the box:

1. Name your repo `<you>.github.io` (or set a `base` in `vite.config.ts` for a project page).
2. Repo settings → Pages → set source to **GitHub Actions**.
3. Push to `main` `.github/workflows/deploy.yml` builds and publishes `dist/`. PRs are gated by `ci.yml` (`npm run lint` + `npm test`).

SPA deep links work via the `public/404.html` redirect trick nothing to configure.

## 7. Verify

```bash
npm run lint     # types + token gate + route/docs sync + prompt sync + eslint
npm test         # engine + component + degradation tests
npm run build    # full production build incl. per-route metadata + sitemap
```

If all three pass, the fork is coherent: no dangling routes, no stale docs, no identity leftovers still wired into components.

---

## What you're inheriting

- **Token system** colours and type sizes are `@theme` tokens; `scripts/check-tailwind-tokens.mjs` blocks raw hex, sub-10px text, and sub-AA contrast in CI.
- **Route manifest** `src/content/routes.ts` drives the router, sitemap, social metadata, and screenshots; a sync gate keeps the docs honest.
- **Graceful degradation** every integration is optional by construction, with unit tests covering the `null` paths.
- **Docs that match the code** [architecture.md](architecture.md) (structure, tokens, routes), [patterns.md](patterns.md) (how the tricky parts work), [maintenance.md](maintenance.md) (the pre-push checklist).
