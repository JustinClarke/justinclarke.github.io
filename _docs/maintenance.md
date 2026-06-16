# Maintenance

Everything to check before pushing to `main`.

---

## Pre-push checklist

### 1. Lint

Run this single command it covers types and Tailwind token compliance:

```bash
npm run lint
```

Then do a full production build to catch bundler or metadata errors:

```bash
npm run build
```

CI runs `lint` on every pull request (`ci.yml`) and `build` on every deploy (`deploy.yml`). If both pass locally, CI will pass.

### 2. Update docs if needed

If you touched a signature subsystem (terminal engine, F1 telemetry, design tokens, routing), update the relevant section in `_docs/architecture.md` or `_docs/patterns.md`.

If you added or removed a route, also update:
- `ROUTES` array in `scripts/inject-metadata.js`
- `public/sitemap.xml` (canonical routes only `/contact` is an alias of `/connect` and is intentionally omitted)

---

## What `npm run lint` checks

| Check | Tool | What it catches |
|:---|:---|:---|
| TypeScript types | `tsc --noEmit` | Type errors, missing imports, broken aliases |
| Tailwind token compliance | `scripts/check-tailwind-tokens.mjs` | Raw hex values that should be `--color-*` tokens |

### Tailwind token rule (quick ref)

- Colours used ≥ 2 times **must** be a `@theme` token in `src/index.css` before the second use.
- JS files that genuinely need raw hex (canvas draw calls, Framer Motion values) belong in `src/config/constants.ts` only.
- Inline `style={{ color: '#...' }}` is a lint failure unless the line ends with `// tw-allow-hex` (needs justification in review).

Full contract: [`_docs/patterns.md` Tailwind token contract](_docs/patterns.md#tailwind-token-contract).

---

## Code style (brief)

- **No raw hex outside `constants.ts`.** See Tailwind contract above.
- **No inline `style` for static values.** `style={{ zIndex: 40 }}` → `z-40`.
- **Dynamic values via CSS vars**, not inline props:
  ```tsx
  <span
    style={{ '--accent': accent } as React.CSSProperties}
    className="bg-(--accent) shadow-[0_0_6px_var(--accent)]"
  />
  ```
- **Comments only when the *why* is non-obvious** skip anything that restates what the code does.
- **No extra abstractions.** If three similar lines won't become four, leave them as-is.

---

## Updating the AI agent's knowledge

The AI terminal assistant (and the floating chat drawer) is powered by a Cloudflare Worker at `portfolio-ai.justinclarke.workers.dev`. Its knowledge comes entirely from one file:

```
worker/system-prompt.js
```

`_docs/_resume.yaml` is the single source of truth for all accomplishment data — metrics, bullet points, skills, project stats. When you update your resume, sync the relevant facts into `system-prompt.js`.

### How to update

1. Edit `worker/system-prompt.js` — add or update the relevant section (EXPERIENCE, PROJECTS, SKILLS, etc.)
2. Redeploy the worker:
   ```bash
   cd worker
   npx wrangler deploy
   ```
3. Test in the terminal: ask a question that exercises the new info.

### What the system prompt contains

| Section | What to put here |
|:---|:---|
| IDENTITY | Contact info, location, work auth |
| EDUCATION | Degrees, distinctions, relevant highlights |
| SKILLS | Grouped by category — reorder to reflect current focus |
| EXPERIENCE | Role, company, dates, key accomplishment bullets with metrics |
| PROJECTS | Name, live URL, stack, key stats and accomplishments |
| INSTRUCTIONS | Tone, response length, off-topic handling, formatting rules |

### Formatting rule

The terminal renders **plain text only** — no markdown. The system prompt instructs the model not to use `**bold**`, `# headers`, or hyphen bullets. Keep accomplishment bullets as plain prose with numbers inline (e.g. `cut refresh from 45 min to 20 min`).

### History truncation

The worker rejects history items longer than 500 characters. The client already truncates history text to 490 chars before sending (`src/hooks/useAIAgent.ts`), so multi-turn conversations are safe.

---

## Deploy pipeline (for reference)

```
pull request → main
  └─ GitHub Actions (ci.yml)
       ├─ npm ci
       └─ npm run lint          ← blocks on type errors or token violations

push to main
  └─ GitHub Actions (deploy.yml)
       ├─ npm ci
       ├─ npm run build         ← tsc + vite build + inject-metadata.js
       │                           (injects VITE_UMAMI_* analytics vars)
       └─ deploy dist/ → GitHub Pages
```
