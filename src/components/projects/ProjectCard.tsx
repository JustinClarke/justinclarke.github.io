import { FC, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSpotlight, useReducedMotion, useParallax } from '@/shared/hooks';
import { Badge } from '@/components/ui/Badge';
import { Project } from '@/shared/types';
import { cn, parseMetricValue, getMetricTooltip } from '@/shared/utils';
import { SOFT_QUARTIC_EASE } from '@/shared/constants';

interface ProjectCardProps {
  project: Project;
  index: number;
}


/**
 * Premium ProjectCard with interactive spotlight and hardware-accelerated visuals.
 * Standardizes the 2x2 grid aesthetic with the "Studio" brand identity.
 */
export const ProjectCard: FC<ProjectCardProps> = ({ project, index }) => {
  const { handleMouseMove, mouseX, mouseY } = useSpotlight();
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const parallax = useParallax(containerRef, 8);

  const { num, suffix } = useMemo(() => parseMetricValue(project.pageMetrics[0].val), [project.pageMetrics]);

  return (
    <div
      ref={containerRef}
      className='card-anim flex h-full group/card-wrapper text-left w-full rounded-2xl overflow-hidden'
      style={{ transitionDelay: `${index * 80}ms` }}
      onMouseMove={handleMouseMove}
    >
      <Link
        to={`/project/${project.id}`}
        className='group relative flex flex-col flex-1 transition-all duration-500 outline-none focus-ring w-full bg-[#050505]'
        aria-label={`View details for ${project.title}: ${project.copy}`}
      >
        {/* ── MOBILE: Compact Rich Row ── */}
        <div className='flex md:hidden items-center gap-6 p-6 min-h-[120px] rounded-2xl hover:bg-white/[0.03] transition-all duration-300'>
          <div className='w-28 h-20 bg-[#0a0a0a] rounded-xl shadow-sm overflow-hidden flex items-center justify-center flex-shrink-0 border border-white/[0.05] relative'>
            <div className='flex items-center justify-center scale-75 transform-gpu opacity-80'>
              {project.visual}
            </div>
          </div>
          <div className='flex flex-col flex-1 min-w-0'>
            <h3 className='font-bold text-white text-[18px] tracking-tight leading-tight mb-2'>
              {project.title}
            </h3>
            <div className='font-mono text-[10px] text-brand-primary/80 uppercase tracking-[0.2em] font-bold'>
              {project.tech.slice(0, 2).join(' • ')}
            </div>
          </div>
          <span className='text-white/20 group-hover:text-brand-primary group-hover:translate-x-1 transition-all' aria-hidden="true">→</span>
        </div>

        {/* ── DESKTOP: Spotlight Interactive Dashboard ── */}
        <div className='hidden md:flex flex-col border border-white/[0.08] rounded-2xl overflow-hidden group-hover/card-wrapper:border-white/[0.15] transition-all duration-700 w-full flex-1 relative project-card-tilt'>

          {/* Spotlight Layers */}
          {!prefersReducedMotion && (
            <>
              <motion.div
                className='pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-700 group-hover/card-wrapper:opacity-100 z-0'
                style={{ 
                  background: 'radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(0, 200, 180, 0.08), transparent 80%)',
                  // @ts-ignore
                  "--mouse-x": mouseX,
                  "--mouse-y": mouseY,
                }}
              />
              <motion.div
                className='pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-700 group-hover/card-wrapper:opacity-100 z-10'
                style={{
                  background: 'radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(0, 200, 180, 0.4), transparent 80%)',
                  WebkitMaskImage: 'radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), black, transparent)',
                  maskImage: 'radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), black, transparent)',
                  // @ts-ignore
                  "--mouse-x": mouseX,
                  "--mouse-y": mouseY,
                }}
              />
            </>
          )}

          {/* Persistent Shimmer Border */}
          <div className='absolute inset-0 rounded-2xl border border-white/[0.03] pointer-events-none z-30' />

          <div className='flex flex-col md:flex-row flex-1 relative z-20 items-stretch h-full'>
            {/* Visual Header */}
            <div className={`bg-[#050505] flex items-center justify-center relative overflow-hidden h-[260px] md:h-auto md:w-[320px] lg:w-[440px] border-b md:border-b-0 border-white/[0.08] ${index % 2 === 0 ? 'md:border-r md:order-1' : 'md:border-l md:order-2'
              }`}>
              <motion.div
                className='scale-90 will-change-transform'
                style={{
                   transform: `translate(${parallax.x}px, ${parallax.y}px)`,
                   transition: `transform 800ms cubic-bezier(${SOFT_QUARTIC_EASE.join(',')})`
                }}
                aria-label={`${project.title} visualization: ${project.visualDescription}`}
              >
                <div
                  className='cursor-help'
                  data-tooltip={
                    project.id === 'ltv-analytics' ? "LTV tracking: Because knowing what a customer is worth is better than guessing. (My model is 82% accurate.)" :
                      project.id === 'spotify-engine' ? "Predicting your next favorite song. Calculated with pure math and a little bit of magic." :
                        project.id === 'litestore' ? "0.6s load time. Because life is too short to wait for a website to hydrate." :
                          "High-fidelity visual structure. Built for performance."
                  }
                >
                  {project.heroVisual}
                </div>
              </motion.div>

              {/* Overlay Badge */}
              <div
                className='absolute top-8 right-8 flex items-center gap-2 opacity-0 group-hover/card-wrapper:opacity-100 translate-y-2 group-hover/card-wrapper:translate-y-0 transition-all duration-500'
                data-tooltip="Full breakdown inside - problem, approach, outcome."
              >
                <span className='font-ibh text-[10px] font-bold uppercase tracking-[0.25em] text-brand-primary bg-brand-primary/10 px-4 py-2 rounded-full border border-brand-primary/20 backdrop-blur-md'>
                  VIEW CASE STUDY
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className={`p-10 md:p-14 flex flex-col flex-1 ${index % 2 === 0 ? 'md:order-2' : 'md:order-1 text-right md:items-end'
              }`}>
              <div className={`flex items-center mb-6 ${index % 2 === 0 ? 'justify-between' : 'justify-end'}`}>
                <span className='font-mono text-[10px] font-bold tracking-[0.25em] uppercase text-white/20'>
                  {project.projectType}
                </span>
              </div>

              <h3 className='font-noto text-3xl md:text-5xl font-black leading-[1.1] text-white mb-8 tracking-tighter'>
                {project.title}
              </h3>

              <div
                className={`flex flex-wrap gap-2.5 mb-10 ${index % 2 === 0 ? '' : 'justify-end'}`}
                data-tooltip="Standardized tech vertical for this project."
              >
                {project.tech.map((t, i) => (
                  <Badge
                    key={t}
                    variant='soft-bg'
                    className="border-white/5 opacity-80 badge-reveal"
                    style={{ transitionDelay: `${i * 60 + 200}ms` }}
                  >
                    {t}
                  </Badge>
                ))}
              </div>

              <p className={`text-reveal text-[17px] text-white/50 leading-relaxed mb-12 max-w-xl font-noto ${index % 2 === 0 ? '' : 'ml-auto'}`} style={{ transitionDelay: '400ms' }}>
                {project.copy}
              </p>

              <div
                className={`mt-auto pt-10 border-t border-white/[0.08] flex items-baseline gap-4 cursor-help ${index % 2 === 0 ? '' : 'flex-row-reverse'}`}
                data-tooltip={getMetricTooltip(project.pageMetrics[0].label, project.pageMetrics[0].val)}
              >
                <span 
                  className='font-mono text-4xl lg:text-5xl font-bold text-white tracking-tighter'
                  data-count-target={num > 0 ? num : null}
                  data-count-suffix={suffix}
                >
                  {project.pageMetrics[0].val}
                </span>
                <span className='font-mono text-[11px] font-bold tracking-[0.25em] uppercase text-white/20 mb-1 lg:mb-2'>{project.pageMetrics[0].label}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
