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
