/**
 * main.tsx the entry point. This is the very first app code the browser runs.
 *
 * Fits in: index.html has a single empty <div id="root"></div>. This file finds
 *          that div and tells React to "take over" and draw the whole app inside
 *          it. Everything you see on screen ultimately starts here.
 * Note:    the order of the wrapper components below matters see RootProviders.
 *
 * For beginners ----------------------------------------------------------------
 * A plain website is HTML files the browser displays directly. A React app is
 * different: the HTML page is almost empty, and JavaScript *builds* the page
 * after it loads. This file is the "on" switch for that process.
 * -----------------------------------------------------------------------------
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { RootProviders } from '@/providers';
import App from './App';
import '../index.css'; // LEARN: importing CSS in JS is normal here the build tool
                       //    (Vite) bundles it into the page for us.

// LEARN: document.getElementById('root') grabs that empty <div> from index.html.
//    The `!` afterwards is a TypeScript promise to the compiler: "trust me,
//    this element really exists, it won't be null." (It always exists because
//    index.html defines it.) createRoot then hands that div to React.
const rootElement = document.getElementById('root')!;

createRoot(rootElement).render(
  // Each wrapper below adds a capability to everything inside it. Read them as
  // nested boxes, outermost first:
  <StrictMode>
    {/* LEARN: StrictMode is a development-only helper. It intentionally runs some
        code twice to surface bugs early. It disappears in production builds
        and never shows anything on screen. */}
    <BrowserRouter>
      {/* LEARN: Router = the thing that makes /project/litestore show a different
          page than /connect, WITHOUT a full page reload. It reads the URL and
          picks which component to show (the actual choices live in App.tsx). */}
      <RootProviders>
        {/* RootProviders bundles app-wide features (theme, modals, error
            handling). See src/app/providers/RootProviders.tsx. */}
        <App />
      </RootProviders>
    </BrowserRouter>
  </StrictMode>,
);

// LEARN: This site is "prerendered": at build time a headless browser loads the page
//    and saves a snapshot of the finished HTML (good for SEO and fast first
//    paint). Firing this event is our signal to that tool: "the app has mounted,
//    you may take the snapshot now."
document.dispatchEvent(new Event('render-ready'));
