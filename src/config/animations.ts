/**
 * @fileoverview Centralized Framer Motion variants and physics configurations.
 * Ensures consistent motion kinetics across the portfolio.
 */

export const SPRINGS = {
  soft: { type: 'spring', stiffness: 100, damping: 20 },
  snappy: { type: 'spring', stiffness: 300, damping: 30 },
  bouncy: { type: 'spring', stiffness: 400, damping: 10 },
} as const;

export const EASING = {
  quintic: [0.16, 1, 0.3, 1], // cinematic decel
  circOut: [0, 0.55, 0.45, 1],
  smooth: [0.22, 1, 0.36, 1],
} as const;

export const FADE_IN = {
  hidden: { opacity: 0 },
  visible: (i: number = 0) => ({
    opacity: 1,
    transition: { duration: 1.2, delay: i * 0.1, ease: EASING.smooth }
  }),
};

export const SLIDE_UP = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { 
      duration: 1.4, 
      delay: i * 0.1, 
      ease: EASING.quintic 
    }
  }),
};

export const STAGGER_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

/**
 * Specialized variants for specific UI components
 */
export const HERO_CONTENT_REVEAL = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.4,
      delay: custom,
      ease: EASING.quintic
    }
  })
};

export const REVEAL_BLOCK = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 1.2,
      delay: i * 0.05,
      ease: EASING.smooth
    }
  })
};

export const PRELOADER_EXIT = {
  initial: { opacity: 1 },
  exit: { 
    opacity: 0,
    scale: 1.05,
    filter: 'blur(20px)',
    transition: { 
      duration: 1.8, 
      ease: EASING.quintic
    }
  }
};

/**
 * Global hover interactions
 */
export const HOVER = {
  scale_micro: { scale: 1.02, transition: { duration: 0.2, ease: EASING.smooth } },
  scale_standard: { scale: 1.05, transition: { duration: 0.3, ease: EASING.smooth } },
  tap: { scale: 0.98 },
} as const;
