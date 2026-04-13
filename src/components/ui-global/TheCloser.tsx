import { useRef } from 'react';
import { SectionContainer, ScrollReveal } from '@/shared/components';
import { closerMetadata } from '@/data';
import { useModal } from '@/providers';
import { useReducedMotion } from '@/shared/hooks';

/**
 * TheCloser Component
 * 
 * Displays the final CTA and site footer with a high-performance terminal aesthetic.
 * 
 * Architecture:
 * - Call to Action: Large typography with a pulse-glow "noise" accent.
 * - Social Links: Standardized icon hover states with semantic brand accents.
 * - Status: Live availability indicator (AvailabilityDot).
 */
export const TheCloser = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { openContactModal } = useModal();
  const prefersReducedMotion = useReducedMotion();

  // Scroll entrance managed globally via initScrollAnimations
  return (
    <SectionContainer
      id='contact'
      ref={containerRef}
      contentMaxWidth='max-w-6xl'
      className='bg-brand-bg py-24 md:py-32 relative overflow-hidden flex flex-col min-h-[640px] justify-between dark border-t border-studio'
      innerClassName='flex flex-col flex-1 justify-between w-full px-8 md:px-0'
    >
      <div className='flex flex-col flex-1'>
        {/* Label / Status Bar */}
        <ScrollReveal once={false} direction="right" distance={8} className='flex items-center gap-6 mb-12'>
          <span className='font-mono text-[11px] font-bold tracking-[0.25em] uppercase text-brand-primary/60 whitespace-nowrap flex items-center gap-2.5'>
            <span className='availability-dot' aria-hidden='true' />
            Available for new engagements
          </span>
          <div className='flex-1 h-px bg-studio' aria-hidden='true' />
        </ScrollReveal>

        {/* Main Grid */}
        <div className='flex flex-col lg:flex-row items-center lg:items-end justify-between gap-16 mb-24 text-center lg:text-left'>
          <ScrollReveal once={false} delay={0.2} direction="up" className='flex-1 max-w-3xl'>
            <div
              className='cursor-help group/header'
              data-tooltip="Standard. High-fidelity data structures require high-fidelity decision making."
            >
              <h2 className='font-noto text-[clamp(28px,5vw,60px)] font-black leading-[1.05] tracking-tighter text-white mb-0 text-center lg:text-left'>
                <span className="block">If your data isn't</span>
                <span className="block">driving decisions,</span>
                <span className="block">
                  <span className="text-white/30">it's just </span>
                  <span className="text-brand-primary drop-shadow-[0_0_15px_rgba(0,200,180,0.3)]">noise.</span>
                </span>
              </h2>
            </div>
          </ScrollReveal>

          <div className='flex flex-col items-center lg:items-end gap-8 flex-shrink-0'>
            <ScrollReveal once={false} delay={0.4}>
              <button
                onClick={openContactModal}
                className='group flex items-center justify-center gap-6 px-12 py-[22px] bg-brand-bg text-white font-noto text-[14px] font-bold tracking-[0.2em] uppercase rounded-full cursor-pointer transition-all duration-700 ease-out border border-brand-primary/20 hover:border-brand-primary hover:bg-brand-primary/[0.05] hover:shadow-[0_0_40px_rgba(0,200,180,0.15)] focus-ring relative overflow-hidden min-w-[320px]'
                aria-label='Open contact form to discuss a project'
                data-tooltip="Serious enquiries, interesting problems, and good coffee conversations welcome."
              >
                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-r from-transparent via-brand-primary/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] ease-in-out" />
                <span className='whitespace-nowrap pt-[2px] block relative z-10 transition-colors duration-500 group-hover:text-brand-primary'>GET IN TOUCH</span>
                <div className='relative z-10 w-8 h-8 rounded-full bg-white/[0.03] flex items-center justify-center border border-white/10 group-hover:bg-brand-primary/10 group-hover:border-brand-primary/40 transition-all duration-500'>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/60 group-hover:text-brand-primary transition-all duration-500 group-hover:-translate-y-[2px] group-hover:translate-x-[2px]" aria-hidden="true"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
                </div>
              </button>
            </ScrollReveal>

            <ScrollReveal once={false} delay={0.6}>
              <a
                className='font-mono text-[14px] text-white/50 font-bold leading-relaxed tracking-[0.08em] hover:text-brand-primary transition-colors duration-400 focus-ring rounded-sm group cursor-pointer'
                href={`mailto:${closerMetadata.email}`}
                data-tooltip={closerMetadata.tooltips.email}
              >
                <span className='smooth-underline after:h-[1px] after:bg-brand-primary'>{closerMetadata.email}</span>
              </a>
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <ScrollReveal 
        delay={0.8} 
        once={false} 
        distance={8} 
        className='flex flex-col md:flex-row items-center justify-between gap-12 pt-12 border-t border-white/[0.08] w-full text-white/90 relative z-10'
      >
        <div
          className='flex items-center gap-6 cursor-help group/logo'
          data-tooltip={closerMetadata.tooltips.logo}
        >
          <div className='w-11 h-11 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center shadow-sm transition-all duration-500 group-hover/logo:border-brand-primary/40 group-hover/logo:bg-brand-primary/5'>
            <span className='font-mono text-[13px] font-bold text-brand-primary/90 tracking-[0.04em]' aria-hidden='true'>JC</span>
          </div>
          <div className='flex flex-col'>
            <span className='font-mono text-[11px] font-bold tracking-[0.1em] uppercase text-white/80'>JUSTIN CLARKE</span>
            <span className='font-mono text-[9px] text-white/15 uppercase tracking-[0.25em] font-medium'>© 2026</span>
          </div>
        </div>

        <nav aria-label='Footer Social Links'>
          <ul className='flex items-center gap-4'>
            <li><SocialLink href='https://github.com/JustinClarke' icon='github' label='GitHub Profile' delay={0.1} /></li>
            <li><SocialLink href='https://linkedin.com/in/justinsavioclarke' icon='linkedin' label='LinkedIn Profile' delay={0.2} /></li>
            <li><SocialLink href='https://www.instagram.com/justiiiinsta' icon='instagram' label='Instagram Profile' delay={0.3} /></li>
            <li><SocialLink href={`mailto:${closerMetadata.email}`} icon='mail' label='Email Me' delay={0.4} /></li>
          </ul>
        </nav>

        <div className='flex flex-col items-center md:items-end gap-1.5'>
          <span className='font-mono text-[10px] font-bold text-white/10 uppercase tracking-[0.25em]'>Repository</span>
          <a
            href='https://github.com/JustinClarke/justinclarke.github.io'
            target='_blank'
            rel='noopener noreferrer'
            className='font-mono text-[12px] font-bold tracking-[0.12em] text-white/40 hover:text-brand-primary transition-colors duration-400 focus-ring rounded-sm group cursor-help'
            data-tooltip="Explore the architecture. Fully open source."
          >
            <span className='smooth-underline after:h-[1px] after:bg-brand-primary'>justinclarke.github.io</span>
          </a>
        </div>
      </ScrollReveal>
    </SectionContainer>
  );
};

const SocialLink = ({ href, icon, label, delay = 0 }: { href: string; icon: 'github' | 'linkedin' | 'instagram' | 'mail'; label: string; delay?: number }) => {
  const icons = {
    github: <path d='M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22' />,
    linkedin: <><path d='M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z' /><rect x='2' y='9' width='4' height='12' /><circle cx='4' cy='4' r='2' /></>,
    instagram: <><rect x='2' y='2' width='20' height='20' rx='5' /><path d='M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z' /><line x1='17.5' y1='6.5' x2='17.51' y2='6.5' /></>,
    mail: <><path d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z' /><polyline points='22,6 12,13 2,6' /></>
  };

  return (
    <ScrollReveal
      once={false}
      delay={delay}
      distance={8}
    >
      <a
        href={href}
        target='_blank'
        rel='noopener noreferrer'
        aria-label={label}
        data-tooltip={label}
        className='w-[48px] h-[48px] flex items-center justify-center rounded-full bg-studio/40 border border-studio text-white/50 hover:text-brand-primary hover:border-brand-primary/40 hover:bg-brand-primary/5 transition-all duration-500 focus-ring group active:scale-90 flex-shrink-0 cursor-pointer'
      >
        <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true' className='group-hover:scale-110 transition-transform duration-500'>
          {icons[icon]}
        </svg>
      </a>
    </ScrollReveal>
  );
};
