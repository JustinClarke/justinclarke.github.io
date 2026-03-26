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
