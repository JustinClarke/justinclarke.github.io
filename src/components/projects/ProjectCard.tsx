import { FC } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSpotlight, useReducedMotion } from '@/shared/hooks';
import { Badge } from '@/components/ui/Badge';
import { Project } from '@/shared/types';

interface ProjectCardProps {
  project: Project;
}

/**
 * Premium ProjectCard with interactive spotlight and hardware-accelerated visuals.
 * Standardizes the 2x2 grid aesthetic with the "Studio" brand identity.
 */
export const ProjectCard: FC<ProjectCardProps> = ({ project }) => {
  const { handleMouseMove, background, borderGlow, borderMask } = useSpotlight({ 
    radius: 350, 
    color: '0, 200, 180' 
  });
  const prefersReducedMotion = useReducedMotion();

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: prefersReducedMotion ? 1000 : 80,
        damping: prefersReducedMotion ? 100 : 12
      },
    },
  };

  return (
    <motion.div
      variants={itemVariants}
      className='flex h-full group/card-wrapper text-left w-full rounded-[16px] overflow-hidden'
      onMouseMove={handleMouseMove}
    >
      <Link
        to={`/project/${project.id}`}
        className='group relative flex flex-col flex-1 transition-all duration-300 outline-none focus-ring w-full bg-[#0a0a0a]'
        aria-label={`View details for ${project.title}: ${project.copy}`}
      >
        {/* ── MOBILE: Compact Rich Row ── */}
        <div className='flex md:hidden items-center gap-5 p-5 min-h-[110px] rounded-2xl hover:bg-white/[0.04] transition-all duration-300'>
          <div className='w-24 h-16 bg-[#111] rounded-xl shadow-sm overflow-hidden flex items-center justify-center flex-shrink-0 border border-white/5 relative'>
            <div className='flex items-center justify-center scale-[0.7] transform-gpu opacity-80'>
              {project.visual}
            </div>
          </div>
          <div className='flex flex-col flex-1 min-w-0'>
            <h3 className='font-bold text-white text-[17px] tracking-tight leading-tight mb-1'>
              {project.title}
            </h3>
            <div className='font-mono text-[10px] text-teal-400/70 uppercase tracking-widest font-bold'>
              {project.tech.slice(0, 2).join(' • ')}
            </div>
          </div>
          <span className='text-white/20 group-hover:text-teal-400 group-hover:translate-x-1 transition-all' aria-hidden="true">→</span>
        </div>

        {/* ── DESKTOP: Spotlight Interactive Dashboard ── */}
        <div className='hidden md:flex flex-col border border-[#1a1a1a] rounded-[16px] overflow-hidden group-hover/card-wrapper:border-white/20 transition-all duration-500 w-full flex-1 relative'>
          
          {/* Spotlight Layers */}
          {!prefersReducedMotion && (
            <>
              <motion.div
                className='pointer-events-none absolute -inset-px rounded-[16px] opacity-0 transition-opacity duration-500 group-hover/card-wrapper:opacity-100 z-0'
                style={{ background }}
              />
              <motion.div
                className='pointer-events-none absolute -inset-px rounded-[16px] opacity-0 transition-opacity duration-500 group-hover/card-wrapper:opacity-100 z-10'
                style={{
                  background: borderGlow,
                  WebkitMaskImage: borderMask,
                  maskImage: borderMask,
                }}
              />
            </>
          )}

          {/* Persistent Shimmer Border */}
          <div className='absolute inset-0 rounded-[16px] border border-white/[0.03] pointer-events-none z-30' />

          <div className='flex flex-col flex-1 relative z-20 items-stretch h-full'>
            {/* Visual Header (Top-loaded for consistency) */}
            <div className='bg-[#0b0b0b] flex items-center justify-center relative overflow-hidden h-[240px] border-b border-white/[0.08]'>
              <motion.div
                className='scale-[0.85]'
                animate={prefersReducedMotion ? {} : { y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                aria-label={`${project.title} visualization: ${project.visualDescription}`}
              >
                {project.heroVisual}
              </motion.div>
              
              {/* Overlay Badge for Desktop View */}
              <div className='absolute top-6 right-6 flex items-center gap-2 opacity-0 group-hover/card-wrapper:opacity-100 translate-y-2 group-hover/card-wrapper:translate-y-0 transition-all duration-300'>
                <span className='font-ibm text-[11px] font-bold uppercase tracking-widest text-[#00c8b4] bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20'>
                  View Project
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className='p-8 md:p-9 flex flex-col flex-1'>
              <div className='flex items-center justify-between mb-4'>
                <span className='font-ibm text-[11px] font-medium tracking-[0.25em] uppercase text-white/30'>
                  {project.projectType}
                </span>
              </div>

              <h3 className='font-noto text-2xl md:text-3xl font-extrabold leading-tight text-white mb-4 tracking-tight'>
                {project.title}
              </h3>

              <div className='flex flex-wrap gap-2 mb-6'>
                {project.tech.map(t => (
                  <Badge key={t} variant='soft-bg'>
                    {t}
                  </Badge>
                ))}
              </div>

              <p className='text-[16px] text-white/60 leading-relaxed line-clamp-2 mb-8'>
                {project.copy}
              </p>

              {project.pageMetrics?.[0] && (
                <div className='mt-auto pt-6 border-t border-white/[0.08] flex items-baseline gap-3'>
                  <span className='font-ibm text-2xl font-bold text-white'>{project.pageMetrics[0].val}</span>
                  <span className='font-ibm text-[11px] font-medium tracking-widest uppercase text-white/30'>{project.pageMetrics[0].label}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
