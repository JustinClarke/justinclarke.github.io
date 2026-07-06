/**
 * CommandPalette the ⌘K pop-up: type to fuzzy-search every command, arrow-key
 * through the results, Enter to run.
 *
 * Fits in: a modal overlay opened from the Hero terminal. Closing or picking a
 *          command calls back to the parent via `onClose` / `onCommand`.
 * Note:    the keyboard model is the fiddly part `activeIndex` tracks the
 *          highlighted row, and arrow keys move it within the filtered list.
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { COMMAND_MANIFEST } from '../engine';
import { cn } from '@/utils';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onCommand: (cmd: string) => void;
}

// The commands the palette shows, minus the hidden easter eggs.
const VISIBLE_SPECS = COMMAND_MANIFEST.filter(s => !s.hidden);

// Fuzzy match: query chars must appear in `target` in order but not adjacent, so
// "exp" matches "expertise". Walk target, advancing `qi` on each lined-up char;
// full match once the whole query is consumed.
function fuzzyMatch(query: string, target: string): boolean {
  if (!query) return true;
  let qi = 0;
  for (let i = 0; i < target.length && qi < query.length; i++) {
    if (target[i].toLowerCase() === query[qi].toLowerCase()) qi++;
  }
  return qi === query.length;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onCommand }) => {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Keep a command if its id, any alias, or (for longer queries) its summary matches.
  const filtered = VISIBLE_SPECS.filter(s =>
    fuzzyMatch(query, s.id) ||
    s.aliases.some(a => fuzzyMatch(query, a)) ||
    (query.length > 1 && s.summary.toLowerCase().includes(query.toLowerCase()))
  );

  // On open, reset and focus the input (delayed until it's on screen).
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Jump the highlight back to the top whenever the search text changes.
  useEffect(() => { setActiveIndex(0); }, [query]);

  const run = useCallback((cmd: string) => {
    setQuery('');
    onCommand(cmd);
  }, [onCommand]);

  // Arrow keys move the highlight (clamped to the list); Enter runs, Escape closes.
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      if (filtered[activeIndex]) run(filtered[activeIndex].id);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  // Keep the highlighted row visible as you arrow past the edge of the scroll area.
  useEffect(() => {
    const el = listRef.current?.children[activeIndex] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  if (!isOpen) return null;

  const categoryLabel = (cat: string) =>
    cat === 'core' ? 'CORE' : cat === 'system' ? 'SYSTEM' : 'EGG';

  // Click-outside-to-close: the full-screen wrapper closes on click; the inner
  // box stops propagation so clicks inside it don't reach the wrapper.
  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-brand-bg/70 backdrop-blur-sm" />

      {/* Palette box */}
      <div
        className="relative w-full max-w-lg glass-studio border-studio rounded-xl shadow-[0_30px_80px_rgba(0,0,0,0.7)] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-studio">
          <span className="font-mono text-term-faint text-micro shrink-0">⌘K</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="search commands..."
            className="flex-1 bg-transparent border-none outline-none font-mono text-base md:text-caption text-term-fg placeholder:text-term-faint caret-brand-primary"
            spellCheck={false}
            autoComplete="off"
          />
          <kbd className="font-mono text-micro text-term-faint border border-white/10 rounded px-1.5 py-0.5">ESC</kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[320px] overflow-y-auto custom-scrollbar py-1">
          {filtered.length === 0 ? (
            <div className="px-4 py-3 font-mono text-fine text-term-faint">no commands match.</div>
          ) : (
            filtered.map((spec, i) => (
              <button
                key={spec.id}
                type="button"
                onClick={() => run(spec.id)}
                className={cn(
                  'w-full text-left px-4 py-2.5 flex items-center gap-3 transition-colors',
                  i === activeIndex ? 'bg-brand-primary/10' : 'hover:bg-white/[0.03]'
                )}
              >
                <span className={cn(
                  'font-mono text-fine font-bold w-28 shrink-0',
                  i === activeIndex ? 'text-brand-primary' : 'text-term-fg'
                )}>
                  {spec.id}
                </span>
                <span className="font-mono text-micro text-term-dim truncate flex-1">
                  {spec.summary}
                </span>
                <span className={cn(
                  'font-mono text-micro tracking-[0.15em] uppercase shrink-0',
                  spec.category === 'core' ? 'text-brand-primary/60' :
                  spec.category === 'system' ? 'text-blue-400/50' : 'text-viz-mac-yellow/50'
                )}>
                  {categoryLabel(spec.category)}
                </span>
              </button>
            ))
          )}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2 border-t border-studio flex items-center gap-4 font-mono text-micro text-term-faint">
          <span><kbd className="border border-white/10 rounded px-1">↑↓</kbd> navigate</span>
          <span><kbd className="border border-white/10 rounded px-1">↵</kbd> run</span>
          <span><kbd className="border border-white/10 rounded px-1">esc</kbd> close</span>
          <span className="ml-auto opacity-50">{filtered.length} commands</span>
        </div>
      </div>
    </div>
  );
};
