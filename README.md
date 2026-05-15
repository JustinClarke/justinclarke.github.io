# Justin Clarke: Cinematic HUD Portfolio & System Interface

> **System Status:** `[ VERIFIED ]` | **Core:** `React 19` | **Interface:** `Cinematic HUD v4.0`

This repository houses the source code for a high-fidelity, interactive personal portfolio designed as a **"Cinematic HUD" (Heads-Up Display)**. It is a live technical dossier for Justin Clarke, an Analytics Engineer and Full-Stack Developer, architected to demonstrate advanced frontend engineering, system simulation, and high-performance rendering. 

Rather than a static gallery of projects, this platform is a live demonstration of browser-based system simulation, high-performance rendering, and sophisticated UI/UX design patterns built to impress staff-level engineers and technical stakeholders.

---

## 1. PROJECT STRUCTURE & ARCHITECTURE

The application is structured to decouple pure logic from React rendering, ensuring scalability and testability.

```text
.
├── public/                 # Static assets (Resume PDF, vector graphics)
├── src/
│   ├── components/
│   │   ├── home/           # Core landing page logic (TerminalUI, TerminalEngine, SnakeGame)
│   │   ├── layout/         # High-level wrappers (Navigation, Layout, Footer)
│   │   ├── projects/       # Project-specific detail components & Case Studies
│   │   ├── modals/         # Contextual overlays (Contact, Resume interactions)
│   │   └── common/         # Reusable atomic UI elements (Buttons, Badges)
│   ├── ui/                 # "System UI" library (SpotlightCard, MagneticButton)
│   ├── hooks/              # Custom interaction logic (useParallax, useSpotlight, useTerminal)
│   ├── data/               # Centralized content manifest (Portfolio data, Skills, Projects)
│   ├── providers/          # Global state (Theme context, Modal context)
│   ├── utils/              # Pure utilities (Metrics formatting, ClassName merging, Animations)
│   ├── services/           # External API integrations (LLM routing, etc.)
│   ├── App.tsx             # Root routing logic (React Router 7)
│   └── index.css           # Global design tokens and Tailwind 4 configuration
├── tailwind.config.ts      # Legacy utility config (if applicable/migration layer)
├── vite.config.ts          # Advanced build pipeline & alias configuration
└── tsconfig.json           # Strict TypeScript enforcement
```

### Data Flow & System Interaction
The application operates on a **Uni-directional Data Flow** managed through React context and custom hooks:
1.  **Input:** The user interacts via the `TerminalUI` (keyboard simulation) or `SpotlightCard` elements (mouse/touch).
2.  **Processing:** Text input is filtered through the `TerminalEngine`-a pure TypeScript logic layer decoupled from React components-to resolve commands, fuzzy-match errors, or trigger side effects.
3.  **Model:** The `Portfolio Manifest` (`src/data/`) acts as the single source of truth for all career, education, and project metadata. UI components map over this static data.
4.  **Output:** React 19 renders the UI with optimized concurrent animations via **Framer Motion**, while **D3.js** handles high-density expertise pipeline visualizations.

### Core Design Patterns
-   **Engine-UI Separation:** The `TerminalEngine.ts` module allows for independent testing and complex command parsing without the overhead of React component lifecycles.
-   **Pipeline/Buffer Pattern:** Used in character-by-character terminal rendering to queue and sequence typed outputs safely without race conditions.
-   **Registry Pattern:** CLI commands and "funny errors" are registered in a central manifest, making the system easily extensible with new "Easter Eggs."
-   **HOC/Provider Pattern:** Modal states and theme variables are handled via top-level Providers to prevent prop-drilling across the deep component tree.

---

## 2. THE EXPERIENCE (VISUAL WALKTHROUGH)

The portfolio avoids standard web patterns in favor of an immersive "Command Center" feel.

### ⚡ The Boot Sequence
The interface initializes with a character-by-character terminal sequence, simulating a vintage CRT display.
- **Verification:** The system outputs `[ JUSTIN_CLARKE ] status: VERIFIED` in a high-contrast brand teal.
- **Telemetry:** Real-time metadata about Justin's current focus (e.g., `MBA candidate [+PL-300] in flight`) is streamed to the console.
- **Tactile Feedback:** Every character rendered uses a queued buffer system to maintain a "typed" rhythm, accompanied by subtle scanline overlays and backdrop blurs.

### ⌨️ The System Interface (CLI)
At the heart of the home screen is the **TerminalUI**, a fully functional command-line simulation.
- **Fuzzy Matching:** The engine resolves commands like `record`, `projects`, or `expertise` even if misspelled, using a custom logic-resolver.
- **Integrated Navigation:** Users can interact via traditional clicks or by typing. Typing a command like `record` triggers an "Elevator Scroll" that smoothly transports the viewport to the Career Dossier.
- **Placeholder Engine:** A dynamic placeholder cycles through suggested commands (e.g., `try typing "snake"`) to guide non-technical users.

### 🎯 Interactive HUD Elements
The site utilizes "Spotlight Cards" and "Magnetic Buttons" to create a premium, tactile feel.
- **Hover Micro-Animations:** Buttons subtly track the cursor's movement (magnetic effect), and cards react with a radial glow (spotlight effect) that illuminates technical metadata.
- **Glassmorphism:** The entire UI is built on a "Dark Mode First" philosophy, using translucent layers (`bg-black/20`) and heavy backdrop blurs to simulate a sophisticated software interface.

---

## 3. CORE MODULES & FEATURES

### 📊 Career Dossier (Interactive Timeline)
The `CareerTimeline` component replaces traditional resumes with a high-density vertical timeline.
- **Dossier Cards:** Each role is presented as a "Dossier," featuring a unique index (e.g., `01`, `02`) and high-contrast labels.
- **Accordion Logic:** Clicking a role expands a detailed impact report, powered by **Framer Motion** for physics-based layout transitions.
- **Technical Tags:** Skills are highlighted in a dedicated sidebar, allowing recruiters to quickly parse the tech stack used in each role (e.g., `Microsoft Fabric`, `SQL`, `Next.js`).

### 📈 Expertise Pipeline (D3.js Visualization)
The `ExpertisePipeline` is a data-driven visualization of technical proficiency.
- **Dynamic Scaling:** Powered by **D3.js**, it renders a graph of competencies where bar lengths and colors are mapped directly to quantitative skill data.
- **SVG Precision:** Unlike standard CSS bars, these are high-precision SVG elements that animate with sub-pixel accuracy, communicating data architecture expertise visually.

### 🎮 Snake_OS (The Hidden System)
Type `snake` into the terminal to trigger the **Snake_OS** module.
- **Integrated Environment:** The terminal output clears and morphs into a 20x20 game grid.
- **Optimized Logic:** The game runs at a 120ms tick rate, utilizing coordinate reuse to minimize garbage collection and ensure 60fps performance on all devices.
- **System Reboot:** Upon "Game Over" or manual exit, the terminal triggers a secondary boot sequence, returning the user to the core interface seamlessly.

---

## 4. DEEP DIVE: FEATURED CASE STUDIES

The portfolio highlights detailed case studies that demonstrate product engineering and analytics depth. These are rendered in cinematic, autoplaying HUD tabs that automatically pause on hover for readability.

### Project 01: Predictive Music Engine (MSc Distinction Project)
A high-fidelity recommendation engine utilizing vector-similarity modeling and acoustic feature analytics across a 1.2 Million track dataset.
- **The Problem:** Traditional collaborative filtering often fails at the "cold start" problem and lacks the granular acoustic depth required for nuanced discovery in niche genres.
- **The Approach:** Architected a hybrid model combining TF-IDF vectorized genre profiles with MinMax-scaled audio features (Energy, Valence, etc.). Implemented a weighted Cosine Similarity logic to rank 1.2M tracks against a dynamic user-profile vector.
- **The Outcome:** Engineered a functional predictive tool achieving a Distinction grade, delivering high-accuracy recommendations validated against the Spotify Million Playlist Dataset.
- **Stack & Metrics:** Python, Pandas, Scikit-Learn, Spotify API | 1.2M Songs Processed | 12D Feature Space.

### Project 02: LiteStore (Retail as a Service Platform)
A production serverless platform handling behavioral telemetry (GA4) and front-end optimization.
- **The Problem:** Slow page load times and poor SEO rankings were directly damaging user conversion and organic discovery for the retail platform.
- **The Approach:** Served as the sole engineer to build a serverless platform using Next.js, AWS, and Vercel implementing SSR and aggressive caching strategies throughout. Built event tracking and GA4 telemetry pipelines feeding conversion dashboards.
- **The Outcome:** Reduced load times from 3.0s to 0.6s and improved conversion rates by 20% within the first two weeks post-launch, validated via A/B experiments designed off telemetry insights.
- **Stack & Metrics:** Next.js, Tailwind, GA4, Vercel | 80% Load time reduction | 20% Conversion uplift | SSR Architecture.

---

## 5. TECHNICAL STACK & IMPLEMENTATION RATIONALE

| Layer | Technology | Engineering Rationale |
| :--- | :--- | :--- |
| **Framework** | `React 19` | Native support for `useActionState` and optimized concurrent rendering. Chosen to handle complex UI state without excessive re-renders. |
| **Styling** | `Tailwind CSS 4` | Leveraging the new CSS-first configuration and `@theme` variables for brand consistency. Prevents "Utility Soup" by centralizing brand colors (e.g., `--color-brand-primary`). |
| **Animations** | `Framer Motion 12` | Orchestrates complex "Layout IDs" to animate elements seamlessly between different DOM nodes and screen positions, achieving physics that CSS alone cannot. |
| **Data Viz** | `D3.js` | Industry-standard for complex, data-driven SVG rendering in the "Expertise Pipeline." Provides absolute control over paths and geometry. |
| **Bundler** | `Vite 6` | Sub-second HMR and multi-threaded Rollup builds. Produces highly optimized manual chunks. |
| **Icons** | `Lucide React` | High-performance, tree-shakeable SVG icons that align perfectly with the technical HUD aesthetic. |

### Performance & Accessibility Optimization
- **Manual Chunking:** Large libraries like Framer Motion and D3 are split into separate network chunks in `vite.config.ts` to ensure the initial "Boot Sequence" loads in under 1 second.
- **Accessibility Integration:** The system automatically detects `@media (prefers-reduced-motion: reduce)` and scales back high-frequency animations to maintain usability.
- **Responsive Geometry:** For components like the Snake game, absolute geometry and rigid `aspect-ratio: 1/1` wrappers ensure the game remains pixel-perfect and fair regardless of the viewport size, bypassing flexbox stretching.

---

## 6. SETUP, LOCAL DEVELOPMENT & DEPLOYMENT

### Prerequisites
- **Node.js**: v20.0.0 or higher
- **Package Manager**: `npm` (v9+) or `pnpm`
- **Environment**: macOS / Linux (Windows users should use WSL2 for terminal simulation parity)

### Installation
1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/JustinClarke/justinclarke.github.io.git
    cd justinclarke.github.io
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Variables**:
    Create a `.env` file in the root for any external integrations:
    ```env
    VITE_GEMINI_API_KEY=your_api_key_here # For AI routing features
    ```

### Local Development
-   **Start Dev Server**: `npm run dev` (Spins up Vite on port 3000 by default with sub-second HMR)
-   **Build for Production**: `npm run build`
-   **Preview Production Build**: `npm run preview`

### Deployment Strategy
This project is configured and optimized for **GitHub Pages**. 
- The `vite.config.ts` includes a `base: '/'` setting specifically for root-domain deployment. 
- The build pipeline produces a highly minified `dist/` folder with optimized manual chunks for React and Framer Motion to ensure lightning-fast Time-to-Interactive (TTI).

---

> Built with 🦾 by **Justin Clarke** - Analytics Engineer & Full-Stack Developer.
> **Note:** The "Cinematic HUD" uses high-frequency animations. It automatically respects `prefers-reduced-motion` settings to ensure accessibility for all users.
