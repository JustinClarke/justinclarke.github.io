import { useState, useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

import { SectionContainer, ScrollReveal } from '@/shared/components';
import { ExperienceItem, EducationTimeline } from '@/components/ui';
import { ExpertisePipeline } from './ExpertisePipeline';
import { useReducedMotion } from '@/shared/hooks';
import { experiences, education } from '@/data';

/**
 * ExpertiseAndExperience Component
 * 
 * Orchestrates the professional narrative from capabilities (dark) to career history (light).
 * 
 * Architecture:
 * - Parallax Layer: Decorative radial glows (ExpertiseBackground).
 * - Multi-Mode Layout: Seamlessly blends a dark Expertise matrix with a light Experience accordion.
 * - Colors: Migrated to semantic tokens (brand-bg, light-bg, border-studio).
 */
export const ExpertiseAndExperience = () => {
  const [openExp, setOpenExp] = useState<number>(0);
  const prefersReducedMotion = useReducedMotion();

  const pipelineRef = useRef<HTMLDivElement>(null);
  const expRef = useRef<HTMLDivElement>(null);
  const eduRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement>(null);

  // Framer Motion native parallax
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const backgroundY3 = useTransform(scrollYProgress, [0, 1], [0, prefersReducedMotion ? 0 : -400]);
  const backgroundY4 = useTransform(scrollYProgress, [0, 1], [0, prefersReducedMotion ? 0 : -800]);

  return (
    <div ref={containerRef as any} className="relative overflow-x-hidden">
      {/* ── Expertise Pipeline (DARK MODE) ── */}
      <section 
        id="expertise"
        className="narrative-section py-24 md:py-32 text-white scroll-mt-[100px]"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative">
          <div ref={pipelineRef} className="flex flex-col gap-6 md:gap-8">
            <ScrollReveal 
              direction="right" 
              distance={12} 
              className="flex items-center justify-start gap-6"
            >
              <span className="font-mono text-[11px] font-bold tracking-[0.25em] uppercase text-text-dim whitespace-nowrap">Capabilities</span>
              <div className="flex-1 h-px bg-studio section-label-rule" data-reveal="inactive" />
            </ScrollReveal>
            
            <ScrollReveal delay={0.1}>
              <h2 className="font-noto text-4xl md:text-7xl font-black tracking-tighter text-white mb-8 md:mb-12">
                Expertise Pipeline
              </h2>
            </ScrollReveal>

            <ExpertisePipeline />
          </div>
        </div>
      </section>

      {/* ── Career & Education (LIGHT MODE) ── */}
      <SectionContainer
        className="narrative-section py-24 md:py-32 bg-light-bg text-black scroll-mt-[100px] border-t border-light-border"
        contentMaxWidth="max-w-7xl"
        innerClassName="flex flex-col gap-24 md:gap-32 relative"
      >
        <ExpertiseBackground y3={backgroundY3} y4={backgroundY4} />

        {/* ── Work Experience ── */}
        <div id="experience" ref={expRef} className="flex flex-col gap-8 scroll-mt-[100px]">
          <ScrollReveal 
            direction="right" 
            distance={12} 
            className="flex items-center gap-6"
          >
            <span className="font-mono text-[11px] font-bold tracking-[0.25em] uppercase text-light-text-muted whitespace-nowrap group-hover:text-brand-primary transition-colors">Career</span>
            <div className="flex-1 h-px bg-light-border section-label-rule" data-reveal="inactive" />
          </ScrollReveal>
          
          <ScrollReveal delay={0.1}>
            <h2 className="font-noto text-3xl md:text-7xl font-black tracking-tighter text-black">
              Work Experience
            </h2>
          </ScrollReveal>

          <div className="mt-12 flex flex-col">
            {experiences.map((exp, i) => (
              <ScrollReveal 
                key={exp.company} 
                delay={i * 0.1}
                distance={8}
                layout
              >
                <ExperienceItem
                  exp={exp}
                  isOpen={openExp === i}
                  onClick={() => setOpenExp(openExp === i ? -1 : i)}
                />
              </ScrollReveal>
            ))}
            <ScrollReveal delay={0.4} distance={0}>
              <div className="border-b border-black/[0.03] divider-grow" data-reveal="inactive" />
            </ScrollReveal>
          </div>
        </div>

        {/* ── Education ── */}
        <div id="education" ref={eduRef} className="flex flex-col gap-8 scroll-mt-[100px]">
          <ScrollReveal 
            direction="right" 
            distance={12} 
            className="flex items-center gap-6"
          >
            <span className="font-mono text-[11px] font-bold tracking-[0.25em] uppercase text-light-text-muted whitespace-nowrap group-hover:text-brand-primary transition-colors">Academic Background</span>
            <div className="flex-1 h-px bg-light-border section-label-rule" data-reveal="inactive" />
          </ScrollReveal>
          
          <ScrollReveal delay={0.1}>
            <h2 className="font-noto text-3xl md:text-7xl font-black tracking-tighter text-black">
              Education
            </h2>
          </ScrollReveal>

          <div className="mt-8 md:mt-12">
            <EducationTimeline education={education} />
          </div>
        </div>
      </SectionContainer>
    </div>
  );
};

/**
 * Decorative parallax background elements for the Expertise section.
 */
interface ExpertiseBackgroundProps {
  y3: MotionValue<number>;
  y4: MotionValue<number>;
}

const ExpertiseBackground = ({ y3, y4 }: ExpertiseBackgroundProps) => (
  <div aria-hidden="true">
    <motion.div style={{ y: y4 }} className="absolute top-[60%] right-[-10%] w-[400px] h-[400px] bg-brand-primary/5 rounded-full blur-[110px] pointer-events-none" />
    <motion.div style={{ y: y3 }} className="absolute top-[10%] right-[5%] w-72 h-72 bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none" />
    <div className="absolute top-[40%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
    <div className="absolute bottom-[10%] right-[-5%] w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
  </div>
);
