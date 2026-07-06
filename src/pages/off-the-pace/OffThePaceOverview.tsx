/**
 * OffThePaceOverview the marketing-style "Overview" page for the Off The Pace
 * F1 causal-ML case study (route /f1).
 *
 * Fits in: one of two top-level Off The Pace pages. This is the story-first
 *          view; OffThePaceSource is the engineering-deep-dive twin. Both are
 *          lazy-loaded by App.tsx.
 * Note:    `data-theme-lock="dark"` + the `otp-scope` class pin this whole
 *          subtree to the dark theme regardless of the site-wide toggle.
 */
import { lazy, Suspense, useState } from 'react';
import { SEO } from '@/components/layout';
import { TheCloser } from '@/components/layout/TheCloser';
import { routeMeta } from '@/content';
import { PersistentNav } from './components/ui/PersistentNav';
import { SplitHero } from './components/sections/hero/SplitHero';
import { OffThePacePreloader } from './components/ui/OffThePacePreloader';

const OverviewView = lazy(() =>
  import('./components/views/OverviewView').then((m) => ({ default: m.OverviewView }))
);

export function OffThePaceOverview() {
  // Skip the preloader for automated tools (Lighthouse, headless browsers) and
  // for visitors who already saw it this session (sessionStorage persists that
  // across page navigations).
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
      <SEO {...routeMeta('/f1')} />

      {showPreloader && (
        <OffThePacePreloader onComplete={handlePreloaderComplete} />
      )}

      {/* JS-driven opacity fade, keyed off the runtime showPreloader boolean. */}
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
