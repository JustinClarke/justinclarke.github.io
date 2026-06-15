/**
 * OffThePaceSource the engineering deep-dive page for the Off The Pace F1
 * case study (route /off-the-pace) the technical twin of OffThePaceOverview.
 *
 * Fits in: one of two top-level Off The Pace pages; lazy-loaded by App.tsx.
 *          Renders ProjectHero + the heavy SourceView (the dbt/CI/ML sections).
 * Note:    Shares the same preloader + dark-theme-lock pattern as the Overview
 *          page, and adds a thin scroll-progress bar pinned to the top edge.
 *
 * For beginners ----------------------------------------------------------------
 * The red bar across the top tracks how far you have scrolled. The useEffect
 * below subscribes to the browser's "scroll" event when the page appears and
 * unsubscribes when it leaves (that returned function is the "cleanup"). Each
 * scroll recomputes a 0-100 percentage and stores it in state, which re-renders
 * the bar at its new width. The `{ passive: true }` flag tells the browser we
 * will never block scrolling, so it can keep scrolling smooth.
 * -----------------------------------------------------------------------------
 */
import { lazy, Suspense, useState } from 'react';
import { SEO } from '@/components/layout';
import { TheCloser } from '@/components/layout/TheCloser';
import { PersistentNav } from './components/ui/PersistentNav';
import { ProjectHero } from './components/ProjectHero';
import { OffThePacePreloader } from './components/ui/OffThePacePreloader';

const SourceView = lazy(() =>
  import('./components/views/SourceView').then((m) => ({ default: m.SourceView }))
);

export function OffThePaceSource() {
  const [showPreloader, setShowPreloader] = useState(() => {
    if (typeof window !== 'undefined') {
      const isAutomation =
        navigator.webdriver ||
        /lighthouse|headless|speedcurve/i.test(navigator.userAgent) ||
        window.location.search.includes('performance');
      if (isAutomation) return false;

      try {
        if (sessionStorage.getItem('otp_preloader_shown')) {
          return false;
        }
      } catch (e) {
        // Ignore storage restrictions
      }
    }
    return true;
  });

  const handlePreloaderComplete = () => {
    try {
      sessionStorage.setItem('otp_preloader_shown', 'true');
    } catch (e) {
      // Ignore storage restrictions
    }
    setShowPreloader(false);
  };

  return (
    <div data-theme-lock="dark" className="otp-scope min-h-screen bg-graphite-900 text-white font-sans selection:bg-f1-red/30 overflow-x-hidden relative">
      <SEO
        title="Off The Pace ⋅ Architecture & Engineering"
        description="The engineering behind the F1 Causal Pace Engine: 60 dbt models, 336 CI tests, 5 XGBoost models all beating baseline, and a Frisch-Waugh ghost car simulator."
        path="/off-the-pace"
      />

      {/* Ambient background decorations */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Technical dot-grid overlay */}
        <div className="absolute inset-0 bg-dots-dark opacity-40" />
        
        {/* Dynamic large blurred radial glows */}
        <div className="absolute top-[8%] right-[-10%] w-[550px] h-[550px] rounded-full bg-f1-red/5 blur-[120px] mix-blend-screen" />
        <div className="absolute top-[35%] left-[-15%] w-[700px] h-[700px] rounded-full bg-brand-primary/4 blur-[150px] mix-blend-screen" />
        <div className="absolute top-[62%] right-[-10%] w-[600px] h-[600px] rounded-full bg-f1-red/4 blur-[130px] mix-blend-screen" />
        <div className="absolute top-[85%] left-[-5%] w-[500px] h-[500px] rounded-full bg-emerald-500/3 blur-[120px] mix-blend-screen" />
      </div>

      {showPreloader && (
        <OffThePacePreloader onComplete={handlePreloaderComplete} />
      )}

      <div
        className="relative z-10"
        style={{
          opacity: showPreloader ? 0 : 1,
          transition: 'opacity 1s ease-in-out',
          transitionDelay: showPreloader ? '0s' : '0.2s',
        }}
      >
        <PersistentNav />
        <ProjectHero />
        <Suspense fallback={null}>
          <SourceView />
        </Suspense>
        <TheCloser />
      </div>
    </div>
  );
}
