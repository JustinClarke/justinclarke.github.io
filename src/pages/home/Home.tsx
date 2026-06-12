/**
 * Home.tsx the homepage: the Hero terminal up top, then four lazy-loaded
 * sections (featured projects, expertise pipeline, career timeline, footer).
 *
 * Fits in: rendered by App.tsx for the "/" route.
 * Note:    the drifting teal background re-renders this component ~20x/second
 *          (see the interval below). React diffs the children and finds nothing
 *          changed, so the only real DOM work each tick is the style update.
 *
 * For beginners ----------------------------------------------------------------
 * The page itself is just five sections stacked vertically, like five <div>s
 * in plain HTML. The one JavaScript trick is the animated background: a timer
 * nudges a number forward forever, and that number steers a CSS
 * radial-gradient as if you edited the style attribute 20 times a second.
 * -----------------------------------------------------------------------------
 */
import React, { useEffect, useState } from 'react';
import { Hero } from './Hero';
import { SkeletonLoader } from '@/ui/SkeletonLoader';

import { SEO } from '@/components/layout';
// LEARN: React.lazy = code splitting. Each section below lives in its own
//    JavaScript file that the browser only downloads when the section is about
//    to render. The Hero above is imported normally because it must appear
//    instantly. (App.tsx explains the `.then(m => ...)` adapter dance.)
const CareerTimeline = React.lazy(() => import('./CareerTimeline').then(m => ({ default: m.CareerTimeline })));
const ExpertisePipeline = React.lazy(() => import('./ExpertisePipeline').then(m => ({ default: m.ExpertisePipeline })));
const FeaturedProjects = React.lazy(() => import('@/components/projects/FeaturedProjects').then(m => ({ default: m.FeaturedProjects })));
const TheCloser = React.lazy(() => import('@/components/layout/TheCloser').then(m => ({ default: m.TheCloser })));

/**
 * Loading state for the home page sections.
 * LEARN: shown by <Suspense> below while the lazy sections' code downloads
 *    grey placeholder boxes so the page doesn't jump when the real thing lands.
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
  // LEARN: `gradientHue` is a number that only ever grows. It is not really a
  //    hue it's a clock that the gradient maths below feeds into sin/cos to
  //    drift the background. Calling setGradientHue re-renders the page with
  //    the new value.
  const [gradientHue, setGradientHue] = useState(0);

  useEffect(() => {
    // LEARN: setInterval runs this arrow function every 50ms forever. The
    //    `prev => prev + 0.4` form reads the latest value rather than a stale
    //    one. The returned cleanup stops the timer if the page unmounts
    //    without it the timer would keep firing in the background (a leak).
    const interval = setInterval(() => {
      setGradientHue(prev => prev + 0.4); // Slower, continuous growth
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const getTealPulse = (time: number) => {
    // Breathing Teal: Oscillation between deep obsidian and vibrant teal
    // LEARN: Math.sin turns the ever-growing clock into a smooth -1..1 wave,
    //    so lightness and saturation breathe instead of growing forever.
    const pulse = Math.sin(time * 0.01);
    const lightness = 4 + pulse * 4; // Pulses between 0% and 8%
    const saturation = 30 + pulse * 15; // Pulses between 15% and 45%
    return `hsl(174, ${saturation}%, ${lightness}%)`;
  };

  return (
    <main
      // LEARN: inline `style` is the sanctioned home for JS-computed values
      //    (the Tailwind contract reserves it for exactly this). The backticks
      //    build a CSS string with ${...} holes filled in by JavaScript.
      style={{
        background: `radial-gradient(circle at ${50 + Math.sin(gradientHue * 0.005) * 30}% ${50 + Math.cos(gradientHue * 0.003) * 30}%, ${getTealPulse(gradientHue)} 0%, var(--color-brand-bg) 100%)`,
        transition: 'background 100ms ease-out'
      }}
    >
      <SEO title="Justin Clarke ⋅ Home" />
      <div id="hero">
        <Hero />
      </div>

      {/* LEARN: one Suspense wraps all four lazy sections the skeleton shows
          until the first of them arrives, then the sections stream in. */}
      <React.Suspense fallback={<HomeSkeleton />}>
        <FeaturedProjects />
        <ExpertisePipeline />
        <CareerTimeline />
        <TheCloser />
      </React.Suspense>
    </main>
  );
}
