/**
 * ConnectPage the contact / "get in touch" page, styled as a terminal window.
 *
 * Fits in: rendered by App.tsx at /connect and /contact. Shares the
 *          WindowChrome "OS window" frame from the home-page hero.
 * Note:    three separate useEffects run here, each with its own concern:
 *          (1) the breathing background gradient, (2) the [C] keyboard
 *          shortcut to copy email, (3) auto-opening the contact modal when
 *          ?contact=true or #contact is in the URL. Keeping them separate
 *          means each one's cleanup is scoped and obvious.
 *
 * The QR modal is local state here since nothing else needs it; the contact
 * modal lives in ModalProvider so App.tsx can also open it from other pages.
 */
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Mail, Github, Calendar, ArrowRight, Download, Send, QrCode, X } from 'lucide-react';
import { SEO } from '@/components/layout';
import { useModal, useTheme } from '@/providers';
import { cn, track } from '@/utils';
import { WindowChrome } from '@/pages/home/Hero/ui/WindowChrome';
import { BackToTerminal, TechStack } from '@/ui';
import { SITE, routeMeta } from '@/content';

export function ConnectPage() {
  const { setIsContactModalOpen, openEmailModal } = useModal();
  const { resolvedTheme } = useTheme();
  const [gradientHue, setGradientHue] = useState(0);
  const [copiedToast, setCopiedToast] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // Effect 1 the "breathing" background. gradientHue ticks up every 50ms;
  // getTealPulse() maps it through a sine wave into a slowly pulsing HSL gradient.
  useEffect(() => {
    const interval = setInterval(() => {
      setGradientHue(prev => prev + 0.4);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Effect 2 the [C] shortcut copies the email. Bails when focus is in an
  // input/textarea so it doesn't swallow the keypress mid-typing.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }
      if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        if (navigator.clipboard) {
          navigator.clipboard.writeText(SITE.email).catch(() => { });
        }
        setCopiedToast(true);
        setTimeout(() => setCopiedToast(false), 2000);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Effect 3 deep-linked URLs like /connect?contact=true (or #contact) pop the
  // contact form open automatically.
  const location = useLocation();
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (
      searchParams.get('contact') === 'true' ||
      searchParams.get('open') === 'true' ||
      location.hash === '#contact' ||
      location.hash === '#connect'
    ) {
      setIsContactModalOpen(true);
    }
  }, [location, setIsContactModalOpen]);

  const getTealPulse = (time: number) => {
    const pulse = Math.sin(time * 0.01);
    if (resolvedTheme === 'light') {
      // Pale teal wash that breathes over the white surface.
      const lightness = 96 + pulse * 2; // 94% to 98%
      const saturation = 45 + pulse * 15;
      return `hsl(174, ${saturation}%, ${lightness}%)`;
    }
    const lightness = 3 + pulse * 3; // 0% to 6%
    const saturation = 20 + pulse * 10; // 10% to 30%
    return `hsl(174, ${saturation}%, ${lightness}%)`;
  };

  // Build a vCard (.vcf) entirely in-browser (Blob + object URL + hidden
  // <a download>) so the "save contact" button needs no server.
  const handleDownloadVCard = () => {
    // Phone, instagram and birthday are used nowhere else on the site, so they
    // stay local to the vCard rather than widening the SITE schema.
    const vcardData = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${SITE.name}`,
      `N:${SITE.lastName};${SITE.firstName};;;`,
      `EMAIL;TYPE=INTERNET:${SITE.email}`,
      'TEL;TYPE=CELL:+971585376967',
      'TITLE:Data Product Engineer',
      `URL:${SITE.url}`,
      `X-SOCIALPROFILE;type=linkedin:${SITE.social.linkedin}`,
      `X-SOCIALPROFILE;type=github:${SITE.social.github}`,
      'X-SOCIALPROFILE;type=instagram:justiiiinsta',
      'BDAY:20010224',
      `TZ:${SITE.timezone}`,
      'END:VCARD'
    ].join('\n');

    const blob = new Blob([vcardData], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${SITE.firstName}_${SITE.lastName}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <SEO {...routeMeta('/connect')} />

      <div className="hidden md:block">
        <BackToTerminal />
      </div>

      <main
        className="h-dvh md:min-h-screen w-full flex flex-col items-center justify-center selection:bg-brand-primary/20 relative overflow-hidden text-term-fg py-6 px-4 md:p-12 lg:p-16 animate-in fade-in duration-700"
        style={{
          background: `radial-gradient(circle at 75% 25%, ${getTealPulse(gradientHue)} 0%, var(--color-surface) 100%)`,
          transition: 'background 100ms ease-out'
        }}
      >
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.015] z-0 bg-[radial-gradient(var(--color-brand-primary)_1px,transparent_1px)] bg-[size:32px_32px]" />

        {/* Global Copied Toast Notification */}
        {copiedToast && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 md:top-6 md:right-6 md:left-auto md:translate-x-0 z-50 bg-surface-3 border border-brand-primary/40 px-5 py-3 rounded-xl shadow-[0_15px_30px_rgba(0,0,0,0.6)] flex items-center gap-3 animate-fade-in font-mono text-xs text-brand-primary w-[calc(100%-2rem)] md:w-auto max-w-md md:max-w-none justify-center md:justify-start">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
            <span>EMAIL COPIED TO CLIPBOARD</span>
          </div>
        )}        {/* Outer Page Container */}
        <div className="w-full max-w-[1536px] h-full flex-grow flex flex-col justify-center lg:justify-start lg:pt-24 z-10 relative">

          <div className="w-full h-auto max-h-[calc(100dvh-2rem)] lg:max-h-none lg:h-[80vh] min-h-[auto] lg:min-h-[600px] page-entry-scale bg-term-bg/95 border border-edge rounded-2xl overflow-hidden flex flex-col shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] mx-auto animate-in fade-in duration-500 my-0 lg:my-0">
            <WindowChrome
              url={`${SITE.social.github.toLowerCase()}@portfolio: ~/connect`}
              showBackOnMobile
              onMinimize={() => setIsMinimized(true)}
              isMinimized={isMinimized}
            />
            <div className="flex-1 p-4 xs:p-5 sm:p-8 lg:p-12 overflow-y-auto overscroll-contain flex items-center justify-center connect-scroll-container">
              <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-6 md:gap-8 lg:gap-16 items-center w-full my-auto">

                {/* Left Pane: Typographic Identity & Core Actions */}
                <div className="flex flex-col text-left">

                  <div className="font-mono text-fine md:text-xs text-brand-primary font-bold mb-2 md:mb-4 lg:mb-6 flex items-center gap-2 md:gap-3 animate-in fade-in slide-in-from-left-4 duration-500">
                    <span>~$</span>
                    <span className="flex items-center gap-1.5">
                      connect
                      <span className="w-1.5 h-3.5 bg-brand-primary animate-pulse inline-block shadow-[0_0_8px_var(--color-brand-primary)]" style={{ animationDuration: '1s' }} />
                    </span>
                  </div>

                  <h1 className="leading-[0.9] tracking-tighter flex flex-row md:flex-col items-baseline md:items-start gap-x-2 md:gap-x-0 select-none animate-in fade-in slide-in-from-left-4 duration-500 delay-75 connect-title whitespace-nowrap">
                    <span className="font-mono text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-term-fg leading-[0.9] drop-shadow-[0_2px_10px_rgba(255,255,255,0.06)]">
                      {SITE.firstName.toLowerCase()}
                    </span>
                    <span className="font-playfair italic text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-brand-primary font-black leading-[0.9] mt-0 md:mt-2 drop-shadow-[0_2px_15px_rgba(0,200,180,0.18)]">
                      {SITE.lastName.toLowerCase()}.
                    </span>
                  </h1>

                  <div className="relative pl-4 md:pl-6 mt-5 md:mt-5 lg:mt-8 lg:max-w-md animate-in fade-in slide-in-from-left-4 duration-500 delay-150 connect-subtitle space-y-2.5 md:space-y-4">
                    {/* Glowing Left Vertical Line */}
                    <div className="absolute left-0 top-1 bottom-1 w-[2px] bg-gradient-to-b from-brand-primary via-brand-primary/45 to-transparent rounded-full shadow-[0_0_8px_rgba(0,200,180,0.4)] opacity-90" />

                    <span className="font-mono !text-xs md:!text-sm text-term-fg leading-relaxed block font-bold">
                      data product engineer
                    </span>

                    {/* Responsive Stack Badges (Visible on all sizes, wraps beautifully) */}
                    <TechStack className="!text-micro md:!text-xs" />
                  </div>

                  {/* Status Tags */}
                  <div className="hidden md:flex flex-wrap gap-2.5 mt-4 md:mt-5.5 lg:mt-8 animate-in fade-in slide-in-from-left-4 duration-500 delay-200 connect-tags">
                    <span className="hidden md:inline-flex font-mono text-micro lg:text-fine tracking-[0.14em] font-semibold px-2.5 py-1 lg:px-3 lg:py-1.5 rounded-md border border-brand-primary/30 bg-brand-primary/5 text-brand-primary items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                      AVAILABLE
                    </span>
                    <span className="hidden md:inline-flex font-mono text-micro lg:text-fine tracking-[0.14em] font-semibold px-2.5 py-1 lg:px-3 lg:py-1.5 rounded-md border border-edge bg-fg/[0.02] text-fg-mid cursor-help" data-tooltip="For the UAE">
                      SPONSORSHIP NOT REQUIRED
                    </span>
                  </div>

                  {/* Main CTAs */}
                  <div className="flex flex-row w-full gap-2 md:gap-3 lg:gap-4 mt-5 md:mt-7 lg:mt-10 items-stretch animate-in fade-in slide-in-from-left-4 duration-500 delay-250 connect-ctas">
                    <button
                      onClick={handleDownloadVCard}
                      className="group/btn flex-[1.2] sm:flex-[1.4] md:flex-initial px-2 sm:px-3 py-3 md:px-5 md:py-3.5 lg:px-7 lg:py-4 bg-brand-primary hover:brightness-110 text-ink border border-brand-primary rounded-lg md:rounded-xl font-mono text-micro sm:text-micro lg:text-fine font-black tracking-[0.08em] sm:tracking-[0.14em] lg:tracking-mega flex items-center justify-center gap-1.5 sm:gap-2.5 transition-all cursor-pointer shadow-[0_6px_20px_-4px_rgba(0,200,180,0.35)] hover:shadow-[0_10px_34px_-4px_rgba(0,200,180,0.6)] hover:-translate-y-0.5 active:scale-[0.97] active:translate-y-0 duration-200"
                    >
                      <Download className="w-4 h-4 sm:w-4.5 sm:h-4.5 lg:w-[18px] lg:h-[18px] stroke-[2.5] shrink-0 group-hover/btn:scale-110 transition-transform duration-200" />
                      <span className="whitespace-nowrap">SAVE CONTACT</span>
                    </button>
                    <a
                      href={`https://cal.com/${SITE.social.cal}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => track('outbound-click', { channel: 'book' })}
                      className="group/btn flex-1 md:flex-initial px-2 sm:px-3 py-3 md:px-5 md:py-3.5 lg:px-7 lg:py-4 bg-fg/[0.02] hover:bg-fg/[0.06] text-term-fg/70 md:text-term-fg/80 hover:text-term-fg border border-edge md:border-edge hover:border-brand-primary/30 rounded-lg md:rounded-xl font-mono text-micro sm:text-micro lg:text-fine font-black tracking-[0.08em] sm:tracking-[0.14em] lg:tracking-[0.25em] flex items-center justify-center gap-1.5 sm:gap-2.5 transition-all cursor-pointer active:scale-[0.97] duration-200 backdrop-blur-sm md:shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)] hover:shadow-[0_4px_16px_-4px_rgba(0,200,180,0.15)]"
                    >
                      <Calendar className="w-4 h-4 sm:w-4.5 sm:h-4.5 lg:w-[18px] lg:h-[18px] shrink-0 group-hover/btn:text-brand-primary group-hover/btn:scale-110 transition-all duration-200" />
                      <span className="whitespace-nowrap">BOOK CALL</span>
                    </a>
                    <button
                      onClick={() => setIsQrModalOpen(true)}
                      className="group/btn flex-1 md:flex-initial px-2 sm:px-3.5 py-3 md:px-5 md:py-3.5 lg:px-7 lg:py-4 bg-fg/[0.02] hover:bg-fg/[0.06] text-term-fg/70 md:text-term-fg/80 hover:text-term-fg border border-edge md:border-edge hover:border-brand-primary/30 rounded-lg md:rounded-xl font-mono text-micro sm:text-micro lg:text-fine font-black tracking-[0.08em] sm:tracking-[0.14em] lg:tracking-[0.25em] flex items-center justify-center gap-1.5 sm:gap-2 lg:gap-2.5 transition-all cursor-pointer active:scale-[0.97] duration-200 backdrop-blur-sm md:shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)] hover:shadow-[0_4px_16px_-4px_rgba(0,200,180,0.15)]"
                    >
                      <QrCode className="w-4 h-4 sm:w-4.5 sm:h-4.5 lg:w-[18px] lg:h-[18px] shrink-0 group-hover/btn:text-brand-primary group-hover/btn:scale-110 transition-all duration-200" />
                      <span className="whitespace-nowrap">QR<span className="hidden sm:inline"> CODE</span></span>
                    </button>
                  </div>

                  <div className="font-mono text-micro lg:text-micro text-fg-faint tracking-[0.14em] mt-4 lg:mt-6 animate-in fade-in duration-700 delay-300 hidden sm:block">
                    ⏎ or press <kbd className="border border-edge bg-fg/[0.02] px-1.5 py-0.5 rounded text-fg-mid text-micro font-bold">C</kbd> <span className="text-fg-mid">to copy email</span>
                  </div>

                </div>

                {/* Right Pane: Monospaced Channels List */}
                <div className="flex flex-col animate-in fade-in slide-in-from-right-4 duration-500 mt-0 md:mt-6 lg:mt-0 connect-right-pane">

                  <div className="hidden sm:flex justify-between items-center mb-4 pb-2 border-b border-edge-soft connect-channels-header">
                    <h3 className="font-mono text-micro text-fg-mid tracking-[0.22em] uppercase font-bold">
                        // CHANNELS · 05
                    </h3>
                    <span className="font-mono text-micro text-fg-faint tracking-[0.14em] hidden sm:inline">
                      sorted by: response_time ↓
                    </span>
                  </div>

                  {/* Monospaced List Table */}
                  <div className="flex flex-col border-t border-edge-soft">

                    {/* 1. Email  -  button on mobile (opens modal), anchor on desktop (opens mailto) */}
                    <button
                      type="button"
                      data-channel="email"
                      onClick={openEmailModal}
                      className="sm:hidden w-full flex items-center justify-between py-3 border-b border-edge-soft active:bg-fg/[0.02] rounded-lg transition-all duration-300 group cursor-pointer text-left bg-transparent border-t-0 border-x-0 outline-none animate-in fade-in slide-in-from-bottom-3 fill-mode-both delay-75"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-md bg-social-email/5 flex items-center justify-center text-social-email shrink-0">
                          <Mail className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-mono text-xs text-term-fg font-semibold truncate">
                            {SITE.email}
                          </span>
                          <span className="font-mono text-micro text-fg-mid uppercase tracking-widest mt-0.5">
                            REPLIES &lt; 24H
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-fg-faint shrink-0" />
                    </button>
                    <button
                      type="button"
                      data-channel="email"
                      onClick={() => {
                        navigator.clipboard.writeText(SITE.email).catch(() => { });
                        setCopiedToast(true);
                        setTimeout(() => setCopiedToast(false), 2000);
                      }}
                      className="hidden sm:flex w-full items-center justify-between py-3.5 border-b border-edge-soft hover:bg-social-email/2 hover:px-3 rounded-lg transition-all duration-300 group cursor-pointer text-left bg-transparent border-t-0 border-x-0 outline-none animate-in fade-in slide-in-from-bottom-3 fill-mode-both delay-75"
                    >
                      <div className="flex items-center gap-6 min-w-0">

                        <div className="flex flex-col w-16 md:w-20 shrink-0 select-none">
                          <span className="font-mono text-micro text-social-email/40 tracking-wider group-hover:text-social-email/70 transition-colors font-bold">
                            [01]
                          </span>
                          <span className="font-mono text-micro text-social-email/60 tracking-widest font-black uppercase mt-0.5 group-hover:text-social-email transition-colors">
                            EMAIL
                          </span>
                        </div>

                        <div className="w-12 h-12 rounded-xl bg-social-email/5 border border-social-email/10 flex items-center justify-center text-social-email group-hover:bg-social-email group-hover:text-ink group-hover:border-transparent transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] group-hover:shadow-[0_0_15px_rgba(255,71,87,0.4)] shrink-0">
                          <Mail className="w-4 h-4" />
                        </div>

                        <div className="flex flex-col min-w-0">
                          <span className="font-mono text-sm md:text-base text-term-fg font-semibold truncate group-hover:text-fg transition-colors">
                            {SITE.email}
                          </span>
                          <span className="font-mono text-micro text-social-email/50 uppercase tracking-widest mt-1 group-hover:text-social-email/70 transition-colors">
                            REPLIES &lt; 24H
                          </span>
                        </div>

                      </div>

                      <ArrowRight className="w-4 h-4 text-fg-faint group-hover:text-social-email group-hover:translate-x-1 transition-all duration-300 shrink-0" />
                    </button>

                    {/* 2. LinkedIn */}
                    <a
                      href={`https://linkedin.com/in/${SITE.social.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-channel="linkedin"
                      onClick={() => track('outbound-click', { channel: 'linkedin' })}
                      className="w-full flex items-center justify-between py-3 sm:py-3.5 border-b border-edge-soft active:bg-fg/[0.02] hover:bg-social-linkedin/[0.02] hover:px-3 rounded-lg transition-all duration-300 group cursor-pointer text-left animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both delay-150"
                    >
                      <div className="flex items-center gap-3 sm:gap-6 min-w-0">

                        {/* Index & Label Block */}
                        <div className="hidden sm:flex flex-col w-16 md:w-20 shrink-0 select-none">
                          <span className="font-mono text-micro text-social-linkedin/40 tracking-wider group-hover:text-social-linkedin/70 transition-colors font-bold">
                            [02]
                          </span>
                          <span className="font-mono text-micro text-social-linkedin/60 tracking-widest font-black uppercase mt-0.5 group-hover:text-social-linkedin transition-colors">
                            LINKEDIN
                          </span>
                        </div>

                        <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-md sm:rounded-xl bg-social-linkedin/5 border-0 sm:border sm:border-social-linkedin/10 flex items-center justify-center text-social-linkedin sm:group-hover:bg-social-linkedin sm:group-hover:text-ink sm:group-hover:border-transparent transition-all duration-300 sm:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] sm:group-hover:shadow-[0_0_15px_rgba(10,102,194,0.4)] shrink-0 font-sans font-black text-fine sm:text-label lowercase tracking-tighter">
                          in
                        </div>

                        <div className="flex flex-col min-w-0">
                          <span className="font-mono text-xs sm:text-sm md:text-base text-term-fg font-semibold truncate group-hover:text-fg transition-colors">
                            linkedin.com/in/{SITE.social.linkedin}
                          </span>
                          <span className="font-mono text-micro text-fg-mid sm:text-social-linkedin/50 uppercase tracking-widest mt-0.5 sm:mt-1 group-hover:text-social-linkedin/70 transition-colors">
                            PROFESSIONAL NETWORK
                          </span>
                        </div>

                      </div>

                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-fg-faint group-hover:text-social-linkedin group-hover:translate-x-1 transition-all duration-300 shrink-0" />
                    </a>

                    {/* 3. GitHub */}
                    <a
                      href={`https://github.com/${SITE.social.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-channel="github"
                      onClick={() => track('outbound-click', { channel: 'github' })}
                      className="w-full flex items-center justify-between py-3 sm:py-3.5 border-b border-edge-soft active:bg-fg/[0.02] hover:bg-social-github/[0.02] hover:px-3 rounded-lg transition-all duration-300 group cursor-pointer text-left animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both delay-225"
                    >
                      <div className="flex items-center gap-3 sm:gap-6 min-w-0">

                        {/* Index & Label Block */}
                        <div className="hidden sm:flex flex-col w-16 md:w-20 shrink-0 select-none">
                          <span className="font-mono text-micro text-social-github/40 tracking-wider group-hover:text-social-github/70 transition-colors font-bold">
                            [03]
                          </span>
                          <span className="font-mono text-micro text-social-github/60 tracking-widest font-black uppercase mt-0.5 group-hover:text-social-github transition-colors">
                            GITHUB
                          </span>
                        </div>

                        <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-md sm:rounded-xl bg-social-github/5 border-0 sm:border sm:border-social-github/10 flex items-center justify-center text-social-github sm:group-hover:bg-social-github sm:group-hover:text-ink sm:group-hover:border-transparent transition-all duration-300 sm:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] sm:group-hover:shadow-[0_0_15px_rgba(137,87,229,0.4)] shrink-0">
                          <Github className="w-4 h-4" />
                        </div>

                        <div className="flex flex-col min-w-0">
                          <span className="font-mono text-xs sm:text-sm md:text-base text-term-fg font-semibold truncate group-hover:text-fg transition-colors">
                            github.com/{SITE.social.github.toLowerCase()}
                          </span>
                          <span className="font-mono text-micro text-fg-mid sm:text-social-github/50 uppercase tracking-widest mt-0.5 sm:mt-1 group-hover:text-social-github/70 transition-colors">
                            38 PUBLIC REPOS
                          </span>
                        </div>

                      </div>

                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-fg-faint group-hover:text-social-github group-hover:translate-x-1 transition-all duration-300 shrink-0" />
                    </a>

                    {/* 4. Book Call */}
                    <a
                      href={`https://cal.com/${SITE.social.cal}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-channel="book"
                      onClick={() => track('outbound-click', { channel: 'book' })}
                      className="w-full flex items-center justify-between py-3 sm:py-3.5 border-b border-edge-soft active:bg-fg/[0.02] hover:bg-social-cal/[0.02] hover:px-3 rounded-lg transition-all duration-300 group cursor-pointer text-left animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both delay-300"
                    >
                      <div className="flex items-center gap-3 sm:gap-6 min-w-0">

                        {/* Index & Label Block */}
                        <div className="hidden sm:flex flex-col w-16 md:w-20 shrink-0 select-none">
                          <span className="font-mono text-micro text-social-cal/40 tracking-wider group-hover:text-social-cal/70 transition-colors font-bold">
                            [04]
                          </span>
                          <span className="font-mono text-micro text-social-cal/60 tracking-widest font-black uppercase mt-0.5 group-hover:text-social-cal transition-colors">
                            BOOK
                          </span>
                        </div>

                        <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-md sm:rounded-xl bg-social-cal/5 border-0 sm:border sm:border-social-cal/10 flex items-center justify-center text-social-cal sm:group-hover:bg-social-cal sm:group-hover:text-ink sm:group-hover:border-transparent transition-all duration-300 sm:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] sm:group-hover:shadow-[0_0_15px_rgba(255,80,0,0.4)] shrink-0">
                          <Calendar className="w-4 h-4" />
                        </div>

                        <div className="flex flex-col min-w-0">
                          <span className="font-mono text-xs sm:text-sm md:text-base text-term-fg font-semibold truncate group-hover:text-fg transition-colors">
                            cal.com/{SITE.social.cal}
                          </span>
                          <span className="font-mono text-micro text-fg-mid sm:text-social-cal/50 uppercase tracking-widest mt-0.5 sm:mt-1 group-hover:text-social-cal/70 transition-colors">
                            THIS WEEK: OPEN
                          </span>
                        </div>

                      </div>

                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-fg-faint group-hover:text-social-cal group-hover:translate-x-1 transition-all duration-300 shrink-0" />
                    </a>

                    {/* 5. Secure Inquiries (Triggers Contact Modal) */}
                    <button
                      onClick={() => setIsContactModalOpen(true)}
                      data-channel="inquiries"
                      className="w-full flex items-center justify-between py-3 sm:py-3.5 border-b border-edge-soft active:bg-fg/[0.02] hover:bg-brand-primary/[0.02] hover:px-3 rounded-lg transition-all duration-300 group cursor-pointer text-left bg-transparent border-t-0 border-x-0 outline-none animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both delay-375"
                    >
                      <div className="flex items-center gap-3 sm:gap-6 min-w-0">

                        {/* Index & Label Block */}
                        <div className="hidden sm:flex flex-col w-16 md:w-20 shrink-0 select-none">
                          <span className="font-mono text-micro text-brand-primary/40 tracking-wider group-hover:text-brand-primary/70 transition-colors font-bold">
                            [05]
                          </span>
                          <span className="font-mono text-micro text-brand-primary/60 tracking-widest font-black uppercase mt-0.5 group-hover:text-brand-primary transition-colors">
                            INQUIRIES
                          </span>
                        </div>

                        <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-md sm:rounded-xl bg-brand-primary/5 border-0 sm:border sm:border-brand-primary/10 flex items-center justify-center text-brand-primary sm:group-hover:bg-brand-primary sm:group-hover:text-ink sm:group-hover:border-transparent transition-all duration-300 sm:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] sm:group-hover:shadow-[0_0_15px_rgba(0,200,180,0.4)] shrink-0">
                          <Send className="w-4 h-4" />
                        </div>

                        <div className="flex flex-col min-w-0">
                          <span className="font-mono text-xs sm:text-sm md:text-base text-term-fg font-semibold truncate group-hover:text-fg transition-colors">
                            let's work together
                          </span>
                          <span className="font-mono text-micro text-fg-mid sm:text-brand-primary/50 uppercase tracking-widest mt-0.5 sm:mt-1 group-hover:text-brand-primary/70 transition-colors">
                            SECURE FORM
                          </span>
                        </div>

                      </div>

                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-fg-faint group-hover:text-brand-primary group-hover:translate-x-1 transition-all duration-300 shrink-0" />
                    </button>

                  </div>

                </div>

              </div>
            </div>
          </div>

        </div>

      </main>

      {/* QR Code Modal */}
      {isQrModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 animate-in fade-in duration-200"
            onClick={() => setIsQrModalOpen(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-in fade-in scale-in duration-300">
            <div className="bg-surface-3/95 backdrop-blur-md border border-edge rounded-2xl shadow-[0_40px_100px_rgba(0,0,0,0.8)] w-full max-w-[310px] sm:max-w-[380px] p-6 flex flex-col items-center relative">
              {/* Close Button Icon */}
              <button
                onClick={() => setIsQrModalOpen(false)}
                className="absolute top-4 right-4 text-fg-mid hover:text-fg-soft transition-colors p-1 rounded-md hover:bg-fg/5 cursor-pointer z-10"
                aria-label="Close"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* QR Code Target Frame with Inviting Glow */}
              <div className="relative p-3.5 bg-white rounded-2xl shadow-[0_0_35px_rgba(0,200,180,0.22)] mt-4 mb-5 group select-none">
                {/* HUD Viewfinder Frame */}
                <div className="absolute -inset-1.5 border border-brand-primary/30 rounded-[18px] opacity-80 pointer-events-none" />
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=350x350&color=0c1110&data=${encodeURIComponent(`${SITE.url}/connect`)}`}
                  alt="QR Code"
                  className="w-48 h-48 sm:w-60 sm:h-60 block rounded-lg"
                />
              </div>

              {/* Stylish Website Label */}
              <p className="font-mono text-micro sm:text-fine text-fg-mid tracking-[0.25em] font-semibold text-center mt-2 uppercase select-all">
                {SITE.domain.split('.')[0]}<span className="text-brand-primary font-bold">.{SITE.domain.split('.').slice(1).join('.')}</span>
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
