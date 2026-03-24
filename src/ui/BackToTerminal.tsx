import React from 'react';
import { Link } from 'react-router-dom';

export const BackToTerminal = () => {
  return (
    <Link
      to="/"
      className="fixed z-50 top-6 left-5 md:top-4 md:left-4 lg:top-[18px] lg:left-8 font-mono text-[10px] lg:text-[11px] uppercase tracking-[0.08em] text-[#e8e6e0]/50 hover:text-brand-primary bg-[#0c1110]/80 backdrop-blur-md px-3.5 py-2.5 rounded-lg border border-white/5 hover:border-brand-primary/20 transition-all duration-200 select-none no-underline cursor-pointer active:scale-95"
      aria-label="Back to portfolio"
    >
      ← back ~
    </Link>
  );
};
