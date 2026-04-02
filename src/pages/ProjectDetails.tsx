/**
 * @fileoverview Refined Project Details Page.
 * Transitions from modal-based viewing to a dedicated, high-fidelity case study page.
 */

import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProject, useReducedMotion } from '@/shared/hooks';
import { SectionContainer, SkeletonLoader } from '@/shared/components';
import { DetailHeader, MetricItem, CaseStudyGrid } from '@/components/projects/ProjectDetailsComponents';

/**
 * Loading skeleton for the project details page.
 */
function ProjectDetailsSkeleton() {
  return (
    <div className="w-full min-h-screen bg-[#050505] flex flex-col pt-24 items-center p-6">
      <SkeletonLoader className="w-full max-w-5xl h-[500px] rounded-3xl" />
    </div>
  );
}

/**
 * ProjectDetails handles the full-page case study view.
 * Responsive for iPhone, iPad, and Desktop.
 */
export function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { project, loading, error } = useProject(id);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
    
    if (!loading && (error || !project)) {
      navigate('/', { replace: true });
    }
  }, [project, loading, error, navigate]);

  if (loading || !project) return <ProjectDetailsSkeleton />;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-[#00c8b4]/30 overflow-x-hidden">
      
      {/* High-Visibility Header (The 'Really Obvious' Back Arrow is here) */}
      <DetailHeader title={project.title} />

      <main className="flex-1 flex flex-col items-center">
        
        {/* ── Hero Section ── */}
        <SectionContainer
          className="w-full border-b border-white/5 bg-[#0a0a0a]"
          contentMaxWidth="max-w-7xl"
          innerClassName="grid grid-cols-1 lg:grid-cols-2"
        >
          {/* Hero Narrative */}
          <motion.div 
            initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="p-8 md:p-12 lg:p-16 flex flex-col gap-6 md:gap-8 border-b lg:border-b-0 lg:border-r border-white/5"
          >
            <div className="flex flex-col gap-4">
              <span className="font-mono text-[12px] md:text-[13px] font-black tracking-[0.2em] uppercase text-teal-400/90">
                {project.projectType}
              </span>
              <h1 className="font-noto text-[32px] md:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tighter text-white">
                {project.title}
              </h1>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {project.tech.map(t => (
                  <span 
                    key={t} 
                    className="font-mono text-[11px] md:text-[12px] px-3 py-1 rounded-[4px] border border-white/10 bg-white/[0.03] text-white/70 font-bold uppercase tracking-wider"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-[17px] md:text-[19px] lg:text-[21px] text-white/60 leading-relaxed font-medium max-w-2xl">
              {project.copy}
            </p>

            {/* Metrics Dashboard Row */}
            {project.pageMetrics && (
              <div className="mt-8 md:mt-12 pt-8 border-t border-white/5 grid grid-cols-2 sm:flex sm:flex-wrap gap-x-12 gap-y-8 items-start">
                {project.pageMetrics.map((metric, i) => (
                  <MetricItem key={i} metric={metric} />
                ))}
              </div>
            )}
          </motion.div>

          {/* Hero Visual Block (Responsive Visual) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="bg-[#0b0b0b] flex items-center justify-center relative overflow-hidden min-h-[350px] md:min-h-[450px] p-8 md:p-16 lg:p-24"
          >
            <div className="relative z-10 w-full h-full flex items-center justify-center scale-[1.0] md:scale-[1.2] lg:scale-[1.3]">
              {project.heroVisual}
            </div>
            {/* Aesthetic Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#00c8b4]/5 via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-teal-500/5 blur-[120px] rounded-full pointer-events-none" />
          </motion.div>
        </SectionContainer>

        {/* ── Case Study In-Depth ── */}
        <div className="w-full bg-[#080808]">
          {project.caseStudy && <CaseStudyGrid caseStudy={project.caseStudy} />}
        </div>

        {/* ── Footer Navigation ── */}
        <SectionContainer
          className="w-full py-16 md:py-24 bg-[#0a0a0a]"
          contentMaxWidth="max-w-4xl"
          innerClassName="flex flex-col items-center text-center gap-8"
        >
          <div className="w-16 h-px bg-white/20" />
          <h2 className="font-noto text-2xl md:text-3xl font-bold text-white/40 tracking-tight">
            Interested in seeing more?
          </h2>
          <button 
            onClick={() => navigate('/')}
            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-white text-black font-noto font-black text-[14px] uppercase tracking-widest rounded-full hover:bg-[#00c8b4] hover:text-white transition-all duration-300 active:scale-95 shadow-2xl shadow-black focus-ring"
          >
            Return to Gallery
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </SectionContainer>

      </main>
    </div>
  );
}
