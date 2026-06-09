/**
 * TerminalBody the scrolling output area and the live input line of the hero
 * terminal: it prints past commands/results and handles everything you type.
 *
 * Fits in: the centrepiece of the Hero. The engine decides WHAT to show; this file
 *          decides how it LOOKS and how the keyboard behaves (history, Tab-complete,
 *          the konami code). It reports typed commands up via `onCommand`.
 * Note:    three components live here a `PlaceholderCycler` (the rotating "try
 *          typing…" hint), an `InputCursor` (a fake caret that also shows the ghost
 *          autocomplete), and the main `TerminalBody`. The keyboard handler is the
 *          dense part; read it as a list of "if this key, do this".
 *
 * For beginners ----------------------------------------------------------------
 * Most of this is React-specific machinery. `useRef` is used two ways here: to grab
 * real DOM nodes (to auto-scroll, to focus the input) AND as a no-re-render store
 * (the konami progress, the set of already-run commands). State (`useState`) is for
 * values that should repaint the screen; refs are for values that shouldn't.
 * -----------------------------------------------------------------------------
 */
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { TerminalLine, getCompletion } from '../engine';
import { Typewriter } from './Typewriter';
import { cn } from '@/utils';
import { TechStack } from '@/ui';

interface TerminalBodyProps {
  history: TerminalLine[];
  inputValue: string;
  onInputChange: (val: string) => void;
  onCommand: (cmd: string, source?: 'terminal' | 'sidebar') => void;
  bootStep: number;
  getLineColor: (type: string) => string;
  isTyping: boolean;
  lastExitCode?: number | null;
}

// LEARN: The famous "konami code" key sequence. We watch for it being typed in order
//    (see the handler below) and trigger the `matrix` easter egg when it completes.
const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

// ---------------------------------------------------------------------------
// PlaceholderCycler cycles suggestions, skipping already-run commands
// ---------------------------------------------------------------------------
const PlaceholderCycler: React.FC<{ ran: Set<string> }> = ({ ran }) => {
  const allSuggestions = [
    { prefix: 'try typing ', cmd: 'whoami', suffix: " (unless you're an AI)" },
    { prefix: 'try typing ', cmd: 'ls projects', suffix: ' to see my digital craftsmanship' },
    { prefix: 'try typing ', cmd: 'timeline', suffix: ' to travel through time' },
    { prefix: 'try typing ', cmd: 'resumé', suffix: ' to download my CV' },
    { prefix: 'try typing ', cmd: 'connect', suffix: ' to contact me' },
    { prefix: 'try typing ', cmd: 'snake', suffix: ' (warning: highly addictive)' },
    { prefix: 'try typing ', cmd: 'the long version', suffix: ' for my secret vault' },
    { prefix: 'try typing ', cmd: 'help', suffix: ' (we all need it sometimes)' },
    { prefix: 'try typing ', cmd: 'clear', suffix: ' to make this pristine again' },
    { prefix: 'try typing ', cmd: 'about me', suffix: ' to read my autobiography (short version)' },
  ];
  // LEARN: `ran` is a Set of commands already used; we drop those from the hints so
  //    the cycler suggests fresh things. If everything's been tried, fall back to all.
  const pool = allSuggestions.filter(s => !ran.has(s.cmd));
  const suggestions = pool.length > 0 ? pool : allSuggestions;

  const [index, setIndex] = useState(0);
  const [key, setKey] = useState(0);
  const [charsDone, setCharsDone] = useState(0);

  // LEARN: `setInterval` runs every 5s to advance to the next hint. `(prev + 1) %
  //    length` is the wrap-around trick: it counts 0,1,2,… then back to 0. Bumping
  //    `key` forces the Typewriters to remount and re-type. clearInterval on cleanup.
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % suggestions.length);
      setKey((prev) => prev + 1);
      setCharsDone(0);
    }, 5000);
    return () => clearInterval(interval);
  }, [suggestions.length]);

  const current = suggestions[index % suggestions.length];
  const fullText = current.prefix + current.cmd + current.suffix;
  const speed = 25;
  const cmdDelay = current.prefix.length * speed;
  const suffixDelay = (current.prefix.length + current.cmd.length) * speed;

  useEffect(() => {
    setCharsDone(0);
    const startTime = performance.now();
    const total = fullText.length;
    let raf: number;
    const tick = (now: number) => {
      const elapsed = now - startTime;
      let count = Math.min(current.prefix.length, Math.floor(elapsed / speed));
      if (elapsed > cmdDelay) count += Math.min(current.cmd.length, Math.floor((elapsed - cmdDelay) / speed));
      if (elapsed > suffixDelay) count += Math.min(current.suffix.length, Math.floor((elapsed - suffixDelay) / speed));
      setCharsDone(count);
      if (count < total) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [key]);

  void charsDone; // used for cursor sync

  return (
    <div className="font-mono text-[11px] md:text-[12px] text-term-fg select-none leading-tight whitespace-pre-wrap">
      <Typewriter key={`prefix-${key}`} text={current.prefix} speed={speed} className="text-term-fg" />
      <Typewriter key={`cmd-${key}`} text={current.cmd} speed={speed} delay={cmdDelay} className="text-brand-primary font-black brightness-110" />
      <Typewriter key={`suffix-${key}`} text={current.suffix} speed={speed} delay={suffixDelay} className="text-term-fg" />
      <span className="terminal-block-cursor ml-[1px]" aria-hidden="true" />
    </div>
  );
};

// ---------------------------------------------------------------------------
// InputCursor block cursor + optional ghost completion text
// ---------------------------------------------------------------------------
const InputCursor: React.FC<{ text: string; ghost?: string }> = ({ text, ghost }) => {
  const measureRef = useRef<HTMLSpanElement>(null);
  const [left, setLeft] = useState(0);

  // LEARN: A neat trick to place a fake caret. We render the typed text into a HIDDEN
  //    span, then measure its pixel width (`offsetWidth`) and position the cursor that
  //    many pixels from the left. Re-measures whenever the text changes.
  useEffect(() => {
    if (measureRef.current) setLeft(measureRef.current.offsetWidth);
  }, [text]);

  return (
    <>
      <span
        ref={measureRef}
        aria-hidden="true"
        style={{ position: 'absolute', visibility: 'hidden', whiteSpace: 'pre', pointerEvents: 'none', fontFamily: 'var(--font-mono)', fontSize: 'inherit', fontWeight: 'inherit', letterSpacing: 'inherit' }}
      >
        {text}
      </span>
      {ghost && (
        <span
          aria-hidden="true"
          style={{ position: 'absolute', left: `${left}px`, whiteSpace: 'pre', pointerEvents: 'none', fontFamily: 'var(--font-mono)', fontSize: 'inherit', fontWeight: 'inherit', letterSpacing: 'inherit' }}
          className="text-term-faint"
        >
          {ghost}
        </span>
      )}
      <span
        className="terminal-block-cursor absolute top-1/2 -translate-y-1/2"
        style={{ left: `${left}px` }}
        aria-hidden="true"
      />
    </>
  );
};

// ---------------------------------------------------------------------------
// Main TerminalBody
// ---------------------------------------------------------------------------
export const TerminalBody: React.FC<TerminalBodyProps> = ({
  history,
  inputValue,
  onInputChange,
  onCommand,
  bootStep,
  getLineColor,
  isTyping,
  lastExitCode,
}) => {
  const outRef = useRef<HTMLDivElement>(null);
  const inpRef = useRef<HTMLInputElement>(null);

  // LEARN: Lazy initializer (the `() => …` form) runs once to load prior commands from
  //    sessionStorage. The try/catch guards against malformed saved JSON if parsing
  //    fails we just start with an empty history rather than crashing.
  const [cmdHistory, setCmdHistory] = useState<string[]>(() => {
    try { return JSON.parse(sessionStorage.getItem('term_cmd_history') || '[]'); } catch { return []; }
  });
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [ghostText, setGhostText] = useState('');
  const [completionCandidates, setCompletionCandidates] = useState<string[]>([]);
  const konamiProgress = useRef(0);
  const ranCommands = useRef<Set<string>>(new Set());

  // LEARN: Listen for window resizes to track mobile vs desktop, and REMOVE the
  //    listener on cleanup. The `[]` deps mean this wiring happens once on mount.
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // LEARN: Auto-scroll to the bottom whenever new output arrives, so the latest line
  //    is always visible. Runs every time `history` changes (a new command ran).
  useEffect(() => {
    if (outRef.current) outRef.current.scrollTop = outRef.current.scrollHeight;
  }, [history]);



  // Track run commands for PlaceholderCycler exclusion
  useEffect(() => {
    history.forEach(l => {
      if (l.t === 'prompt') ranCommands.current.add(l.text.replace('~$ ', '').toLowerCase());
    });
  }, [history]);

  // Update ghost + completion candidates on input change (synchronous)
  useEffect(() => {
    if (!inputValue) { setGhostText(''); setCompletionCandidates([]); return; }
    const { completion, candidates } = getCompletion(inputValue);
    setGhostText(completion);
    setCompletionCandidates(candidates.slice(0, 3));
  }, [inputValue]);

  // LEARN: The keyboard brain of the terminal, wrapped in useCallback so it isn't
  //    rebuilt every render. It handles, in order: konami tracking, Tab/→ to accept
  //    the ghost autocomplete, Enter to run + save to history, and ↑/↓ to walk back
  //    and forth through previous commands (`historyIndex` is the cursor into them).
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    // Konami code tracker
    // LEARN: If the pressed key matches the next expected konami key, advance; once the
    //    whole sequence lands, fire `matrix`. Any wrong key resets progress to 0.
    if (e.key === KONAMI[konamiProgress.current]) {
      konamiProgress.current++;
      if (konamiProgress.current === KONAMI.length) {
        konamiProgress.current = 0;
        onCommand('matrix');
      }
    } else {
      konamiProgress.current = 0;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const current = (e.target as HTMLInputElement).value;
      const { completion } = getCompletion(current);
      if (completion) onInputChange(current + completion);
      return;
    }
    if (e.key === 'ArrowRight') {
      const current = (e.target as HTMLInputElement).value;
      const { completion } = getCompletion(current);
      if (completion) { e.preventDefault(); onInputChange(current + completion); return; }
    }
    if (e.key === 'Enter') {
      const cmd = inputValue.trim();
      if (cmd) {
        const updated = [cmd, ...cmdHistory.filter(c => c !== cmd).slice(0, 49)];
        setCmdHistory(updated);
        try { sessionStorage.setItem('term_cmd_history', JSON.stringify(updated)); } catch { }
      }
      setHistoryIndex(-1);
      setGhostText('');
      onCommand(inputValue);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < cmdHistory.length - 1) {
        const next = historyIndex + 1;
        setHistoryIndex(next);
        onInputChange(cmdHistory[next]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > -1) {
        const next = historyIndex - 1;
        setHistoryIndex(next);
        onInputChange(next === -1 ? '' : cmdHistory[next]);
      }
    }
  }, [ghostText, inputValue, cmdHistory, historyIndex, onInputChange, onCommand]);

  const lastPromptIndex = history.map((l) => l.t).lastIndexOf('prompt');
  const showPlaceholder = !inputValue && !isInputFocused;
  const showInputCursor = isInputFocused || !!inputValue;

  return (
    <div
      className="flex-1 overflow-y-auto pr-4 custom-scrollbar cursor-text"
      ref={outRef}
      onClick={() => inpRef.current?.focus()}
      aria-label="Terminal output"
    >
      <div className="min-h-full flex flex-col justify-start pb-4">
        {/* Mobile intro */}
        {isMobile && (
          <div className="space-y-4 mb-4 shrink-0">
            <div className="space-y-1">
              <div>
                <h1 className="leading-[0.9] tracking-tighter flex flex-col">
                  <Typewriter text="justin" speed={20} delay={180} className="font-mono text-3xl font-black text-term-fg" skip={true} />
                  <Typewriter text="clarke." speed={20} delay={300} className="font-playfair italic text-3xl text-brand-primary font-black" skip={true} />
                </h1>
              </div>
            </div>
            <div className="space-y-1">
              <div className="space-y-2.5">
                <Typewriter text="data & analytics developer." speed={12} delay={880} className="font-mono text-[11px] sm:text-xs text-term-fg leading-relaxed block font-bold" as="span" skip={true} />
                <TechStack animate className="!text-[11px]" />
                <Typewriter text="Data to decisions and decisions into products" speed={12} delay={1650} className="font-mono text-[11px] sm:text-xs text-term-dim leading-relaxed block" as="span" skip={true} />
              </div>
            </div>
          </div>
        )}

        {/* Command History */}
        {/* LEARN: We `.map` over the history array, rendering each line. A line's `t`
              (type) decides its shape: a `prompt` shows the "~$ command" you typed;
              everything else is output, which may be plain text, coloured `parts`,
              clickable `chips`, or a link. `aria-live="polite"` lets screen readers
              announce new output as it appears. */}
        <div className="space-y-1" aria-live="polite" aria-atomic="false">
          {history.map((line, i) => (
            <div key={i} className="font-mono text-[11px] md:text-[12px] leading-tight">
              {line.t === 'prompt' ? (
                <div className="flex gap-2 md:gap-4 items-center">
                  <span className="text-brand-primary font-bold shrink-0">~$</span>
                  <span className="text-term-fg tracking-tight truncate">{line.text.replace('~$ ', '')}</span>
                </div>
              ) : (
                <div
                  className={cn(
                    'pl-6 md:pl-9 text-term-dim',
                    !isMobile && i > lastPromptIndex && 'opacity-0 animate-terminal-fade-in'
                  )}
                  style={{ animationDelay: !isMobile && i > lastPromptIndex ? `${(i - lastPromptIndex - 1) * 35}ms` : undefined }}
                >
                  {line.parts ? (
                    <div>
                      <div className="flex flex-wrap gap-x-2">
                        {line.parts.map((p, j) => {
                          const content = (
                            <span key={`${i}-${j}`} className={cn(getLineColor(p.t), p.href && 'hover:underline cursor-pointer text-brand-primary brightness-110 font-bold')}>
                              {p.text}
                            </span>
                          );
                          const isInternal = p.href?.startsWith('/');
                          return p.href ? (
                            isInternal ? <Link key={`${i}-${j}`} to={p.href}>{content}</Link>
                              : <a key={`${i}-${j}`} href={p.href} target="_blank" rel="noopener noreferrer">{content}</a>
                          ) : content;
                        })}
                      </div>
                      {line.chips && line.chips.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-1.5">
                          {line.chips.map((chip, ci) => (
                            <button key={ci} type="button" onClick={() => onCommand(chip)}
                              className="font-mono text-[10px] px-2 py-0.5 rounded border border-brand-primary/40 text-brand-primary bg-brand-primary/[0.08] hover:bg-brand-primary/20 hover:border-brand-primary/70 transition-colors cursor-pointer">
                              {chip}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : line.chips && line.chips.length > 0 ? (
                    <div>
                      {line.text && <span className={getLineColor(line.t)}>{line.text}</span>}
                      <div className="flex flex-wrap gap-2 mt-1">
                        {line.chips.map((chip, ci) => (
                          <button key={ci} type="button" onClick={() => onCommand(chip)}
                            className="font-mono text-[10px] px-2 py-0.5 rounded border border-brand-primary/40 text-brand-primary bg-brand-primary/[0.08] hover:bg-brand-primary/20 hover:border-brand-primary/70 transition-colors cursor-pointer">
                            {chip}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : line.href ? (
                    line.href.startsWith('/') ? (
                      <Link to={line.href}><span className={cn(getLineColor(line.t), 'hover:underline cursor-pointer text-brand-primary brightness-110 font-bold')}>{line.text}</span></Link>
                    ) : (
                      <a href={line.href} target="_blank" rel="noopener noreferrer"><span className={cn(getLineColor(line.t), 'hover:underline cursor-pointer text-brand-primary brightness-110 font-bold')}>{line.text}</span></a>
                    )
                  ) : (
                    <span className={getLineColor(line.t)}>{line.text}</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Active Prompt Phase 3.1: exit code semantics */}
        {bootStep >= 7 && (
          <div
            className={cn(
              'flex items-center gap-2 md:gap-4 transition-all duration-500',
              isTyping ? 'opacity-0 pointer-events-none translate-y-1' : 'opacity-100 translate-y-0'
            )}
            onClick={() => inpRef.current?.focus()}
          >
            {lastExitCode && lastExitCode !== 0 ? (
              <span className="font-mono text-[11px] md:text-xs shrink-0 flex items-center gap-1">
                <span className="text-viz-mac-red font-bold">[{lastExitCode}]</span>
                <span className="text-viz-mac-red font-bold">~$</span>
              </span>
            ) : (
              <span className="font-mono text-[11px] md:text-xs text-brand-primary font-bold shrink-0">~$</span>
            )}

            <div className="relative flex-1 flex items-center min-w-0 font-mono text-[11px] md:text-[12px]">
              <input
                ref={inpRef}
                type="text"
                value={inputValue}
                onChange={(e) => onInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                className="terminal-input-zoom-fix bg-transparent border-none outline-none font-mono text-term-fg caret-transparent py-1 relative z-10"
                spellCheck={false}
                placeholder=""
                autoComplete="off"
                aria-label="Terminal input"
              />

              {showPlaceholder && (
                <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none z-0">
                  <PlaceholderCycler ran={ranCommands.current} />
                </div>
              )}

              {showInputCursor && (
                <InputCursor text={inputValue} ghost={isInputFocused ? ghostText : undefined} />
              )}
            </div>
          </div>
        )}

        {/* Mobile completion chips top-3 candidates (Phase 3.4) */}
        {isMobile && bootStep >= 7 && !isTyping && inputValue && completionCandidates.length > 0 && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {completionCandidates.map((c, ci) => (
              <button key={ci} type="button" onClick={() => onInputChange(c)}
                className="font-mono text-[10px] px-2 py-0.5 rounded border border-brand-primary/40 text-brand-primary bg-brand-primary/[0.08] active:bg-brand-primary/20 transition-colors">
                {c}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
