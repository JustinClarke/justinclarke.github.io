# LiteStorePage — Elevation Plan

**Source studied:** `LiteStore-nextjs-main/` (the actual production codebase, ~2,000 LOC across 30+ files)
**Target:** `src/pages/projects/LiteStorePage.tsx` (currently 458 lines, marketing-tone, light on evidence)
**Goal:** Raise the page from "polished claims" to "verifiable engineering story" by mining the source repo for concrete artifacts, then surfacing them as scrollable, citation-grade evidence.

---

## 1. What the current page does well (keep)

- Strong hero treatment, HUD chrome, cinematic typography.
- Three-phase Migration Arc (HTML → CRA → Next.js 12) — narrative spine works.
- Brand grid on light theme is a clean tonal break.
- `SEO`, `BackToTerminal`, `TheCloser`, `RelatedProjects` integration is already correct.
- The `_document.js` GA4 snippet block is the page's strongest "show, don't tell" moment.

## 2. What's underclaimed or missing (the gap the source closes)

The source repo contains hard evidence the current page hand-waves:

| Current page says | Source actually shows | What to do |
|---|---|---|
| "30+ static routes" | 30 distinct `.js` files in `pages/` — countable (home, contact, spaces/index, 3 mall indexes, 11 brand pages, 4 FAQ categories, 2 blog posts, 3 legal pages, 2 about, 404, success, _app, _document) | Replace claim with a real route tree visualization |
| "Custom GA4 layer" | `pages/_document.js` lines 17-32 — exact code | Already shown, but tighten with a "What this earns you" callout (page_path tracking without a plugin) |
| "Google Sheets pipeline" | `pages/contact.js` lines 19-26 — real `axios.post` to a real sheet.best UUID endpoint | Show the actual POST + a "why this was the right tradeoff for a 2nd-year CS student shipping solo to a paying client" |
| "11 brand routes" | Actual brand list w/ mall scoping: Orion (6), Garuda (4), Lulu (1) | Replace flat grid with mall-grouped tree — matches the URL structure |
| "Tailwind + MUI" | `tailwind.config.js` has 5 custom brand colors (`mensxp-orange`, `jbl-orange`, `wow-gold`, etc.) — per-brand theming was a real architectural decision | New beat: "Per-tenant theme tokens" — show the config |
| "Swiper + AOS" | `home.js` uses Swiper with `Autoplay`, `EffectFade`, `Navigation`, `Pagination`, `A11y` modules; AOS init in `_app.js` | Concrete: "5 Swiper modules across 12 carousels, AOS duration 1500ms set once in `_app.js`" |
| Not mentioned | `react-countup` for the metrics counters (₹100→0 deposit, 48hr transition, 58% cheaper, ₹2.2Cr GMV) | New section: animated business metrics — these are the *real* numbers the client used |
| Not mentioned | FAQ pages are *each* 30-40KB (brands.js, general.js, services.js, landowners.js) — content scale was non-trivial | Add a "Content scale" sub-stat: ~140KB of FAQ copy, 4 audiences |
| Not mentioned | 19KB privacy policy + 20KB ToS hand-typed into JSX | Add to "what shipping solo actually meant" beat |
| Not mentioned | Justin appears in `pages/about/company.js` lines 87-97 as "Justin Clarke / React Developer" — direct attribution exists in the codebase | Cite this as authorship proof |

## 3. Proposed new structure

Keep the seven existing sections, but reorder slightly and insert two new ones. The narrative should read: *Hook → Origin → Architecture (with code) → Multi-tenancy → Business reality → Closer*.

```
┌─ HERO (existing, light edits)
├─ SECTION 01: THE BUILD / Migration Arc (existing)
├─ SECTION 02: THE ROUTE TREE                            ◄── NEW
├─ SECTION 03: THE REAL STACK / Form Pipeline (existing)
├─ SECTION 04: TELEMETRY LAYER (existing)
├─ SECTION 05: PER-TENANT THEMING                        ◄── NEW
├─ SECTION 06: BRAND ROUTES (existing, restructure)
├─ SECTION 07: THE NUMBERS THE CLIENT CARED ABOUT       ◄── NEW
├─ SECTION 08: SHIPPING SOLO / Journey Beats (existing, move from S01)
├─ RelatedProjects + TheCloser
```

---

## 4. Section-by-section spec

### 4.1 HERO — light edits

**Keep:** Layout, type scale, "Solo Engineering Lead" pill, audit metrics footer.

**Change:**
- `AUDIT_METRICS` — replace `LCP 0.6s / FCP 0.4s` (these are unverified; we don't have Lighthouse runs) with countable facts from the source:
  - `Routes: 30` (exact count of `.js` files in `pages/`)
  - `Tenants: 11` (brand pages)
  - `Malls: 3` (Orion / Garuda / Lulu)
  - `LOC: ~2,000` (`wc -l` on `pages/`)
- `SYSTEM_LOGS` — replace with verifiable log lines:
  - `[BUILD] next 12.2.2 · 30 routes prerendered`
  - `[POST] axios → sheet.best/api/sheets/31835dc6...`
  - `[GTAG] window.dataLayer.push · page_path: ${pathname}`
  - `[SWIPER] modules: Navigation, Pagination, A11y, EffectFade, Autoplay`
  - `[AOS] Aos.init({ duration: 1500 })`
  - `[TENANT] /spaces/{orion,garuda,lulu}/{brand}`
  - `[THEME] tailwind.config.js · 5 brand color tokens`

### 4.2 SECTION 01 — Migration Arc (keep)

No structural change. Optional: add a 4th phase card titled "Today" — "Repo archived 2023. Three years later, it's the case study you're reading."

### 4.3 SECTION 02 — Route Tree (NEW)

**Concept:** A literal `tree`-style print of the `pages/` directory, monospace, click-to-expand groups. This is the "30+ routes" claim, visualized.

**Data:**
```
pages/
├── index.js                    → /
├── home.js                     → /home
├── contact.js                  → /contact
├── 404.js                      → /404
├── about/
│   ├── company.js              → /about/company
│   └── careers.js              → /about/careers
├── blog/
│   ├── index.js                → /blog
│   ├── the-future-of-retail-1.js
│   └── the-future-of-retail-2.js
├── faqs/
│   ├── index.js                → /faqs
│   ├── general.js              (34KB)
│   ├── brands.js               (38KB)
│   ├── landowners.js           (38KB)
│   └── services.js             (34KB)
├── legal/
│   ├── privacypolicy.js        (20KB)
│   ├── termsofuse.js           (20KB)
│   └── reports-and-accounts.js
├── spaces/
│   ├── index.js                → /spaces
│   ├── orion/                  6 brand pages
│   ├── garuda/                 4 brand pages
│   └── lulu/                   1 brand page
├── utilities/success.js        → /utilities/success
└── api/hello.js                (unused)
```

**Layout:**
- Single column, max-w-4xl, centered.
- Section heading: "The Route Map." with eyebrow "Pages Router · Static Generation".
- Monospace tree with subtle indent guides.
- Per-leaf hover: highlight the URL on the right.
- Optional: a "Total: 30 files · 11 tenant routes · ~2,000 LOC" footer stat.

**Why this matters:** Converts the abstract "30+ static routes" claim into something the reader can count themselves. Anchors credibility for the rest of the page.

### 4.4 SECTION 03 — The Real Stack / Form Pipeline (keep + extend)

Current pipeline diagram is good. Two additions:

- **Add the literal endpoint** (truncated UUID, for the bit of "this was a real production URL" texture):
  - `POST https://sheet.best/api/sheets/31835dc6-...`
- **Add a "Why sheet.best" callout** below the pipeline:
  > "The client needed lead capture in a Google Sheet they already owned. A backend with auth and a DB was overkill. sheet.best as a middleware kept the form serverless and the data in the client's hands — they could revoke access without touching code."

This is the kind of judgment call that distinguishes "I picked tools" from "I picked the right tools for this client."

### 4.5 SECTION 04 — Telemetry Layer (keep + tighten)

The code block is the page's centerpiece. Two refinements:

- **Add a 3-row "What this earns you" mini-table** under the code:
  - `Page-load tracking` — `window.location.pathname` per route
  - `Env-driven config` — `NEXT_PUBLIC_GOOGLE_ANALYTICS` swappable per deploy
  - `Zero plugin surface` — no `@next/third-parties`, no `nextjs-google-analytics` (those packages didn't exist in 2022 anyway)
- **Add a "2026 retrospective" callout** at the bottom:
  > "Today I'd reach for `@next/third-parties/google` (released 2023). This was the right call in 2022 — `_document.js` injection was the documented pattern."

This shows technical maturity: the engineer who shipped this knows what they'd change *now*, which is more credible than pretending the code is timeless.

### 4.6 SECTION 05 — Per-Tenant Theming (NEW)

**Concept:** Surface the `tailwind.config.js` evidence that per-brand theme tokens were a deliberate architectural decision, not just CSS.

**Data:** From `tailwind.config.js`:
```js
colors: {
  'purple':           '#7e7ca6',  // primary
  'darker-purple':    '#65629e',  // primary:hover
  'mensxp-orange':    '#ff5e03',
  'vitro-green':      '#2c4b35',
  'wow-gold':         '#bc9850',
  'sleepycat-orange': '#ff6832',
  'jbl-orange':       '#ff3200',
  // ...
}
```

**Layout:**
- Two-column grid (`lg:grid-cols-2`), `gap-20`.
- Left: a code block showing the exact `colors` map from `tailwind.config.js` (syntax-highlighted, same style as the GA4 block).
- Right: a swatch grid — 5 brand color chips with the hex value and the brand name. On hover, the chip shows a tiny mockup of how that brand's hero used the color (e.g., `text-jbl-orange` on the JBL page heading).

**Section title:** "Per-Tenant Tokens." Eyebrow: "Design System · One config, 11 brands."

**Why this matters:** Closes the loop on "11 brand routes" — they weren't copy-pasted; they shared a token system. Cheap to add, high credibility for the design-system claim.

### 4.7 SECTION 06 — Brand Routes (restructure)

Current implementation is a flat 11-cell grid on white. Replace with a **mall-grouped layout** to match the actual URL structure:

```
ORION MALL                    GARUDA MALL              LULU MALL
/spaces/orion                 /spaces/garuda           /spaces/lulu
─────────────────             ─────────────            ─────────────
JBL                           MensXP                   Frootle
Sleepycat                     Vitro
The Pant Project              Zymrat
WOW                           Skillmatics
Xyxx
Zymrat
```

**Layout:**
- Keep white background, keep scanlines.
- Three columns (`lg:grid-cols-3`), each mall is a card with the mall name as eyebrow + the URL path + a vertical list of brands.
- Per-brand row uses that brand's color token (from §4.6) for the bullet/border.
- Header copy stays: "Each tenant is a templated route under `/spaces/<mall>/<brand>`..."

**Why this matters:** The current flat grid loses the multi-tenant hierarchy. Showing mall→brand mirrors the route structure and makes the "templated per-tenant" claim self-evident.

### 4.8 SECTION 07 — The Numbers (NEW)

**Concept:** The current page has *engineering* metrics (LCP, routes). The source repo has *business* metrics the client cared about — the ones rendered with `react-countup` on the live site. Surfacing these connects engineering to business outcome.

**Data:** From `home.js` lines 492-575:
- `₹0` — Security Deposit (counts down from 100)
- `0` — Lock-in months (counts down from 100)
- `₹0` — Sunk Cost (counts down from 100)
- `48 hrs` — Transition time between brands
- `58%` — Cheaper than conventional retail
- `₹2.2 Cr+` — GMV sold in Flexi-Stores

**Layout:**
- Dark section (matches `bg-[#080808]` rhythm).
- Eyebrow: "Production Metrics" / Heading: "What the Client Measured."
- 3×2 grid of stat tiles, each with:
  - The number, large, in `font-noto`
  - The label below in `font-mono text-white/40`
  - A small subline: "from `home.js:492-575`" (file-citation styling, like the GA4 code block has `pages/_document.js`)
- Below the grid, a single line:
  > "These were the numbers in the client's pitch deck. They're rendered with `react-countup` on the live home page — the engineering existed to surface them."

**Why this matters:** Bridges "I built a website" to "I built a tool that communicated the client's value prop." This is the section that separates a portfolio piece from a case study.

### 4.9 SECTION 08 — Shipping Solo (move + reframe)

Current page has this content in Section 01 as "Journey Beats Grid" (logo design, workspace admin, client lead, prototype, handoff). It belongs *later* — after the technical sections — as the human closer before `TheCloser`.

**Change:**
- Move the existing `JOURNEY_BEATS` grid here.
- Re-title: from "Operational Highlights / The Technical Dossier" to "Shipping Solo." with eyebrow "Beyond the Code."
- Add one beat to the grid, from evidence in the source repo:
  - `id: 'attribution'`, label: `Codebase Attribution`, detail: `"Listed in pages/about/company.js as 'Justin Clarke / React Developer' — the only frontend dev on the team."`
- Keep the "11 brands shipped" stat tile as the visual closer of the grid.

---

## 5. Data extraction — exact constants to add to the file

Add these at the top of `LiteStorePage.tsx`, after the existing constant blocks:

```tsx
// From actual `pages/` directory enumeration
const ROUTE_TREE = [
  { type: 'file',   path: 'index.js',                url: '/',                   size: null },
  { type: 'file',   path: 'home.js',                 url: '/home',               size: '31KB' },
  { type: 'file',   path: 'contact.js',              url: '/contact',            size: '5KB'  },
  { type: 'file',   path: '404.js',                  url: '/404',                size: '2KB'  },
  { type: 'group',  path: 'about/',                  url: null,                  size: null,
    children: [
      { path: 'company.js',  url: '/about/company',  size: '6KB' },
      { path: 'careers.js',  url: '/about/careers',  size: '3KB' },
    ]
  },
  { type: 'group',  path: 'blog/',                   url: null,                  size: null,
    children: [
      { path: 'index.js',                 url: '/blog',                          size: '6KB' },
      { path: 'the-future-of-retail-1.js', url: '/blog/the-future-of-retail-1', size: '9KB' },
      { path: 'the-future-of-retail-2.js', url: '/blog/the-future-of-retail-2', size: '6KB' },
    ]
  },
  { type: 'group',  path: 'faqs/',                   url: null,                  size: null,
    children: [
      { path: 'index.js',      url: '/faqs',            size: '5KB'  },
      { path: 'general.js',    url: '/faqs/general',    size: '34KB' },
      { path: 'brands.js',     url: '/faqs/brands',     size: '38KB' },
      { path: 'landowners.js', url: '/faqs/landowners', size: '38KB' },
      { path: 'services.js',   url: '/faqs/services',   size: '34KB' },
    ]
  },
  { type: 'group',  path: 'legal/',                  url: null,                  size: null,
    children: [
      { path: 'privacypolicy.js',         url: '/legal/privacypolicy',         size: '20KB' },
      { path: 'termsofuse.js',            url: '/legal/termsofuse',            size: '20KB' },
      { path: 'reports-and-accounts.js',  url: '/legal/reports-and-accounts',  size: '2KB'  },
    ]
  },
  { type: 'group',  path: 'spaces/',                 url: '/spaces',             size: null,
    children: [
      { path: 'index.js',     url: '/spaces',          size: '10KB' },
      { path: 'orion/',       url: '/spaces/orion',    size: null,  count: 6 },
      { path: 'garuda/',      url: '/spaces/garuda',   size: null,  count: 4 },
      { path: 'lulu/',        url: '/spaces/lulu',     size: null,  count: 1 },
    ]
  },
  { type: 'file',   path: 'utilities/success.js',    url: '/utilities/success',  size: '500B' },
];

// From `tailwind.config.js` lines 22-34
const BRAND_TOKENS = [
  { name: 'Primary',         var: 'purple',           hex: '#7e7ca6', usedBy: 'LiteStore brand' },
  { name: 'Primary :hover',  var: 'darker-purple',    hex: '#65629e', usedBy: 'CTA hover state'  },
  { name: 'MensXP',          var: 'mensxp-orange',    hex: '#ff5e03', usedBy: '/spaces/garuda/mensxp'    },
  { name: 'Vitro',           var: 'vitro-green',      hex: '#2c4b35', usedBy: '/spaces/garuda/vitro'     },
  { name: 'WOW',             var: 'wow-gold',         hex: '#bc9850', usedBy: '/spaces/orion/wow'        },
  { name: 'Sleepycat',       var: 'sleepycat-orange', hex: '#ff6832', usedBy: '/spaces/orion/sleepycat'  },
  { name: 'JBL',             var: 'jbl-orange',       hex: '#ff3200', usedBy: '/spaces/orion/jbl'        },
];

// Mall-grouped brand structure — replaces the flat BRANDS array
const TENANTS_BY_MALL = [
  {
    mall: 'Orion Mall',
    path: '/spaces/orion',
    brands: [
      { name: 'JBL',              token: 'jbl-orange',       path: '/spaces/orion/jbl' },
      { name: 'Sleepycat',        token: 'sleepycat-orange', path: '/spaces/orion/sleepycat' },
      { name: 'The Pant Project', token: null,               path: '/spaces/orion/thepantproject' },
      { name: 'WOW',              token: 'wow-gold',         path: '/spaces/orion/wow' },
      { name: 'Xyxx',             token: null,               path: '/spaces/orion/xyxx' },
      { name: 'Zymrat',           token: null,               path: '/spaces/orion/zymrat' },
    ],
  },
  {
    mall: 'Garuda Mall',
    path: '/spaces/garuda',
    brands: [
      { name: 'MensXP',     token: 'mensxp-orange', path: '/spaces/garuda/mensxp' },
      { name: 'Vitro',      token: 'vitro-green',   path: '/spaces/garuda/vitro' },
      { name: 'Zymrat',     token: null,            path: '/spaces/garuda/zymrat' },
      { name: 'Skillmatics', token: null,           path: '/spaces/garuda/skillmatics' },
    ],
  },
  {
    mall: 'Lulu Mall',
    path: '/spaces/lulu',
    brands: [
      { name: 'Frootle', token: null, path: '/spaces/lulu/frootle' },
    ],
  },
];

// From `home.js` lines 492-575 (react-countup metrics)
const BUSINESS_METRICS = [
  { value: '₹0',      label: 'Security Deposit',         note: 'CountUp 100 → 0',  source: 'home.js:497' },
  { value: '0',       label: 'Lock-in (months)',         note: 'CountUp 100 → 0',  source: 'home.js:511' },
  { value: '₹0',      label: 'Sunk Cost',                note: 'CountUp 100 → 0',  source: 'home.js:524' },
  { value: '48 hrs',  label: 'Brand transition time',    note: 'CountUp 0 → 48',   source: 'home.js:537' },
  { value: '58%',     label: 'Cheaper than conventional', note: 'CountUp 0 → 58',  source: 'home.js:550' },
  { value: '₹2.2 Cr+', label: 'GMV sold via Flexi-Stores', note: 'Static',         source: 'home.js:568' },
];

// Replaces the existing AUDIT_METRICS (drops unverified LCP/FCP)
const AUDIT_METRICS = [
  { label: 'Routes',  value: '30',    sub: 'Static Pages' },
  { label: 'Tenants', value: '11',    sub: 'Brand Routes' },
  { label: 'Malls',   value: '3',     sub: 'Mall Scopes'  },
  { label: 'LOC',     value: '~2K',   sub: 'pages/*'      },
];
```

---

## 6. Implementation order (for the Sonnet coding pass)

Each step is independently shippable and testable. Don't bundle; verify between steps.

1. **Add constants** (no UI change yet) — drop the new const blocks above the component, update `AUDIT_METRICS` and `SYSTEM_LOGS`. Confirm build still passes.
2. **Section 02 — Route Tree** — new section between hero and current Section 01. Single-column monospace tree. Use `<ScrollReveal>` like the other sections.
3. **Section 04 refinement** — add the "What this earns you" mini-table + 2026 retrospective callout under the existing GA4 code block.
4. **Section 03 refinement** — add endpoint URL + "Why sheet.best" callout under the existing form pipeline.
5. **Section 05 — Per-Tenant Theming** — new section between Telemetry and Brand Routes. Two-column: config code (left) + swatch grid (right).
6. **Section 06 — Brand Routes restructure** — replace flat `BRANDS.map` with mall-grouped `TENANTS_BY_MALL.map`. Keep white-on-dark inversion.
7. **Section 07 — Business Metrics** — new section after Brand Routes. Dark, 3×2 stat grid with file-citation sublines.
8. **Section 08 — Shipping Solo move** — move existing `JOURNEY_BEATS` grid out of Section 01, place it just before `RelatedProjects`. Add the `attribution` beat. Re-title section.
9. **Section 01 cleanup** — Section 01 now ends with the Migration Arc. Verify the "Origin Story" eyebrow + spacing still flow into the new Section 02.

After each step:
- `npm run build` — must pass.
- Visual check in dev server — every existing section still renders, no layout regressions, no broken `ScrollReveal` triggers.

---

## 7. Out of scope (do NOT do in this pass)

- **Don't fabricate Lighthouse numbers.** If we want LCP/FCP claims, run Lighthouse against `litestore.in` separately and cite the run date. The current `0.6s / 0.4s` numbers should be replaced (see §4.1), not "verified."
- **Don't add interactive carousels.** The source uses Swiper extensively; resist replicating it. The route tree, swatches, and brand list are static — they tell the story without animation overhead.
- **Don't touch `SEO`, `BackToTerminal`, `TheCloser`, `RelatedProjects`.** These are shared and out of scope.
- **Don't deep-link to the source repo.** `LiteStore-nextjs-main/` is committed locally but the repo is private/archived — citing files is fine, linking is not.
- **Don't refactor existing sections that aren't called out.** Hero layout, Migration Arc cards, Form Pipeline visual — all stay as-is structurally.

---

## 8. Acceptance criteria

The elevated page is "done" when:

- [ ] Every numeric claim on the page traces back to a specific file:line in `LiteStore-nextjs-main/` (or is removed).
- [ ] The reader can count "30 routes" themselves from the visible route tree.
- [ ] The reader can see *which* brand tokens existed and *how* the per-tenant theming was structured.
- [ ] The page surfaces business metrics (the client's numbers) alongside engineering metrics — not just one or the other.
- [ ] Section flow reads: Hook → Origin → Routes → Stack → Telemetry → Tokens → Tenants → Business Outcome → Human Story → Closer.
- [ ] Build passes; no console errors; all existing keyboard/scroll behavior intact.
- [ ] Page LOC growth stays under ~300 lines (target final size: 700-750 LOC, comparable to `SpotifyEnginePage.tsx`).
