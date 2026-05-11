import React, { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle, useMemo } from 'react';
import { cn } from '@/utils';
import { SnakeGame } from './SnakeGame';
import { elevatorScroll } from '@/utils/scroll';
import { resolveCommand, TerminalLine, SideEffectType } from './TerminalEngine';

export interface TerminalHandle {
  runCmd: (cmd: string) => void;
}

interface TerminalUIProps {
  isDark: boolean;
  onThemeToggle: () => void;
  onContactOpen: () => void;
}

/**
 * TerminalUI
 * 
 * High-fidelity terminal component.
 * Features:
 * - data-term attribute system
 * - Optimized character queue for typed text
 * - Integrated Snake Game
 * - Imperative API via forwardRef
 */
export const TerminalUI = forwardRef<TerminalHandle, TerminalUIProps>(({ isDark, onThemeToggle, onContactOpen }, ref) => {
  const outRef = useRef<HTMLDivElement>(null);
  const inpRef = useRef<HTMLInputElement>(null);
  const [pillsVisible, setPillsVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [terminalText, setTerminalText] = useState('');
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const prevActiveGame = useRef<string | null>(null);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const placeholders = useMemo(() => ['record', 'ls projects', 'expertise', 'help', 'ping me'], []);

  useEffect(() => {
    if (inputValue) return;
    const interval = setInterval(() => {
      setPlaceholderIndex(prev => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [inputValue, placeholders.length]);

  useEffect(() => {
    if (!activeGame) {
      setTimeout(() => inpRef.current?.focus({ preventScroll: true }), 50);
    }
  }, [activeGame]);

  // --- Output Helpers ---
  const addLine = useCallback((type: string, label: string, text: string) => {
    if (!outRef.current) return;
    const d = document.createElement('div');
    d.className = 'flex gap-2 font-mono text-[13.5px] leading-relaxed mb-0.5';
    d.innerHTML = `<span data-term="prompt">${label}</span><span data-term="${type}">${text}</span>`;
    outRef.current.appendChild(d);
    outRef.current.scrollTop = outRef.current.scrollHeight;
  }, []);

  const addTypedLine = useCallback((type: string, label: string, text: string, speed = 15) => {
    return new Promise<void>((resolve) => {
      if (!outRef.current) return resolve();
      const d = document.createElement('div');
      d.className = 'flex gap-2 font-mono text-[13.5px] leading-relaxed mb-0.5';
      d.innerHTML = `<span data-term="prompt">${label}</span><span data-term="${type}"></span>`;
      outRef.current.appendChild(d);

      const span = d.lastElementChild as HTMLElement;
      const queue = text.split('');

      const interval = setInterval(() => {
        const char = queue.shift();
        if (!char) {
          clearInterval(interval);
          resolve();
          return;
        }
        span.textContent += char;
        if (outRef.current) outRef.current.scrollTop = outRef.current.scrollHeight;
      }, speed);
    });
  }, []);

  const addTypedComplexLine = useCallback((parts: TerminalLine['parts'], label: string, speed = 15) => {
    return new Promise<void>(async (resolve) => {
      if (!outRef.current || !parts) return resolve();
      const d = document.createElement('div');
      d.className = 'flex gap-2 font-mono text-[13.5px] leading-relaxed mb-0.5';
      d.innerHTML = `<span data-term="prompt">${label}</span>`;
      outRef.current.appendChild(d);

      for (const part of parts) {
        const span = document.createElement('span');
        span.setAttribute('data-term', part.t);
        d.appendChild(span);

        await new Promise<void>((res) => {
          const queue = part.text.split('');
          const interval = setInterval(() => {
            const char = queue.shift();
            if (!char) {
              clearInterval(interval);
              res();
              return;
            }
            span.textContent += char;
            if (outRef.current) outRef.current.scrollTop = outRef.current.scrollHeight;
          }, speed);
        });
      }
      resolve();
    });
  }, []);

  // --- Side Effect Handler ---
  const handleEffect = useCallback((type: SideEffectType, payload?: any) => {
    switch (type) {
      case 'scroll':
        setTimeout(() => elevatorScroll(payload, 1.8, 180), 100);
        break;
      case 'theme':
        onThemeToggle();
        break;
      case 'contact':
        onContactOpen();
        break;
      case 'download':
        setTimeout(() => {
          const link = document.createElement('a');
          link.href = '/resources/Justin_Clarke_Resume.pdf';
          link.download = 'Justin_Clarke_Resume.pdf';
          link.click();
        }, 1200);
        break;
      case 'snake':
        // Handled directly in handleCommand for timing
        break;
    }
  }, [onThemeToggle, onContactOpen]);

  // --- Command Processor ---
  const handleCommand = useCallback(async (raw: string) => {
    const input = raw.trim();
    if (!input) return;

    // 1. Echo command
    addLine('cmd', '~$', ' ' + input);
    setInputValue('');
    setTerminalText('');

    // 2. Resolve via Engine
    const result = resolveCommand(input);

    // 3. Special Case: Snake
    if (result.effect?.type === 'snake') {
      await addTypedLine('success', '  ', 'Initializing Snake_OS...', 25);
      setTimeout(() => {
        if (outRef.current) outRef.current.innerHTML = '';
        setActiveGame('snake');
      }, 800);
      return;
    }

    // 4. Special Case: Clear
    if (input.toLowerCase() === 'clear') {
      setActiveGame(null);
      setTimeout(() => { if (outRef.current) outRef.current.innerHTML = ''; }, 100);
      return;
    }

    // 5. Render Lines
    for (const line of result.lines) {
      if (line.parts) {
        await addTypedComplexLine(line.parts, '  ', 12);
      } else {
        await addTypedLine(line.t, '  ', line.text, 12);
      }
    }

    // 6. Handle other effects after loading
    if (result.effect) {
      handleEffect(result.effect.type, result.effect.payload);
    }

    if (result.showPills) setPillsVisible(true);
  }, [addLine, addTypedLine, addTypedComplexLine, handleEffect]);

  // --- Boot Sequence ---
  const runBootSequence = useCallback(async () => {
    if (!outRef.current) return;
    
    await addTypedComplexLine([
      { t: 'brand', text: ' [ JUSTIN_CLARKE ] ' },
      { t: 'muted', text: ' status: ' },
      { t: 'success', text: 'SHIPPING' },
    ], '>', 22);
    await addTypedComplexLine([
      { t: 'muted', text: ' currently: ' },
      { t: 'p', text: 'building at the intersection of data + product' },
    ], '>', 14);
    await addTypedComplexLine([
      { t: 'muted', text: ' type ' },
      { t: 'brand', text: 'help' },
      { t: 'muted', text: ' or click ' },
      { t: 'brand', text: 'record' },
      { t: 'muted', text: ' below ↓' }
    ], '>', 16);

    setPillsVisible(true);
    setTimeout(() => inpRef.current?.focus({ preventScroll: true }), 100);
  }, [addTypedComplexLine]);

  const hasBooted = useRef(false);
  useEffect(() => {
    if (hasBooted.current) return;
    hasBooted.current = true;
    runBootSequence();
  }, [runBootSequence]);

  useEffect(() => {
    if (prevActiveGame.current && !activeGame) {
      runBootSequence();
    }
    if (!activeGame) {
      setTimeout(() => inpRef.current?.focus({ preventScroll: true }), 50);
    }
    prevActiveGame.current = activeGame;
  }, [activeGame, runBootSequence]);

  // --- Imperative API ---
  useImperativeHandle(ref, () => ({
    runCmd: (cmd: string) => handleCommand(cmd)
  }), [handleCommand]);

  return (
    <div className={cn(
      "relative flex flex-col flex-1 h-full min-h-0 overflow-hidden z-1 transition-all duration-500",
      isDark
        ? "terminal-dark bg-black/20 backdrop-blur-[2px] shadow-[inset_0_0_40px_rgba(0,0,0,0.3)]"
        : "terminal-light bg-black/2"
    )}>


      {/* Sync Header: Translucent Teal Overlay */}
      <div className={cn(
        "flex items-center gap-3 sm:gap-4 pl-4 pr-4 sm:pr-6 py-2.5 transition-colors duration-300 border-b backdrop-blur-md",
        isDark ? "bg-brand-primary/10 border-brand-primary/20" : "bg-brand-primary/5 border-brand-primary/10"
      )}>
        <div className={cn(
          "flex items-center justify-center w-6 h-6 rounded-md shrink-0 transition-all duration-300",
          isDark ? "bg-brand-primary/20 text-brand-primary" : "bg-brand-primary/10 text-brand-primary"
        )}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className={cn(
            "font-mono text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em]",
            isDark ? "text-brand-primary" : "text-brand-primary"
          )}>
            System Interface
          </span>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary/40 animate-pulse" />
            <span className={cn(
              "font-mono text-[8px] uppercase tracking-widest font-bold opacity-60",
              isDark ? "text-white" : "text-black"
            )}>
              Active Session
            </span>
          </div>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <span className={cn("font-mono text-[8px] uppercase tracking-tighter font-bold opacity-30", isDark ? "text-white" : "text-black")}>Local Port</span>
            <span className={cn("font-mono text-[9px] font-black", isDark ? "text-white" : "text-black")}>8080:CLI</span>
          </div>
          <div className={cn("w-px h-6", isDark ? "bg-white/5" : "bg-black/5")} />
          <div className="flex items-center gap-1.5">
            <div className={cn("w-1.5 h-1.5 rounded-full", isDark ? "bg-white/10" : "bg-black/10")} />
            <div className={cn("w-1.5 h-1.5 rounded-full", isDark ? "bg-white/10" : "bg-black/10")} />
            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary shadow-[0_0_8px_rgba(0,200,180,0.4)]" />
          </div>
        </div>
      </div>

      {/* Terminal Output */}
      <div className={cn(
        "relative flex flex-col flex-1 gap-px overflow-y-auto min-h-0 scroll-smooth scanline",
        activeGame ? "p-0" : "pl-2 pr-4 sm:pr-6 py-4"
      )} ref={outRef}>
        {activeGame === 'snake' && (
          <div className="absolute inset-0 z-50 bg-[#050505] flex flex-col overflow-hidden">
            <SnakeGame onExit={() => setActiveGame(null)} />
          </div>
        )}
      </div>

      {/* Terminal Footer: Nav Hints & Quick Actions */}
      {!activeGame && (
        <div className={cn(
          "flex flex-col gap-4 pl-2 pr-4 sm:pr-6 py-4 cursor-default border-t transition-all duration-1200 ease-out",
          isDark ? "border-white/5 bg-transparent" : "border-black/5 bg-transparent",
          pillsVisible
            ? 'opacity-100'
            : 'opacity-0 pointer-events-none'
        )}>
          {/* Nav Menu — terminal-style numbered list */}
          <div className="flex flex-col gap-1 w-full">
            {[
              { num: '01', cmd: 'record', desc: 'Full career & education timeline', primary: true },
              { num: '02', cmd: 'ls projects', desc: 'Featured case studies' },
              { num: '03', cmd: 'expertise', desc: 'Analytics + full-stack toolkit' },
              { num: '04', cmd: 'advanced', desc: 'More commands' },
            ].map((item) => (
              <div
                key={item.cmd}
                onClick={() => handleCommand(item.cmd)}
                className={cn(
                  'group flex items-center gap-3 px-3 py-2 rounded cursor-pointer transition-all duration-300 border',
                  item.primary
                    ? isDark
                      ? 'bg-brand-primary/[0.06] border-brand-primary/20 hover:bg-brand-primary/[0.1] hover:border-brand-primary/40'
                      : 'bg-brand-primary/5 border-brand-primary/25 hover:bg-brand-primary/10'
                    : isDark
                      ? 'border-transparent hover:bg-white/[0.03] hover:border-white/10'
                      : 'border-transparent hover:bg-black/[0.03] hover:border-black/10'
                )}
              >
                {/* Number badge */}
                <span className={cn(
                  'font-mono text-[10px] font-bold tracking-wider tabular-nums shrink-0 transition-opacity duration-300',
                  item.primary
                    ? 'text-brand-primary opacity-70'
                    : isDark
                      ? 'text-white/30 group-hover:text-white/60'
                      : 'text-black/30 group-hover:text-black/60'
                )}>
                  [{item.num}]
                </span>

                {/* Command */}
                <span className={cn(
                  'font-mono text-[12px] font-bold tracking-tight transition-colors duration-300 shrink-0',
                  item.primary
                    ? 'text-brand-primary'
                    : isDark
                      ? 'text-white/75 group-hover:text-white'
                      : 'text-black/70 group-hover:text-black'
                )}>
                  {item.cmd}
                </span>

                {/* Spacer rule */}
                <span className={cn(
                  'flex-1 h-px transition-colors duration-300',
                  item.primary
                    ? 'bg-brand-primary/20'
                    : isDark
                      ? 'bg-white/[0.06] group-hover:bg-white/15'
                      : 'bg-black/[0.06] group-hover:bg-black/15'
                )} />

                {/* Description */}
                <span className={cn(
                  'font-mono text-[10px] tracking-tight transition-opacity duration-300 hidden sm:inline',
                  item.primary
                    ? isDark ? 'text-white/55' : 'text-black/55'
                    : isDark
                      ? 'text-white/35 group-hover:text-white/65'
                      : 'text-black/40 group-hover:text-black/70'
                )}>
                  {item.desc}
                </span>

                {/* Arrow */}
                <span className={cn(
                  'font-mono text-[12px] shrink-0 transition-all duration-300',
                  item.primary
                    ? 'text-brand-primary opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5'
                    : 'opacity-30 group-hover:opacity-100 group-hover:translate-x-0.5',
                  isDark ? 'text-brand-primary' : 'text-(--term-prompt)'
                )}>
                  →
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!activeGame && (
        <div
          className={cn(
            "relative flex items-center gap-2 shrink-0 cursor-text border-t pl-2 pr-4 sm:pr-6 py-4 transition-all duration-300",
            isDark ? "border-white/5 text-white/90" : "border-black/5 text-black/80",
            !inputValue && "animate-[pulse_4s_infinite] shadow-[inset_0_0_20px_rgba(0,200,180,0.05)]"
          )}
          onClick={() => inpRef.current?.focus({ preventScroll: true })}
        >
          <span className="shrink-0 font-mono text-[13px] opacity-80 font-bold text-(--term-prompt)">~$</span>
          <div className="relative flex items-center min-w-0 flex-1 gap-1">
            <div className="w-2 h-[1.2em] bg-(--term-prompt) animate-pulse shadow-sm opacity-80" />
            {inputValue ? (
              <span className="font-mono text-[13px] whitespace-pre-wrap font-medium">{terminalText}</span>
            ) : (
              <span className="font-mono text-[13px] opacity-50 italic select-none">
                try typing "<span className="text-(--term-prompt) opacity-80 not-italic font-bold">{placeholders[placeholderIndex]}</span>"
              </span>
            )}
          </div>
          <input
            ref={inpRef}
            className="absolute opacity-0 w-0 h-0"
            type="text"
            value={inputValue}
            onChange={(e) => { setInputValue(e.target.value); setTerminalText(e.target.value); }}
            onKeyDown={(e) => { if (e.key === 'Enter') handleCommand(inputValue); }}
            spellCheck={false}
            autoComplete="off"
          />
        </div>
      )}
    </div>
  );
});
