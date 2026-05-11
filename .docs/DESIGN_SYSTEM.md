# Design System Specification: The Justin Clarke HUD

## 1. Visual Foundation
The "HUD" (Heads-Up Display) aesthetic is built on high-contrast technical precision and atmospheric depth.

### 1.1 Color Tokens
| Name | Hex | Usage |
| :--- | :--- | :--- |
| **Brand BG** | `#070707` | Core background, absolute black. |
| **Brand Primary** | `#00c8b4` | Interactive elements, "Professional" accents, active states. |
| **Brand Amber** | `#f59e0b` | "Scholastic" markers, alerts, secondary progression. |
| **Brand Purple** | `#a855f7` | "Intelligence" and data-heavy metrics. |
| **White/5** | `rgba(255,255,255,0.05)` | Standard border utility for panel dividers. |
| **White/20** | `rgba(255,255,255,0.2)` | Tertiary text, muted labels. |

---

## 2. Typography & Type Hierarchy
We use a modular scale to ensure hierarchy in a data-dense environment.

### 2.1 Typeface Selection
- **Heading 1/2**: `Noto Sans` (900 weight) — Aggressive, cinematic impact.
- **Narrative**: `Inter` — High readability sans-serif for descriptions.
- **Accents**: `Playfair Display` (Italic) — Premium contrast within technical text.
- **Data/UI**: `IBM Plex Mono` — The "Technical" voice for coordinates, tags, and labels.

### 2.2 Global Font Scaling (Desktop)
- **Section Heading (H2)**: `text-7xl` (4.5rem / 72px) | Tracking: `-0.05em` | Leading: `0.9`.
- **Card Titles**: `text-xl` (1.25rem / 20px) | Weight: `Black` (900).
- **Sub-headings**: `text-[10px]` | Weight: `Bold` | Tracking: `Tighter`.
- **Technical Metadata**: `text-[9px]` | Weight: `Bold` | Tracking: `0.4em` (Wide).
- **Body Text**: `text-[11px]` | Weight: `Regular` | Leading: `Relaxed`.

---

## 3. UI Components & HUD Decor
Every UI element must reinforce the technical narrative.

### 3.1 Accent Brackets
Interactive cards use absolute-positioned 8x8px brackets in the corners (`top-0 left-0` and `bottom-0 right-0`).
- **Style**: `border-t border-l border-white/5` (Top Left).
- **Animation**: Color shift to `brand-primary` on hover.

### 3.2 Skill Pills
- **Base State**: `bg-white/5 border border-white/10 text-white/40`.
- **Hover State**: Hardware-accelerated `scale(1.1)`, white text shift, and subtle teal border pulse.

### 3.3 Terminal Text
- **Color**: `#00c8b4` for prompt symbols (`>`).
- **Scanlines**: Fixed overlay with `bg-scanline` and `opacity-[0.03]`.

---

## 4. Spacing & Grid System
The "Narrative Section" pattern is applied to all major blocks.

### 4.1 Section Padding
Standardized vertical spacing ensures a predictable scroll cadence.
- **Mobile**: `py-20` (80px).
- **Desktop**: `py-28` (112px).

### 4.2 Content Widths
- **Primary Narrative Flow**: `max-w-6xl` (1152px).
- **Horizontal Padding**: `px-6` (Mobile) / `px-12` (Desktop).

---

## 5. Animation Architecture
Performance-optimized motion that feels "buttery smooth" on Safari.

- **Dropdowns**: Use the **CSS Grid Transition** pattern (`0fr -> 1fr`) in `index.css`.
- **Reveals**: 1.2s ease-out transitions. No `will-change` hints on reveals.
- **Neural Net**: "Halo + Core" canvas draw loop with visibility-based pausing.
