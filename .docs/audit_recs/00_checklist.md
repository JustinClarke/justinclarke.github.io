# 📋 SEO & Accessibility Prioritized Checklist

This checklist tracks the implementation of the Senior Engineering SEO Audit. Items are prioritized by their impact on search visibility, social sharing, and technical performance.

## 🔴 Phase 1: High Impact (Immediate Action)
- [x] **Technical: Prerendering Pipeline**
  - Implemented zero-dependency `inject-metadata.js` script.
  - Automated via `package.json` build script.
  - Added `render-ready` dispatch to `main.tsx`.
- [x] **Technical: Baseline Sync**
  - Updated `index.html` meta tags to match `SEO.tsx` defaults.
  - Fixed `theme-color` mismatch (#00c8b4 -> #050505).
- [x] **Metadata: SEO Component Refactor**
  - Fixed absolute URL bug for `og:image`.
  - Added `og:image:width`, `:height`, and `:alt`.
  - Deleted obsolete `meta keywords` tag.
- [x] **Metadata: Schema.org Fix**
  - Updated `Schema.tsx` to support `CreativeWork`.
- [x] **Content: Semantic H1s**
  - Implemented `sr-only` H1s on all 5 project case-study pages.
- [x] **Infrastructure: Sitemap Refresh**
  - Updated `sitemap.xml` lastmod dates to `2026-05-12`.

## 🟡 Phase 2: Medium Impact (Quality & Accessibility)
- [x] **Content: Snippet-Optimized Copy**
  - Updated all 5 project meta descriptions using the formula.
- [x] **Accessibility: Landmark & Navigation**
  - Added `<main id="main-content">` landmark.
  - Implemented "Skip to content" keyboard navigation.
- [x] **Accessibility: HUD & Decor Audit**
  - Added `aria-hidden="true"` to decorative elements.
  - Implemented `role="status"` and `aria-live="polite"` for HUD indicators.
- [x] **Accessibility: Interactive Semantics**
  - Added `aria-label` descriptors to links and download buttons.

## 🟢 Phase 3: Low Impact (Polish & Optimization)
- [ ] **Performance: Asset Loading**
  - Self-host Inter and IBM Plex Mono fonts (Requires downloading font files).
  - [x] Optimized Google Fonts loading with `preconnect` and `preload` in `index.html`.
- [x] **UX: Internal Linking**
  - Added "Related Case Studies" section to the bottom of all project pages.
  - Refined "Return to Terminal" aria-label for clarity in `BackToTerminal.tsx`.
- [ ] **Visibility: Submission**
  - [ ] Submit refreshed sitemap to Google Search Console (Manual Action Required).
  - [ ] Submit to Bing Webmaster Tools (Manual Action Required).

---
*Refer to individual `.md` files in `audit_recs/` for detailed implementation logic and code snippets.*


🚦 Final Handoff & Next Steps
The infrastructure is now 100% complete and audit-ready. The remaining items are manual "visibility" steps:

Manual Submission: Log in to Google Search Console and Bing Webmaster Tools to submit the refreshed sitemap.xml.
Social Asset: We recommend adding a high-resolution og-image.png (1200x630) to the public/ folder to complete the social preview experience.