import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionContainer } from '@/shared/components';
import { useModal } from '@/providers';
import { useReducedMotion } from '@/shared/hooks';

gsap.registerPlugin(ScrollTrigger);

/**
 * TheCloser component displays the final CTA and site footer.
 * High-performance terminal aesthetic with a focus on quick engagement.
 */
export const TheCloser = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { openContactModal } = useModal();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(containerRef.current,
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 95%',
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <SectionContainer
      id='contact'
      ref={containerRef}
      contentMaxWidth='max-w-6xl'
      className='bg-[#0a0a0a] py-12 md:py-24 relative overflow-hidden flex flex-col min-h-[600px] justify-between'
      innerClassName='flex flex-col flex-1 justify-between w-full'
    >
      <div className='flex flex-col flex-1'>
        {/* Label / Status Bar */}
        <div className='flex items-center gap-4 mb-10'>
          <span className='font-mono text-[12px] font-bold tracking-[0.2em] uppercase text-[#00c8b4]/60 whitespace-nowrap'>
            Available for new engagements
          </span>
          <div className='flex-1 h-px bg-white/10' aria-hidden='true' />
        </div>

        {/* Main Grid */}
        <div className='flex flex-col lg:flex-row items-center lg:items-end justify-between gap-12 mb-20 text-center lg:text-left'>
          <div className='flex-1 max-w-2xl'>
            <h2 className='font-noto text-[clamp(32px,5vw,64px)] font-black leading-[1.1] tracking-tighter text-white mb-0'>
              If your data isn't<br />
              driving decisions,<br />
              <span className='text-white/20 italic'>it's just </span>
              <span className='text-brand-primary'>noise.</span>
            </h2>
          </div>

          <div className='flex flex-col items-center lg:items-end gap-6 flex-shrink-0'>
            <motion.button
              onClick={openContactModal}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className='group flex items-center gap-3 px-10 py-5 bg-white text-black font-noto text-[14px] font-bold tracking-[0.08em] uppercase rounded-full cursor-pointer transition-all duration-300 hover:bg-brand-primary active:scale-[0.96] focus-ring overflow-hidden relative shadow-[0_10px_40px_rgba(255,255,255,0.05)]'
              aria-label='Open contact form to discuss a project'
            >
              <span className='relative z-10'>Get in Touch</span>
              <span className='relative z-10 text-base transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1' aria-hidden='true'>↗</span>
              <div className='absolute inset-0 bg-brand-primary translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300 ease-out z-0' />
            </motion.button>

            <a className='font-mono text-[13px] text-white/70 font-bold leading-relaxed tracking-[0.06em] hover:text-brand-primary transition-colors duration-300 focus-ring rounded-sm group' href='mailto:justinsavioclarke@outlook.com'>
              <span className='smooth-underline after:h-[1px] after:bg-brand-primary'>justinsavioclarke@outlook.com</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className='flex flex-col md:flex-row items-center justify-between gap-8 pt-10 border-t border-white/10 w-full text-white/90'>
        <div className='flex items-center gap-4'>
          <div className='w-9 h-9 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center shadow-sm'>
            <span className='font-mono text-[12px] font-bold text-brand-primary/80 tracking-[0.04em]' aria-hidden='true'>JC</span>
          </div>
          <div className='flex flex-col'>
            <span className='font-mono text-[11px] font-bold tracking-[0.08em] uppercase'>Justin Clarke</span>
            <span className='font-mono text-[9px] text-white/30 uppercase tracking-widest'>Full-Stack Engineer · 2026</span>
          </div>
        </div>

        <nav className='flex items-center gap-2' aria-label='Footer Social Links'>
          <ul className='flex items-center gap-2'>
            <li><SocialLink href='https://github.com/JustinClarke' icon='github' label='GitHub Profile' /></li>
            <li><SocialLink href='https://linkedin.com/in/justinsavioclarke' icon='linkedin' label='LinkedIn Profile' /></li>
            <li><SocialLink href='https://www.instagram.com/justiiiinsta' icon='instagram' label='Instagram Profile' /></li>
            <li><SocialLink href='mailto:justinsavioclarke@outlook.com' icon='mail' label='Email Me' /></li>
          </ul>
        </nav>

        <div className='flex flex-col items-end gap-1'>
          <span className='font-mono text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]'>Repository</span>
          <a
            href='https://justinclarke.github.io'
            target='_blank'
            rel='noopener noreferrer'
            className='font-mono text-[11px] font-bold tracking-[0.1em] text-white/50 hover:text-brand-primary transition-colors duration-300 focus-ring rounded-sm group'
          >
            <span className='smooth-underline after:h-[1px] after:bg-brand-primary'>justinclarke.github.io</span>
          </a>
        </div>
      </div>
    </SectionContainer>
  );
};

const SocialLink = ({ href, icon, label }: { href: string; icon: 'github' | 'linkedin' | 'instagram' | 'mail'; label: string }) => {
  const icons = {
    github: <path d='M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22' />,
    linkedin: <><path d='M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z' /><rect x='2' y='9' width='4' height='12' /><circle cx='4' cy='4' r='2' /></>,
    instagram: <><rect x='2' y='2' width='20' height='20' rx='5' /><path d='M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z' /><line x1='17.5' y1='6.5' x2='17.51' y2='6.5' /></>,
    mail: <><path d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z' /><polyline points='22,6 12,13 2,6' /></>
  };

  return (
    <a href={href} target='_blank' rel='noopener noreferrer' aria-label={label} className='p-2.5 rounded-full bg-white/[0.03] border border-white/[0.05] text-white/50 hover:text-brand-primary hover:border-brand-primary/30 hover:bg-brand-primary/5 transition-all duration-300 focus-ring group active:scale-90'>
      <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true' className='group-hover:scale-110 transition-transform duration-300'>
        {icons[icon]}
      </svg>
    </a>
  );
};
