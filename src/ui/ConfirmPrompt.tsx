/**
 * ConfirmPrompt a tiny inline "confirm? y / n" popover.
 *
 * Fits in: shown next to a destructive action (e.g. clearing terminal state)
 *          to make the user confirm before it happens.
 * Note:    it positions itself absolutely, so its parent must be `relative`.
 *
 * For beginners ----------------------------------------------------------------
 * `if (!isOpen) return null;` is the React way of saying "render nothing".
 * A component that returns null adds no HTML to the page, which is how we
 * show/hide the prompt without removing it from the parent's code.
 * -----------------------------------------------------------------------------
 */
import React from 'react';

interface ConfirmPromptProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message?: string;
}

export const ConfirmPrompt: React.FC<ConfirmPromptProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  message = 'confirm?'
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-6 left-0 z-50 bg-[#0c1211]/95 backdrop-blur-md border border-white/10 rounded px-2.5 py-1.5 flex items-center gap-1.5 shadow-[0_8px_20px_rgba(0,0,0,0.7)] animate-fade-in text-[10px] font-mono text-f1-cream whitespace-nowrap text-left">
      <span className="opacity-85">{message}</span>
      <button
        type="button"
        onClick={onConfirm}
        className="px-1.5 py-0.5 bg-viz-mac-red/20 hover:bg-viz-mac-red/35 border border-viz-mac-red/45 rounded text-viz-mac-red font-bold transition-colors cursor-pointer text-[9px] leading-none"
      >
        y
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="px-1.5 py-0.5 bg-white/5 hover:bg-white/15 border border-white/15 rounded text-f1-grey transition-colors cursor-pointer text-[9px] leading-none"
      >
        n
      </button>
    </div>
  );
};
