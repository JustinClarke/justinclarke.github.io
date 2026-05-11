import React from 'react';
import { HeroSection } from '@/components/home';
import { SkeletonLoader } from '@/ui';

const CareerTimeline = React.lazy(() => import('@/components/home').then(m => ({ default: m.CareerTimeline })));
const ExpertisePipeline = React.lazy(() => import('@/components/home').then(m => ({ default: m.ExpertisePipeline })));
const FeaturedProjects = React.lazy(() => import('@/components/projects').then(m => ({ default: m.FeaturedProjects })));
const TheCloser = React.lazy(() => import('@/components/layout').then(m => ({ default: m.TheCloser })));

/**
 * Loading state for the home page sections.
 */
function HomeSkeleton() {
  return (
    <div className="space-y-32 py-32">
      <div className="max-w-6xl mx-auto px-4">
        <SkeletonLoader variant="card" className="h-[400px] rounded-2xl" />
      </div>
      <div className="max-w-6xl mx-auto px-4">
        <SkeletonLoader variant="project-grid" className="h-[600px] rounded-[32px]" />
      </div>
    </div>
  );
}

export function Home() {
  return (
    <main>
      <div id="hero">
        <HeroSection />
      </div>

      <React.Suspense fallback={<HomeSkeleton />}>
        <CareerTimeline />
        <ExpertisePipeline />
        <FeaturedProjects />
        <TheCloser />
      </React.Suspense>
    </main>
  );
}
