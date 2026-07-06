# Analytics

Privacy-first, cookieless analytics via [Umami](https://umami.is). No consent banner needed, ~2KB tracker, SPA route changes picked up automatically.

---

## Why Umami

| | Umami | GA4 |
|:---|:---|:---|
| Cookie-consent banner | Not needed (cookieless) | Required in EU/UK |
| Script weight | ~2 KB | ~45 KB+ |
| SPA route tracking | Automatic (patches `history.pushState`) | Manual gtag config |
| Data ownership | Yours, unsampled | Google's, sampled |

For search-query data, add Google Search Console (no script needed) rather than GA4.

---

## How it works

### Loader [`Analytics.tsx`](../src/components/analytics/Analytics.tsx)

A render-nothing component that injects the Umami `<script>` tag once, with guards so it only ever runs in a real production browser:

```tsx
if (!import.meta.env.PROD || !UMAMI) return;        // prod + configured only
if (navigator.webdriver) return;                    // skip screenshot tool
if (document.querySelector('script[data-website-id]')) return; // inject once
```

`data-domains` is set to `SITE.domain` so the collector rejects beacons from `localhost` and preview hosts that's the main defence keeping dev traffic out of the dashboard. Mounted once alongside `<SEO />` in [`App.tsx`](../src/app/App.tsx).

**Pageviews are automatic.** Umami patches `history.pushState`, which React Router calls on every navigation. The app updates the URL at navigation start (the visual swap is deferred via `displayLocation`), so each route change shows up as its own pageview.

**Trailing slashes are normalised** to prevent split traffic stats (e.g. `/f1/` vs `/f1`). Handled at two levels:
1. **GitHub Pages redirect (`index.html`):** Direct hits on trailing-slash URLs get normalised during the 404 redirect decode, before React mounts.
2. **Client-side router (`App.tsx`):** If a trailing slash survives into React, a replace-navigation cleans it up. The page-transition state machine ignores trailing-slash differences so this doesn't trigger a visual fade.

### Custom events [`track.ts`](../src/utils/track.ts)

```ts
track('event-name', { optional: 'data' });
```

No-op when the tracker isn't loaded (optional-chains `window.umami?.track`), safe to call in dev and during prerender.

| Event | Fired from | Payload |
|:---|:---|:---|
| `contact-open` | `openContactModal()` in [`ModalProvider.tsx`](../src/app/providers/ModalProvider.tsx) | |
| `email-open` | `openEmailModal()` in [`ModalProvider.tsx`](../src/app/providers/ModalProvider.tsx) | |
| `email-copy` | Copy button in [`EmailModal.tsx`](../src/components/modals/EmailModal.tsx) | |
| `outbound-click` | Cal.com / LinkedIn / GitHub links in [`Connect.tsx`](../src/pages/Connect.tsx) | `{ channel: 'book' \| 'linkedin' \| 'github' }` |
| `project-click` | Project grid clicks | `{ project: string }` |
| `compliance-audit-toggle` | Toggling compliance overlay | `{ state: 'on' \| 'off' }` |
| `terminal-command` | Terminal command execution | `{ command: string }` |
| `theme-toggle` | Light/dark toggle | `{ theme: 'light' \| 'dark' }` |

Modal events are instrumented on the provider (single choke point) rather than each caller. Keep event names kebab-case and stable renaming splits history in the dashboard.

---

## Configuration

Two public (non-secret) values baked into [`site.ts`](../src/content/site.ts) as `SITE.integrations.umami`:

| Field | Value |
|:---|:---|
| `websiteId` | The Umami website UUID (public, like a GA measurement ID) |
| `src` | `https://cloud.umami.is/script.js` |

Setting `SITE.integrations.umami` to `null` turns analytics off the loader renders nothing (graceful degradation). Dev builds never load the tracker regardless; it's `PROD`-gated.

---

## Verify

1. `npm run build && npm run preview` → DevTools → Network: `script.js` loads and `/api/send` fires on load **and** each navigation.
2. Umami → Realtime: the visit shows up; route changes are separate pageviews.
3. `npm run dev` → confirm **no** beacon (dev is `PROD`-gated).
4. Open the contact modal → confirm `contact-open` appears in Umami → Events.

## Rollback

Remove `<Analytics />` from [`App.tsx`](../src/app/App.tsx) one line; tracker stops loading on next deploy. Any remaining `track()` calls become harmless no-ops.
