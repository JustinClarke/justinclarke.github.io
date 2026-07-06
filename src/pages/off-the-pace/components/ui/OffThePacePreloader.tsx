/**
 * OffThePacePreloader the brief intro splash: an F1 logo on a pale field that
 * pulses a red glow, then fades out and hands control back to the page.
 *
 * Fits in: shown once per session by OffThePaceOverview / OffThePaceSource
 *          while the real page fades in behind it.
 * Note:    Rendered through a portal into document.body so it sits above all
 *          page content regardless of where it is mounted in the tree.
 *          Phase timeline: red -> glow -> red -> fading, onComplete at 2.8s.
 */
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export const OffThePacePreloader = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<'red' | 'glow' | 'fading'>('red');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('glow'), 500);
    const t2 = setTimeout(() => setPhase('red'), 1300);
    const t3 = setTimeout(() => setPhase('fading'), 2100);
    const t4 = setTimeout(() => onComplete(), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onComplete]);

  const isFading = phase === 'fading';
  const isGlowing = phase === 'glow';

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-light-text)',
        opacity: isFading ? 0 : 1,
        transition: 'opacity 0.8s ease-in-out',
        pointerEvents: isFading ? 'none' : 'auto',
      }}
    >
      <img
        src="/assets/f1.svg"
        alt="F1"
        style={{
          width: '40vw',
          maxWidth: '400px',
          height: 'auto',
          filter: isGlowing ? 'drop-shadow(0 0 40px rgba(225, 6, 0, 1))' : 'none',
          transition: 'filter 0.5s ease-in-out',
        }}
      />
    </div>,
    document.body
  );
};
