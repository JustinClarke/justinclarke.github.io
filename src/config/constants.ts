/**
 * @fileoverview Centralized global design constants.
 */

export const THEME = {
  colors: {
    teal: 'var(--color-brand-primary)',
    black: 'var(--color-brand-bg)',
    white: 'var(--color-text-primary)',
  },
  spacing: {
    mobile: '24px',
    desktop: '36px',
    sectionGap: 'clamp(80px, 10vw, 150px)',
  },
  transition: {
    duration: 300,
    ease: [0.16, 1, 0.3, 1],
  },
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

export const CATEGORY_COLORS = {
  lang: 'var(--color-acc-lang)',
  cloud: 'var(--color-acc-cloud)',
  bi: 'var(--color-acc-bi)',
  creative: 'var(--color-acc-creative)',
} as const;
