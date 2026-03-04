import React, { useState, useEffect, useRef, useCallback } from 'react';
import { COMMAND_MANIFEST } from '../engine';
import { cn } from '@/utils';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onCommand: (cmd: string) => void;
}

const VISIBLE_SPECS = COMMAND_MANIFEST.filter(s => !s.hidden);

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

  const filtered = VISIBLE_SPECS.filter(s =>
    fuzzyMatch(query, s.id) ||
    s.aliases.some(a => fuzzyMatch(query, a)) ||
    (query.length > 1 && s.summary.toLowerCase().includes(query.toLowerCase()))
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => { setActiveIndex(0); }, [query]);

  const run = useCallback((cmd: string) => {
    setQuery('');
    onCommand(cmd);
  }, [onCommand]);

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

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.children[activeIndex] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  if (!isOpen) return null;

  const categoryLabel = (cat: string) =>
    cat === 'core' ? 'CORE' : cat === 'system' ? 'SYSTEM' : 'EGG';

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
          <span className="font-mono text-term-faint text-[10px] shrink-0">⌘K</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="search commands..."
            className="flex-1 bg-transparent border-none outline-none font-mono text-[16px] md:text-[12px] text-term-fg placeholder:text-term-faint caret-brand-primary"
            spellCheck={false}
            autoComplete="off"
          />
          <kbd className="font-mono text-[9px] text-term-faint border border-white/10 rounded px-1.5 py-0.5">ESC</kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[320px] overflow-y-auto custom-scrollbar py-1">
          {filtered.length === 0 ? (
            <div className="px-4 py-3 font-mono text-[11px] text-term-faint">no commands match.</div>
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
                  'font-mono text-[11px] font-bold w-28 shrink-0',
                  i === activeIndex ? 'text-brand-primary' : 'text-term-fg'
                )}>
                  {spec.id}
                </span>
                <span className="font-mono text-[10px] text-term-dim truncate flex-1">
                  {spec.summary}
                </span>
                <span className={cn(
                  'font-mono text-[8px] tracking-[0.15em] uppercase shrink-0',
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
        <div className="px-4 py-2 border-t border-studio flex items-center gap-4 font-mono text-[9px] text-term-faint">
          <span><kbd className="border border-white/10 rounded px-1">↑↓</kbd> navigate</span>
          <span><kbd className="border border-white/10 rounded px-1">↵</kbd> run</span>
          <span><kbd className="border border-white/10 rounded px-1">esc</kbd> close</span>
          <span className="ml-auto opacity-50">{filtered.length} commands</span>
        </div>
      </div>
    </div>
  );
};
