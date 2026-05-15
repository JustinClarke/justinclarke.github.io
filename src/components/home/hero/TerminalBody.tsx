import React, { useRef, useEffect, useState, memo } from 'react';
import { TerminalLine } from '@/components/home/TerminalEngine';
import { Typewriter } from './Typewriter';
import { cn } from '@/utils';

interface TerminalBodyProps {
  history: TerminalLine[];
  inputValue: string;
  onInputChange: (val: string) => void;
  onCommand: (cmd: string) => void;
  bootStep: number;
  getLineColor: (type: string) => string;
  isTyping: boolean;
}

const PlaceholderCycler: React.FC = () => {
  const suggestions = [
    'record',
    'ls projects',
    'expertise',
    'snake',
    'contact',
    'resume',
    'whoami',
    'clear',
    'help',
    'stack',
    'education'
  ];
  const [index, setIndex] = useState(0);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % suggestions.length);
      setKey((prev) => prev + 1);
    }, 5000); // Slower cycle for readability
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-mono text-[12px] text-[#8a8a86] opacity-70 italic flex items-center gap-1.5 whitespace-nowrap select-none">
      try typing "
      <Typewriter
        key={key}
        text={suggestions[index]}
        speed={120}
        className="text-[#00c8b4] not-italic font-black brightness-125"
      />
      "
    </div>
  );
};

export const TerminalBody: React.FC<TerminalBodyProps> = ({
  history,
  inputValue,
  onInputChange,
  onCommand,
  bootStep,
  getLineColor,
  isTyping
}) => {
  const outRef = useRef<HTMLDivElement>(null);
  const inpRef = useRef<HTMLInputElement>(null);

  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Auto-scroll to bottom on history change
  useEffect(() => {
    if (outRef.current) {
      outRef.current.scrollTop = outRef.current.scrollHeight;
    }
  }, [history]);

  // Focus input when boot sequence finishes
  useEffect(() => {
    if (bootStep >= 7 && !isTyping) {
      // preventScroll: true is critical for Safari to stop jumping to top on window focus
      inpRef.current?.focus({ preventScroll: true });
    }
  }, [bootStep, isTyping]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const cmd = inputValue.trim();
      if (cmd) {
        setCmdHistory(prev => [cmd, ...prev.slice(0, 9)]);
      }
      setHistoryIndex(-1);
      onCommand(inputValue);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < cmdHistory.length - 1) {
        const nextIndex = historyIndex + 1;
        setHistoryIndex(nextIndex);
        onInputChange(cmdHistory[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > -1) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        onInputChange(nextIndex === -1 ? '' : cmdHistory[nextIndex]);
      }
    }
  };

  return (
    <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar" ref={outRef}>
      <div className="space-y-1 min-h-full flex flex-col justify-start pb-4">
        {/* Command History */}
        <div className="space-y-1">
          {history.map((line, i) => (
            <div key={i} className="font-mono text-[11px] md:text-[12px] leading-tight">
              {line.t === 'prompt' ? (
                <div className="flex gap-2 md:gap-4 items-center">
                  <span className="text-[#00c8b4] font-bold shrink-0">~$</span>
                  <span className="text-[#f4f4f3] tracking-tight truncate">{line.text.replace('~$ ', '')}</span>
                </div>
              ) : (
                <div className="pl-6 md:pl-9 text-[#8a8a86]">
                  {line.parts ? (
                    <div className="flex flex-wrap gap-x-2">
                      {line.parts.map((p, j) => (
                        <Typewriter
                          key={`${i}-${j}`}
                          text={p.text}
                          speed={100}
                          className={getLineColor(p.t)}
                          skip={i < history.length - 1}
                        />
                      ))}
                    </div>
                  ) : (
                    <Typewriter
                      text={line.text}
                      speed={100}
                      className={getLineColor(line.t)}
                      skip={i < history.length - 1}
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Active Prompt */}
        {bootStep >= 7 && (
          <div className={cn(
            "flex items-center gap-2 md:gap-4 transition-all duration-500",
            isTyping ? "opacity-0 pointer-events-none translate-y-1" : "opacity-100 translate-y-0"
          )} onClick={() => inpRef.current?.focus()}>
            <span className="font-mono text-[11px] md:text-xs text-[#00c8b4] font-bold shrink-0">~$</span>
            <div className="relative flex-1 flex items-center min-w-0">
              <input
                ref={inpRef}
                type="text"
                value={inputValue}
                onChange={(e) => onInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent border-none outline-none font-mono text-[11px] md:text-[12px] text-[#f4f4f3] caret-[#00c8b4] py-1"
                spellCheck={false}
              />
              {!inputValue && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none overflow-hidden">
                  <PlaceholderCycler />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
