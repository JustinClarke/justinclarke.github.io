import { FC } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSpotlight, useReducedMotion } from '@/shared/hooks';
import { Badge } from '@/components/ui/Badge';
import { Project } from '@/shared/types';

interface ProjectCardProps {
  project: Project;
  index: number;
}

const getMetricTooltip = (label: string, val: string) => {
  const combined = `${val} ${label}`.toUpperCase();
  if (combined.includes('EVENTS/SEC')) return "Four thousand events per second. Ingested. Processed. Visualised.";
  if (combined.includes('RECLAIMED')) return "That's 624 hours a year. You're welcome, VNS.";
  if (combined.includes('LOAD TIME')) return "From 3 seconds to 0.6. No magic, just good engineering.";
  if (combined.includes('MSC GRADE')) return "Highest grade available. Not that we're counting.";
  return "";
};

/**
 * Premium ProjectCard with interactive spotlight and hardware-accelerated visuals.
 * Standardizes the 2x2 grid aesthetic with the "Studio" brand identity.
 */
export const ProjectCard: FC<ProjectCardProps> = ({ project, index }) => {
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

          <div className='flex flex-col md:flex-row flex-1 relative z-20 items-stretch h-full'>
            {/* Visual Header */}
            <div className={`bg-[#0b0b0b] flex items-center justify-center relative overflow-hidden h-[240px] md:h-auto md:w-[320px] lg:w-[400px] border-b md:border-b-0 border-white/[0.08] ${
              index % 2 === 0 ? 'md:border-r md:order-1' : 'md:border-l md:order-2'
            }`}>
              <motion.div
                className='scale-[0.85]'
                animate={prefersReducedMotion ? {} : { y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                aria-label={`${project.title} visualization: ${project.visualDescription}`}
              >
                <div 
                  className='cursor-help'
                  data-tooltip={
                    project.id === 'ltv-analytics' ? "LTV tracking: Because knowing what a customer is worth is better than guessing. (My model is 82% accurate.)" :
                    project.id === 'spotify-engine' ? "Predicting your next favorite song. Calculated with pure math and a little bit of magic." :
                    project.id === 'litestore' ? "0.6s load time. Because life is too short to wait for a website to hydrate." :
                    ""
                  }
                >
                  {project.heroVisual}
                </div>
              </motion.div>
              
              {/* Overlay Badge */}
              <div 
                className='absolute top-6 right-6 flex items-center gap-2 opacity-0 group-hover/card-wrapper:opacity-100 translate-y-2 group-hover/card-wrapper:translate-y-0 transition-all duration-300'
                data-tooltip="Full breakdown inside - problem, approach, outcome."
              >
                <span className='font-ibm text-[11px] font-bold uppercase tracking-widest text-[#00c8b4] bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20'>
                  View Case Study
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className={`p-8 md:p-12 flex flex-col flex-1 ${
              index % 2 === 0 ? 'md:order-2' : 'md:order-1 text-right md:items-end'
            }`}>
              <div className={`flex items-center mb-4 ${index % 2 === 0 ? 'justify-between' : 'justify-end'}`}>
                <span className='font-ibm text-[11px] font-medium tracking-[0.25em] uppercase text-white/30'>
                  {project.projectType}
                </span>
              </div>

              <h3 className='font-noto text-3xl md:text-4xl font-extrabold leading-tight text-white mb-6 tracking-tight'>
                {project.title}
              </h3>

              <div 
                className={`flex flex-wrap gap-2 mb-8 ${index % 2 === 0 ? '' : 'justify-end'}`}
                data-tooltip={
                  project.id === 'ltv-analytics' ? "Microsoft Fabric stack — real-time ingestion through to BI" :
                  project.id === 'product-telemetry' ? "Fabric Data Pipelines — automated ingestion at scale" :
                  project.id === 'litestore' ? "Serverless stack — Next.js on Vercel with AWS backing" :
                  project.id === 'spotify-engine' ? "Python ML stack with Spotify API integration" :
                  ""
                }
              >
                {project.tech.map(t => (
                  <Badge 
                    key={t} 
                    variant='soft-bg'
                  >
                    {t}
                  </Badge>
                ))}
              </div>

              <p className={`text-[17px] text-white/60 leading-relaxed mb-10 max-w-xl ${index % 2 === 0 ? '' : 'ml-auto'}`}>
                {project.copy}
              </p>

                <div 
                  className={`mt-auto pt-8 border-t border-white/[0.08] flex items-baseline gap-3 cursor-help ${index % 2 === 0 ? '' : 'flex-row-reverse'}`}
                  data-tooltip={getMetricTooltip(project.pageMetrics[0].label, project.pageMetrics[0].val)}
                >
                  <span className='font-ibm text-3xl font-bold text-white'>{project.pageMetrics[0].val}</span>
                  <span className='font-ibm text-[12px] font-medium tracking-widest uppercase text-white/30'>{project.pageMetrics[0].label}</span>
                </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
