import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { resolveCommand, TerminalLine } from '@/components/home/TerminalEngine';
import { useModal } from '@/providers/ModalProvider';
import { elevatorScroll } from '@/utils/scroll';
import { SnakeGame } from '@/components/home/SnakeGame';

// Sub-components from the hero folder
import { WindowChrome } from './hero/WindowChrome';
import { SidebarMenu } from './hero/SidebarMenu';
import { TerminalHeader } from './hero/TerminalHeader';
import { TerminalBody } from './hero/TerminalBody';

/**
 * Hero - Terminal IS the Hero
 * 
 * Orchestrator component that manages the terminal state and layout.
 * Fixed for sequential execution and scroll-after-typing behavior.
 */
export const Hero: React.FC = () => {
  const { setIsContactModalOpen } = useModal();
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState<TerminalLine[]>([]);
  const [bootStep, setBootStep] = useState(() => {
    if (typeof window !== 'undefined' && (window as any).__TERMINAL_BOOTED__) return 7;
    return -1;
  });
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (bootStep === 7) return;

    const handleStart = () => {
      setTimeout(() => setBootStep(0), 300);
    };

    window.addEventListener('preloaderComplete', handleStart);

    const safetyTimeout = setTimeout(() => {
      setBootStep(prev => prev === -1 ? 0 : prev);
    }, 4500);

    return () => {
      window.removeEventListener('preloaderComplete', handleStart);
      clearTimeout(safetyTimeout);
    };
  }, [bootStep]);

  useEffect(() => {
    if (bootStep === 7 && typeof window !== 'undefined') {
      (window as any).__TERMINAL_BOOTED__ = true;
    }
  }, [bootStep]);

  const handleCommand = useCallback(async (cmd: string) => {
    const raw = cmd.trim();
    if (!raw || isTyping) return;

    if (raw.toLowerCase() === 'snake' || raw.toLowerCase() === 'play snake') {
      if (window.innerWidth < 1024) {
        setHistory(prev => [
          ...prev,
          { t: 'prompt', text: `~$ ${raw}` },
          { t: 'error', text: 'SYSTEM_ERROR: snake.exe requires physical keyboard + desktop resolution.' },
          { t: 'muted', text: 'Environment check failed. Peripheral "Keyboard" not detected or width < 1024px.' }
        ]);
        setInputValue('');
        return;
      }
      setActiveGame('snake');
      setInputValue('');
      return;
    }

    if (raw.toLowerCase() === 'clear') {
      setHistory([]);
      setInputValue('');
      return;
    }

    if (raw.toLowerCase() === 'resume') {
      const link = document.createElement('a');
      link.href = '/resources/Justin_Clarke_resume.pdf';
      link.download = 'Justin_Clarke_resume.pdf';
      link.click();
      setInputValue('');
      return;
    }

    // 1. Resolve Command
    const result = resolveCommand(raw);
    setIsTyping(true);
    setInputValue('');

    // 2. Add Prompt to History Immediately
    setHistory(prev => [...prev, { t: 'prompt', text: `~$ ${raw}` }]);

    // 3. Process lines one by one (simulating previous terminal behavior)
    for (const line of result.lines) {
      // Add line to history
      setHistory(prev => [...prev, line]);

      // Calculate typing duration based on text length
      const textLen = line.text?.length || 0;
      const duration = Math.max(400, textLen * 15); // Slower line-by-line processing
      await new Promise(res => setTimeout(res, duration));
    }

    setIsTyping(false);

    // 4. Trigger Side Effects AFTER Typing
    if (result.effect?.type === 'scroll') {
      elevatorScroll(result.effect.payload, 1.8, 180);
    }

    if (result.effect?.type === 'contact') {
      setIsContactModalOpen(true);
    }
  }, [setIsContactModalOpen, isTyping]);

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
      case 'm': return 'text-[#5a5a57]';
      default: return 'text-[#f4f4f3]';
    }
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center p-4 md:p-[6vw] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,200,180,0.02)_0%,transparent_70%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full h-[85vh] min-h-[600px] max-w-[1400px] lg:h-[80vh] bg-brand-card border border-white/10 rounded-xl overflow-hidden flex flex-col shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] cursor-text"
      >
        {activeGame === 'snake' && (
          <div className="absolute inset-0 z-50 bg-brand-bg flex flex-col">
            <WindowChrome url="snake.exe" right={<button onClick={() => setActiveGame(null)} className="text-viz-mac-red font-bold px-2 hover:bg-white/5 rounded transition-colors">EXIT</button>} />
            <div className="flex-1 overflow-hidden">
              <SnakeGame onExit={() => setActiveGame(null)} />
            </div>
          </div>
        )}

        <WindowChrome
          right={
            <div className="flex items-center gap-4 md:gap-6">
              <div className="hidden sm:flex gap-4">
                <a href="mailto:justinsavioclarke@outlook.com" className="hover:text-brand-primary transition-colors smooth-underline after:h-[1px] after:bg-brand-primary glitch-text-hover"><span className="glitch-target">email</span></a>
                <a href="https://linkedin.com/in/justinsavioclarke" target="_blank" rel="noopener" className="hover:text-brand-primary transition-colors smooth-underline after:h-[1px] after:bg-brand-primary glitch-text-hover"><span className="glitch-target">linkedin</span></a>
                <a href="https://github.com/JustinClarke" target="_blank" rel="noopener" className="hover:text-brand-primary transition-colors smooth-underline after:h-[1px] after:bg-brand-primary glitch-text-hover"><span className="glitch-target">github</span></a>
              </div>
              <span className="text-brand-primary font-bold flex items-center gap-2 whitespace-nowrap text-[10px] md:text-[12px]">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse shadow-[0_0_8px_#00c8b4]" />
                <span className="hidden xs:inline">shipping</span>
              </span>
            </div>
          }
        />

        <div className="flex-1 flex flex-col lg:grid lg:grid-cols-[1.6fr_1fr] gap-4 md:gap-8 p-4 md:p-10 lg:p-12 overflow-hidden">
          <div className="flex flex-col h-full min-h-0 overflow-hidden">
            <div className="font-mono text-[10px] text-[#5a5a57] mb-4 md:mb-6 shrink-0 opacity-60">
              // session_active: port 8080 // auth_success: {new Date().toLocaleTimeString().toLowerCase()}
            </div>

            <TerminalHeader bootStep={bootStep} onStepComplete={setBootStep} />

            <TerminalBody
              history={history}
              inputValue={inputValue}
              onInputChange={setInputValue}
              onCommand={handleCommand}
              bootStep={bootStep}
              getLineColor={getLineColor}
              isTyping={isTyping}
            />
          </div>

          <SidebarMenu onCommand={handleCommand} />
        </div>
      </motion.div>
    </section>
  );
};
