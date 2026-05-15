import React, { useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { Typewriter } from './Typewriter';

interface TerminalHeaderProps {
  bootStep: number;
  onStepComplete: (step: number) => void;
}

export const TerminalHeader: React.FC<TerminalHeaderProps> = memo(({ bootStep, onStepComplete }) => {
  // Stable completion handlers to prevent typewriter restarts
  const step1 = useCallback(() => onStepComplete(1), [onStepComplete]);
  const step2 = useCallback(() => onStepComplete(2), [onStepComplete]);
  const step3 = useCallback(() => onStepComplete(3), [onStepComplete]);
  const step4 = useCallback(() => onStepComplete(4), [onStepComplete]);
  const step5 = useCallback(() => onStepComplete(5), [onStepComplete]);
  const step6 = useCallback(() => onStepComplete(6), [onStepComplete]);
  const step7 = useCallback(() => onStepComplete(7), [onStepComplete]);

  // Snappy typing speeds for a more responsive feel
  const CMD_SPEED = 40;
  const TEXT_SPEED = 30;

  return (
    <div className="shrink-0 space-y-4 md:space-y-6 mb-4 md:mb-8">
      {bootStep >= 0 && (
        <div className="space-y-1 md:space-y-2">
          <div className="flex items-center gap-2 md:gap-3">
            <span className="font-mono text-[11px] md:text-xs text-brand-primary font-bold">~$</span>
            <Typewriter 
              text="whoami" 
              speed={CMD_SPEED} 
              onComplete={step1} 
              className="font-mono text-[11px] md:text-xs text-[#f4f4f3]" 
              skip={bootStep > 0}
            />
          </div>
          {bootStep >= 1 && (
            <div className="pl-4 md:pl-6">
              <h1 className="leading-[0.9] tracking-tighter flex flex-col">
                <Typewriter 
                  text="justin" 
                  speed={40} 
                  delay={50} 
                  onComplete={step2} 
                  className="font-mono text-3xl md:text-5xl lg:text-6xl font-black text-[#f4f4f3]" 
                  skip={bootStep > 1}
                />
                {bootStep >= 2 && (
                  <Typewriter 
                    text="clarke." 
                    speed={40} 
                    onComplete={step3} 
                    className="font-playfair italic text-3xl md:text-5xl lg:text-6xl text-brand-primary font-black" 
                    skip={bootStep > 2}
                  />
                )}
              </h1>
            </div>
          )}
        </div>
      )}

      {bootStep >= 3 && (
        <div className="space-y-1 md:space-y-2">
          <div className="flex items-center gap-2 md:gap-3">
            <span className="font-mono text-[11px] md:text-xs text-brand-primary font-bold">~$</span>
            <Typewriter 
              text="cat about.txt" 
              speed={CMD_SPEED} 
              onComplete={step4} 
              className="font-mono text-[11px] md:text-xs text-[#8a8a86]" 
              skip={bootStep > 3}
            />
          </div>
          {bootStep >= 4 && (
            <div className="pl-4 md:pl-6 border-l border-white/5 space-y-0.5 md:space-y-1">
              <Typewriter 
                text="analytics engineer + full-stack." 
                speed={TEXT_SPEED} 
                onComplete={step5} 
                className="font-mono text-xs md:text-sm text-[#f4f4f3] leading-relaxed block" 
                as="span" 
                skip={bootStep > 4}
              />
              {bootStep >= 5 && (
                <Typewriter 
                  text="I build pipelines and the products they power." 
                  speed={TEXT_SPEED} 
                  onComplete={step7} 
                  className="font-mono text-xs md:text-sm text-[#8a8a86] leading-relaxed block" 
                  as="span" 
                  skip={bootStep > 5}
                />
              )}
            </div>
          )}
        </div>
      )}

    </div>
  );
});
