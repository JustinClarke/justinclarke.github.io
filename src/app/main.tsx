/**
 * main.tsx the entry point. This is the very first app code the browser runs.
 *
 * index.html ships a single empty <div id="root"></div>; this file mounts React
 * into it. The order of the wrapper components below matters see RootProviders.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { RootProviders } from '@/providers';
import App from './App';
import '../index.css';

const rootElement = document.getElementById('root')!;

createRoot(rootElement).render(
  // Each wrapper below adds a capability to everything inside it. Read them as
  // nested boxes, outermost first:
  <StrictMode>
    <BrowserRouter>
      {/* Client-side routing; the route → component choices live in App.tsx. */}
      <RootProviders>
        {/* RootProviders bundles app-wide features (theme, modals, error
            handling). See src/app/providers/RootProviders.tsx. */}
        <App />
      </RootProviders>
    </BrowserRouter>
  </StrictMode>,
);

// Prerender contract: the build-time snapshot tool waits for `render-ready`
// before capturing the finished HTML. Fire it only once the app has mounted.
document.dispatchEvent(new Event('render-ready'));
