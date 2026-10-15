/**
 * ScrollHint a hairline and chevron that surface only when the visitor has
 * been idle for a while, then breathe very slowly under the hero terminal.
 * No copy, no chrome: it stays out of the way until it is actually useful.
 *
 * Fits in: rendered by the Hero (src/pages/home/Hero/index.tsx) and the
 *          Off The Pace split hero.
 * Note:    idle = no scroll / wheel / touch / key input for IDLE_MS. Any input
 *          hides it and restarts the timer. The breathing is one slow CSS
 *          keyframe shared by line and chevron so they move as one. Respects
 *          prefers-reduced-motion by holding a static, dim cue.
 */
import React, { useEffect, useState } from 'react';

interface ScrollHintProps {
  hasScrolled: boolean;
  className?: string;
  variant?: 'teal' | 'f1';
}

const IDLE_MS = 6000;
const INPUT_EVENTS = ['scroll', 'wheel', 'touchmove', 'keydown'] as const;

export const ScrollHint: React.FC<ScrollHintProps> = ({ hasScrolled, className = '', variant = 'teal' }) => {
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    let timer: number;
    const arm = () => {
      setIdle(false);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setIdle(true), IDLE_MS);
    };
    arm();
    INPUT_EVENTS.forEach((e) => window.addEventListener(e, arm, { passive: true }));
    return () => {
      window.clearTimeout(timer);
      INPUT_EVENTS.forEach((e) => window.removeEventListener(e, arm));
    };
  }, []);

  const visible = idle && !hasScrolled;

  return (
    <>
      <style>{`
        @keyframes scrollHintBreathe {
          0%, 100% { opacity: 0.3; transform: translateY(0); }
          50%      { opacity: 0.8; transform: translateY(3px); }
        }
        .scroll-hint-container {
          transform: translate(-50%, 0);
          opacity: 0;
          transition: opacity 1.8s ease-in-out;
        }
        .scroll-hint-container.is-visible { opacity: 1; }
        .scroll-hint-track {
          background: linear-gradient(
            to bottom,
            transparent,
            color-mix(in srgb, var(--scroll-hint-color) 55%, transparent) 50%,
            transparent
          );
        }
        .scroll-hint-breathe {
          animation: scrollHintBreathe 7s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .scroll-hint-breathe { animation: none; opacity: 0.5; }
        }
      `}</style>

      {/* aria-hidden: purely decorative, kept out of the a11y tree. */}
      <div
        aria-hidden="true"
        className={`scroll-hint-container ${visible ? 'is-visible' : ''} pointer-events-none left-1/2 flex flex-col items-center z-20 ${className || 'absolute bottom-full mb-3 md:bottom-auto md:top-[calc(100%+16px)]'}`}
        style={
          {
            '--scroll-hint-color': variant === 'f1' ? 'var(--color-f1-red)' : 'var(--color-light-bg)',
          } as React.CSSProperties
        }
      >
        <div className="scroll-hint-breathe flex flex-col items-center">
          <div className="scroll-hint-track h-12 w-px" />
          <svg
            className="-mt-1 text-(--scroll-hint-color)"
            width="14"
            height="8"
            viewBox="0 0 14 8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M1 1l6 6 6-6" />
          </svg>
        </div>
      </div>
    </>
  );
};
