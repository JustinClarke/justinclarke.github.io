# 04: Accessibility & Semantic HTML

## 🌫 The HUD Challenge
Styled HUD elements can create "noise" for screen readers. We must separate the visual glamour from the semantic structure.

### 1. Hide Decorative Chrome
Any element that is purely visual (grid lines, dots, ambient glows) must be hidden from Assistive Technology (AT):
```tsx
<div aria-hidden="true" className="absolute inset-0 bg-grid-pattern" />
```

### 2. Live Regions for Status Indicators
The HUD status indicators should notify AT when they change:
```tsx
<div role="status" aria-label="System status" aria-live="polite">
  <span>Module: DIS-REL-PH</span>
</div>
```

### 3. Landmark Structure
Ensure every page uses the `<main>` tag.
```tsx
<main id="main-content">
  {/* All page content goes here */}
</main>
```
Add a **Skip to Content** link at the top of `App.tsx` for keyboard users.

### 4. Semantic Lists and Figures
*   **Archetype Grid**: Render as a `<ul>` with `<li>` items.
*   **Code Blocks**: Wrap in `<figure>` with an `<figcaption className="sr-only">` describing the code's purpose.

### 5. MagneticButton Polymorphism
When using `MagneticButton` as a wrapper for an `<a>` tag, ensure the wrapper is hidden and the link carries the label:
```tsx
<MagneticButton as="div" aria-hidden="true">
  <a href="..." aria-label="Explore the SQL Disaster Response Project">
    Explore Project
  </a>
</MagneticButton>
```
