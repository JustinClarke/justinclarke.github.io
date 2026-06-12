/**
 * config/constants.ts the single home for shared design constants and the
 * occasional bit of copy/config the UI reads (greetings, boot logs, timings).
 *
 * Fits in: imported wherever a fixed value is needed in JS (e.g. the Preloader).
 * Note:    per the project's Tailwind rule, colours here are CSS-variable
 *          references like 'var(--color-brand-primary)', NOT raw hex the real
 *          colour values live once in src/index.css's @theme block. This file is
 *          also the ONLY sanctioned place for JS colour constants.
 *
 * For beginners ----------------------------------------------------------------
 * These are plain exported values, not components. `as const` tells TypeScript
 * to treat the object as fixed and read-only (so, e.g., BREAKPOINTS.md is known
 * to be exactly 768, not just "a number"). Other files import what they need.
 * -----------------------------------------------------------------------------
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

export const OTHER_LANGUAGES = [
  "Hola", "Bonjour", "Hallo", "Ciao", "Olá", "Привет", "你好", "こんにちは", "안녕하세요", "مرحباً", "नमस्ते",
  "Merhaba", "Xin chào", "Cześć", "Hej", "Halo", "สวัสดี", "Γειά σου", "שלום", "Namaste",
  "Szia", "Ahoj", "Selam", "Sawubona", "Hujambo", "God dag", "Dia duit", "Bula"
];

export const BOOT_LOGS = [
  "[ OK ] [BOOT] CINEMATIC_HUD V4.2 LOADED SUCCESSFULLY.",
  "[ OK ] [DATA] DBT COMPILE → 6 LAYERS RESOLVED.",
  "[ OK ] [STRM] FABRIC EVENTHOUSE LISTENING ON :443.",
  "[ INFO ] [VITE] HMR UPDATE → /SRC/INDEX.CSS (X6)",
  "[ OK ] [GPU]  FRAME BUDGET LOCKED → 16.67MS.",
  "[ OK ] [USR]  VISITOR AUTHENTICATED → SESSION OPEN.",
];

export const PIPELINE_COLORS = ['var(--color-brand-primary)', 'var(--color-acc-cloud)', 'var(--color-acc-bi)'] as const;

export const GITHUB_USERNAME = 'JustinClarke';

export const PRELOADER_TIMELINE = {
  SLOW_PHASE_DURATION: 0.9,
  FAST_PHASE_DURATION: 0.6,
  STILLNESS_DURATION: 0.5,
  TOTAL_DURATION: 2.0,
  EXIT_DURATION: 1.2,
};
