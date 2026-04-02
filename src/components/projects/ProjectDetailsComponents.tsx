import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { SpotlightCard } from '@/components/ui';
import { ProjectMetric, ProjectCaseStudy } from '@/shared/types';

/**
 * High-visibility Back Navigation Header.
 * Features a bold, animated arrow and breadcrumb-style title.
 */
export const DetailHeader: React.FC<{ title: string }> = ({ title }) => (
  <div className='sticky top-0 z-50 flex items-center justify-between px-4 md:px-8 py-5 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5'>
    <div className='flex items-center gap-4 md:gap-6 overflow-hidden'>
      <Link 
        to='/'
        className='group flex items-center gap-2 bg-white text-black hover:bg-[#00c8b4] hover:text-white px-4 md:px-6 py-2.5 rounded-full transition-all duration-300 active:scale-95 shadow-xl shadow-white/5 focus-ring whitespace-nowrap'
        aria-label='Back to project gallery'
      >
        <ChevronLeft className='w-5 h-5 group-hover:-translate-x-1 transition-transform' strokeWidth={3} />
        <span className='font-noto font-black text-[13px] md:text-[14px] uppercase tracking-wider'>Back</span>
      </Link>
      
      <div className='hidden sm:flex items-center gap-3 overflow-hidden'>
        <span className='font-mono text-[11px] text-white/30 font-bold tracking-[0.2em] uppercase whitespace-nowrap'>Selected Work</span>
        <div className='w-2 h-2 rounded-full bg-white/10' aria-hidden='true' />
        <span className='font-mono text-[11px] text-white/60 font-bold tracking-[0.1em] uppercase truncate'>{title}</span>
      </div>
    </div>
  </div>
);

/**
 * Individual data metric display (e.g. 100% Availability).
 * Enhanced with responsive scaling for mobile/tablet.
 */
export const MetricItem: React.FC<{ metric: ProjectMetric }> = ({ metric }) => (
  <div className='flex flex-col gap-[2px] md:gap-[6px] min-w-[100px] md:min-w-[140px]'>
    <span className='font-mono text-[22px] md:text-[32px] font-black text-white leading-tight tracking-tighter'>
      {metric.val}
    </span>
    <span className='font-mono text-[10px] md:text-[12px] font-bold tracking-[0.15em] uppercase text-brand-primary/90 leading-tight'>
      {metric.label}
    </span>
  </div>
);

/**
 * 3-Column Case Study Grid with Problem, Approach, Outcome.
 * Optimized for grid layout on tablets and stacking on mobile.
 */
export const CaseStudyGrid: React.FC<{ caseStudy: ProjectCaseStudy }> = ({ caseStudy }) => (
  <div className='p-6 md:p-12 lg:p-16 bg-[#080808] border-t border-white/5'>
    <div className='max-w-7xl mx-auto'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8'>
        <SpotlightCard 
          number='01' 
          title='The Problem' 
          description={caseStudy.problem} 
          className='min-h-[220px]'
        />
        <SpotlightCard 
          number='02' 
          title='The Approach' 
          description={caseStudy.approach} 
          className='min-h-[220px]'
        />
        <SpotlightCard 
          number='03' 
          title='The Outcome' 
          description={caseStudy.outcome} 
          className='min-h-[220px]'
        />
      </div>
    </div>
  </div>
);
