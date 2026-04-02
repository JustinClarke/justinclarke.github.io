import { useRef } from 'react';
import { motion } from 'framer-motion';
import { projectsData } from '@/data';
import { SectionContainer } from '@/shared/components';
import { useReducedMotion } from '@/shared/hooks';
import { ProjectCard } from './ProjectCard';

/**
 * FeaturedProjects implements a 'Dark Hybrid Strategy':
 */
export function FeaturedProjects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Stagger variants for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.1,
        delayChildren: 0.1
      },
    },
  };

  return (
    <SectionContainer
      id="projects"
      ref={containerRef}
      contentMaxWidth="max-w-6xl"
      className="py-16 md:py-32 bg-[#050505] font-sans dark"
    >
      {/* Section Header */}
      <div className="flex flex-col gap-4 mb-12 md:mb-20">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[12px] font-bold tracking-[0.2em] uppercase text-white/40 whitespace-nowrap">Selected Work</span>
          <div className="flex-1 h-px bg-white/20" />
        </div>
        <h2 className="font-noto text-3xl md:text-6xl font-extrabold tracking-tight text-white mb-0">
          Featured Projects
        </h2>
      </div>

      {/* Main Grid Wrapper */}
      <motion.div
        className="flex flex-col md:grid md:grid-cols-1 gap-4 md:gap-8 items-stretch"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
      >
        {projectsData.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
          />
        ))}
      </motion.div>
    </SectionContainer>
  );
}
