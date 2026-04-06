/**
 * Signature "Studio" brand animation constants.
 * These values define the cinematic, hardware-accelerated feel of the portfolio.
 */

/**
 * The signature 'Velvet-Soft' Quartic curve.
 * Slightly more gradual finish than standard eases for a premium transition.
 */
export const SOFT_QUARTIC_EASE = [0.25, 1, 0.4, 1] as const;

/**
 * Standard duration for entrance animations.
 */
export const REVEAL_DURATION = 1.4;

/**
 * Common stagger variants for container-level animations.
 * Used in Feature grids and lists to reveal children sequentially.
 */
export const STAGGER_CHILDREN_VARIANTS = {
  hidden: { opacity: 0 },
  visible: (custom: { stagger?: number; delay?: number } = {}) => ({
    opacity: 1,
    transition: {
      staggerChildren: custom.stagger ?? 0.1,
      delayChildren: custom.delay ?? 0.1,
    },
  }),
};
