# Project Architecture & Master Case Study Record

## 1. Technical Stack & Tooling
The portfolio is engineered as a performance-first React single-page application.

- **Framework**: `Vite` + `React` (TypeScript).
- **Styling**: `Tailwind CSS` for utility-first design; `Vanilla CSS` for high-frequency transitions.
- **Motion**: `Framer Motion` (Complexity) + `CSS Grid/Keyframes` (Performance).
- **Icons**: `Lucide-React`.
- **Optimization**: `IntersectionObserver` for per-section animation pausing.

---

## 2. Directory Manifest
A detailed breakdown of the internal source structure.

- **`/documentation`**: Technical whitepapers, research findings, and design specifications.
- **`/src/components/home`**:
  - `HeroSection.tsx`: Command-line engine and boot sequence.
  - `CareerTimeline.tsx`: Performance-optimized accordion timeline.
  - `ExpertisePipeline.tsx`: High-density capability registry.
  - `NeuralNetCanvas.tsx`: Atmospheric backdrop animation logic.
- **`/src/components/projects`**:
  - `FeaturedProjects.tsx`: Tab-based case study showcase.
  - `Visuals.tsx`: Hardware-accelerated SVG/CSS project thumbnails.
- **`/src/data`**: The centralized truth for all site content, project metrics, and metadata.
- **`/src/hooks`**: Custom performance hooks (`useInView`, `useReducedMotion`).

---

## 3. Case Study: Detailed Metrics

### 3.1 Spotify Engine (Data Engineering)
- **Problem**: Visualizing real-time telemetry from vector resonance pipelines.
- **Solution**: High-performance canvas visualizations combined with data-dense HUD overlays.
- **Engineering Achievement**: Sub-40ms latency in rendering similarity analytics.

### 3.2 SQL Disaster (Database Architecture)
- **Problem**: Representing complex relational recovery models in a readable way.
- **Solution**: Custom `SqlErd` component with programmatic relationship connectors.
- **Technical Fact**: Includes full architectural disclaimers and multi-step recovery logic.

### 3.3 LiteStore (Full-Stack Optimization)
- **Problem**: 3.0s LCP (Largest Contentful Paint) in a multi-tenant retail environment.
- **Solution**: Refactored to Next.js with aggressive edge caching and SSR optimization.
- **Result**: 0.6s LCP (5x improvement).

---

## 4. Mobile-First Optimization Strategy
To maintain the cinematic feel on 375px screens:
- **Responsive Stack**: Elements shift from 2-column registries to single-column streams.
- **Font Reduction**: Headings scale from `7xl` down to `5xl`.
- **Canvas Scaling**: The Neural Net is scaled to `125%` and blurred slightly more to create depth on smaller viewports.

---

## 5. Maintenance Protocol
When adding new sections or projects:
1.  **Reference `DESIGN_SYSTEM.md`** for exact padding and font tokens.
2.  **Enforce `max-w-6xl`** on the container level.
3.  **Vet for Safari**: Check for `backdrop-blur` and `will-change` conflicts.
4.  **Pause on Hidden**: Ensure all new animations use the `isVisible` IntersectionObserver pattern.
