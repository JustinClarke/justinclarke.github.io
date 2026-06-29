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

// Off-the-Pace 7-term identity palette, raw hex for d3/canvas/SVG draw calls
// that cannot read CSS vars (the decomposition waterfall + dbt DAG). This is the
// sanctioned JS home and MUST mirror the --color-term-* tokens in src/index.css.
// Keys match IDENTITY_TERMS / fct_lap_residuals component columns.
export const TERM_COLORS = {
  fuel_component_s: '#475569',        // --color-term-fuel        (slate-600)
  compound_component_s: '#047857',    // --color-term-compound    (emerald-dark)
  rubber_component_s: '#065f46',      // --color-term-rubber      (emerald-800)
  ambient_component_s: '#2563eb',     // --color-term-ambient     (blue-600)
  constructor_component_s: '#334155', // --color-term-constructor (slate-700)
  dirty_air_tax_s: '#3b82f6',         // --color-term-dirty-air   (blue-bright)
  driver_skill_residual_s: '#e10600', // --color-term-driver      (f1-red)
} as const;

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

/**
 * StrokTalk case-study palette (src/pages/showcase/StrokTalkPage.tsx).
 * These raw hexes mirror the --color-strok-* tokens in @theme; they live here
 * (the sanctioned JS-hex home) because the colour-system swatches render each
 * value as literal on-screen text/swatch fill, so the hex IS the content.
 */
export const STROKTALK_PALETTE = [
  {
    hex: '#2ECC8F',
    name: 'Signal Mint',
    role: 'Primary · CTA',
    note: 'The brand green. Reserved for the one action that moves a patient forward Training, Complete, Update. One clear next step, never competing with itself.',
  },
  {
    hex: '#16A578',
    name: 'Deep Mint',
    role: 'Data · Progress',
    note: 'A weightier mint for the progress graph line and gradient anchors. It reads as "growth" on the history screen without shouting over the score.',
  },
  {
    hex: '#2D3540',
    name: 'Slate Ink',
    role: 'Text · Dark UI',
    note: 'Body copy and the heavy secondary buttons (Go ahead, I got it). Softer than pure black so long therapy sessions stay easy on tired eyes.',
  },
  {
    hex: '#EF5364',
    name: 'Coral Cue',
    role: 'Accent · Focus',
    note: 'Used on a single word in each prompt the same, Sort, below to point attention exactly where comprehension is being tested. Never decorative.',
  },
  {
    hex: '#F1F3F4',
    name: 'Cloud',
    role: 'Surface · Cards',
    note: 'The near-white card base. Generous neutral space lowers cognitive load and lets the 3D characters and one accent breathe.',
  },
] as const;

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

