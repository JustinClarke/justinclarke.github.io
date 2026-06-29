/**
 * App.tsx the app shell: it decides WHICH page to show and animates the
 * transition between pages.
 *
 * Fits in: rendered once by main.tsx, inside all the providers. Every page of
 *          the site is mounted by the <Routes> block near the bottom.
 * Note:    two separate, tricky concerns live here (1) whether to show the
 *          intro Preloader, and (2) the cross-fade when the URL changes. Both
 *          are commented in detail below.
 *
 * For beginners ----------------------------------------------------------------
 * Think of this as the picture frame around the site. The frame is always the
 * same (skip-link, SEO tags, analytics, "back to top" button, the modals); only
 * the picture inside (the current page) swaps out as you navigate.
 * -----------------------------------------------------------------------------
 */
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { CommandDock, SEO, GlobalSpotlight } from '@/components/layout';
import { Analytics } from '@/components/analytics';
import { initTooltips, initScrollAnimations, debug } from '@/utils';
import { ContactModal } from '@/components/modals';
import { EmailModal } from '@/components/modals/EmailModal';

// LEARN: A logger labelled "app". It prints nothing unless you enable debugging
//    (see src/utils/debug.ts). Turn it on in the console with:
//    localStorage.debug = 'app'  then refresh.
const log = debug('app');

// ─── Lazy-loaded pages ────────────────────────────────────────────────────────
// LEARN: `lazy(() => import(...))` tells the build tool to put each page in its OWN
//    JavaScript file and only download it when the visitor actually navigates
//    there. This is "code splitting": the homepage loads fast because the code
//    for, say, the HR Archetype page isn't downloaded until it's needed.
//    The `.then(m => ({ default: m.X }))` dance is just adapting a named export
//    (`export function X`) to the "default export" shape `lazy` expects.
const Home = lazy(() => import('@/pages/home/Home').then(m => ({ default: m.Home })));

const Preloader = lazy(() => import('@/components/layout/Preloader').then(m => ({ default: m.Preloader })));
const ConnectPage = lazy(() => import('@/pages/Connect').then(m => ({ default: m.ConnectPage })));

const NotFound = lazy(() => import('@/pages/NotFound').then(m => ({ default: m.NotFound })));
const TheLongVersionPage = lazy(() => import('@/pages/TheLongVersion'));
const SpotifyEnginePage = lazy(() => import('@/pages/projects/SpotifyEnginePage').then(m => ({ default: m.SpotifyEnginePage })));
const SqlDisasterPage = lazy(() => import('@/pages/projects/SqlDisasterPage').then(m => ({ default: m.SqlDisasterPage })));
const LiteStorePage = lazy(() => import('@/pages/projects/LiteStorePage').then(m => ({ default: m.LiteStorePage })));
const CapitalBudgetingPage = lazy(() => import('@/pages/projects/CapitalBudgetingPage').then(m => ({ default: m.CapitalBudgetingPage })));
const HRArchetypePage = lazy(() => import('@/pages/projects/HRArchetypePage').then(m => ({ default: m.HRArchetypePage })));
const OffThePaceOverview = lazy(() => import('@/pages/off-the-pace/OffThePaceOverview').then(m => ({ default: m.OffThePaceOverview })));
const OffThePaceSource = lazy(() => import('@/pages/off-the-pace/OffThePaceSource').then(m => ({ default: m.OffThePaceSource })));
const LinkedinBannerPage = lazy(() => import('@/pages/LinkedinBannerPage').then(m => ({ default: m.LinkedinBannerPage })));
const PortfolioPage = lazy(() => import('@/pages/studio/index').then(m => ({ default: m.PortfolioPage })));
const CrescendoPage = lazy(() => import('@/pages/studio/CrescendoPage').then(m => ({ default: m.CrescendoPage })));
const StrokTalkPage = lazy(() => import('@/pages/studio/StrokTalkPage').then(m => ({ default: m.StrokTalkPage })));

// ─── Preloader policy ─────────────────────────────────────────────────────────
// The intro ("Preloader") should appear at most ONCE per browser tab,
// and never on certain pages or devices. The rules are fiddly, so we keep them
// in one place `decideInitialPreloader()` below instead of scattering them.

// LEARN: A module-level `let` is a single value shared by EVERY render and every
//    component instance in this file (unlike useState, which is per-component).
//    We use it as a one-way latch: once the preloader is done, it stays done,
//    even if React re-creates the App component during navigation.
let globalPreloaderCompleted = false;

// LEARN: The app also stashes the same fact on the global `window` object so code
//    OUTSIDE React (the prerender script, other modules) can read it. These two
//    helpers just hide the verbose, repeated `(window as any).__PRELOADER...`
//    casts so the logic below reads cleanly.
function isPreloaderMarkedCompleteGlobally(): boolean {
  return typeof window !== 'undefined' && Boolean((window as any).__PRELOADER_COMPLETE__);
}
function markPreloaderComplete() {
  globalPreloaderCompleted = true;
  if (typeof window !== 'undefined') (window as any).__PRELOADER_COMPLETE__ = true;
}

/**
 * Work out on the very first render only whether to show the intro Preloader.
 * Returns true to show it, false to skip it. As a side effect, it latches the
 * "complete" flags whenever it decides to skip, so we never show it later.
 *
 * LEARN: This is a plain function (not a component). We call it ONCE, from the
 *    useState initializer, to compute the starting value. Splitting it out like
 *    this means a debugger/stack trace points straight at "the preloader
 *    decision" instead of a tangle inside the component body.
 */
function decideInitialPreloader(isTheLongVersion: boolean, isOffThePace: boolean): boolean {
  // Already finished earlier in this tab's life → never show again.
  if (globalPreloaderCompleted) {
    log('preloader: skip (already completed this session)');
    return false;
  }
  if (isPreloaderMarkedCompleteGlobally()) {
    globalPreloaderCompleted = true;
    log('preloader: skip (window flag already set)');
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
      markPreloaderComplete();
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
 * Main application layout and routing.
 * Root providers (Modal, ErrorBoundary) are handled in RootProviders via main.tsx.
 */
export default function App() {
  // LEARN: useLocation() is a hook from the router. It returns the current URL info
  //    (pathname, search, hash). When the URL changes, this component re-renders
  //    with the new value that's how we react to navigation.
  const location = useLocation();
  const navigate = useNavigate();

  // LEARN: We deliberately keep TWO locations: `location` is where the URL says we
  //    are RIGHT NOW; `displayLocation` is the page currently painted on screen.
  //    During a transition they differ for a moment we hold the old page on
  //    screen (fade it out) before swapping `displayLocation` to the new one.
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionState, setTransitionState] = useState<'idle' | 'fade-out'>('idle');

  const isTheLongVersion = getNormalizedPathname(displayLocation.pathname) === '/the-long-version';
  const isOffThePace = getNormalizedPathname(displayLocation.pathname) === '/f1' || getNormalizedPathname(displayLocation.pathname) === '/off-the-pace';

  // LEARN: useState can take a FUNCTION instead of a value. React calls it once, on
  //    the first render only, to compute the initial state. We use that to run
  //    our (slightly expensive, side-effecting) preloader decision exactly once.
  const [showPreloader, setShowPreloader] = useState(() =>
    decideInitialPreloader(
      getNormalizedPathname(location.pathname) === '/the-long-version',
      getNormalizedPathname(location.pathname) === '/f1' || getNormalizedPathname(location.pathname) === '/off-the-pace'
    ),
  );

  // LEARN: useRef holds a value that survives re-renders but, unlike state, changing
  //    it does NOT trigger a re-render. Here we snapshot the initial preloader
  //    decision so the effect below runs its "once" logic correctly even though
  //    `showPreloader` will change to false later.
  const initialShowPreloader = useRef(showPreloader);

  // ── Effect 1: finish-the-preloader wiring (runs once on mount) ──────────────
  // LEARN: useEffect runs code AFTER the component is painted. The empty array `[]`
  //    at the end means "run this only once, when App first appears" like an
  //    onload handler for the component.
  useEffect(() => {
    // Stop the browser from auto-restoring scroll position on navigation; we
    // manage scrolling ourselves (we always jump to the top of a new page).
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // What to do when the intro animation reports it's finished.
    const handlePreloaderComplete = () => {
      markPreloaderComplete();
      try { sessionStorage.setItem('preloader_shown', 'true'); } catch { /* ignore */ }
      setShowPreloader(false);
      // These set up the scroll-triggered reveal animations and hover tooltips
      // for the page underneath. We start them only after the intro is gone.
      initTooltips();
      initScrollAnimations();
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

    // LEARN: The function you RETURN from useEffect is its "cleanup". React runs it
    //    when the component is removed, to undo the listener/timer above so they
    //    don't leak. Always pair an addEventListener with a removeEventListener.
    return () => {
      window.removeEventListener('preloaderComplete', handlePreloaderComplete);
      clearTimeout(timeout);
    };
  }, []);

  // ── Effect 2: page-transition state machine ─────────────────────────────────
  // LEARN: This effect runs whenever `location` or `displayLocation` changes. It
  //    drives the cross-fade: fade the old page out, jump to the top, then swap
  //    in the new page and fade it back in.
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
  // LEARN: If a visitor lands on a path with a trailing slash (e.g., /f1/),
  //    redirect them immediately to the clean version (e.g., /f1) without causing
  //    a full reload. This unifies analytics tracking and page checks.
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
    <div className="min-h-screen text-white selection:bg-white/20">
      {/* LEARN: "Skip to content" link: invisible until keyboard-focused (sr-only =
          screen-reader only). Lets keyboard/screen-reader users jump past the
          nav straight to the page. An accessibility best practice. */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded-md focus:font-mono focus:text-xs focus:font-bold">
        SKIP TO CONTENT
      </a>
      <SEO />          {/* sets <title> + social-share meta tags per page */}
      <Analytics />    {/* loads the privacy-friendly Umami analytics script */}
      {/* LEARN: `{condition && <Thing />}` renders <Thing /> only when condition is
          true. So the Preloader appears only while showPreloader is true. */}
      {showPreloader && <Suspense fallback={null}><Preloader /></Suspense>}
      {/* <CustomCursor /> */}
      <GlobalSpotlight />
      <CommandDock />

      <div
        // LEARN: The `key` prop is a hint to React: when it changes, React throws
        //    away the old subtree and builds a fresh one. Keying on the pathname
        //    guarantees the new page mounts cleanly instead of being reused.
        key={displayLocation.pathname}
        className={`min-h-screen flex flex-col ${
          transitionState === 'fade-out'
            ? (isTheLongVersion ? 'page-exit-slow' : 'page-exit')
            : (isTheLongVersion ? 'page-enter-slow' : 'page-enter')
        }`}
      >
        <main id="main-content" className="flex-grow flex flex-col">
          {/* LEARN: <Suspense> shows its `fallback` while a lazy page is still
              downloading. We pass `null` (nothing) because pages load fast and a
              spinner would flash annoyingly. */}
          <Suspense fallback={null}>
            {/* LEARN: <Routes> looks at the URL and renders the ONE <Route> whose
                `path` matches. `path="*"` is the catch-all 404 at the end. */}
            <Routes location={displayLocation} key={displayLocation.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/project/spotify-engine" element={<SpotifyEnginePage />} />
              <Route path="/project/sql-disaster" element={<SqlDisasterPage />} />
              <Route path="/project/litestore" element={<LiteStorePage />} />
              <Route path="/project/capital-budgeting" element={<CapitalBudgetingPage />} />
              <Route path="/project/hr-archetype" element={<HRArchetypePage />} />
              <Route path="/the-long-version" element={<TheLongVersionPage />} />
              <Route path="/f1" element={<OffThePaceOverview />} />
              <Route path="/off-the-pace" element={<OffThePaceSource />} />
              <Route path="/connect" element={<ConnectPage />} />
              <Route path="/contact" element={<ConnectPage />} />
              <Route path="/linkedin-banner" element={<LinkedinBannerPage />} />
              <Route path="/studio" element={<PortfolioPage />} />
              <Route path="/studio/crescendo" element={<CrescendoPage />} />
              <Route path="/studio/stroktalk" element={<StrokTalkPage />} />
              <Route path="*" element={<NotFound />} />
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
