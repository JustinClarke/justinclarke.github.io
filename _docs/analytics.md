# Analytics

Privacy-first, cookieless analytics via [Umami](https://umami.is). No consent banner, ~2 KB tracker, SPA route changes tracked automatically.

---

## Why Umami

| | Umami | GA4 |
|:---|:---|:---|
| Cookie-consent banner | Not required (cookieless) | Required in EU/UK |
| Script weight | ~2 KB | ~45 KB+ |
| SPA route tracking | Automatic (patches `history.pushState`) | Manual gtag config |
| Data ownership | Yours, unsampled | Google's, sampled |

For search-query data, add Google Search Console (no script) rather than GA4.

---

## How it works

### Loader [`src/components/analytics/Analytics.tsx`](../src/components/analytics/Analytics.tsx)

A render-nothing component that injects the Umami `<script>` tag exactly once, guarded so it only ever runs in a real production browser:

```tsx
if (!import.meta.env.PROD || !WEBSITE_ID) return;  // prod + configured only
if (navigator.webdriver) return;                    // skip the screenshot tool
if (document.querySelector('script[data-website-id]')) return; // inject once
```

`data-domains="justinclarke.github.io"` is set on the tag so the collector rejects beacons from `localhost` and any preview host the primary defence keeping non-prod traffic out of the dashboard. Mounted once beside `<SEO />` in [`src/app/App.tsx`](../src/app/App.tsx).

**Pageviews are automatic.** Umami patches `history.pushState`, which React Router calls on every navigation. The app updates the URL at navigation start (the visual swap is deferred via `displayLocation`), so each route change registers as its own pageview.

### Custom events [`src/utils/track.ts`](../src/utils/track.ts)

```ts
track('event-name', { optional: 'data' });
```

A no-op when the tracker isn't loaded (optional-chains `window.umami?.track`), so it's safe to call in dev and during prerender.

| Event | Fired from | Payload |
|:---|:---|:---|
| `contact-open` | `openContactModal()` [`ModalProvider.tsx`](../src/app/providers/ModalProvider.tsx) | |
| `email-open` | `openEmailModal()` [`ModalProvider.tsx`](../src/app/providers/ModalProvider.tsx) | |
| `email-copy` | copy button [`EmailModal.tsx`](../src/components/modals/EmailModal.tsx) | |
| `outbound-click` | LinkedIn / GitHub / cal.com links [`Connect.tsx`](../src/pages/Connect.tsx) | `{ channel }` |

Modal events are instrumented on the provider (the single choke point) rather than each caller. Keep event names kebab-case and stable renaming splits history in the dashboard.

---

## Configuration

Two public (non-secret) values, sourced from env at build time:

| Variable | Value |
|:---|:---|
| `VITE_UMAMI_WEBSITE_ID` | the Umami website UUID (public, like a GA measurement ID) |
| `VITE_UMAMI_SRC` | `https://cloud.umami.is/script.js` (default if unset) |

- **Local:** a git-ignored `.env` (see [`.env.example`](../.env.example)). Dev never needs real values the tracker is `PROD`-gated.
- **CI:** set as repository **Variables** (Settings → Secrets and variables → Actions → Variables *not* Secrets, they're public) and injected in the build step of [`deploy.yml`](../.github/workflows/deploy.yml).

> `.env.production` is intentionally **not** used it isn't covered by `.gitignore` and would be committed. Prod values come only from CI.

---

## Verify

1. `npm run build && npm run preview` with prod env vars → DevTools → Network: `script.js` loads and `/api/send` fires on load **and** each in-app navigation.
2. Umami → Realtime: the visit appears; route changes are separate pageviews.
3. `npm run dev` → confirm **no** beacon (dev is `PROD`-gated).
4. Open the contact modal → confirm `contact-open` in Umami → Events.

## Rollback

Remove `<Analytics />` from [`App.tsx`](../src/app/App.tsx) one line; the tracker stops loading on next deploy. Any remaining `track()` calls become harmless no-ops.
