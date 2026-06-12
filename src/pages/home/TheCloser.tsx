/**
 * TheCloser the full-height footer section used at the bottom of every page.
 *
 * Fits in: pages/home/ (it is a home/contact section, not a generic layout
 *          primitive), but every page renders it last via the re-export at
 *          components/layout/TheCloser.tsx.
 * Note:    one piece of state the fake "compliance audit" terminal's
 *          open/closed flag drives both the toggle button and a scroll nudge.
 *
 * For beginners ----------------------------------------------------------------
 * Mostly static HTML: a headline, a contact button, social links, and a
 * tongue-in-cheek legal panel. The two React ideas worth reading for are
 * (1) the `containerRef` + useEffect pair that scrolls the section into view
 * when the terminal opens, and (2) the BRAND_STYLES lookup table near the
 * bottom data picking classes instead of four copies of the same markup.
 * -----------------------------------------------------------------------------
 */
import { useRef, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { SectionContainer, ScrollReveal } from '@/ui';
import { closerMetadata } from '@/data';
import { cn, track } from '@/utils';
import { Mail, ArrowUpRight, Github, Linkedin, Instagram, Terminal, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { TOOLTIPS } from '@/config/tooltips';

export const TheCloser = () => {
  // LEARN: useRef gives a box whose .current React fills with the real DOM
  //    element once it renders the React way to grab a node, instead of
  //    document.querySelector. Needed for scrollIntoView below.
  const containerRef = useRef<HTMLElement>(null);
  // LEARN: useNavigate returns a function that changes the URL from code
  //    the router equivalent of clicking an <a>, for use inside onClick.
  const navigate = useNavigate();
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  // Scroll into view when terminal is opened
  // LEARN: this effect re-runs whenever isTerminalOpen flips. The 150ms
  //    timeout lets the terminal finish appearing first, so the section's new,
  //    taller height is what gets scrolled to. `?.` skips the call safely if
  //    the ref hasn't been attached yet.
  useEffect(() => {
    if (isTerminalOpen) {
      const timer = setTimeout(() => {
        containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isTerminalOpen]);

  return (
    <SectionContainer
      id='contact'
      ref={containerRef}
      containerVariant='project'
      className='relative overflow-hidden flex flex-col min-h-[100svh] h-auto md:h-auto md:min-h-[640px] justify-between dark border-t border-white/5 pb-28 xs:pb-32 sm:pb-24 md:pb-8'
      innerClassName='flex flex-col flex-1 justify-between w-full'
    >
      <div className='flex flex-col flex-1'>
        {/* Section Header */}
        <div className="flex flex-col gap-4 mb-4">
          <ScrollReveal direction="right" distance={12} className="flex items-center gap-6">
            <span className="font-mono text-[9px] md:text-[10px] tracking-[0.4em] uppercase text-white/30 font-bold whitespace-nowrap">
              Contact
            </span>
            <div className="flex-1 h-px bg-white/10" />
            <div className="flex items-center gap-2" data-tooltip={TOOLTIPS.livestatus} data-tooltip-pos="below">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
              <span className="font-mono text-[8px] md:text-[9px] text-brand-primary font-bold uppercase tracking-widest">Live</span>
            </div>
          </ScrollReveal>
        </div>

        {/* Main Content Grid (Vertically Centered) */}
        <div className='flex-1 flex flex-col justify-center pt-8 sm:pt-12 md:pt-0 pb-4 md:pb-0'>
          <div className='flex flex-col lg:flex-row items-center lg:items-end justify-between gap-8 sm:gap-12 lg:gap-20'>
            <ScrollReveal delay={0.1} direction="up" className='max-w-3xl'>
              <h2 className='font-noto text-4xl md:text-[clamp(28px,5vw,60px)] font-black leading-[0.95] md:leading-[1.05] tracking-tighter text-white text-center lg:text-left'>
                If your data isn't <br className="hidden md:block" />
                <span className="text-white/30"> driving decisions,</span><br />
                it's just <em className="font-playfair italic font-normal text-brand-primary drop-shadow-[0_0_15px_rgba(0,200,180,0.3)]">noise.</em>
              </h2>
            </ScrollReveal>

            <div className='flex flex-col items-center lg:items-end gap-6 sm:gap-8 lg:gap-10 flex-shrink-0 w-full lg:w-auto'>
              {/* CTA Button */}
              <ScrollReveal once={false} delay={0.4}>
                <button
                  onClick={() => {
                    track('outbound-click', { channel: 'connect_button_footer' });
                    navigate('/connect');
                  }}
                  data-tooltip={TOOLTIPS.getintouch}
                  className='group flex items-center justify-center gap-6 px-10 md:px-12 py-[18px] md:py-[22px] bg-transparent text-white font-noto text-[13px] md:text-[14px] font-bold tracking-[0.2em] uppercase rounded-full cursor-pointer transition-all duration-700 ease-out border border-brand-primary/20 hover:border-brand-primary hover:bg-brand-primary/[0.05] hover:shadow-[0_0_40px_rgba(0,200,180,0.15)] focus-ring relative overflow-hidden min-w-[280px] md:min-w-[320px]'
                  aria-label='Open contact form'
                >
                  <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-r from-transparent via-brand-primary/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] ease-in-out" />
                  <span className='whitespace-nowrap pt-[2px] block relative z-10 transition-colors duration-500 group-hover:text-brand-primary'>GET IN TOUCH</span>
                  <div className='relative z-10 w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/[0.03] flex items-center justify-center border border-white/10 group-hover:bg-brand-primary/10 group-hover:border-brand-primary/40 transition-all duration-500'>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/60 group-hover:text-brand-primary transition-all duration-500 group-hover:-translate-y-[2px] group-hover:translate-x-[2px]"><path d="M7 17l9.2-9.2M17 17V7H7" /></svg>
                  </div>
                </button>
              </ScrollReveal>

              <ScrollReveal once={false} delay={0.5}>
                <a
                  className='font-mono text-[13px] md:text-[14px] text-white/50 font-bold leading-relaxed tracking-[0.08em] hover:text-brand-primary transition-colors duration-400 group relative cursor-pointer'
                  href={`mailto:${closerMetadata.email}`}
                  data-tooltip={TOOLTIPS.email}
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
        className='flex flex-col md:flex-row items-center justify-between gap-12 md:gap-12 pt-12 md:pt-16 w-full pb-6 md:pb-0 border-t border-white/5 mt-16 md:mt-24'
      >
        <Link
          to="/"
          onClick={(e) => {
            if (window.location.pathname === '/') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className='flex items-center gap-5 md:gap-6 group/logo cursor-pointer no-underline text-left'
          data-tooltip={TOOLTIPS.jclogo}
          data-tooltip-pos="below"
        >
          <div className='w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center transition-all duration-500 group-hover/logo:border-brand-primary/40 group-hover/logo:bg-brand-primary/5'>
            <span className='font-mono text-[12px] md:text-[14px] font-bold text-brand-primary/90'>JC</span>
          </div>
          <div className='flex flex-col'>
            <span className='font-mono text-[10px] md:text-[11px] font-bold tracking-[0.1em] uppercase text-white/80'>JUSTIN CLARKE</span>
            <span className='font-mono text-[8px] md:text-[9px] text-white/15 uppercase tracking-[0.25em] font-medium'>© 2026_EST</span>
          </div>
        </Link>

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
            data-tooltip={TOOLTIPS.sourcemanifest}
            data-tooltip-pos="below"
            className='font-mono text-[12px] md:text-[14px] font-bold tracking-[0.05em] text-white/40 hover:text-brand-primary transition-colors group'
          >
            <span className='smooth-underline after:h-[1px] after:bg-brand-primary'>justinclarke.github.io</span>
          </a>
        </div>
      </ScrollReveal>

      {/* Nominative Fair Use Disclaimer */}
      <ScrollReveal
        delay={0.6}
        className='w-full border-t border-white/5 pt-12 mt-16'
      >
        <div className='flex flex-col gap-4 font-mono text-[8.5px] md:text-[9.5px] w-full border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.015] rounded-xl p-4 md:p-6 transition-all duration-300 backdrop-blur-md relative overflow-hidden group/compliance shadow-[0_4px_30px_rgba(0,0,0,0.4)]'>

          {/* Header Bar */}
          <div className='flex items-center justify-between gap-3 text-white/30 uppercase tracking-[0.15em] font-semibold border-b border-white/[0.04] pb-3'>
            <div className='flex items-center gap-2 xs:gap-3 min-w-0'>
              {/* Window Controls */}
              <div className='flex items-center gap-1.5 shrink-0'>
                <span className='w-2 h-2 rounded-full bg-viz-mac-red opacity-60 hover:opacity-100 transition-opacity' />
                <span className='w-2 h-2 rounded-full bg-viz-mac-yellow opacity-60 hover:opacity-100 transition-opacity' />
                <span className='w-2 h-2 rounded-full bg-viz-success opacity-60 hover:opacity-100 transition-opacity' />
              </div>
              <div className='h-3 w-px bg-white/10 hidden xs:block shrink-0' />
              <div className='flex items-center gap-1.5 xs:gap-2 min-w-0'>
                <Shield className='w-3.5 h-3.5 text-brand-primary/70 animate-pulse shrink-0' />
                <span className='text-brand-primary/70 font-bold truncate text-[8px] xs:text-[9px] sm:text-[9.5px]'>COMPLIANCE_PROTOCOL</span>
              </div>
            </div>
            <div className='h-px flex-1 bg-white/[0.03] hidden lg:block' />
            <div className='flex items-center gap-3 text-[7px] md:text-[8px] shrink-0'>
              <span className='bg-brand-primary/5 px-2.5 py-0.5 rounded-full border border-brand-primary/20 text-brand-primary font-bold tracking-wider whitespace-nowrap shadow-[0_0_8px_rgba(0,200,180,0.12)]'>
                <span className='inline xs:hidden'>FAIR_USE</span>
                <span className='hidden xs:inline'>NOMINATIVE_FAIR_USE</span>
              </span>
              <span className='bg-white/[0.03] px-2 py-0.5 rounded border border-white/5 text-white/20 hidden sm:inline'>VER: 2026_EST</span>
            </div>
          </div>

          {/* Structured Detail Grid */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 pt-2'>
            <div className='flex flex-col gap-2 pl-3 border-l-2 border-white/5 hover:border-brand-primary/45 transition-colors duration-300 group/card'>
              <div className='flex items-center gap-2 text-white/60 font-bold text-[7.5px] md:text-[8.5px] tracking-[0.08em]'>
                <span className='text-brand-primary/60 font-mono'>01_</span>
                <span>PROJECT_CLASSIFICATION</span>
              </div>
              <p className='text-white/35 leading-relaxed font-sans text-[11px] md:text-[12px]'>
                This portfolio is an independent, non-commercial professional creative research project demonstrating advanced data engineering techniques and interactive user interfaces.
              </p>
            </div>

            <div className='flex flex-col gap-2 pl-3 border-l-2 border-white/5 hover:border-brand-primary/45 transition-colors duration-300 group/card'>
              <div className='flex items-center gap-2 text-white/60 font-bold text-[7.5px] md:text-[8.5px] tracking-[0.08em]'>
                <span className='text-brand-primary/60 font-mono'>02_</span>
                <span>TRADEMARKS_&_ASSETS</span>
              </div>
              <p className='text-white/35 leading-relaxed font-sans text-[11px] md:text-[12px] mb-1'>
                "Formula 1", "F1", "Audi", and "Spotify" are trademarks of their respective owners. Brand marks, logo files, and telemetry contexts are utilized strictly under nominative fair use.
              </p>
              <div className='flex flex-wrap gap-1.5 pt-1'>
                <span className='font-mono text-[7px] md:text-[7.5px] font-bold bg-viz-mac-red/5 border border-viz-mac-red/15 text-viz-mac-red px-2 py-0.5 rounded tracking-wider uppercase'>F1_TELEMETRY</span>
                <span className='font-mono text-[7px] md:text-[7.5px] font-bold bg-viz-mac-yellow/5 border border-viz-mac-yellow/15 text-viz-mac-yellow px-2 py-0.5 rounded tracking-wider uppercase'>AUDI_SPEC</span>
                <span className='font-mono text-[7px] md:text-[7.5px] font-bold bg-viz-spotify/5 border border-viz-spotify/15 text-viz-spotify px-2 py-0.5 rounded tracking-wider uppercase'>SPOTIFY_API</span>
              </div>
            </div>

            <div className='flex flex-col gap-2 pl-3 border-l-2 border-white/5 hover:border-brand-primary/45 transition-colors duration-300 group/card'>
              <div className='flex items-center gap-2 text-white/60 font-bold text-[7.5px] md:text-[8.5px] tracking-[0.08em]'>
                <span className='text-brand-primary/60 font-mono'>03_</span>
                <span>FAIR_USE_REPRESENTATION</span>
              </div>
              <p className='text-white/35 leading-relaxed font-sans text-[11px] md:text-[12px]'>
                These telemetry contexts are utilized for educational data identification and visualization. This portfolio is not affiliated with, endorsed by, or sponsored by any of these entities.
              </p>
            </div>
          </div>

          {/* Interactive Logs Console */}
          <div className='mt-2 pt-4 border-t border-white/[0.04] flex flex-col gap-3'>
            <div className='flex flex-col gap-3 sm:flex-row sm:items-center justify-between'>
              <span className='text-white/20 text-[7px] md:text-[8px] tracking-[0.2em] font-semibold uppercase self-start sm:self-auto'>
                [STATUS: ACTIVE_VERIFICATION]
              </span>
              <button
                onClick={() => {
                  track('compliance-audit-toggle', { state: !isTerminalOpen ? 'open' : 'closed' });
                  setIsTerminalOpen(!isTerminalOpen);
                }}
                className='flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/[0.02] border border-white/[0.06] text-white/50 hover:text-brand-primary hover:border-brand-primary/30 transition-all duration-300 hover:bg-brand-primary/[0.02] cursor-pointer text-[7.5px] md:text-[8.5px] tracking-wider uppercase self-start sm:self-auto'
              >
                <Terminal className='w-3 h-3 text-brand-primary' />
                <span className='whitespace-nowrap'>{isTerminalOpen ? 'close_audit_logs.exe' : 'execute_compliance_audit.sh'}</span>
                {isTerminalOpen ? (
                  <ChevronUp className='w-3 h-3 text-brand-primary/80' />
                ) : (
                  <ChevronDown className='w-3 h-3 text-brand-primary/80' />
                )}
              </button>
            </div>

            {isTerminalOpen && (
              <ScrollReveal
                direction='up'
                distance={6}
                className='w-full border border-brand-primary/10 bg-[#060808]/95 rounded-lg p-4 font-mono text-[9px] text-white/40 leading-relaxed shadow-inner overflow-x-auto relative scanline'
              >
                <div className='flex flex-col gap-1.5 min-w-[280px]'>
                  <div className='flex items-center gap-2 text-brand-primary/80 font-bold'>
                    <span>$</span>
                    <span>compliance-check --verbose --target=justinclarke.github.io</span>
                  </div>
                  <div className='text-white/60 font-semibold'>[OK] INITIALIZING COMPLIANCE & PRIVACY AUDIT...</div>
                  <div>[OK] PROJECT STATUS: NON-COMMERCIAL / PROFESSIONAL PORTFOLIO</div>
                  <div className='flex flex-col gap-0.5 pl-3'>
                    <div className='text-white/65'>[INFO] ASSET IDENTIFICATION SCAN:</div>
                    <div className='text-white/50 pl-2'>
                      - <span className='text-viz-mac-red/80 font-semibold'>"Formula 1" / "F1"</span> | SOURCE: Telemetry Dataset | BASIS: Nominative Fair Use (17 U.S.C. § 107)
                    </div>
                    <div className='text-white/50 pl-2'>
                      - <span className='text-viz-mac-yellow/80 font-semibold'>"Audi"</span>              | SOURCE: Historical Specification | BASIS: Descriptive Identification
                    </div>
                    <div className='text-white/50 pl-2'>
                      - <span className='text-viz-spotify/80 font-semibold'>"Spotify"</span>           | SOURCE: Public Web API | BASIS: Educational Integration
                    </div>
                  </div>
                  <div className='flex flex-col gap-0.5 pl-3'>
                    <div className='text-white/65'>[OK] PRIVACY PROTOCOL VALIDATION:</div>
                    <div className='text-viz-success/70 pl-2'>
                      ✓ UAE PDPL & GDPR validation state: PASS (100% Client-Side Execution)
                    </div>
                    <div className='text-viz-success/70 pl-2'>
                      ✓ Tracking and profiling tracking state: DISABLED
                    </div>
                  </div>
                  <div>[OK] NO ENDORSEMENT OR AFFILIATION IMPLIED BY ANY REFERENCED ENTITY</div>
                  <div className='flex items-center gap-2 text-viz-success/90 font-bold mt-1 pt-1.5 border-t border-white/[0.04]'>
                    <span className='w-1.5 h-1.5 rounded-full bg-viz-success animate-ping' />
                    <span>[SUCCESS] ALL SYSTEMS COMPLIANT. STATUS: SECURED_AND_VERIFIED.</span>
                  </div>
                </div>
              </ScrollReveal>
            )}
          </div>
        </div>
      </ScrollReveal>

    </SectionContainer>
  );
};

// LEARN: Record<string, string> is TypeScript for "an object used as a
//    dictionary: any string key, string values". These two tables let
//    FooterSocialLink LOOK UP its tooltip and colours by label instead of
//    hardcoding four near-identical copies of the markup.
const SOCIAL_TOOLTIP: Record<string, string> = {
  GitHub: TOOLTIPS.github,
  LinkedIn: TOOLTIPS.linkedin,
  Instagram: TOOLTIPS.instagram,
  Email: TOOLTIPS.email,
};

const BRAND_STYLES: Record<string, { default: string; hover: string; shadow: string }> = {
  GitHub: {
    default: 'bg-social-github/5 border-social-github/20 text-social-github',
    hover: 'hover:bg-social-github hover:text-ink hover:border-transparent',
    shadow: 'hover:shadow-[0_0_20px_rgba(137,87,229,0.4)]',
  },
  LinkedIn: {
    default: 'bg-social-linkedin/5 border-social-linkedin/20 text-social-linkedin',
    hover: 'hover:bg-social-linkedin hover:text-ink hover:border-transparent',
    shadow: 'hover:shadow-[0_0_20px_rgba(10,102,194,0.4)]',
  },
  Instagram: {
    default: 'bg-social-instagram/5 border-social-instagram/20 text-social-instagram',
    hover: 'hover:bg-social-instagram hover:text-ink hover:border-transparent',
    shadow: 'hover:shadow-[0_0_20px_rgba(225,48,108,0.4)]',
  },
  Email: {
    default: 'bg-social-email/5 border-social-email/20 text-social-email',
    hover: 'hover:bg-social-email hover:text-ink hover:border-transparent',
    shadow: 'hover:shadow-[0_0_20px_rgba(255,71,87,0.4)]',
  },
};

// LEARN: components are plain values, so they can be passed as props.
//    `icon: Icon` destructures the prop AND renames it with a capital letter,
//    because JSX treats <Icon /> as "render this component" but <icon /> as a
//    literal HTML tag.
const FooterSocialLink = ({
  href,
  icon: Icon,
  label,
  onClick,
}: {
  href: string;
  icon: any;
  label: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) => {
  // LEARN: `||` falls back to the neutral grey style if a label has no entry
  //    in BRAND_STYLES so a new link still renders sensibly.
  const styles = BRAND_STYLES[label] || {
    default: 'bg-white/[0.02] border-white/5 text-white/30',
    hover: 'hover:text-brand-primary hover:border-brand-primary/30 hover:bg-brand-primary/5',
    shadow: '',
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    track('outbound-click', { channel: label.toLowerCase() });
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      // LEARN: passing `undefined` to a JSX attribute is the same as omitting
      //    it links with a custom onClick stay in-tab; plain links open a new
      //    tab (with the standard rel guard for third-party sites).
      target={onClick ? undefined : '_blank'}
      rel={onClick ? undefined : 'noopener noreferrer'}
      aria-label={label}
      data-tooltip={SOCIAL_TOOLTIP[label]}
      data-tooltip-pos="below"
      className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border transition-all duration-500 group cursor-pointer ${styles.default} ${styles.hover} ${styles.shadow}`}
    >
      <Icon className='w-4 md:w-4.5 h-4 md:h-4.5 transition-transform duration-500 group-hover:scale-110' />
    </a>
  );
};
