import React from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { SkeletonLoader } from '@/shared/components';

const FeaturedProjects = React.lazy(() => import('@/components/projects').then(m => ({ default: m.FeaturedProjects })));
const ExpertiseAndExperience = React.lazy(() => import('@/components/home/ExpertiseAndExperience').then(m => ({ default: m.ExpertiseAndExperience })));
const TheCloser = React.lazy(() => import('@/components/ui-global/TheCloser').then(m => ({ default: m.TheCloser })));

/**
 * Loading state for the home page sections.
 */
function HomeSkeleton() {
  return (
    <div className="space-y-32 py-32">
      <div className="max-w-6xl mx-auto px-4">
        <SkeletonLoader variant="project-grid" className="h-[600px] rounded-[32px]" />
      </div>
      <div className="max-w-6xl mx-auto px-4">
        <SkeletonLoader variant="card" className="h-[400px] rounded-2xl" />
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
        <FeaturedProjects />
        <ExpertiseAndExperience />
        <TheCloser />
      </React.Suspense>
    </main>
  );
}
