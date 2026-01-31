import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { BackToTop, SEO } from '@/components/layout';
import { Analytics } from '@/components/analytics';
import { initTooltips, initScrollAnimations } from '@/utils';
import { ContactModal } from '@/components/modals';
import { EmailModal } from '@/components/modals/EmailModal';

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


let globalPreloaderCompleted = false;

/**
 * Main application layout and routing.
 * Root providers (Modal, ErrorBoundary) are handled in RootProviders via main.tsx.
 */
export default function App() {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionState, setTransitionState] = useState<'idle' | 'fade-out'>('idle');

  const isTheLongVersion = displayLocation.pathname === '/the-long-version';
  const isOffThePace = displayLocation.pathname === '/f1' || displayLocation.pathname === '/off-the-pace';

  const [showPreloader, setShowPreloader] = useState(() => {
    if (globalPreloaderCompleted) return false;
    if (typeof window !== 'undefined' && (window as any).__PRELOADER_COMPLETE__) {
      globalPreloaderCompleted = true;
      return false;
    }
    if (isTheLongVersion || isOffThePace) {
      globalPreloaderCompleted = true;
      if (typeof window !== 'undefined') (window as any).__PRELOADER_COMPLETE__ = true;
      return false;
    }
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches) {
      globalPreloaderCompleted = true;
      (window as any).__PRELOADER_COMPLETE__ = true;
      return false;
    }
    try {
      if (sessionStorage.getItem('preloader_shown')) {
        globalPreloaderCompleted = true;
        (window as any).__PRELOADER_COMPLETE__ = true;
        return false;
      }
    } catch (e) {
      // ignore storage restrictions
    }
    return true;
  });

  // Capture initial showPreloader value so the effect runs exactly once,
  // avoiding a double-call to initTooltips/initScrollAnimations on state change.
  const initialShowPreloader = useRef(showPreloader);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const handlePreloaderComplete = () => {
      (window as any).__PRELOADER_COMPLETE__ = true;
      globalPreloaderCompleted = true;
      try { sessionStorage.setItem('preloader_shown', 'true'); } catch (e) { /* ignore */ }
      setShowPreloader(false);
      initTooltips();
      initScrollAnimations();
    };

    if (!initialShowPreloader.current) {
      handlePreloaderComplete();
      return;
    }

    window.addEventListener('preloaderComplete', handlePreloaderComplete);
    const timeout = setTimeout(handlePreloaderComplete, 3500);

    return () => {
      window.removeEventListener('preloaderComplete', handlePreloaderComplete);
      clearTimeout(timeout);
    };
  }, []);

  // Page Transition State Machine:
  // Fades out the old page, scrolls to top when dark, switches location, and fades in.
  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setTransitionState('fade-out');

      const isCurrentLong = displayLocation.pathname === '/the-long-version';
      const duration = isCurrentLong ? 600 : 400; // time in ms for fade-out

      const timer = setTimeout(() => {
        if (document.visibilityState === 'visible') {
          window.scrollTo(0, 0);
        }
        setDisplayLocation(location);
        setTransitionState('idle');
      }, duration);

      return () => clearTimeout(timer);
    } else if (
      location.search !== displayLocation.search ||
      location.hash !== displayLocation.hash ||
      location.key !== displayLocation.key
    ) {
      setDisplayLocation(location);
    }
  }, [location, displayLocation]);

  return (
    <div className="min-h-screen text-white selection:bg-white/20">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded-md focus:font-mono focus:text-xs focus:font-bold">
        SKIP TO CONTENT
      </a>
      <SEO />
      <Analytics />
      {showPreloader && <Suspense fallback={null}><Preloader /></Suspense>}
      {/* <CustomCursor /> */}
      <BackToTop />

      <div
        key={displayLocation.pathname}
        className={`min-h-screen flex flex-col ${
          transitionState === 'fade-out'
            ? (isTheLongVersion ? 'page-exit-slow' : 'page-exit')
            : (isTheLongVersion ? 'page-enter-slow' : 'page-enter')
        }`}
      >
        <main id="main-content" className="flex-grow flex flex-col">
          <Suspense fallback={null}>
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
      </div>
      <ContactModal />
      <EmailModal />
    </div>
  );
}
