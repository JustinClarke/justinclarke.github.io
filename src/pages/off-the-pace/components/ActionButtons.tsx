/**
 * ActionButtons the "Repository" + "Documentation" link pair, with text that
 * scrambles on hover.
 *
 * Fits in: a small reusable CTA row dropped into Off The Pace hero/section areas.
 * Note:    Takes a `theme` prop so the docs button can adapt its border/text
 *          colour for light vs dark backgrounds; defaults to dark.
 *
 * For beginners ----------------------------------------------------------------
 * Each button keeps a boolean in useState for whether the mouse is over it.
 * onMouseEnter/onMouseLeave flip that boolean, and we pass it down to
 * ScrambleText as `isHovered` so the child can animate. This is the standard
 * "lift a tiny piece of UI state into the parent" pattern.
 * -----------------------------------------------------------------------------
 */
import { useState } from 'react';
import { ScrambleText } from './ui/ScrambleText';
import { LINKS } from '../data/projectStats';

// LEARN: `{ theme = 'dark' }: { theme?: 'light' | 'dark' }` destructures the
//    single prop and gives it a default. The `?` marks it optional; callers can
//    omit it and get 'dark'. The union type limits it to exactly two strings.
export const ActionButtons = ({ theme = 'dark' }: { theme?: 'light' | 'dark' }) => {
  const isDark = theme === 'dark';
  const [hoverRepo, setHoverRepo] = useState(false);
  const [hoverDocs, setHoverDocs] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 relative z-20 mb-8 mt-2">
      <a
        href={LINKS.repo}
        target="_blank"
        rel="noreferrer"
        onMouseEnter={() => setHoverRepo(true)}
        onMouseLeave={() => setHoverRepo(false)}
        className="group relative inline-flex items-center gap-2 sm:gap-3 px-6 py-4 sm:px-8 sm:py-4 bg-transparent border border-f1-red text-f1-red font-jetbrains text-xs sm:text-sm uppercase tracking-widest font-bold transition-colors duration-200 hover:bg-f1-red hover:text-black shadow-[0_0_10px_rgba(225,6,0,0.15)] hover:shadow-[0_0_20px_rgba(225,6,0,0.4)]"
        aria-label="View repository on GitHub"
      >
        <span className="relative flex items-center gap-2">
          <span className="w-2 h-2 bg-f1-red group-hover:bg-black transition-colors duration-200 animate-pulse shadow-[0_0_8px_rgba(225,6,0,0.8)] group-hover:shadow-[0_0_8px_rgba(0,0,0,0.8)]" />
          <ScrambleText text="REPOSITORY" isHovered={hoverRepo} prefix="[" suffix="]" />
        </span>
      </a>

      <a
        href={LINKS.docs}
        target="_blank"
        rel="noreferrer"
        onMouseEnter={() => setHoverDocs(true)}
        onMouseLeave={() => setHoverDocs(false)}
        className={`group inline-flex items-center gap-2 sm:gap-3 px-6 py-4 sm:px-8 sm:py-4 border font-jetbrains text-xs sm:text-sm uppercase tracking-widest font-bold transition-colors duration-200 hover:bg-f1-red hover:text-black hover:border-f1-red ${
          isDark ? 'border-white/30 text-white/90' : 'border-slate-800 text-slate-800'
        }`}
        aria-label="Read the documentation"
      >
        <ScrambleText text="DOCUMENTATION" isHovered={hoverDocs} prefix=">" />
      </a>
    </div>
  );
};
