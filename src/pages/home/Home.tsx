import React, { useEffect, useState } from 'react';
import { Hero } from './Hero';
import { SkeletonLoader } from '@/ui/SkeletonLoader';

import { SEO } from '@/components/layout';
const CareerTimeline = React.lazy(() => import('./CareerTimeline').then(m => ({ default: m.CareerTimeline })));
const ExpertisePipeline = React.lazy(() => import('./ExpertisePipeline').then(m => ({ default: m.ExpertisePipeline })));
const FeaturedProjects = React.lazy(() => import('@/components/projects/FeaturedProjects').then(m => ({ default: m.FeaturedProjects })));
const TheCloser = React.lazy(() => import('@/components/layout/TheCloser').then(m => ({ default: m.TheCloser })));

/**
 * Loading state for the home page sections.
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
  const [gradientHue, setGradientHue] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setGradientHue(prev => prev + 0.4); // Slower, continuous growth
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const getTealPulse = (time: number) => {
    // Breathing Teal: Oscillation between deep obsidian and vibrant teal
    const pulse = Math.sin(time * 0.01);
    const lightness = 4 + pulse * 4; // Pulses between 0% and 8%
    const saturation = 30 + pulse * 15; // Pulses between 15% and 45%
    return `hsl(174, ${saturation}%, ${lightness}%)`;
  };

  return (
    <main
      style={{
        background: `radial-gradient(circle at ${50 + Math.sin(gradientHue * 0.005) * 30}% ${50 + Math.cos(gradientHue * 0.003) * 30}%, ${getTealPulse(gradientHue)} 0%, var(--color-brand-bg) 100%)`,
        transition: 'background 100ms ease-out'
      }}
    >
      <SEO title="Justin Clarke ⋅ Home" />
      <div id="hero">
        <Hero />
      </div>

      <React.Suspense fallback={<HomeSkeleton />}>
        <FeaturedProjects />
        <ExpertisePipeline />
        <CareerTimeline />
        <TheCloser />
      </React.Suspense>
    </main>
  );
}
