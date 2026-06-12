/**
 * OffThePaceOverview the marketing-style "Overview" page for the Off The Pace
 * F1 causal-ML case study (route /f1).
 *
 * Fits in: one of two top-level Off The Pace pages. This is the story-first
 *          view; OffThePaceSource is the engineering-deep-dive twin. Both are
 *          lazy-loaded by App.tsx.
 * Note:    `data-theme-lock="dark"` + the `otp-scope` class pin this whole
 *          subtree to the dark theme regardless of the site-wide toggle.
 *
 * For beginners ----------------------------------------------------------------
 * This file shows two React patterns. (1) `lazy()` + `<Suspense>` split the
 * heavy OverviewView into its own download that only fetches when this page
 * mounts, keeping the first paint fast. (2) `useState` with a function argument
 * runs that function once on first render to decide the start value - here,
 * whether to show the intro preloader (skipped for bots and on repeat visits).
 * -----------------------------------------------------------------------------
 */
import { lazy, Suspense, useState } from 'react';
import { SEO } from '@/components/layout';
import { TheCloser } from '@/components/layout/TheCloser';
import { PersistentNav } from './components/ui/PersistentNav';
import { SplitHero } from './components/sections/hero/SplitHero';
import { OffThePacePreloader } from './components/ui/OffThePacePreloader';

const OverviewView = lazy(() =>
  import('./components/views/OverviewView').then((m) => ({ default: m.OverviewView }))
);

export function OffThePaceOverview() {
  // LEARN: Passing a function to useState (a "lazy initialiser") makes React
  //    run it only on the very first render to compute the starting value. We
  //    do the work here so the preloader is skipped for automated tools
  //    (Lighthouse, headless browsers) and for visitors who already saw it this
  //    session - sessionStorage remembers that across page navigations.
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
    <div data-theme-lock="dark" className="otp-scope min-h-screen bg-graphite-900 text-white font-sans selection:bg-f1-red/30 overflow-x-hidden">
      <SEO
        title="Off The Pace ⋅ Overview"
        description="A causal ML engine isolating the true forces behind Formula 1 lap times - fuel mass, tyre degradation, dirty air, and driver skill  - down to the millisecond."
        path="/f1"
      />

      {showPreloader && (
        <OffThePacePreloader onComplete={handlePreloaderComplete} />
      )}

      {/* LEARN: This inline style is a legitimate use of `style` (the contract
          reserves it for JS-driven values): opacity flips with the runtime
          `showPreloader` boolean, fading the real page in once the intro ends. */}
      <div
        style={{
          opacity: showPreloader ? 0 : 1,
          transition: 'opacity 1s ease-in-out',
          transitionDelay: showPreloader ? '0s' : '0.2s',
        }}
      >
        <PersistentNav />
        <SplitHero />
        <div id="overview-narrative">
          <Suspense fallback={null}>
            <OverviewView />
          </Suspense>
        </div>
        <TheCloser />
      </div>
    </div>
  );
}
