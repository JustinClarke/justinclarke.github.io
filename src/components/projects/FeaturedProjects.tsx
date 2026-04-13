import { useRef } from 'react';
import { motion } from 'framer-motion';
import { projectsData } from '@/data';
import { SectionContainer, ScrollReveal } from '@/shared/components';
import { useReducedMotion } from '@/shared/hooks';
import { STAGGER_CHILDREN_VARIANTS } from '@/shared/constants';
import { ProjectCard } from './ProjectCard';

/**
 * FeaturedProjects Component
 * 
 * Implements a 'Dark Hybrid Strategy': A high-contrast grid designed to showcase 
 * high-fidelity visual assets against a deep neutral background.
 * 
 * Architecture:
 * - Layout: Responsive grid with staggered Framer Motion entry animations.
 * - Theme: Deep monochrome (brand-bg) with subtle border-studio separators.
 */
export function FeaturedProjects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  return (
    <SectionContainer
      id="projects"
      ref={containerRef}
      contentMaxWidth="max-w-6xl"
      className="pt-12 pb-24 md:pt-20 md:pb-32 font-sans dark scroll-mt-[100px]"
    >
      {/* Section Header */}
      <div className="flex flex-col gap-6 mb-16 md:mb-24">
        <ScrollReveal
          direction="right"
          distance={12}
          className="flex items-center gap-6"
        >
          <span className="font-mono text-[11px] font-bold tracking-[0.25em] uppercase text-text-dim whitespace-nowrap">Selected Work</span>
          <div className="flex-1 h-px bg-studio section-label-rule" data-reveal="inactive" />
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h2 className="font-noto text-3xl md:text-6xl font-black tracking-tighter text-white mb-0">
            Featured Projects
          </h2>
        </ScrollReveal>
      </div>

      {/* Main Grid Wrapper */}
      <motion.div
        className="flex flex-col md:grid md:grid-cols-1 gap-10 md:gap-16 items-stretch"
        variants={STAGGER_CHILDREN_VARIANTS}
        custom={{ stagger: prefersReducedMotion ? 0 : 0.1 }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.05 }}
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
