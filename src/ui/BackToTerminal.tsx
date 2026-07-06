/**
 * BackToTerminal a fixed "← back ~" pill that returns to the home page.
 *
 * Fits in: rendered on the standalone project pages so visitors can get back
 *          to the terminal homepage from anywhere on the screen.
 * Note:    `position: fixed` (the `fixed` utility) pins it to the viewport, so
 *          it stays put while the page scrolls.
 */
import React from 'react';
import { Link } from 'react-router-dom';

export const BackToTerminal = () => {
  return (
    <Link
      to="/"
      className="fixed z-50 top-6 left-5 md:top-4 md:left-4 lg:top-[18px] lg:left-8 font-mono text-micro lg:text-fine uppercase tracking-[0.08em] text-paper/50 hover:text-brand-primary bg-ink/80 backdrop-blur-md px-3.5 py-2.5 rounded-lg border border-white/5 hover:border-brand-primary/20 transition-all duration-200 select-none no-underline cursor-pointer active:scale-95"
      aria-label="Back to portfolio"
    >
      ← back ~
    </Link>
  );
};
