import { useRef } from 'react';
import { SectionContainer, ScrollReveal } from '@/ui';
import { closerMetadata } from '@/data';
import { useModal } from '@/providers';
import { cn } from '@/utils';
import { Mail, ArrowUpRight, Github, Linkedin, Instagram } from 'lucide-react';

export const TheCloser = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { openContactModal } = useModal();

  return (
    <SectionContainer
      id='contact'
      ref={containerRef}
      containerVariant='project'
      className='relative overflow-hidden flex flex-col h-[100svh] md:h-auto md:min-h-[640px] justify-between dark border-t border-white/5'
      innerClassName='flex flex-col flex-1 justify-between w-full'
    >
      <div className='flex flex-col flex-1'>
        {/* Section Header */}
        <div className="flex flex-col gap-4 mb-4">
          <ScrollReveal direction="right" distance={12} className="flex items-center gap-6">
            <span className="font-mono text-[9px] md:text-[10px] tracking-[0.4em] uppercase text-white/30 font-bold whitespace-nowrap">
              Contact Protocol
            </span>
            <div className="flex-1 h-px bg-white/10" />
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
               <span className="font-mono text-[8px] md:text-[9px] text-brand-primary font-bold uppercase tracking-widest">Live</span>
            </div>
          </ScrollReveal>
        </div>

        {/* Main Content Grid (Vertically Centered) */}
        <div className='flex-1 flex flex-col justify-center'>
          <div className='flex flex-col lg:flex-row items-center lg:items-end justify-between gap-12 lg:gap-16'>
            <ScrollReveal delay={0.1} direction="up" className='max-w-3xl'>
              <h2 className='font-noto text-4xl md:text-[clamp(28px,5vw,60px)] font-black leading-[0.95] md:leading-[1.05] tracking-tighter text-white text-center lg:text-left'>
                If your data isn't <br className="hidden md:block" />
                <span className="text-white/30"> driving decisions,</span><br />
                it's just <em className="font-playfair italic font-normal text-brand-primary drop-shadow-[0_0_15px_rgba(0,200,180,0.3)]">noise.</em>
              </h2>
            </ScrollReveal>

            <div className='flex flex-col items-center lg:items-end gap-8 flex-shrink-0 w-full lg:w-auto'>
              {/* CTA Button */}
              <ScrollReveal once={false} delay={0.4}>
                <button
                  onClick={openContactModal}
                  className='group flex items-center justify-center gap-6 px-10 md:px-12 py-[18px] md:py-[22px] bg-transparent text-white font-noto text-[13px] md:text-[14px] font-bold tracking-[0.2em] uppercase rounded-full cursor-pointer transition-all duration-700 ease-out border border-brand-primary/20 hover:border-brand-primary hover:bg-brand-primary/[0.05] hover:shadow-[0_0_40px_rgba(0,200,180,0.15)] focus-ring relative overflow-hidden min-w-[280px] md:min-w-[320px]'
                  aria-label='Open contact form'
                >
                  <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-r from-transparent via-brand-primary/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] ease-in-out" />
                  <span className='whitespace-nowrap pt-[2px] block relative z-10 transition-colors duration-500 group-hover:text-brand-primary'>GET IN TOUCH</span>
                  <div className='relative z-10 w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/[0.03] flex items-center justify-center border border-white/10 group-hover:bg-brand-primary/10 group-hover:border-brand-primary/40 transition-all duration-500'>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/60 group-hover:text-brand-primary transition-all duration-500 group-hover:-translate-y-[2px] group-hover:translate-x-[2px]"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
                  </div>
                </button>
              </ScrollReveal>

              <ScrollReveal once={false} delay={0.5}>
                <a
                  className='font-mono text-[13px] md:text-[14px] text-white/50 font-bold leading-relaxed tracking-[0.08em] hover:text-brand-primary transition-colors duration-400 group relative'
                  href={`mailto:${closerMetadata.email}`}
                >
                  <span className='smooth-underline after:h-[1px] after:bg-brand-primary'>{closerMetadata.email}</span>
                </a>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Ecosystem */}
      <ScrollReveal 
        delay={0.5} 
        className='flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 pt-8 md:pt-12 w-full pb-2 md:pb-0'
      >
        <div className='flex items-center gap-5 md:gap-6 group/logo cursor-pointer'>
          <div className='w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center transition-all duration-500 group-hover/logo:border-brand-primary/40 group-hover/logo:bg-brand-primary/5'>
            <span className='font-mono text-[12px] md:text-[14px] font-bold text-brand-primary/90'>JC</span>
          </div>
          <div className='flex flex-col'>
            <span className='font-mono text-[10px] md:text-[11px] font-bold tracking-[0.1em] uppercase text-white/80'>JUSTIN CLARKE</span>
            <span className='font-mono text-[8px] md:text-[9px] text-white/15 uppercase tracking-[0.25em] font-medium'>© 2026_EST</span>
          </div>
        </div>

        <nav aria-label='Social Connectivity'>
          <ul className='flex items-center gap-3 md:gap-4'>
            <li><FooterSocialLink href='https://github.com/JustinClarke' icon={Github} label='GitHub' /></li>
            <li><FooterSocialLink href='https://linkedin.com/in/justinsavioclarke' icon={Linkedin} label='LinkedIn' /></li>
            <li><FooterSocialLink href='https://www.instagram.com/justiiiinsta' icon={Instagram} label='Instagram' /></li>
            <li><FooterSocialLink href={`mailto:${closerMetadata.email}`} icon={Mail} label='Email' /></li>
          </ul>
        </nav>

        <div className='flex flex-col items-center md:items-end gap-1.5'>
          <span className='font-mono text-[8px] md:text-[9px] font-bold text-white/10 uppercase tracking-[0.3em]'>Source_Manifest</span>
          <a
            href='https://github.com/JustinClarke/justinclarke.github.io'
            target='_blank'
            rel='noopener noreferrer'
            className='font-mono text-[12px] md:text-[14px] font-bold tracking-[0.05em] text-white/40 hover:text-brand-primary transition-colors group'
          >
            <span className='smooth-underline after:h-[1px] after:bg-brand-primary'>justinclarke.github.io</span>
          </a>
        </div>
      </ScrollReveal>
    </SectionContainer>
  );
};

const FooterSocialLink = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => (
  <a
    href={href}
    target='_blank'
    rel='noopener noreferrer'
    className='w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/[0.02] border border-white/5 text-white/30 hover:text-brand-primary hover:border-brand-primary/30 hover:bg-brand-primary/5 transition-all duration-500 group'
  >
    <Icon className='w-4 md:w-4.5 h-4 md:h-4.5 transition-transform duration-500 group-hover:scale-110' />
  </a>
);
