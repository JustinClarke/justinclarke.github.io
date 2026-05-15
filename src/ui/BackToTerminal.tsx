import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { MagneticButton } from './MagneticButton';

export const BackToTerminal = () => {
  return (
    <>
      {/* Desktop Version */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="fixed top-12 left-12 z-[100] hidden md:block"
      >
        <MagneticButton>
          <Link 
            to="/"
            aria-label="Return to terminal home page"
            className="relative flex items-center gap-4 px-6 py-3 rounded-full group transition-all duration-700 border border-white/10 bg-zinc-950/80 backdrop-blur-2xl hover:bg-zinc-900 hover:border-brand-primary/50 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
          >
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full border border-white/10 group-hover:bg-brand-primary group-hover:border-brand-primary group-hover:scale-110 transition-all duration-500 bg-white/5">
              <ArrowLeft className="w-4 h-4 text-white group-hover:text-black transition-colors" />
            </div>

            <div className="flex flex-col relative z-10">
              <span className="font-mono text-[8px] font-black uppercase tracking-[0.3em] text-white/50 group-hover:text-white transition-colors leading-none">Return to</span>
              <span className="font-mono text-[11px] font-black uppercase tracking-[0.4em] text-white leading-none mt-1.5 group-hover:tracking-[0.5em] transition-all duration-700">Terminal</span>
            </div>
          </Link>
        </MagneticButton>
      </motion.div>

      {/* Mobile Version: Lowkey Pill */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-6 left-6 z-[100] md:hidden"
      >
        <Link 
          to="/"
          aria-label="Return to terminal home page"
          className="flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-black/40 backdrop-blur-xl active:bg-white/10 transition-all shadow-lg"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-white/60" />
          <span className="font-mono text-[9px] font-black uppercase tracking-[0.3em] text-white/60">Terminal</span>
        </Link>
      </motion.div>
    </>
  );
};
