# Maintenance

What to check before pushing to `main`.

---

## Pre-push checklist

### 1. Lint & test

Run what CI runs if both pass locally, CI will pass:

```bash
npm run lint
npm test
```

Then do a full production build to catch bundler or metadata problems:

```bash
npm run build
```

CI runs `lint` + `test` on every pull request (`ci.yml`) and `build` on every deploy (`deploy.yml`).

### 2. Routes: edit the manifest, not the plumbing

Adding or removing a page touches three places, and the compiler walks you through each one:

1. The entry in `src/content/routes.ts` (path, title, description, sitemap data).
2. The lazy import + `ROUTE_COMPONENTS` line in `src/app/App.tsx` `Record<RoutePath, …>` makes a missing or stale mapping a **compile error**.
3. The route table in `_docs/architecture.md` `scripts/check-route-sync.mjs` (part of `npm run lint`) **fails CI** until the docs match.

Everything else is derived: per-route metadata, `dist/sitemap.xml`, and the screenshot matrix all read the manifest. Nothing to keep in sync by hand.

### 3. Update docs if you touched something big

If you changed something in a core subsystem (terminal engine, F1 telemetry, design tokens, routing, content layer), update the relevant section in `_docs/architecture.md` or `_docs/patterns.md`.

---

## What `npm run lint` checks

| Check | Tool | What it catches |
|:---|:---|:---|
| TypeScript types | `tsc --noEmit` | Type errors, missing imports, broken aliases, manifest↔component drift |
| Tailwind token compliance | `scripts/check-tailwind-tokens.mjs` | Raw hex that should be a token; `text-[Npx]` below 10px; `text-white/N` or `text-fg/N` below `/45` |
| Route-table sync | `scripts/check-route-sync.mjs` | `_docs/architecture.md` route table drifting from `src/content/routes.ts` |
| Worker-prompt sync | `scripts/build-system-prompt.mjs --check` | Committed `worker/system-prompt.js` stale against `_resume.yaml` / `content/assistant.ts` / `site.ts` |
| ESLint | `eslint . --max-warnings=<budget>` | typescript-eslint + jsx-a11y + react-hooks; warning budget only ratchets down |

### Tailwind token rules (quick ref)

- **Colours** used ≥2 times must be a `@theme` token before the second use.
- **Text colour** comes from the semantic ramp `text-text-primary`/`-secondary`/`-tertiary` (or the theme-flipping `fg-*` family). `text-white/N` and `text-fg/N` below `/45` are blocked (fails WCAG AA on `#050505`); `-ghost`/`-dim`/`-muted` are decorative only.
- **Type** comes from the `--text-*` ramp (`text-micro` 10px = floor, `text-fine` 11px, `text-caption` 12px, `text-label` 13px, `text-display`) or the standard Tailwind scale. No `text-[Npx]` below 10px. A size used ≥2 times becomes a token; uppercase micro-labels get `tracking-mega`/`-ultra`.
- JS files that genuinely need raw hex (canvas, Framer Motion) keep it in `src/config/constants.ts` only.
- Escape hatches (justify in review): `tw-allow-hex`, `tw-allow-micro` (sub-10px decorative glyph), `tw-allow-contrast` (sub-45 decorative text) on the offending line.
- **Viewport-height fit is the sanctioned CSS exception:** the two `@media (max-height: …)` blocks in `index.css` (bento + connect) can't be expressed as utilities (Tailwind has no height variant), so they stay as hand-written `!important` CSS with sub-10px compression fallbacks exempt from the floor.

Full contract: [patterns.md → Tailwind token contract](patterns.md#tailwind-token-contract).

---

## Code style

- **No raw hex outside `constants.ts`.** See Tailwind contract above.
- **No inline `style` for static values.** `style={{ zIndex: 40 }}` → `z-40`.
- **Dynamic values via CSS vars**, not inline props:
  ```tsx
  <span
    style={{ '--accent': accent } as React.CSSProperties}
    className="bg-(--accent) shadow-[0_0_6px_var(--accent)]"
  />
  ```
- **No extra abstractions.** If three similar lines won't become four, leave them as-is.

### Comments

A comment earns its place by explaining **this repo's** patterns not the language or framework.

- **Worth commenting:** the engine registry, the token gate, the transition state machine, the content layer / degradation contract, and non-obvious invariants (e.g. "keyed on pathname so pages mount clean", "must stay erasable syntax Node imports this file directly").
- **Not worth commenting:** what `useState`, `useRef`, `.map`, `??`, `interface`, or a Framer Motion prop *is*. The reader is a developer.
- File headers: a `Fits in:` / `Note:` line about the file's role in this system is useful. A paragraph teaching the framework is not.
- When in doubt, delete. A wrong or stale comment is worse than none.

---

## Updating the AI assistant

The terminal's AI assistant (and the chat drawer) runs on a Cloudflare Worker (URL in `site.ts → integrations.aiChat`). Its knowledge file, `worker/system-prompt.js`, is **generated don't edit it by hand**. Sources:

| Source | Owns |
|:---|:---|
| `_docs/_resume.yaml` | Facts: identity, education, certs, skills, experience bullets (`signature`/`strong` strength), canonical stats |
| `src/content/assistant.ts` | Persona: voice, instructions, canned answers, lore, studio blurbs |
| `src/content/site.ts` | Name, role, domain |

### How to update

1. Edit `_docs/_resume.yaml` and/or `src/content/assistant.ts`.
2. Regenerate and review:
   ```bash
   npm run build:prompt
   git diff worker/system-prompt.js
   ```
3. Redeploy the worker (separate from the Pages workflow):
   ```bash
   cd worker
   npx wrangler deploy
   ```
4. Test in the terminal ask something that exercises the new info.

`npm run lint` runs `build-system-prompt.mjs --check`, so a stale prompt blocks CI. You can forget to deploy, but you can't forget to regenerate.

### Formatting

The terminal renders **plain text only** no markdown. The system prompt tells the model not to use `**bold**`, `# headers`, or hyphen bullets. Keep accomplishment bullets as plain prose with numbers inline (e.g. `cut refresh from 45 min to 20 min`).

### History truncation

The worker rejects history items longer than 500 characters. The client truncates to 490 chars before sending (`src/hooks/useAIAgent.ts`), so multi-turn conversations stay safe.

---

## Deploy pipeline

```
pull request → main
  └─ GitHub Actions (ci.yml, Node 24)
       ├─ npm ci
       ├─ npm run lint          ← types + token gate + route/prompt sync + eslint
       └─ npm test              ← vitest

push to main
  └─ GitHub Actions (deploy.yml, Node 24)
       ├─ npm ci
       ├─ npm run build         ← tsc + vite build + inject-metadata.js (meta + sitemap)
       └─ deploy dist/ → GitHub Pages

worker change (separate, manual)
  └─ npm run build:prompt → cd worker && npx wrangler deploy
```
