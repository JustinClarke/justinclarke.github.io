import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { cn } from '@/shared/utils';
import { HERO_CONTENT_REVEAL } from '@/config/animations';
import { QuickLink } from '@/shared/types';

/**
 * Redesigned Resume pill button.
 */
export const ResumeButton = ({ className, showMobile = false }: { className?: string; showMobile?: boolean }) => (
  <div className={cn(showMobile ? 'md:hidden mb-10' : 'hidden md:block absolute top-10 right-10 z-20', className)}>
    <a
      href='https://raw.githubusercontent.com/JustinClarke/justinclarke.github.io/main/resources/resume.pdf'
      download='Justin Clarke resume'
      className='inline-flex font-noto text-[13px] font-bold tracking-[0.06em] uppercase text-black border border-black/10 rounded-full px-7 py-2.5 bg-white/40 backdrop-blur-xl hover:text-brand-primary hover:bg-white/60 hover:border-brand-primary/40 hover:shadow-[0_8px_20px_rgba(0,200,180,0.1)] active:scale-[0.96] transition-all duration-300 cursor-pointer group items-center gap-2.5 focus-ring'
      aria-label="Download Justin Clarke's Resume (PDF)"
    >
      <span className='smooth-underline after:bg-black group-hover:after:bg-brand-primary'>Resume</span>
      <span className='text-black/80 group-hover:text-brand-primary transition-all duration-300 group-hover:translate-y-0.5 animate-bounce-subtle' aria-hidden="true">↓</span>
    </a>
  </div>
);

/**
 * Global Social Links group.
 */
export const SocialLinks = () => (
  <motion.nav
    aria-label="Social Media Profiles"
    className="flex flex-col gap-2.5 mt-2"
    variants={HERO_CONTENT_REVEAL}
    initial="hidden"
    animate="visible"
    custom={1.0}
  >
    <ul className="flex items-center gap-5">
      {[
        { href: "https://github.com/JustinClarke", icon: "github", label: "GitHub Profile", d: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" },
        { href: "https://linkedin.com/in/justinsavioclarke", icon: "linkedin", label: "LinkedIn Profile", d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" },
        { href: "mailto:justinsavioclarke@outlook.com", icon: "mail", label: "Email Me", d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" }
      ].map((link) => (
        <li key={link.icon}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            className="flex items-center justify-center p-1.5 text-black/60 hover:text-brand-primary hover:scale-120 transition-all duration-300 cursor-pointer focus-ring rounded-md"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {link.icon === "linkedin" ? (
                <><path d={link.d} /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></>
              ) : link.icon === "mail" ? (
                <><path d={link.d} /><polyline points="22,6 12,13 2,6" /></>
              ) : <path d={link.d} />}
            </svg>
            <span className="sr-only">{link.label}</span>
          </a>
        </li>
      ))}
    </ul>
  </motion.nav>
);

/**
 * Desktop-only Quick Links row.
 */
export const QuickLinksRow = ({ links }: { links: QuickLink[] }) => (
  <nav className="hidden md:block w-full pt-6 pb-8 translate-y-[-10px]" aria-label="Quick Project Links">
    <div className="flex items-center gap-3 mb-6">
      <span className="font-mono text-[12px] font-medium tracking-[0.18em] uppercase text-black/60 whitespace-nowrap">Quick Links</span>
      <span className="flex-1 h-px bg-black/20" aria-hidden="true" />
    </div>
    <ul className="flex justify-between items-start gap-4">
      {links.map((link, i) => (
        <li key={link.id} className="flex gap-4 items-start">
          <Link to={`/project/${link.id}`} className="group flex flex-col gap-[6px] transition-all duration-150 focus-ring p-1 -m-1 rounded-sm">
            <span className="font-ibm text-[12px] text-black/40 font-medium tracking-[0.04em]">0{i + 1}</span>
            <span className="font-noto text-[16px] font-bold text-black flex items-center gap-1.5 transition-all">
              <span className="smooth-underline group-hover:text-teal-600 transition-colors duration-300">
                {link.label}
              </span>
              <span className="opacity-0 group-hover:opacity-100 translate-x-[-6px] group-hover:translate-x-0 transition-all duration-200 text-teal-500 scale-110" aria-hidden="true">→</span>
            </span>
          </Link>
          {i < links.length - 1 && <div className="w-px h-6 bg-black/[0.12] self-center flex-shrink-0" aria-hidden="true" />}
        </li>
      ))}
    </ul>
  </nav>
);

/**
 * Animated decorative scroll arrow.
 */
export const HeroScrollArrow = () => (
  <div className='hidden md:flex absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 flex flex-col items-center hero-arrow-bob opacity-20 hover:opacity-100 transition-opacity duration-500'>
    <div className='w-px h-24 bg-black/10' aria-hidden="true" />
    <svg width='10' height='10' viewBox='0 0 10 10' className='mt-1' aria-label="Scroll down">
      <path d='M1 3 L5 7 L9 3' stroke='rgba(0,0,0,0.4)' strokeWidth='1.5' fill='none' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  </div>
);
