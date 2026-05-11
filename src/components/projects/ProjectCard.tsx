import { FC, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSpotlight, useReducedMotion, useParallax } from '@/hooks';
import { Badge } from '@/ui/Badge';
import { Project } from '@/types';
import { cn, parseMetricValue, getMetricTooltip } from '@/utils';
import { SOFT_QUARTIC_EASE } from '@/config/animations';

interface ProjectCardProps {
  project: Project;
  index: number;
}


/**
 * ProjectCard Component
 * 
 * A high-fidelity card with interactive spotlight effects and parallax visuals.
 * 
 * Architecture:
 * - Spotlight: Dual-layer radial gradient following the mouse.
 * - Parallax: Smooth scale/translate effect on the hero visual.
 * - Semantic Colors: Migrated to theme tokens (brand-bg, border-studio).
 */
export const ProjectCard: FC<ProjectCardProps> = ({ project, index }) => {
  const { handleMouseMove, mouseX, mouseY } = useSpotlight();
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const parallax = useParallax(containerRef, 8);

  const titleParts = useMemo(() => {
    const parts = project.title.split(' ');
    if (parts.length > 1) {
      const last = parts.pop();
      return { head: parts.join(' '), last };
    }
    return { head: project.title, last: '' };
  }, [project.title]);

  return (
    <div
      ref={containerRef}
      className='flex h-full group/card-wrapper text-left w-full rounded-2xl overflow-hidden'
      style={{ transitionDelay: `${index * 80}ms` }}
      onMouseMove={handleMouseMove}
    >
      <Link
        to={`/project/${project.id}`}
        className='group relative flex flex-col flex-1 transition-all duration-500 outline-none w-full bg-brand-bg border border-studio hover:border-studio-heavy overflow-hidden'
        aria-label={`View details for ${project.title}: ${project.copy}`}
      >
        {/* Spotlight Layers */}
        {!prefersReducedMotion && (
          <motion.div
            className='pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-700 group-hover:opacity-100 z-10'
            style={{ 
              background: 'radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(0, 200, 180, 0.08), transparent 80%)',
              // @ts-ignore
              "--mouse-x": mouseX,
              "--mouse-y": mouseY,
            }}
          />
        )}

        <div className='flex flex-col md:flex-row flex-1 relative z-20 items-stretch h-full'>
          {/* Visual Header */}
          <div className={`bg-brand-card flex items-center justify-center relative overflow-hidden h-[260px] md:h-auto md:w-[320px] lg:w-[440px] border-b md:border-b-0 border-studio ${index % 2 === 0 ? 'md:border-r md:order-1' : 'md:border-l md:order-2'} cursor-help`} data-tooltip="Pixels were harmed in the making of this." data-tooltip-pos="right">
            <motion.div
              className='scale-90 will-change-transform'
              style={{
                 transform: `translate(${parallax.x}px, ${parallax.y}px)`,
                 transition: `transform 800ms cubic-bezier(0.16, 1, 0.3, 1)`
              }}
            >
              {project.heroVisual}
            </motion.div>

            {/* Corner Brackets */}
            <div className="absolute inset-8 pointer-events-none opacity-20">
              <span className="absolute top-0 left-0 w-4 h-4 border-t border-l border-brand-primary" />
              <span className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-brand-primary" />
            </div>

            <div className='absolute top-8 right-8 flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500'>
              <span className='font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-brand-primary bg-brand-primary/10 px-3 py-1.5 rounded-full border border-brand-primary/20 backdrop-blur-md cursor-help' data-tooltip="Warning: Contains actual code and design decisions." data-tooltip-pos="left">
                VIEW DOSSIER
              </span>
            </div>
          </div>

          {/* Content Body */}
          <div className={`p-8 md:p-12 flex flex-col flex-1 justify-center ${index % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}>
            <div className="mb-4 font-mono text-[10px] tracking-[0.2em] uppercase text-white/20 cursor-help w-fit" data-tooltip="Yes, I categorise everything." data-tooltip-pos="right">
               {project.projectType} // {index + 1} OF 04
            </div>

            <h3 className='font-noto text-3xl md:text-5xl font-black leading-[1.1] text-white mb-6 tracking-tighter'>
              {titleParts.head} {titleParts.last && <em className="font-playfair italic font-normal text-brand-primary">{titleParts.last}.</em>}
            </h3>

            <p className='font-noto text-[16px] text-white/50 leading-relaxed mb-8 max-w-lg'>
              {project.copy}
            </p>

            <div className='flex flex-wrap gap-2 mb-10'>
              {project.tech.map((t) => (
                <span key={t} className="font-mono text-[9px] tracking-[0.1em] uppercase text-white/40 px-2 py-1 border border-studio">
                  {t}
                </span>
              ))}
            </div>

            {/* Performance Metric Row */}
            <div className="mt-auto pt-8 border-t border-white/10 flex gap-8 cursor-help" data-tooltip="100% statistically significant (source: trust me).">
              {project.pageMetrics.slice(0, 2).map((m, i) => (
                <div key={i} className="flex flex-col gap-0.5">
                   <span className="font-mono text-[9px] uppercase tracking-widest text-brand-primary">{m.label}</span>
                   <span className="font-noto text-2xl font-black text-white tracking-tighter">{m.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
