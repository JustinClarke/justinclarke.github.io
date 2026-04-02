/**
 * @fileoverview Centralized global design constants.
 */

export const THEME = {
  colors: {
    teal: '#00c8b4',
    black: '#0a0a0a',
    white: '#ffffff',
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
  lang: THEME.colors.teal,
  cloud: '#3b82f6',
  bi: '#8b5cf6',
  creative: '#ec4899',
} as const;
