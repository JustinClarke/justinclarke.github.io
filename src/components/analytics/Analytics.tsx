/**
 * Analytics loads the Umami visitor-analytics script, once, in production.
 *
 * Fits in: rendered once in App.tsx. It draws nothing returns null.
 * Note:    deliberately skips dev builds, missing config, automated browsers
 *          (Playwright/screenshot tool), and double-injection so it only ever
 *          adds one real tracker on the live site.
 *
 * For beginners ----------------------------------------------------------------
 * A component can have an effect but no visible output. useEffect runs once
 * after mount and builds a <script> tag by hand, appending it to the page <head>
 * the same as writing <script src=...> in HTML, but done conditionally from JS.
 * `import.meta.env` is Vite's way of reading build-time environment variables.
 * -----------------------------------------------------------------------------
 */
import { useEffect } from 'react';

const WEBSITE_ID = import.meta.env.VITE_UMAMI_WEBSITE_ID;
const SRC = import.meta.env.VITE_UMAMI_SRC ?? 'https://cloud.umami.is/script.js';

/** Loads the Umami tracker once: production + real-browser only. Renders nothing. */
export function Analytics() {
  useEffect(() => {
    if (!import.meta.env.PROD || !WEBSITE_ID) return;
    // Cheap defence against the dev-only screenshot tool (Playwright sets webdriver).
    if (navigator.webdriver) return;
    if (document.querySelector('script[data-website-id]')) return;

    const s = document.createElement('script');
    s.defer = true;
    s.src = SRC;
    s.setAttribute('data-website-id', WEBSITE_ID);
    s.setAttribute('data-domains', 'justinclarke.github.io');
    document.head.appendChild(s);
  }, []);

  return null;
}
