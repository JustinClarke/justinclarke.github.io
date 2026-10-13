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
 */
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { TerminalLine, getCompletion } from '../engine';
import { Typewriter } from './Typewriter';
import { cn } from '@/utils';
import { TechStack } from '@/ui';
import { TerminalHeader } from './TerminalHeader';
import { SITE } from '@/content';

interface TerminalBodyProps {
  history: TerminalLine[];
  inputValue: string;
  onInputChange: (val: string) => void;
  onCommand: (cmd: string, source?: 'terminal' | 'sidebar') => void;
  bootStep: number;
  getLineColor: (type: string) => string;
  isTyping: boolean;
  lastExitCode?: number | null;
  onStepComplete?: (step: number) => void;
  showGradients?: boolean;
}

// Konami code sequence; completing it triggers the `matrix` easter egg (see handler below).
const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

// Questions the AI agent can answer; shared by the placeholder cycler and the desktop "try asking" panel.
const AI_QUESTIONS = [
  'how much coffee he drinks?',
  'what is his favourite framework?',
  'does he actually sleep?',
  'what is his biggest flex?',
  'can he fix my printer?',
];


// ---------------------------------------------------------------------------
// PlaceholderCycler cycles AI question hints, skipping already-asked ones
// ---------------------------------------------------------------------------
const PlaceholderCycler: React.FC<{ ran: Set<string>; className?: string }> = ({ ran, className }) => {
  const allSuggestions = AI_QUESTIONS.map(cmd => ({ prefix: 'try asking ', cmd, suffix: '' }));
  // Drop already-asked questions so the cycler suggests fresh things; fall back to all once everything's been tried.
  const pool = allSuggestions.filter(s => !ran.has(s.cmd));
  const suggestions = pool.length > 0 ? pool : allSuggestions;

  const [index, setIndex] = useState(0);
  const [key, setKey] = useState(0);
  const [charsDone, setCharsDone] = useState(0);

  // Bumping `key` forces the Typewriters to remount and re-type each new hint.
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
    <div className={cn('font-mono text-fine md:text-caption text-term-fg select-none leading-tight whitespace-pre-wrap opacity-85', className)}>
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

  // Fake caret: render the typed text into a hidden span, measure its pixel width, position the cursor there.
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
  onStepComplete,
  showGradients = false,
}) => {
  const outRef = useRef<HTMLDivElement>(null);
  const inpRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  // Dynamic textarea height adjustment for desktop
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (outRef.current) outRef.current.scrollTop = outRef.current.scrollHeight;
  }, [history]);

  // Adjust height of textarea when user types or inputValue changes programmatically
  useEffect(() => {
    if (!isMobile) {
      adjustTextareaHeight();
    }
  }, [inputValue, isMobile, adjustTextareaHeight]);

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

  // Handles, in order: konami tracking, Tab/→ to accept the ghost autocomplete,
  // Enter to run + save to history, and ↑/↓ to walk back and forth through
  // previous commands (`historyIndex` is the cursor into them).
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
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

  // Keyboard handler for the desktop textarea
  const handleTextareaKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
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
      const current = (e.target as HTMLTextAreaElement).value;
      const { completion } = getCompletion(current);
      if (completion) onInputChange(current + completion);
      return;
    }
    if (e.key === 'ArrowRight') {
      const current = (e.target as HTMLTextAreaElement).value;
      const { completion } = getCompletion(current);
      if (completion) { e.preventDefault(); onInputChange(current + completion); return; }
    }
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Allow newline insertion (Shift+Enter)
        return;
      }
      // Enter without Shift runs the command
      e.preventDefault();
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
      const hasNewlines = inputValue.includes('\n');
      if (!hasNewlines) {
        e.preventDefault();
        if (historyIndex < cmdHistory.length - 1) {
          const next = historyIndex + 1;
          setHistoryIndex(next);
          onInputChange(cmdHistory[next]);
        }
      }
    } else if (e.key === 'ArrowDown') {
      const hasNewlines = inputValue.includes('\n');
      if (!hasNewlines) {
        e.preventDefault();
        if (historyIndex > -1) {
          const next = historyIndex - 1;
          setHistoryIndex(next);
          onInputChange(next === -1 ? '' : cmdHistory[next]);
        }
      }
    }
  }, [inputValue, cmdHistory, historyIndex, onInputChange, onCommand]);

  // Desktop clicks (suggested question, completion chip, ASK) record the command
  // in the ↑/↓ history exactly like pressing Enter does.
  const remember = useCallback((cmd: string) => {
    const updated = [cmd, ...cmdHistory.filter(c => c !== cmd).slice(0, 49)];
    setCmdHistory(updated);
    try { sessionStorage.setItem('term_cmd_history', JSON.stringify(updated)); } catch { }
    setHistoryIndex(-1);
    setGhostText('');
  }, [cmdHistory]);

  const lastPromptIndex = history.map((l) => l.t).lastIndexOf('prompt');
  const showPlaceholder = !inputValue && !isInputFocused;
  const showInputCursor = isInputFocused || !!inputValue;

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      <div
        className="flex-1 overflow-y-auto overflow-x-hidden pr-4 custom-scrollbar cursor-text"
        ref={outRef}
        onClick={() => {
          if (!isMobile) {
            textareaRef.current?.focus();
          } else {
            inpRef.current?.focus();
          }
        }}
        aria-label="Terminal output"
      >
        <div className="flex flex-col justify-start pb-4">
          {/* Mobile intro */}
          {isMobile && (
            <div className="space-y-4 mb-4 shrink-0">
              <div className="space-y-1">
                <div>
                  <h1 className="leading-[0.9] tracking-tighter flex flex-col">
                    <Typewriter text={SITE.firstName.toLowerCase()} speed={20} delay={180} className="font-mono text-3xl font-black text-term-fg" skip={true} />
                    <Typewriter text={`${SITE.lastName.toLowerCase()}.`} speed={20} delay={300} className="font-playfair italic text-3xl text-brand-primary font-black" skip={true} />
                  </h1>
                </div>
              </div>
              <div className="space-y-1">
                <div className="space-y-2.5">
                  <Typewriter text={SITE.role.toLowerCase()} speed={12} delay={880} className="font-mono text-fine sm:text-xs text-term-fg leading-relaxed block font-bold" as="span" skip={true} />
                  <TechStack animate className="!text-fine" />
                  <Typewriter text="Data to decisions & decisions into products" speed={12} delay={1650} className="font-mono text-fine sm:text-xs text-term-dim leading-relaxed block" as="span" skip={true} />
                </div>
              </div>
            </div>
          )}

          {/* Desktop intro */}
          {!isMobile && onStepComplete && (
            <TerminalHeader
              bootStep={bootStep}
              onStepComplete={onStepComplete}
              showGradients={showGradients}
            />
          )}

          {/* Command History a line's `t` (type) decides its shape: a `prompt` shows the
              "~$ command" you typed; everything else is output, which may be plain text,
              coloured `parts`, clickable `chips`, or a link. */}
          <div className="space-y-1" aria-live="polite" aria-atomic="false">
            {history.map((line, i) => (
              <div key={i} className="font-mono text-fine md:text-caption leading-tight">
                {line.t === 'prompt' ? (
                  <div className="flex gap-2 md:gap-4 items-center">
                    <span className="text-brand-primary font-bold shrink-0">~$</span>
                    <span className="text-term-fg tracking-tight truncate">{line.text.replace('~$ ', '')}</span>
                  </div>
                ) : line.t === 'ai-head' ? (
                  <div
                    className={cn(
                      'pl-6 md:pl-9 flex items-center gap-2 pt-1',
                      !isMobile && i > lastPromptIndex && 'opacity-0 animate-terminal-fade-in'
                    )}
                    style={{ animationDelay: !isMobile && i > lastPromptIndex ? `${(i - lastPromptIndex - 1) * 35}ms` : undefined }}
                  >
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-brand-primary/30 bg-brand-primary/10 px-2 py-0.5 text-micro font-black tracking-mega text-brand-primary">
                      <span className="text-micro leading-none" aria-hidden="true">◆</span>{line.text}
                    </span>
                    {line.streaming && <span className="ai-pulse-dot" aria-hidden="true" />}
                  </div>
                ) : line.t === 'ai-foot' ? (
                  <div
                    className={cn(
                      'pl-6 md:pl-9 flex items-center gap-2 pt-1',
                      !isMobile && i > lastPromptIndex && 'opacity-0 animate-terminal-fade-in'
                    )}
                    style={{ animationDelay: !isMobile && i > lastPromptIndex ? `${(i - lastPromptIndex - 1) * 35}ms` : undefined }}
                  >
                    <span className="text-brand-primary/40 select-none" aria-hidden="true">└─</span>
                    <span className="text-micro tracking-wide text-term-faint">{line.text}</span>
                  </div>
                ) : line.gutter ? (
                  <div
                    className={cn(
                      'pl-6 md:pl-9 flex gap-2',
                      !isMobile && i > lastPromptIndex && 'opacity-0 animate-terminal-fade-in'
                    )}
                    style={{ animationDelay: !isMobile && i > lastPromptIndex ? `${(i - lastPromptIndex - 1) * 35}ms` : undefined }}
                  >
                    <span className="text-brand-primary/40 select-none shrink-0" aria-hidden="true">│</span>
                    <div className="flex-1 text-term-fg whitespace-pre-wrap break-words leading-relaxed">
                      {line.parts
                        ? line.parts.map((p, j) => (
                          <span key={`${i}-${j}`} className={getLineColor(p.t)}>{p.text}</span>
                        ))
                        : line.text}
                      {line.streaming && <span className="terminal-block-cursor ml-[2px]" aria-hidden="true" />}
                    </div>
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
                                className="font-mono text-micro px-2 py-0.5 rounded border border-brand-primary/40 text-brand-primary bg-brand-primary/[0.08] hover:bg-brand-primary/20 hover:border-brand-primary/70 transition-colors cursor-pointer">
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
                              className="font-mono text-micro px-2 py-0.5 rounded border border-brand-primary/40 text-brand-primary bg-brand-primary/[0.08] hover:bg-brand-primary/20 hover:border-brand-primary/70 transition-colors cursor-pointer">
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

          {/* Active Prompt (Mobile view inline) */}
          {isMobile && bootStep >= 7 && (
            <div
              className={cn(
                'flex items-center gap-2 md:gap-4 transition-all duration-500',
                isTyping ? 'opacity-0 pointer-events-none translate-y-1' : 'opacity-100 translate-y-0'
              )}
              onClick={() => inpRef.current?.focus()}
            >
              {lastExitCode && lastExitCode !== 0 ? (
                <span className="font-mono text-fine md:text-xs shrink-0 flex items-center gap-1">
                  <span className="text-viz-mac-red font-bold">[{lastExitCode}]</span>
                  <span className="text-viz-mac-red font-bold">~$</span>
                </span>
              ) : (
                <span className="font-mono text-fine md:text-xs text-brand-primary font-bold shrink-0">~$</span>
              )}

              <div className="relative flex-1 flex items-center min-w-0 font-mono text-fine md:text-caption">
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
                <button key={ci} type="button" onClick={() => {
                  const cmd = c.trim();
                  if (!isTyping) {
                    const updated = [cmd, ...cmdHistory.filter(h => h !== cmd).slice(0, 49)];
                    setCmdHistory(updated);
                    try { sessionStorage.setItem('term_cmd_history', JSON.stringify(updated)); } catch { }
                    setHistoryIndex(-1);
                    setGhostText('');
                    onCommand(cmd);
                  }
                }}
                  className="font-mono text-micro px-2 py-0.5 rounded border border-brand-primary/40 text-brand-primary bg-brand-primary/[0.08] active:bg-brand-primary/20 transition-colors">
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Desktop AI input. It is a row from the sidebar's CONTROLS system (accent
          spine, indicator light, numbered badge, uppercase title + desc) promoted
          to the left column's focal point. Its frame follows the hero grid: the
          left edge sits on the column's ~$ rail, there is no bottom padding so
          it lands flush with the sidebar's last row, and lg:pr-4 (the sidebar's
          lg:pl-12 minus the grid's gap-8, i.e. 48 - 32px) puts it as far left of
          the divider as the sidebar rows sit right of it, at every lg width.
          Hovering or focusing it fans out the suggested questions above it. */}
      {!isMobile && bootStep >= 7 && (
        <div
          className={cn(
            'mt-auto shrink-0 pt-4 lg:pr-4 transition-opacity duration-300',
            isTyping ? 'opacity-60 pointer-events-none' : 'opacity-100'
          )}
        >
          {inputValue && completionCandidates.length > 0 && (
            <div className="flex gap-2 mb-2 flex-wrap pl-11">
              {completionCandidates.map((c, ci) => (
                <button
                  key={ci}
                  type="button"
                  onClick={() => {
                    const cmd = c.trim();
                    if (!isTyping) {
                      remember(cmd);
                      onCommand(cmd);
                    }
                  }}
                  className="font-mono text-micro px-2 py-0.5 rounded border border-brand-primary/40 text-brand-primary bg-brand-primary/[0.08] hover:bg-brand-primary/20 transition-colors cursor-pointer"
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          <div className="group/ai relative w-full">
            {/* Suggested questions, as numbered rows like the sidebar's. Enter is
                staggered (each row's delay rides in on --stagger) and eased on the
                site's expo curve; exit is a quick undelayed fade. */}
            {!inputValue && !isTyping && (
              <div className="pointer-events-none absolute bottom-full left-0 z-30 w-full max-w-sm pb-2 group-hover/ai:pointer-events-auto group-focus-within/ai:pointer-events-auto">
                <div
                  role="group"
                  aria-label="Suggested questions"
                  className={cn(
                    'origin-bottom-left rounded-lg border border-edge bg-input-bg/95 p-1.5 backdrop-blur-md shadow-[0_24px_48px_-24px_var(--color-hover-shadow)]',
                    'translate-y-2 scale-[0.98] opacity-0 transition-[opacity,transform] duration-200 ease-out',
                    'group-hover/ai:translate-y-0 group-hover/ai:scale-100 group-hover/ai:opacity-100 group-hover/ai:duration-500 group-hover/ai:ease-out-expo group-hover/ai:delay-75',
                    'group-focus-within/ai:translate-y-0 group-focus-within/ai:scale-100 group-focus-within/ai:opacity-100 group-focus-within/ai:duration-500 group-focus-within/ai:ease-out-expo'
                  )}
                >
                  <div className="flex items-center gap-3 px-2.5 pt-1.5 pb-2 font-mono text-micro">
                    <span className="uppercase tracking-mega text-fg-mid">Try asking</span>
                    <span className="h-px flex-1 bg-edge" aria-hidden="true" />
                    <span className="text-fg-mid">
                      or type <span className="font-bold text-fg-soft">help</span>
                    </span>
                  </div>
                  {AI_QUESTIONS.map((q, qi) => (
                    <div
                      key={q}
                      style={{ '--stagger': `${120 + qi * 45}ms` } as React.CSSProperties}
                      className={cn(
                        'translate-y-1 opacity-0 transition-[opacity,transform] duration-150 ease-out',
                        'group-hover/ai:translate-y-0 group-hover/ai:opacity-100 group-hover/ai:duration-500 group-hover/ai:ease-out-expo group-hover/ai:delay-(--stagger)',
                        'group-focus-within/ai:translate-y-0 group-focus-within/ai:opacity-100 group-focus-within/ai:duration-500 group-focus-within/ai:ease-out-expo group-focus-within/ai:delay-(--stagger)'
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          remember(q);
                          onCommand(q);
                        }}
                        className="group/q flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-1 text-left transition-colors duration-200 hover:bg-brand-primary/[0.07] focus-visible:bg-brand-primary/[0.07] focus-visible:outline-none"
                      >
                        <span className="inline-flex h-[18px] shrink-0 items-center justify-center rounded-[4px] border border-edge-soft bg-fg/[0.02] px-1.5 font-mono text-micro font-bold text-fg-mid transition-colors duration-300 group-hover/q:border-brand-primary/30 group-hover/q:bg-brand-primary/5 group-hover/q:text-brand-primary group-focus-visible/q:border-brand-primary/30 group-focus-visible/q:text-brand-primary">
                          {String(qi + 1).padStart(2, '0')}
                        </span>
                        <span className="truncate font-mono text-fine text-fg-soft transition-colors duration-300 group-hover/q:text-brand-primary group-focus-visible/q:text-brand-primary">
                          {q}
                        </span>
                        <span
                          aria-hidden="true"
                          className="ml-auto inline-block font-mono text-label leading-none text-brand-primary opacity-0 -translate-x-2 transition-all duration-400 ease-spring group-hover/q:opacity-100 group-hover/q:translate-x-0 group-focus-visible/q:opacity-100 group-focus-visible/q:translate-x-0"
                        >
                          →
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div
              className={cn(
                'relative w-full overflow-hidden rounded-lg border transition-[border-color,background-color,box-shadow] duration-500 ease-out-expo',
                isInputFocused
                  ? 'border-brand-primary/45 bg-brand-primary/[0.04] shadow-[inset_0_0_40px_-24px_var(--color-brand-primary)]'
                  : 'border-brand-primary/20 bg-brand-primary/[0.02] group-hover/ai:border-brand-primary/30'
              )}
            >
              {/* Teal bloom behind the spine (ProjectStrip's blooms, in brand teal) */}
              <span
                aria-hidden="true"
                className={cn(
                  'pointer-events-none absolute -left-20 -top-16 h-40 w-96 rounded-full bg-radial from-brand-primary/[0.10] to-transparent to-60% transition-opacity duration-700',
                  isInputFocused ? 'opacity-100' : 'opacity-60 group-hover/ai:opacity-100'
                )}
              />
              {/* Top hairline: the sidebar rows' hover line, breathing at rest, held on focus */}
              <span
                aria-hidden="true"
                className={cn(
                  'pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-brand-primary/70 to-transparent',
                  isInputFocused ? 'opacity-100' : 'opacity-60 motion-safe:animate-breathe-slow'
                )}
              />
              {/* Accent spine: lit at rest, runs full height with a glow on hover/focus */}
              <span
                aria-hidden="true"
                className={cn(
                  'absolute left-0 z-20 w-[3px] rounded-r-sm transition-all duration-300',
                  isInputFocused
                    ? 'top-0 bottom-0 bg-brand-primary shadow-[0_0_10px_var(--color-brand-primary)]'
                    : 'top-2 bottom-2 bg-brand-primary/50 group-hover/ai:top-0 group-hover/ai:bottom-0 group-hover/ai:bg-brand-primary group-hover/ai:shadow-[0_0_10px_var(--color-brand-primary)]'
                )}
              />

              {/* Header in the sidebar-row layout: lit indicator, AI badge, title,
                  desc on the right (swaps to the key hints while focused). The
                  w-6 gutter is shared with the ~$ below so badge and text align. */}
              <div className="relative z-10 flex items-center gap-2 px-3 pt-2.5">
                <span className="flex w-6 shrink-0 justify-center" aria-hidden="true">
                  <span className="size-1 rounded-[1px] bg-brand-primary shadow-[0_0_6px_var(--color-brand-primary)] motion-safe:animate-indicator-breathe" />
                </span>
                <span className="inline-flex h-[18px] shrink-0 items-center rounded-[4px] border border-brand-primary/40 bg-brand-primary/10 px-1.5 font-mono text-micro font-bold text-brand-primary">
                  AI
                </span>
                <span className="font-noto text-label font-black uppercase tracking-tight text-fg">Agent</span>
                <span
                  key={isInputFocused ? 'keys' : 'desc'}
                  className="ml-auto truncate pl-3 font-mono text-micro uppercase tracking-tight text-fg-mid animate-terminal-fade-in"
                >
                  {isInputFocused ? 'enter to ask · tab to complete' : `ask me anything about ${SITE.firstName}`}
                </span>
              </div>

              <div
                className="relative z-10 flex w-full cursor-text items-start gap-2 px-3 pb-1"
                onClick={() => textareaRef.current?.focus()}
              >
                <span className="flex h-[38px] min-w-6 shrink-0 select-none items-center justify-center font-mono text-xs font-bold">
                  {lastExitCode && lastExitCode !== 0 ? (
                    <span className="text-viz-mac-red">[{lastExitCode}] ~$</span>
                  ) : (
                    <span className="text-brand-primary">~$</span>
                  )}
                </span>

                <div className="relative flex min-h-[38px] min-w-0 flex-1 font-mono text-caption">
                  <textarea
                    ref={textareaRef}
                    id="hero-terminal-input"
                    value={inputValue}
                    onChange={(e) => {
                      onInputChange(e.target.value);
                      adjustTextareaHeight();
                    }}
                    onKeyDown={handleTextareaKeyDown}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                    className="relative z-10 min-h-[38px] max-h-[160px] w-full resize-none border-none bg-transparent py-[9px] font-mono leading-5 text-term-fg caret-brand-primary outline-none custom-scrollbar cursor-text"
                    spellCheck={false}
                    placeholder=""
                    autoComplete="off"
                    aria-label="Ask the AI agent or type a command"
                    disabled={isTyping}
                    rows={1}
                  />

                  {showPlaceholder && (
                    <div className="absolute inset-0 flex items-center overflow-hidden pointer-events-none z-0">
                      <PlaceholderCycler ran={ranCommands.current} className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap" />
                    </div>
                  )}
                </div>

                <div className="flex h-[38px] shrink-0 items-center self-end">
                  <button
                    type="button"
                    aria-disabled={!inputValue.trim()}
                    className={cn(
                      'group/send inline-flex h-7 items-center gap-1.5 rounded-md border pl-2.5 pr-2 font-mono text-micro font-black tracking-mega transition-all duration-300 ease-out-expo',
                      inputValue.trim()
                        ? 'cursor-pointer border-brand-primary/60 bg-brand-primary/10 text-brand-primary shadow-[0_0_14px_-4px_var(--color-brand-primary)] hover:border-brand-primary hover:bg-brand-primary/20'
                        : 'cursor-default border-edge bg-fg/[0.02] text-fg-mid'
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (inputValue.trim() && !isTyping) {
                        remember(inputValue.trim());
                        onCommand(inputValue);
                      }
                    }}
                  >
                    ASK
                    <span
                      aria-hidden="true"
                      className="inline-block text-caption leading-none tracking-normal transition-transform duration-400 ease-spring group-hover/send:translate-x-0.5"
                    >
                      →
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
