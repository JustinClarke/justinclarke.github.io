# The Replication Blueprint: Building the Cinematic HUD Portfolio

This document contains the exact technical blueprints, code logic, and engineering protocols required to reconstruct the Justin Clarke portfolio from absolute zero. 

---

## Phase 0: System Architecture & Dependencies
To replicate the environment, initialize a Vite project with the following core stack:

- **Runtime**: React 18+ with TypeScript
- **Styling**: Tailwind CSS 3.4+
- **Animation**: Framer Motion 11+
- **Icons**: Lucide React
- **Dev Tooling**: PostCSS, Autoprefixer

---

## Phase 1: The Design DNA (Tailwind Config)
The entire HUD aesthetic relies on these specific design tokens. Replace your `tailwind.config.js` with this specification:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'brand-bg': '#070707',
        'brand-primary': '#00c8b4',
        'brand-amber': '#f59e0b',
        'brand-purple': '#a855f7',
      },
      fontFamily: {
        noto: ['"Noto Sans"', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        playfair: ['"Playfair Display"', 'serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      backgroundImage: {
        'scanline': 'linear-gradient(to bottom, transparent 50%, rgba(0, 200, 180, 0.05) 51%)',
        'grid-pattern': 'radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: 1, filter: 'brightness(1)' },
          '50%': { opacity: 0.7, filter: 'brightness(1.5) blur(1px)' },
        }
      }
    },
  },
};
```

---

## Phase 2: Global Styling & Safari Fixes
The "Secret Sauce" for Safari smoothness is defined in `index.css`. 

### 2.1 The Optimized Accordion (CSS Grid)
**CRITICAL**: Do not animate height with JS. Use this Grid pattern:
```css
.exp-body {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 500ms cubic-bezier(0.16, 1, 0.3, 1);
}
.exp-body[data-open="true"] {
  grid-template-rows: 1fr;
}
.exp-body > div {
  overflow: hidden;
}
```

---

## Phase 3: The Neural Net Visual Engine
The background animation uses a custom Canvas loop. Replicate this logic exactly for the "Luminous" look.

### 3.1 Node Rendering (Halo + Core)
To mimic the glow without the `shadowBlur` performance tax:
```typescript
const drawNodes = (ctx, nodes, isDark) => {
  nodes.forEach(p => {
    // 1. Draw Halo (Outer Blur)
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = p.c;
    ctx.globalAlpha = isDark ? 0.15 : 0.1;
    ctx.fill();

    // 2. Draw Core (Sharp Point)
    ctx.beginPath();
    ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
    ctx.fillStyle = p.c;
    ctx.globalAlpha = isDark ? 0.7 : 0.5;
    ctx.fill();
  });
};
```

---

## Phase 4: Component Blueprints

### 4.1 Section Container Protocol
Every section must follow this width and padding hierarchy:
- **Outer Section**: `py-20 md:py-28`, `bg-brand-bg`, `border-t border-white/5`.
- **Inner Container**: `max-w-6xl`, `mx-auto`, `px-6 md:px-12`.
- **Header**: `mb-4 md:mb-6` margin after the section rule.

### 4.2 The Expertise Registry
Instead of a simple grid, use a "High-Density Table" layout:
1.  **Label Row**: Monospaced labels at `text-[10px]` with `0.4em` tracking.
2.  **Card Structure**: Translucent background (`bg-white/[0.03]`), corner brackets (`border-t border-l border-white/5`).
3.  **Skill Pills**: Use `inline-flex` with a fixed height and `scale-110` transition on hover.

---

## Phase 5: Interaction Engineering

### 5.1 The Reveal System
Use `IntersectionObserver` to trigger reveals. 
- **Settings**: `threshold: 0.1`.
- **Transition**: `opacity 1.2s`, `transform 1.2s` (ease-out).
- **Safari Rule**: Do NOT use `will-change`. It exhausts the layer limit.

### 5.2 Hover States (HUD Aesthetic)
- **Cursor**: Use a custom `12px` dot that follows the mouse with a `25px` outer ring (`backdrop-invert`).
- **Glows**: Always use `drop-shadow` CSS instead of SVG filters for hardware acceleration.

---

## Phase 6: Deployment & Payload
- **Images**: All brand logos must be converted to `.webp` (target <15kb per asset).
- **Fonts**: Use `font-display: swap` to prevent FOIT (Flash of Invisible Text).
- **Preloading**: Preload the **IBM Plex Mono** font as it is critical for the Terminal's "boot sequence" look.

---

## Conclusion
If you follow these tokens, use the CSS Grid expansion, and implement the Double-Draw canvas nodes, the resulting build will be indistinguishable from the original Justin Clarke portfolio-maintaining 60FPS performance on high-end desktop and mobile Safari alike.
