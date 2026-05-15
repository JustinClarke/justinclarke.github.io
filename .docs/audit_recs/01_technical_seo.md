# 01: Technical SEO for Single Page Apps (SPA)

## 🔴 The Problem: Client-Side Rendering (CSR)
GitHub Pages serves static files. When a crawler (Google, LinkedIn, Slack) hits your site, it sees a blank `<div id="root"></div>`. While Googlebot eventually executes JS, social scrapers do not. They will only see the stale metadata in your `index.html`.

## 🛠 The Solution: Zero-Dependency Metadata Injection
Since `vite-plugin-prerender` depends on Puppeteer (which can be flaky in CI/CD and iCloud environments), we use a custom script that generates per-route `index.html` files with unique metadata.

### 1. Integration (`scripts/inject-metadata.js`)
We've created a script that reads the production build and replicates `index.html` into route-specific folders (e.g., `/project/spotify-engine/index.html`), replacing meta tags for each.

### 2. Automated Build (`package.json`)
The script is hooked into your build pipeline:
```json
"build": "tsc && vite build && node scripts/inject-metadata.js"
```

### 3. App Hydration (`src/main.tsx`)
Even with static injection, we keep the `render-ready` signal for future-proofing:
```typescript
document.dispatchEvent(new Event('render-ready'));
```



## ⚡️ Core Web Vitals (CWV)
1. **CLS (Layout Shift)**: Ensure `min-h-screen` is set on parent containers to reserve space during page transitions.
2. **LCP (Largest Contentful Paint)**: 
   - Add `font-display: swap` to font loading.
   - Preload the hero H1 font (`Noto Sans`).
3. **FID (First Input Delay)**: Continue the work to reduce the `framer-motion` bundle size by using `m` instead of `motion` (Lazy Motion).
