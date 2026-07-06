/**
 * Home.tsx the homepage: the Hero terminal up top, then four lazy-loaded
 * sections (featured projects, expertise pipeline, career timeline, footer).
 *
 * Fits in: rendered by App.tsx for the "/" route.
 * Note:    the drifting teal background re-renders this component ~20x/second
 *          (see the interval below). React diffs the children and finds nothing
 *          changed, so the only real DOM work each tick is the style update.
 */
import React, { useEffect, useState } from 'react';
import { Hero } from './Hero';
import { useTheme } from '@/app/providers/ThemeProvider';
import { SkeletonLoader } from '@/ui/SkeletonLoader';

import { SEO } from '@/components/layout';
import { routeMeta } from '@/content';
// Below-fold sections are code-split and streamed in as the visitor scrolls;
// the Hero above is imported eagerly because it must paint instantly.
const CareerTimeline = React.lazy(() => import('./CareerTimeline').then(m => ({ default: m.CareerTimeline })));
const ExpertisePipeline = React.lazy(() => import('./ExpertisePipeline').then(m => ({ default: m.ExpertisePipeline })));
const FeaturedProjects = React.lazy(() => import('./bento/FeaturedProjects').then(m => ({ default: m.FeaturedProjects })));
const TheCloser = React.lazy(() => import('@/components/layout/TheCloser').then(m => ({ default: m.TheCloser })));

/**
 * Loading state for the home page sections grey placeholder boxes so the page
 * doesn't jump when the real (lazy) sections land.
 */
function HomeSkeleton() {
  return (
    <div className="space-y-32 py-32">
      <div className="project-container">
        <SkeletonLoader variant="card" className="h-[400px] rounded-2xl" />
      </div>
      <div className="project-container">
        <SkeletonLoader variant="project-grid" className="h-[600px] rounded-[32px]" />
      </div>
    </div>
  );
}

export function Home() {
  // `gradientHue` isn't a hue it's an ever-growing clock the gradient maths
  // below feeds into sin/cos to drift the background.
  const [gradientHue, setGradientHue] = useState(0);
  // Theme picks the teal palette the backdrop breathes with: dark = obsidian→teal,
  // light = pale mint wash on near-white.
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === 'light';

  useEffect(() => {
    const interval = setInterval(() => {
      setGradientHue(prev => prev + 0.4); // Slower, continuous growth
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const getTealPulse = (time: number, alpha: number = 1) => {
    // Math.sin turns the ever-growing clock into a smooth -1..1 wave, so
    // lightness/saturation breathe instead of growing forever.
    const pulse = Math.sin(time * 0.01);
    // In light mode the same wave drives a pale mint on near-white, so the drift
    // survives the theme flip.
    const lightness = isLight ? 90 + pulse * 4 : 14 + pulse * 8; // dark 6–22% · light 86–94%
    const saturation = isLight ? 62 + pulse * 15 : 40 + pulse * 15; // dark 25–55% · light 47–77%
    return `hsla(174, ${saturation}%, ${lightness}%, ${alpha})`;
  };

  return (
    <main
      // The drifting teal backdrop stays dark in both themes (it paints
      // --color-brand-bg, a non-flipping token). The hero terminal below is
      // theme-aware (flips light); the lower sections are still dark-designed,
      // so they're re-pinned dark via the wrapper around <React.Suspense>.
      // Inline `style` here is sanctioned: the Tailwind contract reserves it for
      // exactly this kind of per-frame JS-computed value.
      style={{
        backgroundColor: isLight ? 'var(--color-surface)' : 'var(--color-brand-bg)',
        backgroundImage: `radial-gradient(circle 1400px at ${50 + Math.sin(gradientHue * 0.005) * 30}% ${50 + Math.cos(gradientHue * 0.003) * 30}%, ${getTealPulse(gradientHue, 1)} 0%, ${getTealPulse(gradientHue, 0.4)} 50%, ${getTealPulse(gradientHue, 0)} 100%)`,
        transition: 'background 100ms ease-out'
      }}
    >
      <SEO {...routeMeta('/')} />
      <div id="hero">
        <Hero />
      </div>

      {/* One Suspense wraps the lazy sections; the skeleton shows until the first
          arrives, then they stream in. All four are theme-aware they flip light
          with the toggle (except the F1 telemetry card, which stays dark via its
          own data-theme-lock). They sit transparently on <main>, so the teal
          drift (dark) or light-teal wash
          (light) shows through in both themes. */}
      <React.Suspense fallback={<HomeSkeleton />}>
        <FeaturedProjects />
        <ExpertisePipeline />
        <CareerTimeline />
        <TheCloser />
      </React.Suspense>
    </main>
  );
}
