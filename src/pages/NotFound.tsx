import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Terminal } from 'lucide-react';

/**
 * NotFound Page
 * 
 * Cinematic 404 Error page featuring geometric background noise and staggered entry animations.
 * 
 * Architecture:
 * - Background: Layered radial glows (brand-primary and white/5).
 * - Content: Bold typography with semantic color overlays (brand-bg, text-dim).
 * - Status: Pulse indicator synchronized with the system-wide operational state.
 */
export const NotFound = () => {
  return (
    <main className="min-h-screen bg-brand-bg flex items-center justify-center p-6 relative overflow-hidden">
      {/* ── Background Geometric Noise ── */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-border-studio rounded-full blur-[100px]" />
      </div>

      {/* ── Content Container ── */}
      <div className="relative z-10 max-w-2xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border-studio bg-border-studio/40 mb-8">
            <Terminal className="w-3 h-3 text-brand-primary" />
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-text-muted">Error 404 // Path Invalid</span>
          </div>

          <h1 className="font-serif italic text-8xl md:text-9xl text-white mb-6 relative inline-block">
            404
            <motion.span 
              className="absolute -top-4 -right-8 text-sm font-mono text-brand-primary italic opacity-50"
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              [LOST]
            </motion.span>
          </h1>

          <p className="font-noto text-base md:text-lg text-text-dim leading-relaxed mb-12 max-w-md mx-auto">
            The data point you're looking for has drifted outside the primary namespace. 
            The system was unable to resolve the requested coordinates.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center gap-3 px-8 py-4 bg-white text-black font-noto text-[11px] font-bold tracking-[0.1em] uppercase rounded-[4px] transition-all hover:bg-brand-primary focus-ring"
              >
                <Home className="w-4 h-4" aria-hidden="true" />
                Return to Base
              </motion.button>
            </Link>

            <Link to={-1 as any}>
              <button 
                className="flex items-center gap-2 px-8 py-4 bg-transparent text-text-muted border border-border-studio font-noto text-[11px] font-bold tracking-[0.1em] uppercase rounded-[4px] transition-all hover:bg-border-studio hover:text-white focus-ring"
                aria-label="Go back to the previous page"
              >
                <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                Step Back
              </button>
            </Link>
          </div>
        </motion.div>

        {/* ── Footer Branding: Final status confirmation ── */}
        <div className="mt-20 pt-8 border-t border-border-studio flex items-center justify-center gap-4">
          <span className="font-mono text-[8px] text-text-muted/40 uppercase tracking-[0.25em]">system.status.operational</span>
          <div className="w-1 h-1 rounded-full bg-brand-primary animate-pulse" />
        </div>
      </div>
    </main>
  );
};
