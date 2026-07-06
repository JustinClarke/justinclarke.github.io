/**
 * App.tsx the app shell: it decides WHICH page to show and animates the
 * transition between pages.
 *
 * Fits in: rendered once by main.tsx, inside all the providers. Every page of
 *          the site is mounted by the <Routes> block near the bottom.
 * Note:    two separate, tricky concerns live here (1) whether to show the
 *          intro Preloader, and (2) the cross-fade when the URL changes. Both
 *          are commented in detail below.
 */
import { lazy, Suspense, useEffect, useRef, useState, type ComponentType, type ReactNode } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { CommandDock, SEO, GlobalSpotlight } from '@/components/layout';
import { Analytics } from '@/components/analytics';
import { initTooltips, debug } from '@/utils';
import { ContactModal } from '@/components/modals';
import { EmailModal } from '@/components/modals/EmailModal';
import { ROUTES, type RoutePath } from '@/content/routes';

// Silent-by-default logger (localStorage.debug = 'app'); see utils/debug.ts.
const log = debug('app');

// ─── Lazy-loaded pages ────────────────────────────────────────────────────────
// Every page is code-split into its own chunk, downloaded only on navigation, so
// the homepage payload stays small. `.then(m => ({ default: m.X }))` adapts our
// named exports to the default-export shape `lazy` expects.
const Home = lazy(() => import('@/pages/home/Home').then(m => ({ default: m.Home })));

const Preloader = lazy(() => import('@/components/layout/Preloader').then(m => ({ default: m.Preloader })));
const ConnectPage = lazy(() => import('@/pages/Connect').then(m => ({ default: m.ConnectPage })));

const NotFound = lazy(() => import('@/pages/NotFound').then(m => ({ default: m.NotFound })));
const TheLongVersionPage = lazy(() => import('@/pages/TheLongVersion'));
const SpotifyEnginePage = lazy(() => import('@/pages/projects/SpotifyEnginePage').then(m => ({ default: m.SpotifyEnginePage })));
const SqlDisasterPage = lazy(() => import('@/pages/projects/SqlDisasterPage/SqlDisasterPage').then(m => ({ default: m.SqlDisasterPage })));
const LiteStorePage = lazy(() => import('@/pages/projects/LiteStorePage').then(m => ({ default: m.LiteStorePage })));
const CapitalBudgetingPage = lazy(() => import('@/pages/projects/CapitalBudgetingPage').then(m => ({ default: m.CapitalBudgetingPage })));
const HRArchetypePage = lazy(() => import('@/pages/projects/HRArchetypePage').then(m => ({ default: m.HRArchetypePage })));
const OffThePaceOverview = lazy(() => import('@/pages/off-the-pace/OffThePaceOverview').then(m => ({ default: m.OffThePaceOverview })));
const OffThePaceSource = lazy(() => import('@/pages/off-the-pace/OffThePaceSource').then(m => ({ default: m.OffThePaceSource })));
const LinkedinBannerPage = lazy(() => import('@/pages/LinkedinBannerPage').then(m => ({ default: m.LinkedinBannerPage })));
const StudioPage = lazy(() => import('@/pages/studio/StudioPage').then(m => ({ default: m.StudioPage })));
const CrescendoPage = lazy(() => import('@/pages/studio/CrescendoPage').then(m => ({ default: m.CrescendoPage })));
const StrokTalkPage = lazy(() => import('@/pages/studio/StrokTalkPage').then(m => ({ default: m.StrokTalkPage })));

// ─── Route → component map ───────────────────────────────────────────────────
// WHICH pages exist (paths, titles, dark flag, sitemap data) lives in the
// content/routes.ts manifest; this map only says which component renders each
// path. `Record<RoutePath, …>` is exhaustive both ways: a manifest entry with
// no component here is a TS error, and so is a stale entry for a deleted
// route so a forker who removes a case study gets pointed at exactly the
// two lines (here + the lazy import above) left to delete.
const ROUTE_COMPONENTS: Record<RoutePath, ComponentType> = {
  '/': Home,
  '/project/spotify-engine': SpotifyEnginePage,
  '/project/sql-disaster': SqlDisasterPage,
  '/project/litestore': LiteStorePage,
  '/project/capital-budgeting': CapitalBudgetingPage,
  '/project/hr-archetype': HRArchetypePage,
  '/the-long-version': TheLongVersionPage,
  '/f1': OffThePaceOverview,
  '/off-the-pace': OffThePaceSource,
  '/connect': ConnectPage,
  '/contact': ConnectPage, // aliasOf '/connect' renders the same page
  '/linkedin-banner': LinkedinBannerPage,
  '/studio': StudioPage,
  '/studio/crescendo': CrescendoPage,
  '/studio/stroktalk': StrokTalkPage,
};

// ─── Preloader policy ─────────────────────────────────────────────────────────
// The intro ("Preloader") should appear at most ONCE per browser tab,
// and never on certain pages or devices. The rules are fiddly, so we keep them
// in one place `decideInitialPreloader()` below instead of scattering them.

// In-memory guard against `decideInitialPreloader` running twice (StrictMode
// double-invokes state initializers in dev). Other modules that need "is the
// preloader done" (e.g. useTerminalBoot) can't see this module-local `let`
// they read `sessionStorage`, which `markPreloaderComplete` keeps in sync.
let preloaderComplete = false;

function markPreloaderComplete() {
  preloaderComplete = true;
  try { sessionStorage.setItem('preloader_shown', 'true'); } catch { /* ignore */ }
}

/**
 * Work out on the very first render only whether to show the intro Preloader.
 * Returns true to show it, false to skip it. As a side effect, it latches the
 * "complete" flag whenever it decides to skip, so we never show it later. Called
 * once from the useState initializer; kept as a named function so a stack trace
 * points straight at "the preloader decision".
 */
function decideInitialPreloader(isTheLongVersion: boolean, isOffThePace: boolean): boolean {
  // Already finished earlier in this tab's life → never show again.
  if (preloaderComplete) {
    log('preloader: skip (already completed this session)');
    return false;
  }

  // Deep-linking straight into a content page? Skip the intro the visitor
  // came for that page, not the homepage animation.
  if (isTheLongVersion || isOffThePace) {
    markPreloaderComplete();
    log('preloader: skip (deep link to content page)');
    return false;
  }

  // Phones (≤768px) skip the heavy intro for performance.
  if (typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches) {
    markPreloaderComplete();
    log('preloader: skip (small screen)');
    return false;
  }

  // Seen it already this tab session? `sessionStorage` remembers until the tab
  // is closed. The try/catch guards browsers that block storage.
  try {
    if (sessionStorage.getItem('preloader_shown')) {
      preloaderComplete = true;
      log('preloader: skip (sessionStorage flag)');
      return false;
    }
  } catch {
    // ignore storage restrictions (private mode, blocked cookies, …)
  }

  log('preloader: SHOW (first visit this session)');
  return true;
}

const getNormalizedPathname = (path: string): string => {
  return path !== '/' && path.endsWith('/') ? path.slice(0, -1) : path;
};

/**
 * DarkRoute wraps a page that must stay dark regardless of the site theme
 * (project case studies, the studio, Off The Pace). `data-theme-lock="dark"`
 * pins the flipping --color-* tokens to their dark values for everything
 * inside, and `bg-surface` paints the dark page background so the now
 * theme-aware <body> (which turns white in light mode) never shows through.
 */
function DarkRoute({ children }: { children: ReactNode }) {
  return (
    <div data-theme-lock="dark" className="min-h-screen bg-surface text-fg">
      {children}
    </div>
  );
}

/**
 * Main application layout and routing.
 * Root providers (Modal, ErrorBoundary) are handled in RootProviders via main.tsx.
 */
export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // The heart of the page-transition machine: we deliberately keep TWO locations.
  // `location` is where the URL says we are right now; `displayLocation` is the
  // page currently painted. During a transition they differ for a moment we hold
  // the old page on screen (fade it out) before swapping `displayLocation` over.
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionState, setTransitionState] = useState<'idle' | 'fade-out'>('idle');

  const isTheLongVersion = getNormalizedPathname(displayLocation.pathname) === '/the-long-version';
  const isOffThePace = getNormalizedPathname(displayLocation.pathname) === '/f1' || getNormalizedPathname(displayLocation.pathname) === '/off-the-pace';

  // Lazy initializer so the side-effecting preloader decision runs exactly once.
  const [showPreloader, setShowPreloader] = useState(() =>
    decideInitialPreloader(
      getNormalizedPathname(location.pathname) === '/the-long-version',
      getNormalizedPathname(location.pathname) === '/f1' || getNormalizedPathname(location.pathname) === '/off-the-pace'
    ),
  );

  // Snapshot the initial decision so Effect 1's "once" logic stays correct even
  // after `showPreloader` flips to false.
  const initialShowPreloader = useRef(showPreloader);

  // ── Effect 1: finish-the-preloader wiring (runs once on mount) ──────────────
  useEffect(() => {
    // Stop the browser from auto-restoring scroll position on navigation; we
    // manage scrolling ourselves (we always jump to the top of a new page).
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // What to do when the intro animation reports it's finished.
    const handlePreloaderComplete = () => {
      markPreloaderComplete();
      setShowPreloader(false);
      // Hover tooltips for the page underneath start only after the intro is gone.
      initTooltips();
      log('preloader: complete');
    };

    // If we already decided to skip the preloader, run the "done" steps now.
    if (!initialShowPreloader.current) {
      handlePreloaderComplete();
      return;
    }

    // Otherwise wait for the Preloader component to dispatch its event...
    window.addEventListener('preloaderComplete', handlePreloaderComplete);
    // ...with a 3.5s safety net so a stuck animation can never trap the visitor.
    const timeout = setTimeout(handlePreloaderComplete, 3500);

    return () => {
      window.removeEventListener('preloaderComplete', handlePreloaderComplete);
      clearTimeout(timeout);
    };
  }, []);

  // ── Effect 2: page-transition state machine ─────────────────────────────────
  // Drives the cross-fade: fade the old page out, jump to the top, swap in the
  // new page, fade it back in. Runs on any `location`/`displayLocation` change.
  useEffect(() => {
    const normLoc = getNormalizedPathname(location.pathname);
    const normDisp = getNormalizedPathname(displayLocation.pathname);

    if (normLoc !== normDisp) {
      // The path changed → begin fading the current page out.
      log('navigate', displayLocation.pathname, '→', location.pathname);
      setTransitionState('fade-out');

      // The "long version" page gets a slower, more dramatic fade.
      const isCurrentLong = getNormalizedPathname(displayLocation.pathname) === '/the-long-version';
      const duration = isCurrentLong ? 600 : 400; // fade-out time in ms

      const timer = setTimeout(() => {
        // Only scroll if the tab is actually visible scrolling a hidden/
        // background tab can be ignored or janky.
        if (document.visibilityState === 'visible') {
          window.scrollTo(0, 0);
        }
        setDisplayLocation(location); // swap the page that's painted
        setTransitionState('idle');   // fade the new one in
      }, duration);

      return () => clearTimeout(timer);
    } else if (
      // Same page (or trailing slash difference resolved), but the query string /
      // hash / history key changed (e.g. a ?tab=… link or back/forward).
      // Update without a full fade.
      location.pathname !== displayLocation.pathname ||
      location.search !== displayLocation.search ||
      location.hash !== displayLocation.hash ||
      location.key !== displayLocation.key
    ) {
      setDisplayLocation(location);
    }
  }, [location, displayLocation]);

  // ── Effect 3: trailing-slash normalization ─────────────────────────────────
  // Redirect /f1/ → /f1 in-place (no reload) so analytics and page checks see a
  // single canonical path.
  useEffect(() => {
    if (location.pathname !== '/' && location.pathname.endsWith('/')) {
      navigate({
        pathname: location.pathname.slice(0, -1),
        search: location.search,
        hash: location.hash,
      }, { replace: true });
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen text-fg selection:bg-brand-primary/20">
      {/* "Skip to content": invisible until keyboard-focused, lets keyboard and
          screen-reader users jump past the nav straight to the page. */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded-md focus:font-mono focus:text-xs focus:font-bold">
        SKIP TO CONTENT
      </a>
      <SEO />          {/* sets <title> + social-share meta tags per page */}
      <Analytics />    {/* loads the privacy-friendly Umami analytics script */}
      {showPreloader && <Suspense fallback={null}><Preloader /></Suspense>}
      {/* <CustomCursor /> */}
      <GlobalSpotlight />
      <CommandDock />

      <div
        // Keying on the pathname forces each page to mount clean instead of being
        // reused across a transition don't drop this or pages bleed into each other.
        key={displayLocation.pathname}
        className={`min-h-screen flex flex-col ${
          transitionState === 'fade-out'
            ? (isTheLongVersion ? 'page-exit-slow' : 'page-exit')
            : (isTheLongVersion ? 'page-enter-slow' : 'page-enter')
        }`}
      >
        <main id="main-content" className="flex-grow flex flex-col">
          {/* fallback={null}: pages load fast enough that a spinner would only flash. */}
          <Suspense fallback={null}>
            {/* Routes are generated from the content/routes.ts manifest (single
                source of truth); `path="*"` is the catch-all 404. */}
            <Routes location={displayLocation} key={displayLocation.pathname}>
              {ROUTES.map(route => {
                const Page = ROUTE_COMPONENTS[route.path];
                const element = 'dark' in route && route.dark
                  ? <DarkRoute><Page /></DarkRoute>
                  : <Page />;
                return <Route key={route.path} path={route.path} element={element} />;
              })}
              <Route path="*" element={<DarkRoute><NotFound /></DarkRoute>} />
            </Routes>
          </Suspense>
        </main>
      </div>
      {/* The modals live OUTSIDE the page so they stay mounted across navigation
          and can float above any page. They show themselves based on shared
          state from ModalProvider (see useModal). */}
      <ContactModal />
      <EmailModal />
    </div>
  );
}
