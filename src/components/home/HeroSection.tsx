import { useRef } from 'react';
import { motion } from 'framer-motion';
import { SectionContainer } from '@/shared/components';
import { projectsData } from '@/data';
import { useModal } from '@/providers';
import { cn } from '@/shared/utils';
import { HERO_CONTENT_REVEAL } from '@/config/animations';
import { useMousePosition } from '@/shared/hooks';
import { NetworkIllustration } from './NetworkIllustration';
import {
  ResumeButton,
  SocialLinks,
  QuickLinksRow,
  HeroScrollArrow
} from './hero/HeroSubComponents';

/**
 * @fileoverview Refactored Hero Section.
 * Orchestrates the primary landing experience, now using dynamic data and premium CTAs.
 */

const heroMetadata = {
  role: 'Data Analyst & Full-Stack Engineer',
  name: 'Justin\nClarke',
  bio: 'Pipelines to dashboards\nEngineering to insights',
  cta: 'Get in touch',
};

export const HeroSection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const mousePos = useMousePosition(containerRef);
  const { openContactModal } = useModal();

  // Derive quick links from projectsData
  const dynamicQuickLinks = projectsData.map(p => ({
    id: p.id,
    label: p.title
  }));

  // Mouse-driven parallax for background accent (increased amplitude)
  const accentX = -15 + mousePos.x * 30;
  const accentY = -15 + mousePos.y * 30;

  return (
    <SectionContainer
      id="hero"
      ref={containerRef}
      contentMaxWidth="max-w-6xl"
      className="min-h-screen flex flex-col justify-center bg-white"
      innerClassName="flex items-center min-h-screen relative py-12 md:py-0"
    >
      {/* ── Visual Layer: Background Accent ── */}
      <div
        className="absolute z-0 rounded-full pointer-events-none transition-transform duration-[800ms] ease-out will-change-transform"
        aria-hidden="true"
        style={{
          width: 650,
          height: 650,
          top: '-5%',
          right: '-5%',
          background: `rgba(0,200,180,${0.04 + mousePos.x * 0.04})`,
          transform: `translate(${accentX}px, ${accentY}px)`,
        }}
      />

      <ResumeButton />
      <HeroScrollArrow />

      {/* ── Main Layout Grid ── */}
      <div className={cn(
        "w-full grid grid-cols-1 md:grid-cols-[55%_45%] items-center gap-10 relative z-10",
      )}>

        {/* Left Column: Typography & Navigation */}
        <div className="flex flex-col items-start text-left px-6 md:px-0">

          <motion.p
            className="font-ibm text-sm font-normal text-black/60 tracking-widest mb-3 uppercase cursor-help"
            variants={HERO_CONTENT_REVEAL}
            initial="hidden"
            animate="visible"
            custom={0.2}
            data-tooltip="I've spent approximately 4,200 hours staring at pipelines. Most of them didn't leak."
          >
            {heroMetadata.role}
          </motion.p>

          <motion.h1
            className="font-serif font-normal text-black leading-[1.1] mb-6 md:mb-8 whitespace-pre-line tracking-tight max-w-2xl cursor-help"
            style={{ fontSize: 'clamp(52px, 8vw, 82px)' }}
            variants={HERO_CONTENT_REVEAL}
            initial="hidden"
            animate="visible"
            custom={0.4}
            data-tooltip="Fun fact: My middle name isn't actually 'Saviour', despite what my terminal thinks."
          >
            {heroMetadata.name}
          </motion.h1>

          <motion.p
            className="font-noto text-base font-normal text-black/70 leading-relaxed max-w-[460px] mb-5 whitespace-pre-line cursor-help"
            variants={HERO_CONTENT_REVEAL}
            initial="hidden"
            animate="visible"
            custom={0.6}
            data-tooltip="I specialise in moving data from place A to place B while making it look easy (it rarely is)."
          >
            {heroMetadata.bio}
          </motion.p>

          <ResumeButton showMobile />

          <motion.button
            onClick={openContactModal}
            className="group relative inline-flex items-center justify-center gap-3 font-noto text-[15px] font-bold text-white bg-black rounded-full px-8 py-3.5 cursor-pointer mb-10 md:mb-14 overflow-hidden transition-all duration-300 hover:shadow-[0_15px_35px_rgba(0,0,0,0.2)] active:scale-[0.98] focus-ring"
            variants={HERO_CONTENT_REVEAL}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            custom={0.8}
            aria-label="Contact me for new engagements"
            data-tooltip="I respond faster than a Power BI refresh. Mostly."
          >
            <span className="relative z-10 smooth-underline after:bg-white">{heroMetadata.cta}</span>
            <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>

            {/* Subtle Liquid Shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
          </motion.button>

          <QuickLinksRow links={dynamicQuickLinks} />
          <SocialLinks />
        </div>

        {/* Right Column: Narrative Illustration */}
        <div
          className="hidden md:flex justify-center items-center will-change-transform"
          style={{
            transform: `translate(${accentX * 1.2}px, ${accentY * 1.2}px)`,
            transition: 'transform 800ms ease-out'
          }}
        >
          <NetworkIllustration />
        </div>
      </div>
    </SectionContainer>
  );
};
