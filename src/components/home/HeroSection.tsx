import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Sun, Moon, Download } from 'lucide-react';
import { useModal } from '@/providers/ModalProvider';
import { cn } from '@/utils';
import { NeuralNetCanvas } from './NeuralNetCanvas';
import { TerminalUI, TerminalHandle } from './TerminalUI';

/**
 * HeroSection
 * 
 * Layout orchestrator for the top-fold experience.
 * Decomposed into:
 * - NeuralNetCanvas: Background animation
 * - TerminalUI: Interactive CLI
 * - HeroHeadline: Brand bio and nav hints
 */
export const HeroSection: React.FC = () => {
  const terminalRef = useRef<TerminalHandle>(null);
  const { setIsContactModalOpen } = useModal();
  const [isDark, setIsDark] = useState(true);

  const runCmd = (cmd: string) => terminalRef.current?.runCmd(cmd);

  const containerClasses = cn(
    "relative flex flex-col items-center justify-center w-full min-h-screen overflow-x-hidden transition-colors duration-500",
    "lg:px-12 xl:px-20",
    isDark
      ? "bg-brand-bg bg-[radial-gradient(rgba(255,255,255,0.05)_0.8px,transparent_0.8px)] bg-[length:24px_24px]"
      : "bg-white bg-[radial-gradient(rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[length:20px_20px]"
  );

  return (
    <section className={containerClasses}>
      {/* Background vignette */}
      <div className={cn(
        "absolute inset-0 pointer-events-none z-1 transition-opacity duration-700",
        isDark
          ? "bg-[radial-gradient(circle_at_50%_50%,transparent_0%,#050505_85%)] opacity-100"
          : "bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(255,255,255,0.4)_90%)] opacity-40"
      )} />

      <div className={cn(
        "relative flex flex-col z-2 w-[94%] max-w-400 m-0 overflow-hidden rounded-3xl font-mono transition-all duration-500 mx-auto",
        "-translate-y-5 backdrop-blur-xl border min-h-[80dvh] h-auto md:h-[80dvh] md:max-h-[80dvh]",
        isDark
          ? 'bg-brand-card/90 border-white/8 shadow-[0_40px_100px_rgba(0,0,0,0.5)]'
          : 'bg-white/90 border-black/5 shadow-[0_20px_50px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.01)]'
      )}>

        {/* Topbar */}
        <div className={cn(
          "relative shrink-0 px-8 rounded-t-3xl border-b transition-all duration-300 z-10",
          "grid grid-cols-[auto_1fr] grid-rows-[auto_auto] gap-y-1 py-4 lg:py-0 lg:flex lg:items-center lg:justify-between lg:h-12",
          isDark ? 'bg-brand-modal border-border-studio' : 'bg-white border-light-border'
        )}>
          <div className="relative flex gap-2 col-start-1 row-start-1 self-center">
            <div className="relative w-3 h-3 rounded-full bg-viz-mac-red ring-1 ring-black/5" />
            <div className="relative w-3 h-3 rounded-full bg-viz-mac-yellow ring-1 ring-black/5" />
            <div className="relative w-3 h-3 rounded-full bg-viz-success ring-1 ring-black/5" />
          </div>

          <div className={cn(
            "z-5 whitespace-nowrap pointer-events-none font-mono text-[9px] lg:text-[10px] tracking-[.12em] opacity-60 text-shadow-sm",
            "col-start-2 row-start-1 self-center justify-self-end text-right",
            "lg:absolute lg:right-auto lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:-translate-x-1/2 lg:text-center",
            isDark ? "text-viz-success shadow-viz-success/10" : "text-[#444]"
          )}>
            justinclarke / portfolio
          </div>

          <div className="relative flex items-center gap-2 sm:gap-4 z-10 col-span-2 row-start-2 justify-center lg:flex-row lg:col-span-1 lg:row-start-1 lg:justify-end mt-2 lg:mt-0">
            {/* Social Links Group */}
            <div className="flex items-center gap-1 sm:mr-1 lg:mr-2">
              <a
                href="https://github.com/JustinClarke"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "p-2 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95 group/soc",
                  isDark
                    ? "text-[#6e5494] hover:text-white hover:bg-[#6e5494]/20"
                    : "text-[#6e5494] hover:text-white hover:bg-[#6e5494]/10"
                )}
                data-tooltip="Inspect my source code."
                data-tooltip-pos="below"
              >
                <Github size={16} className="transition-transform group-hover/soc:-translate-y-0.5" />
              </a>
              <a
                href="https://linkedin.com/in/justinsavioclarke"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "p-2 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95 group/soc",
                  isDark
                    ? "text-[#0077b5] hover:text-white hover:bg-[#0077b5]/20"
                    : "text-[#0077b5] hover:text-white hover:bg-[#0077b5]/10"
                )}
                data-tooltip="Connect on LinkedIn"
                data-tooltip-pos="below"
              >
                <Linkedin size={16} className="transition-transform group-hover/soc:-translate-y-0.5" />
              </a>
            </div>

            {/* Resume Button */}
            <a
              href="/resources/Justin_Clarke_Resume.pdf"
              download="Justin_Clarke_Resume.pdf"
              className={cn(
                "hidden lg:inline-flex items-center gap-2 px-5 py-1.5 rounded-full font-mono font-bold text-[10px] tracking-[0.05em] uppercase cursor-pointer no-underline transition-all duration-500 border-[1.5px] shadow-sm hover:shadow-xl active:scale-95 group/res",
                isDark
                  ? "bg-white/5 text-white border-white/20 hover:border-brand-primary hover:bg-brand-primary/10 resume-pulse-dark"
                  : "bg-black/5 text-black border-black/10 hover:border-black hover:bg-black/5 resume-pulse-light"
              )}
              data-tooltip="Please don't parse this with regex. I beg you."
              data-tooltip-pos="below"
            >
              Resume
              <span className={cn(
                "flex items-center justify-center w-6 h-6 rounded-full ml-2 transition-all duration-500",
                isDark
                  ? "bg-white/10 text-white group-hover:bg-brand-primary group-hover:text-white group-hover:shadow-[0_0_15px_rgba(0,200,180,0.5)]"
                  : "bg-black/10 text-black group-hover:bg-black group-hover:text-white"
              )}>
                <Download size={13} className="transition-transform duration-500 group-hover/res:translate-y-0.5" />
              </span>
            </a>

            {/* Theme Toggle - Minimal Switch */}
            <div
              className={cn(
                "group relative flex items-center cursor-pointer transition-all duration-500 active:scale-95 ml-2",
                isDark ? "text-white/40 hover:text-white" : "text-black/40 hover:text-black"
              )}
              onClick={() => setIsDark(!isDark)}
              data-tooltip={isDark ? "Enable Light Mode" : "Return to Darkness"}
              data-tooltip-pos="below"
            >
              <div className={cn(
                "relative w-9 h-4.5 rounded-full transition-all duration-500 flex items-center px-0.5 overflow-hidden border shadow-inner",
                isDark ? "bg-zinc-950 border-white/20" : "bg-amber-400 border-black/10"
              )}>
                <motion.div
                  initial={false}
                  animate={{ x: isDark ? 0 : 18 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className={cn(
                    "relative z-10 w-3.5 h-3.5 rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.4)] flex items-center justify-center transition-colors duration-300",
                    "bg-white"
                  )}
                >
                  {isDark ? (
                    <Moon size={8} className="text-zinc-950 fill-zinc-950" />
                  ) : (
                    <Sun size={8} className="text-amber-400 fill-amber-400" />
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] flex-1 w-full overflow-hidden h-full">

          {/* Left Column: Bio */}
          <div className={cn(
            "relative flex flex-col justify-center md:justify-between items-center md:items-start flex-1 transition-all duration-500",
            "border-r transition-colors duration-300 scrollbar-none p-8 sm:p-10 md:p-0 md:h-full md:overflow-hidden md:pt-20 md:pb-24 md:pl-20 md:pr-10",
            isDark ? "bg-white/1 border-white/5" : "bg-black/1 border-black/5"
          )}>
            {/* Mobile Background Texture */}
            <div className="absolute inset-0 z-0 pointer-events-none md:hidden overflow-hidden">
              <NeuralNetCanvas className="absolute inset-0 opacity-[0.55] scale-125" isDark={isDark} nodeCount={25} />
              {/* Scanline Animation */}
              <div className="absolute inset-0 bg-scanline pointer-events-none opacity-[0.03]" />
              {/* Technical Grid */}
              <div className="absolute inset-0 bg-[radial-gradient(rgba(0,200,180,0.08)_1px,transparent_1px)] bg-size-[25px_25px]" />
              <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-brand-bg to-transparent opacity-80" />
            </div>

            {/* Technical HUD Marker (Mobile Only) */}
            <div className="absolute top-8 right-8 flex flex-col items-end gap-1.5 md:hidden pointer-events-none font-mono uppercase">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-ping" />
              </div>
              <div className="w-16 h-px bg-brand-primary/20 mt-1" />
            </div>

            <div className="relative z-10 flex flex-col gap-10 lg:gap-8 justify-start items-center md:items-start w-full">
              <div className={cn(
                "font-black whitespace-pre-line leading-[1.0] sm:leading-[0.8] ml-[clamp(-2px,-0.15vw,0)] cursor-help text-center md:text-left",
                isDark ? "text-white" : "text-black"
              )} data-tooltip="Fun fact: My terminal and I have a complicated relationship.">
                <span className="font-mono tracking-[-0.08em] text-[clamp(2.5rem,14vw,8rem)] lg:text-[clamp(2.5rem,8vw,5.5rem)] font-black">Justin</span>
                {"\n"}
                <span className="font-playfair italic tracking-[-0.05em] text-[clamp(2.5rem,14vw,8rem)] lg:text-[clamp(2.5rem,8vw,5.5rem)] font-black">Clarke</span>
              </div>
              <div className="flex flex-col gap-8 sm:gap-12 items-center md:items-start mt-4">
                <div className={cn(
                  "relative flex items-center gap-3 px-5 py-2 rounded-[4px] w-fit font-mono font-bold tracking-[0.15em] uppercase text-[9px] sm:text-[11px] lg:text-[10px] border transition-all duration-300 shadow-xl backdrop-blur-md cursor-help",
                  isDark
                    ? "bg-brand-primary/10 border-brand-primary/40 text-brand-primary shadow-[0_0_30px_rgba(0,200,180,0.15)]"
                    : "bg-brand-primary/5 border-brand-primary/20 text-[#00796b]"
                )} data-tooltip="The digital backbone and the visual soul." data-tooltip-pos="right">
                  <span className={cn(
                    "w-2 h-2 rounded-full animate-pulse shadow-[0_0_10px_currentColor]",
                    isDark ? "bg-brand-primary text-brand-primary" : "bg-[#00897b] text-[#00897b]"
                  )} />
                  Analytics Engineer · Full-Stack
                </div>
                <div className="tagline-block flex flex-col gap-2 border-l-0 md:border-l-2 border-brand-primary/30 pl-0 md:pl-6 ml-0 md:ml-1 text-center md:text-left" data-tooltip="End-to-end data systems and user experiences." data-tooltip-pos="right">
                  <div className={cn("font-mono font-black text-lg sm:text-2xl md:text-sm tracking-[-0.02em] leading-tight", isDark ? "text-white" : "text-black")}>
                    I build pipelines and the products they power.
                  </div>
                </div>
              </div>
            </div>

            <div className="hero-actions flex flex-col sm:flex-row items-center gap-6 mt-12 w-full sm:w-auto relative z-10">
              <button
                onClick={() => setIsContactModalOpen(true)}
                className={cn(
                  "group inline-flex items-center justify-between sm:justify-start gap-2 px-6 py-2 rounded-full font-mono font-bold text-[10px] sm:text-[11px] tracking-[0.05em] uppercase cursor-pointer transition-all duration-300 border-[1.5px] shadow-sm hover:shadow-lg active:scale-95 w-full sm:w-auto",
                  isDark
                    ? "bg-transparent text-white border-white/20 hover:border-white hover:bg-white/5"
                    : "bg-black text-white border-black hover:bg-white hover:text-black"
                )}
                data-tooltip="I respond faster than a Power BI refresh. Mostly."
              >
                Get in touch
                <span className={cn(
                  "flex items-center justify-center w-7 h-7 rounded-full ml-3 transition-all duration-300",
                  isDark
                    ? "bg-white/10 text-white group-hover:bg-white group-hover:text-black"
                    : "bg-white text-black group-hover:bg-black group-hover:text-white"
                )}>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17l9.2-9.2M17 17V7H7" />
                  </svg>
                </span>
              </button>

              <a
                href="/resources/Justin_Clarke_Resume.pdf"
                download="Justin_Clarke_Resume.pdf"
                className={cn(
                  "inline-flex items-center justify-center gap-3 px-6 py-2 rounded-full font-mono font-bold text-[11px] tracking-widest uppercase cursor-pointer no-underline transition-all duration-300 border shadow-2xl backdrop-blur-xl group/res w-full sm:w-auto lg:hidden",
                  isDark
                    ? "bg-white/10 text-white border-white/20 hover:bg-white hover:text-black"
                    : "bg-black text-white border-black hover:bg-white hover:text-black"
                )}
              >
                Resume
                <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover/res:translate-y-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M19 12l-7 7-7-7" />
                </svg>
              </a>
            </div>

            {/* Mobile Footer Meta */}
            <div className="absolute bottom-4 left-8 right-8 z-10 md:hidden flex justify-between items-center opacity-30 font-mono text-[8px] tracking-[0.2em] uppercase">
              <div className="flex items-center gap-3">
                <span className="text-brand-primary font-bold">Latency: 2ms</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span>Buffer: Nominal</span>
              </div>
            </div>


          </div>

          {/* Right Column: Terminal */}
          <div className="rcol relative hidden md:flex flex-col overflow-hidden h-full">
            <NeuralNetCanvas className="absolute inset-0 z-0 pointer-events-none" isDark={isDark} />
            <TerminalUI
              ref={terminalRef}
              isDark={isDark}
              onThemeToggle={() => setIsDark(d => !d)}
              onContactOpen={() => setIsContactModalOpen(true)}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
