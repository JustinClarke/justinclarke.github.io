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
  "[ OK ] [BOOT] SYSTEM_HUD V4.2 LOADED SUCCESSFULLY.",
  "[ OK ] [DATA] DBT COMPILE → 6 LAYERS RESOLVED.",
  "[ OK ] [STRM] FABRIC EVENTHOUSE LISTENING ON :443.",
  "[ INFO ] [VITE] HMR UPDATE → /SRC/INDEX.CSS (X6)",
  "[ OK ] [GPU]  FRAME BUDGET LOCKED → 16.67MS.",
  "[ OK ] [USR]  VISITOR AUTHENTICATED → SESSION OPEN.",
];

export const PIPELINE_COLORS = ['var(--color-brand-primary)', 'var(--color-acc-cloud)', 'var(--color-acc-bi)'] as const;

export const GITHUB_USERNAME = 'JustinClarke';

export const AI_AGENT = {
  proxyUrl: import.meta.env.VITE_AI_PROXY_URL || 'https://portfolio-ai.justinclarke.workers.dev',
  maxSessionQueries: 20,
  maxPromptLength: 500,
  maxHistoryTurns: 6,
  requestTimeoutMs: 30_000,
  // Short display label for the response footer. Backend runs Cloudflare Workers
  // AI: @cf/meta/llama-3.3-70b-instruct-fp8-fast (see worker/worker.js).
  model: 'llama-3.3-70b',
} as const;

export const PRELOADER_TIMELINE = {
  SLOW_PHASE_DURATION: 0.9,
  FAST_PHASE_DURATION: 0.6,
  STILLNESS_DURATION: 0.5,
  TOTAL_DURATION: 2.0,
  EXIT_DURATION: 1.2,
};

export const GAME_COLORS = {
  tetris: {
    shapes: [
      '#0ea5e9', // I (cyan-ish)
      '#3b82f6', // J (blue)
      '#f97316', // L (orange)
      '#eab308', // O (yellow)
      '#22c55e', // S (green)
      '#a855f7', // T (purple)
      '#ef4444'  // Z (red)
    ],
    bg: '#0a0a0a',
    grid: '#1a1a1a',
  },
  spaceInvaders: {
    bg: '#0a0a0a',
    player: '#00c8b4',
    bullet: '#ef4444',
    invaders: [
      '#fbbf24', // type 0
      '#a855f7', // type 1
      '#ef4444', // type 2
    ],
  },
  pong: {
    bg: '#111111',
    player: '#00c8b4',
    ai: '#ef4444',
  },
} as const;

export const LITESTORE_BRAND_TOKENS = [
  { name: 'LiteStore', hex: '#7e7ca6' },
  { name: 'MensXP', hex: '#ff5e03' },
  { name: 'Vitro', hex: '#2c4b35' },
  { name: 'WOW', hex: '#bc9850' },
  { name: 'Sleepycat', hex: '#ff6832' },
  { name: 'JBL', hex: '#ff3200' },
] as const;

export const SEO_THEME_COLORS = {
  dark: '#050505',
  light: '#ffffff',
} as const;

export const LINKEDIN_BANNER_COLORS = {
  dark: {
    frameBg: '#060608',
    profileBorder: '#060608',
    profileBg: 'radial-gradient(circle at 35% 35%, var(--color-term-text), #0d0d0d)',
    syntax: {
      keyword: '#c678dd',
      func: '#61afef',
      string: '#98c379',
      tag: '#e06c75',
      attr: '#d19a66',
    },
  },
  light: {
    outerBg: 'bg-[#f8fafc]',
    chartFill: '#e2e8f0',
    arrowGradEnd: '#0d9488',
    arrowHead: '#0d9488',
    titleDevGrad: 'linear-gradient(135deg, #0d9488, #4f46e5)',
    syntax: {
      keyword: '#a8229b',
      func: '#0277bd',
      string: '#2e7d32',
      tag: '#d84315',
      attr: '#ad7b00',
    },
  },
} as const;

