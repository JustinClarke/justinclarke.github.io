import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
        ibm: ["var(--font-ibm)", "monospace"],
        noto: ["var(--font-noto)", "sans-serif"],
        serif: ["var(--font-serif)", "serif"],
        playfair: ["var(--font-playfair)", "serif"],
      },
      colors: {
        brand: {
          primary: "var(--color-brand-primary)",
          bg: "var(--color-brand-bg)",
          card: "var(--color-brand-card)",
          modal: "var(--color-brand-modal)",
        },
        border: {
          studio: "var(--color-border-studio)",
          'studio-heavy': "var(--color-border-studio-heavy)",
        },
        term: {
          text: "var(--color-term-text)",
          grey: "var(--color-term-grey)",
          'grey-dim': "var(--color-term-grey-dim)",
          white: "var(--color-term-white)",
        },
        viz: {
          success: "var(--color-viz-success)",
          error: "var(--color-viz-error)",
          warning: "var(--color-viz-warning)",
          info: "var(--color-viz-info)",
          spotify: "var(--color-viz-spotify)",
        },
        light: {
          bg: "var(--color-light-bg)",
          border: "var(--color-light-border)",
          text: "var(--color-light-text)",
          'text-dim': "var(--color-light-text-dim)",
          'text-muted': "var(--color-light-text-muted)",
        },
      },
    },
  },
  plugins: [],
} satisfies Config
