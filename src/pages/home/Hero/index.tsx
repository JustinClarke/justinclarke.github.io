import React, { useState, useCallback, useEffect, useRef } from 'react';
import { SnakeGame } from './SnakeGame';
import { useTerminalSession } from '@/hooks/useTerminalSession';
import { useTerminalBoot } from '@/hooks/useTerminalBoot';
import { useFirstVisit } from '@/hooks/useFirstVisit';
import { useReducedMotion } from '@/hooks/useReducedMotion';

import { WindowChrome } from './ui/WindowChrome';
import { SidebarMenu } from './ui/SidebarMenu';
import { TerminalHeader } from './ui/TerminalHeader';
import { TerminalBody } from './ui/TerminalBody';
import { CommandPalette } from './ui/CommandPalette';
import { ScrollHint } from './ScrollHint';

const DUBAI_LOCALE = 'en-US';
const DUBAI_TZ = 'Asia/Dubai';

const SessionClock: React.FC = () => {
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString(DUBAI_LOCALE, { timeZone: DUBAI_TZ, hour12: false })
  );

  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date().toLocaleTimeString(DUBAI_LOCALE, { timeZone: DUBAI_TZ, hour12: false }));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="hidden md:block font-mono text-[10px] text-term-faint mb-4 md:mb-6 shrink-0 opacity-60">
      // session_active: port 8080 // auth_success: {time}
    </div>
  );
};

/**
 * Hero - Terminal IS the Hero
 *
 * Orchestrator component that wires useTerminalSession + useTerminalBoot
 * into the layout. All command logic lives in the hooks/engine.
 */
export const Hero: React.FC = () => {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [terminalState, setTerminalState] = useState<'normal' | 'shutting-down' | 'static' | 'starting-up'>('normal');
  const [paletteOpen, setPaletteOpen] = useState(false);

  const { bootStep, setBootStep } = useTerminalBoot();
  const { inputValue, setInputValue, history, setHistory, isTyping, lastExitCode, handleCommand } = useTerminalSession({ onLaunchGame: setActiveGame });
  const isFirstVisit = useFirstVisit('terminal_visited');
  const prefersReducedMotion = useReducedMotion();
  const autoDemoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoDemoCancelled = useRef(false);
  const autoDemoStarted = useRef(false);
  const staticCanvasRef = useRef<HTMLCanvasElement>(null);

  const [hasScrolled, setHasScrolled] = useState(false);

  // Detect scroll to dismiss the scroll hint when entering other sections
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleShutdownAndReboot = useCallback(() => {
    setTerminalState('shutting-down');
    setTimeout(() => {
      setTerminalState('static');
      setTimeout(() => {
        setHistory([]);
        setInputValue('');
        setActiveGame(null);
        setBootStep(0);
        setTerminalState('starting-up');
        setTimeout(() => setTerminalState('normal'), 600);
      }, 2500);
    }, 1000);
  }, [setHistory, setInputValue, setBootStep]);

  // First-visit auto-demo: after 6s of idle on boot, run whoami then ls projects
  useEffect(() => {
    if (autoDemoStarted.current || autoDemoCancelled.current) return;
    if (!isFirstVisit || prefersReducedMotion || bootStep < 7 || isTyping || history.length > 0) return;

    autoDemoStarted.current = true;
    autoDemoCancelled.current = false;
    autoDemoTimer.current = setTimeout(async () => {
      if (autoDemoCancelled.current) return;
      await handleCommand('whoami');
      if (autoDemoCancelled.current) return;
      await new Promise(r => setTimeout(r, 1200));
      if (autoDemoCancelled.current) return;
      await handleCommand('ls projects');
    }, 6000);
    return () => {
      if (autoDemoTimer.current) {
        clearTimeout(autoDemoTimer.current);
        autoDemoTimer.current = null;
      }
    };
  }, [isFirstVisit, prefersReducedMotion, bootStep, isTyping, history.length, handleCommand]);

  // Cancel auto-demo on any keypress, input, click, or scroll
  useEffect(() => {
    const cancelDemo = () => {
      autoDemoCancelled.current = true;
      if (autoDemoTimer.current) {
        clearTimeout(autoDemoTimer.current);
        autoDemoTimer.current = null;
      }
    };

    if (inputValue || history.length > 0 || isTyping) {
      cancelDemo();
    }

    window.addEventListener('scroll', cancelDemo, { passive: true });
    window.addEventListener('click', cancelDemo, { passive: true });
    window.addEventListener('keydown', cancelDemo, { passive: true });

    return () => {
      window.removeEventListener('scroll', cancelDemo);
      window.removeEventListener('click', cancelDemo);
      window.removeEventListener('keydown', cancelDemo);
    };
  }, [inputValue, history.length, isTyping]);

  // Static noise canvas rendering
  useEffect(() => {
    if (terminalState !== 'static') return;
    const canvas = staticCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scale = 4;
    const w = Math.ceil(window.innerWidth / scale);
    const h = Math.ceil(window.innerHeight / scale);
    canvas.width = w;
    canvas.height = h;

    const imageData = ctx.createImageData(w, h);
    const buf = new Uint32Array(imageData.data.buffer);
    let animId: number;

    const draw = () => {
      for (let i = 0; i < buf.length; i++) {
        const v = (Math.random() * 255) | 0;
        buf[i] = 0xff000000 | (v << 16) | (v << 8) | v;
      }
      ctx.putImageData(imageData, 0, 0);
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => cancelAnimationFrame(animId);
  }, [terminalState]);

  // Cmd-K / Ctrl-K opens command palette
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen(prev => !prev);
      }
      if (e.key === 'Escape') setPaletteOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const getLineColor = (type: string) => {
    switch (type) {
      case 'brand': return 'text-brand-primary font-bold';
      case 'success':
      case 'viz-success':
      case 'g': return 'text-viz-success';
      case 'error':
      case 'r':
      case 'viz-mac-red': return 'text-viz-mac-red';
      case 'info':
      case 'b': return 'text-blue-500'; // Default blue
      case 'viz-mac-yellow':
      case 'o': return 'text-viz-mac-yellow';
      case 'pu': return 'text-acc-bi';
      case 'muted':
      case 'm': return 'text-term-faint';
      default: return 'text-term-fg';
    }
  };

  const getContainerClass = () => {
    switch (terminalState) {
      case 'shutting-down':
        return 'crt-shutdown pointer-events-none';
      case 'starting-up':
        return 'crt-startup pointer-events-none';
      case 'static':
        return 'opacity-0 scale-0 pointer-events-none';
      default:
        return 'page-entry-scale';
    }
  };

  return (
    <section data-theme-lock="dark" className="relative w-full min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-12 lg:p-16 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,200,180,0.02)_0%,transparent_70%)] pointer-events-none" />

      {terminalState === 'static' && (
        <div className="fixed inset-0 z-[9999] bg-black crt-static-container">
          <canvas
            ref={staticCanvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ imageRendering: 'pixelated', opacity: 0.55 }}
          />
          <div className="crt-static-scanlines absolute inset-0" />
          <div className="crt-static-vignette absolute inset-0" />
          <div className="crt-static-flicker absolute inset-0 bg-white" />
        </div>
      )}

      <div className={`${getContainerClass()} relative w-full h-[85vh] min-h-[600px] max-w-[1536px] lg:h-[80vh] transition-all duration-300`}>
        <div className="w-full h-full bg-brand-card border border-white/10 rounded-xl overflow-hidden flex flex-col shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] cursor-text">
          {activeGame === 'snake' && (
            <div className="absolute inset-0 z-50 bg-brand-bg flex flex-col">
              <WindowChrome url="snake.exe" right={<button onClick={() => setActiveGame(null)} className="text-viz-mac-red font-bold px-2 hover:bg-white/5 rounded transition-colors">EXIT</button>} />
              <div className="flex-1 overflow-hidden">
                <SnakeGame onExit={() => setActiveGame(null)} />
              </div>
            </div>
          )}

          <WindowChrome
            onMinimize={() => setIsMinimized(true)}
            isMinimized={isMinimized}
            onCloseConfirm={handleShutdownAndReboot}
          />

          <div className="flex-1 flex flex-col lg:grid lg:grid-cols-[1.6fr_1fr] gap-4 md:gap-8 p-3 md:py-8 md:px-6 lg:py-10 lg:px-8 overflow-hidden">
            <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <SessionClock />

              <div className="hidden md:block">
                <TerminalHeader bootStep={bootStep} onStepComplete={setBootStep} />
              </div>

              <TerminalBody
                history={history}
                inputValue={inputValue}
                onInputChange={setInputValue}
                onCommand={handleCommand}
                bootStep={bootStep}
                getLineColor={getLineColor}
                isTyping={isTyping}
                lastExitCode={lastExitCode}
              />
            </div>

            <SidebarMenu onCommand={handleCommand} />
          </div>
        </div>

        {/* Scroll hint retro terminal style, starts dark grey, turns light teal, blinks if idle, disappears in other sections */}
        <ScrollHint hasScrolled={hasScrolled} />
      </div>

      <CommandPalette
        isOpen={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onCommand={(cmd) => { setPaletteOpen(false); handleCommand(cmd); }}
      />
    </section>
  );
};


