import React, { memo, useEffect } from 'react';
import { TechStack } from '@/ui';

interface TerminalHeaderProps {
  bootStep: number;
  onStepComplete: (step: number) => void;
}

const fadeIn = (delay: number): React.CSSProperties => ({
  animation: `terminal-fade-in 0.5s cubic-bezier(0.215, 0.61, 0.355, 1) ${delay}ms both`,
});

export const TerminalHeader: React.FC<TerminalHeaderProps> = memo(({ bootStep, onStepComplete }) => {
  useEffect(() => {
    if (bootStep !== 0) return;
    const timer = setTimeout(() => onStepComplete(7), 1700);
    return () => clearTimeout(timer);
  }, [bootStep, onStepComplete]);

  if (bootStep < 0) return null;

  return (
    <div className="shrink-0 space-y-4 md:space-y-6 mb-4 md:mb-8">
      <div className="space-y-1 md:space-y-2">
        <div className="flex items-center gap-2 md:gap-3" style={fadeIn(100)}>
          <span className="font-mono text-[11px] md:text-xs text-brand-primary font-bold">~$</span>
          <span className="font-mono text-[11px] md:text-xs text-term-fg">whoami</span>
        </div>
        <div className="pl-4 md:pl-6">
          <h1 className="leading-[0.9] tracking-tighter flex flex-col">
            <span className="font-mono text-3xl md:text-5xl lg:text-6xl font-black text-term-fg" style={fadeIn(300)}>justin</span>
            <span className="font-playfair italic text-3xl md:text-5xl lg:text-6xl text-brand-primary font-black" style={fadeIn(450)}>clarke.</span>
          </h1>
        </div>
      </div>

      <div className="space-y-1 md:space-y-2">
        <div className="flex items-center gap-2 md:gap-3" style={fadeIn(650)}>
          <span className="font-mono text-[11px] md:text-xs text-brand-primary font-bold">~$</span>
          <span className="font-mono text-[11px] md:text-xs text-term-dim">profile.read()</span>
        </div>
        <div className="pl-4 md:pl-6 border-l border-white/5 space-y-3.5 md:space-y-4">
          <span className="font-mono text-xs md:text-sm text-term-fg leading-relaxed block font-bold" style={fadeIn(850)}>data & analytics developer.</span>
          <div style={fadeIn(1050)}><TechStack animate /></div>
          <span className="font-mono text-xs md:text-sm text-term-dim leading-relaxed block" style={fadeIn(1250)}>Data to decisions and decisions into products</span>
        </div>
      </div>
    </div>
  );
});
