# Design System Specification: The Justin Clarke HUD

## 1. Visual Foundation
The "HUD" (Heads-Up Display) aesthetic is built on high-contrast technical precision and atmospheric depth.

### 1.1 Color Tokens
| Name | Hex | Usage |
| :--- | :--- | :--- |
| **Brand BG** | `#070707` | Core background, absolute black. |
| **Brand Primary** | `#00c8b4` | Interactive elements, "Professional" accents, active states. |
| **Brand Amber** | `#f59e0b` | "Academic" markers, alerts, secondary progression. |
| **Brand Purple** | `#a855f7` | "Intelligence" and data-heavy metrics. |
| **White/5** | `rgba(255,255,255,0.05)` | Standard border utility for panel dividers. |
| **White/20** | `rgba(255,255,255,0.2)` | Tertiary text, muted labels. |

---

## 2. Typography & Type Hierarchy
We use a modular scale to ensure hierarchy in a data-dense environment.

### 2.1 Typeface Selection
- **Heading 1/2**: `Noto Sans` (900 weight) - Aggressive, cinematic impact.
- **Narrative**: `Inter` - High readability sans-serif for descriptions.
- **Accents**: `Playfair Display` (Italic) - Premium contrast within technical text.
- **Data/UI**: `IBM Plex Mono` - The "Technical" voice for coordinates, tags, and labels.

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

## 4. Spacing & Layout Engine
We use a semantic layout engine to enforce consistency across the HUD. Avoid using ad-hoc tailwind padding/margin classes for top-level structures.

### 4.1 Spacing Tokens
| Token | Mobile | Desktop | Utility Equivalent |
| :--- | :--- | :--- | :--- |
| **Section Y** | `5rem` (80px) | `7rem` (112px) | `.section-layout` |
| **Container X** | `1.5rem` (24px) | `3rem` (48px) | `.container-layout` |
| **Narrative Gap** | `3rem` (48px) | `4.5rem` (72px) | `.narrative-gap` |
| **Component Gap** | `1.5rem` (24px) | `2rem` (32px) | `.component-gap` |

### 4.2 Layout Containers
- **Site Container** (`.site-container`): `max-w-6xl` (1152px) centered with standard X-padding.
- **Project Container** (`.project-container`): `max-w-7xl` (1280px) centered with standard X-padding.
- **Section Wrapper** (`.section-layout`): Applies standard vertical padding.

### 4.3 Narrative Structure
Every major section should follow this hierarchy:
```html
<section class="section-layout border-t border-white/5">
  <div class="site-container">
    <!-- Header -->
    <div class="narrative-gap border-b border-white/10 pb-12">
      <h2 class="...">...</h2>
    </div>
    <!-- Content -->
    <div class="grid ...">...</div>
  </div>
</section>
```

---

## 5. Animation Architecture
Performance-optimized motion that feels "buttery smooth" on Safari.

- **Dropdowns**: Use the **CSS Grid Transition** pattern (`0fr -> 1fr`) in `index.css`.
- **Reveals**: 1.2s ease-out transitions. No `will-change` hints on reveals.
- **Neural Net**: "Halo + Core" canvas draw loop with visibility-based pausing.
