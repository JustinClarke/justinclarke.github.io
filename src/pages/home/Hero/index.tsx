/**
 * Hero the first thing visitors see: a fake terminal that IS the hero banner.
 *
 * Fits in: rendered at the top of the Home page. This file is the "orchestrator"
 *          it owns the on-screen layout and wires together the hooks that hold
 *          the real logic (boot animation, command session) and the small UI
 *          pieces in ./ui/*.
 * Note:    almost no business logic lives here. Commands are decided in
 *          engine.ts, run by useTerminalSession, and the boot animation is in
 *          useTerminalBoot. This component is mostly glue + visual state.
 *
 * For beginners ----------------------------------------------------------------
 * A "component" is a function that returns markup (JSX, which looks like HTML).
 * React calls it to draw a piece of the page, and re-calls it whenever its state
 * changes, redrawing only what differs. Below, `useState(...)` lines are this
 * component's memory; the `<section>...</section>` at the bottom is what it
 * draws. The pieces like <WindowChrome/> and <TerminalBody/> are smaller
 * components imported from ./ui composing small pieces is the whole idea.
 * -----------------------------------------------------------------------------
 */
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { SnakeGame } from './games/SnakeGame';
import { PongGame } from './games/PongGame';
import { TetrisGame } from './games/TetrisGame';
import { SpaceInvadersGame } from './games/SpaceInvadersGame';
import { useTerminalSession } from '@/hooks/useTerminalSession';
import { useTerminalBoot } from '@/hooks/useTerminalBoot';

import { debug, cn } from '@/utils';

import { WindowChrome } from './ui/WindowChrome';
import { SidebarMenu } from './ui/SidebarMenu';
import { TerminalBody } from './ui/TerminalBody';
import { CommandPalette } from './ui/CommandPalette';
import { ScrollHint } from './ScrollHint';

const log = debug('hero');

// Justin is based in Dubai, so the fake "session clock" shows Dubai time in
// 24-hour format regardless of the visitor's own timezone.
const DUBAI_LOCALE = 'en-US';
const DUBAI_TZ = 'Asia/Dubai';

/**
 * A tiny live clock printed above the terminal ("auth_success: 14:03:22").
 * It ticks once per second. Defined here as its own mini-component so its
 * 1-second timer re-renders ONLY the clock, not the whole heavy Hero.
 */
const SessionClock: React.FC = () => {
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString(DUBAI_LOCALE, { timeZone: DUBAI_TZ, hour12: false })
  );

  useEffect(() => {
    // LEARN: setInterval runs the callback repeatedly forever (here every 1000ms
    //    = 1 second). It returns an id we MUST pass to clearInterval in the
    //    cleanup, or the timer keeps firing after the clock is gone (a "leak").
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
  // ── Visual state (the component's "memory") ────────────────────────────────
  const [activeGame, setActiveGame] = useState<string | null>(null); // 'snake' or null
  const [isMinimized, setIsMinimized] = useState(false);             // window minimised?
  // The fake CRT power cycle: normal → shutting-down → static (TV snow) →
  // starting-up → normal. Driven by the close button (handleShutdownAndReboot).
  const [terminalState, setTerminalState] = useState<'normal' | 'shutting-down' | 'static' | 'starting-up'>('normal');
  const [paletteOpen, setPaletteOpen] = useState(false);             // Cmd-K menu open?

  // ── Logic borrowed from hooks (the real work lives there) ──────────────────
  const { bootStep, setBootStep } = useTerminalBoot();
  const [showGradients, setShowGradients] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    if (bootStep >= 7) {
      const timer = setTimeout(() => {
        setShowGradients(true);
        setShowSidebar(true);
      }, 150);

      return () => {
        clearTimeout(timer);
      };
    } else {
      setShowGradients(false);
      setShowSidebar(false);
    }
  }, [bootStep]);

  const { inputValue, setInputValue, history, setHistory, isTyping, lastExitCode, handleCommand } = useTerminalSession({ onLaunchGame: setActiveGame });



  // LEARN: a ref pointed at a DOM node. After render, `staticCanvasRef.current`
  //    is the actual <canvas> element, which we draw TV-static onto by hand.
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

  // Clicking the window's "close" button plays a retro CRT power-off/on sequence
  // and resets the terminal. The nested setTimeouts are the timeline:
  //   0ms     start "shutting-down" animation
  //   1000ms  cut to TV static
  //   3500ms  wipe history + restart the boot, begin "starting-up"
  //   4100ms  back to "normal"
  const handleShutdownAndReboot = useCallback(() => {
    log('reboot sequence start');
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



  // TV-static effect: paint random black-and-white noise on the <canvas> every
  // animation frame, but ONLY while terminalState === 'static'.
  // This is hand-drawn graphics a glimpse of how games/visualisations work
  // under the hood, below the level of HTML elements.
  useEffect(() => {
    if (terminalState !== 'static') return;       // only run during the static phase
    const canvas = staticCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');          // the 2D drawing toolkit for the canvas
    if (!ctx) return;

    // Render at 1/4 resolution (scale = 4) for speed; the CSS stretches it back
    // up, and the blockiness actually looks MORE like real TV snow.
    const scale = 4;
    const w = Math.ceil(window.innerWidth / scale);
    const h = Math.ceil(window.innerHeight / scale);
    canvas.width = w;
    canvas.height = h;

    // LEARN: a canvas is really just a grid of pixels. `imageData.data` is one
    //    long list of bytes, 4 per pixel (red, green, blue, alpha). Viewing it
    //    as a Uint32Array lets us set a whole pixel with ONE number instead of
    //    four much faster when we're redrawing the whole screen 60×/second.
    const imageData = ctx.createImageData(w, h);
    const buf = new Uint32Array(imageData.data.buffer);
    let animId: number;

    const draw = () => {
      for (let i = 0; i < buf.length; i++) {
        // Random grey value 0–255. `| 0` chops off the decimals (fast floor).
        const v = (Math.random() * 255) | 0;
        // Pack alpha(255) + r + g + b into one 32-bit number. Equal r=g=b = grey.
        buf[i] = 0xff000000 | (v << 16) | (v << 8) | v;
      }
      ctx.putImageData(imageData, 0, 0);  // blit our pixel buffer onto the canvas
      // LEARN: requestAnimationFrame schedules `draw` to run again right before
      //    the next screen repaint (~60×/sec). It's the standard way to animate
      //    smoothly. We save the id so the cleanup can cancel the loop.
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => cancelAnimationFrame(animId); // stop the loop when static ends
  }, [terminalState]);

  // Keyboard shortcut: Cmd-K (Mac) / Ctrl-K (Windows) toggles the command
  // palette; Escape closes it. A global listener so it works from anywhere.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();                  // stop the browser's own Ctrl-K
        setPaletteOpen(prev => !prev);       // flip open ↔ closed
      }
      if (e.key === 'Escape') setPaletteOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Maps a line's "type" tag (set by the engine) to Tailwind text-colour classes,
  // so e.g. errors show red and successes show green in the output.
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
    <section className="relative w-full min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-12 lg:p-16 overflow-hidden">
      <div className={cn(
        "absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,200,180,0.02)_0%,transparent_70%)] pointer-events-none transition-opacity duration-1000",
        showGradients ? "opacity-100" : "opacity-0"
      )} />

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
        <div className="w-full h-full relative bg-term-bg border border-edge rounded-xl overflow-hidden flex flex-col shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] cursor-text">
          {/* Ambient Glows (Smooth CSS radial gradients without blur filters to prevent Safari stuttering) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
            {/* Teal top-right glow (fades in with the sidebar to prevent block clipping) */}
            <div 
              className={cn(
                "absolute top-0 right-0 w-[80%] md:w-[55%] h-[40%] md:h-[55%] rounded-full translate-x-1/4 -translate-y-1/4 transition-opacity duration-1000",
                showSidebar ? "opacity-100" : "opacity-0"
              )}
              style={{ background: 'radial-gradient(circle, rgba(0,200,180,0.16) 0%, rgba(0,200,180,0.08) 35%, rgba(0,200,180,0.02) 65%, transparent 100%)' }}
            />
            {/* Blue bottom-left glow (fades in with the text gradients) */}
            <div 
              className={cn(
                "absolute bottom-0 left-0 w-[80%] md:w-[50%] h-[40%] md:h-[50%] rounded-full -translate-x-1/4 translate-y-1/4 transition-opacity duration-1000",
                showGradients ? "opacity-100" : "opacity-0"
              )}
              style={{ background: 'radial-gradient(circle, rgba(75,139,190,0.14) 0%, rgba(75,139,190,0.06) 35%, rgba(75,139,190,0.015) 65%, transparent 100%)' }}
            />
          </div>

          {['snake', 'pong', 'tetris', 'space_invaders'].includes(activeGame || '') && (
            <div className="absolute inset-0 z-50 bg-brand-bg flex flex-col">
              <WindowChrome url={`${activeGame}.exe`} right={<button onClick={() => setActiveGame(null)} className="text-viz-mac-red font-bold px-2 hover:bg-white/5 rounded transition-colors">EXIT</button>} />
              <div className="flex-1 overflow-hidden">
                {activeGame === 'snake' && <SnakeGame onExit={() => setActiveGame(null)} />}
                {activeGame === 'pong' && <PongGame onExit={() => setActiveGame(null)} />}
                {activeGame === 'tetris' && <TetrisGame onExit={() => setActiveGame(null)} />}
                {activeGame === 'space_invaders' && <SpaceInvadersGame onExit={() => setActiveGame(null)} />}
              </div>
            </div>
          )}

          <WindowChrome
            onMinimize={() => setIsMinimized(true)}
            isMinimized={isMinimized}
            onCloseConfirm={handleShutdownAndReboot}
            onCommand={handleCommand}
          />

          <div className="relative z-10 flex-1 flex flex-col lg:grid lg:grid-cols-[1.6fr_1fr] gap-4 md:gap-8 p-3 md:py-8 md:px-6 lg:py-10 lg:px-8 overflow-hidden">
            <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <SessionClock />

              <TerminalBody
                history={history}
                inputValue={inputValue}
                onInputChange={setInputValue}
                onCommand={handleCommand}
                bootStep={bootStep}
                getLineColor={getLineColor}
                isTyping={isTyping}
                lastExitCode={lastExitCode}
                onStepComplete={setBootStep}
                showGradients={showGradients}
              />
            </div>

            <SidebarMenu onCommand={handleCommand} isVisible={showSidebar} />
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


