import { useRef } from 'react';
import { motion } from 'framer-motion';
import { SectionContainer, ScrollReveal } from '@/shared/components';
import { projectsData, heroMetadata } from '@/data';
import { useModal } from '@/providers';
import { cn } from '@/shared/utils';
import { HOVER } from '@/config/animations';
import { useParallax } from '@/shared/hooks/useParallax';
import { NetworkIllustration } from './NetworkIllustration';
import {
  ResumeButton,
  SocialLinks,
  QuickLinksRow,
  HeroScrollArrow
} from './hero/HeroSubComponents';

/**
 * @fileoverview Refactored Hero Section.
 * Orchestrates the primary landing experience, now using dynamic data and internal parallax hooks.
 */

export const HeroSection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const parallax = useParallax(containerRef, 30);
  const { openContactModal } = useModal();

  // Update quick links to major sections as requested
  const sectionQuickLinks = [
    { id: 'projects', label: 'Projects' },
    { id: 'expertise', label: 'Expertise' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' }
  ];

  return (
    <SectionContainer
      id="hero"
      ref={containerRef}
      contentMaxWidth="max-w-6xl"
      className="min-h-screen flex flex-col justify-center bg-white overflow-hidden"
      innerClassName="flex items-center min-h-screen relative py-12 md:py-0"
    >
      {/* ── Visual Layer: Background Accent + Floating Orbs ── */}
      <div
        className="absolute z-0 rounded-full pointer-events-none transition-transform duration-[1200ms] ease-out will-change-transform"
        aria-hidden="true"
        style={{
          width: 800,
          height: 800,
          top: '-10%',
          right: '-10%',
          background: 'radial-gradient(circle, rgba(0,200,180,0.06) 0%, rgba(0,200,180,0) 70%)',
          transform: `translate(${parallax.x}px, ${parallax.y}px)`,
        }}
      />
      <div className="float-orb" aria-hidden="true" style={{ width: 300, height: 300, top: '20%', left: '-5%', background: 'rgba(0,200,180,0.04)', animationDelay: '0s', animationDuration: '14s' }} />
      <div className="float-orb" aria-hidden="true" style={{ width: 200, height: 200, bottom: '10%', right: '15%', background: 'rgba(100,100,255,0.03)', animationDelay: '-4s', animationDuration: '16s' }} />
      <div className="float-orb" aria-hidden="true" style={{ width: 250, height: 250, top: '60%', left: '30%', background: 'rgba(0,200,180,0.03)', animationDelay: '-8s', animationDuration: '18s' }} />

      <ResumeButton />
      <HeroScrollArrow />

      {/* ── Main Layout Grid ── */}
      <div className={cn(
        "w-full grid grid-cols-1 md:grid-cols-[55%_45%] items-center gap-16 relative z-10",
      )}>

        {/* Left Column: Typography & Navigation */}
        <div className="flex flex-col items-start text-left px-8 md:px-0">
          <ScrollReveal direction="right" distance={8} delay={0.1}>
            <p
              className="font-ibm text-sm font-normal text-black/60 tracking-widest mb-4 uppercase cursor-help"
              data-tooltip={heroMetadata.tooltips.role}
            >
              {heroMetadata.role}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <h1
              className="font-serif font-normal text-black leading-[1.1] mb-8 md:mb-12 whitespace-pre-line tracking-tight max-w-2xl cursor-help"
              style={{ fontSize: 'clamp(44px, 7vw, 72px)' }}
              data-tooltip={heroMetadata.tooltips.name}
            >
              {heroMetadata.name}
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <p
              className="font-noto text-base md:text-lg font-normal text-black/70 leading-relaxed max-w-[480px] mb-8 whitespace-pre-line cursor-help"
              data-tooltip={heroMetadata.tooltips.bio}
            >
              {heroMetadata.bio}
            </p>
          </ScrollReveal>

          <ResumeButton showMobile />

          <ScrollReveal delay={0.5}>
            <button
              onClick={openContactModal}
              className="group relative inline-flex items-center justify-center gap-4 font-noto text-[15px] font-bold text-white bg-black rounded-full px-10 py-4 cursor-pointer mb-12 md:mb-16 overflow-hidden transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.25)] active:scale-[0.98] focus-ring cta-breathe"
              aria-label="Contact me for new engagements"
              data-tooltip={heroMetadata.tooltips.cta}
            >
              <span className="relative z-10 smooth-underline after:bg-white">{heroMetadata.cta}</span>
              <span className="relative z-10 transition-transform duration-500 group-hover:translate-x-1" aria-hidden="true">→</span>

              {/* Subtle Liquid Shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
            </button>
          </ScrollReveal>

          <ScrollReveal delay={0.6}>
            <QuickLinksRow links={sectionQuickLinks} />
          </ScrollReveal>
          <ScrollReveal delay={0.7}>
            <SocialLinks />
          </ScrollReveal>
        </div>

        {/* Right Column: Narrative Illustration */}
        <div
          className="hidden md:flex justify-center items-center will-change-transform"
          style={{
            transform: `translate(${parallax.x * 0.5}px, ${parallax.y * 0.5}px)`,
            transition: 'transform 1200ms cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <NetworkIllustration />
        </div>
      </div>
    </SectionContainer>
  );
};
