import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { SectionContainer } from '@/shared/components';
import { ExperienceItem, EducationCard } from '@/components/ui';
import { ExpertisePipeline } from './ExpertisePipeline';
import { useReducedMotion } from '@/shared/hooks';
import { experiences, education } from '@/data';

gsap.registerPlugin(ScrollTrigger);

/**
 * ExpertiseAndExperience highlights professional history.
 * Updated to use the 4-column ExpertisePipeline and modular items.
 */
export const ExpertiseAndExperience = () => {
  const [openExp, setOpenExp] = useState<number>(0);
  const prefersReducedMotion = useReducedMotion();

  const pipelineRef = useRef<HTMLDivElement>(null);
  const expRef = useRef<HTMLDivElement>(null);
  const eduRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax Background
      if (containerRef.current && !prefersReducedMotion) {
        gsap.to('.parallax-bg-3', {
          y: -400,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        });
        gsap.to('.parallax-bg-4', {
          y: -800,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        });
      }
    }, containerRef); // Scope to containerRef

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <SectionContainer
      id="expertise"
      ref={containerRef}
      contentMaxWidth="max-w-6xl"
      className="narrative-section min-h-screen py-24 md:py-40 bg-white text-black overflow-x-hidden"
      innerClassName="flex flex-col gap-24 md:gap-32 relative"
    >
      <ExpertiseBackground />

      {/* ── Expertise Pipeline ── */}
      <div ref={pipelineRef} className="flex flex-col gap-6">
        <div className="flex items-center gap-4 group cursor-help" data-tooltip="The strategic toolkit.">
          <span className="font-mono text-[12px] font-bold tracking-[0.2em] uppercase text-black/30 whitespace-nowrap group-hover:text-teal-600 transition-colors">Capabilities</span>
          <div className="flex-1 h-px bg-black/[0.06]" />
        </div>
        <h2 
          className="font-noto text-3xl md:text-7xl font-black tracking-tighter text-black mb-12 cursor-help"
          data-tooltip="If it isn't here, I'm probably currently learning it."
        >Expertise Pipeline</h2>

        <ExpertisePipeline />
      </div>

      {/* ── Work Experience ── */}
      <div ref={expRef} className="flex flex-col gap-6">
        <div className="flex items-center gap-4 group cursor-help" data-tooltip="The hands-on history.">
          <span className="font-mono text-[12px] font-bold tracking-[0.2em] uppercase text-black/30 whitespace-nowrap group-hover:text-teal-600 transition-colors">Career</span>
          <div className="flex-1 h-px bg-black/[0.06]" />
        </div>
        <h2 
          className="font-noto text-3xl md:text-7xl font-black tracking-tighter text-black cursor-help"
          data-tooltip="Every gig has been a step toward bigger data problems."
        >Work Experience</h2>

        <div className="mt-8">
          {experiences.map((exp, i) => (
            <ExperienceItem
              key={exp.company}
              exp={exp}
              isOpen={openExp === i}
              onClick={() => setOpenExp(openExp === i ? -1 : i)}
            />
          ))}
          <div className="border-b border-[#eee]" />
        </div>
      </div>

      {/* ── Education ── */}
      <div ref={eduRef} className="flex flex-col gap-6">
        <div className="flex items-center gap-4 group cursor-help" data-tooltip="The theoretical foundation.">
          <span className="font-mono text-[12px] font-bold tracking-[0.2em] uppercase text-black/30 whitespace-nowrap group-hover:text-teal-600 transition-colors">Academic Background</span>
          <div className="flex-1 h-px bg-black/[0.06]" />
        </div>
        <h2 
          className="font-noto text-3xl md:text-7xl font-black tracking-tighter text-black cursor-help"
          data-tooltip="The baseline of research and logic."
        >Education</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {education.map(edu => (
            <div
              key={edu.school}
              className={edu.isOngoing ? "md:col-span-2" : "md:col-span-1"}
            >
              <EducationCard edu={edu} />
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
};

/**
 * Decorative parallax background elements for the Expertise section.
 */
const ExpertiseBackground = () => (
  <div aria-hidden="true">
    <div className="parallax-bg-4 absolute top-[60%] right-[-10%] w-[400px] h-[400px] bg-brand-primary/5 rounded-full blur-[110px] pointer-events-none" />
    <div className="parallax-bg-3 absolute top-[10%] right-[5%] w-72 h-72 bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none" />
    <div className="parallax-bg-2 absolute top-[40%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
    <div className="parallax-bg-1 absolute bottom-[10%] right-[-5%] w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
  </div>
);
