# Tailwind-First Architecture

This project enforces Tailwind as the single source of truth for all styling. The rules below apply to all code, whether written manually or AI-assisted.

## The Contract

1. **No raw hex for tokenised colours.** If a colour exists in `src/index.css` as a `--color-*` token, use the utility (`text-f1-red`, `bg-litestore`) or CSS var (`var(--color-f1-red)`) — never the literal hex.

2. **New colours go into `@theme` first.** Any colour used ≥2 times must become a token before its second use. No exceptions.

3. **JS colour constants live in `src/config/constants.ts` only.** When JS genuinely needs raw hex (canvas/SVG draw calls, Framer Motion values), keep it there. Nowhere else. The script `scripts/check-tailwind-tokens.mjs` verifies this home mirrors `@theme`.

4. **Static inline styles → utilities.** `style={{ zIndex: 40 }}` becomes `z-40`. Inline `style` is reserved for JS-dynamic values only.

5. **Dynamic values flow through CSS vars,** styled with arbitrary-value utilities, not raw inline props.
   ```tsx
   // instead of: style={{ backgroundColor: accent, boxShadow: `0 0 6px ${accent}` }}
   <span
     style={{ '--accent': accent } as React.CSSProperties}
     className="bg-(--accent) shadow-[0_0_6px_var(--accent)]"
   />
   ```

6. **Reusable animations are `--animate-*` tokens** consumed as `animate-*` utilities in markup. Hand-written `.class { animation: … }` wrappers only for one-off keyframes.

## The Gate

Run `scripts/check-tailwind-tokens.mjs` to audit compliance:
```bash
node scripts/check-tailwind-tokens.mjs
```

This script is run as part of `npm run lint` and **blocks CI** when violations exist.

Escape hatch (rare): add `// tw-allow-hex` on a line to bypass the gate (must be justified in code review).

## When in doubt
Consult `_docs/maintenance.md` for the enforcement model and cleanup patterns.
