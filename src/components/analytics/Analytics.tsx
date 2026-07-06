/**
 * Analytics loads the Umami visitor-analytics script, once, in production.
 *
 * Fits in: rendered once in App.tsx. It draws nothing returns null.
 * Note:    deliberately skips dev builds, a disabled integration
 *          (SITE.integrations.umami: null), automated browsers
 *          (Playwright/screenshot tool), and double-injection so it only ever
 *          adds one real tracker on the live site.
 */
import { useEffect } from 'react';
import { SITE, type SiteConfig } from '@/content';

// Widened to the config union so the null branch stays a checked code path
// even while this deployment has the integration switched on.
const UMAMI: SiteConfig['integrations']['umami'] = SITE.integrations.umami;

/** Loads the Umami tracker once: production + real-browser only. Renders nothing. */
export function Analytics() {
  useEffect(() => {
    if (!import.meta.env.PROD || !UMAMI) return;
    // Cheap defence against the dev-only screenshot tool (Playwright sets webdriver).
    if (navigator.webdriver) return;
    if (document.querySelector('script[data-website-id]')) return;

    const s = document.createElement('script');
    s.defer = true;
    s.src = UMAMI.src;
    s.setAttribute('data-website-id', UMAMI.websiteId);
    s.setAttribute('data-domains', SITE.domain);
    document.head.appendChild(s);
  }, []);

  return null;
}
