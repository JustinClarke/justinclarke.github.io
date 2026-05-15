# Repository Cleanup Manifesto

This document outlines the unused code, legacy components, and redundant assets identified during the V3 "Cinematic HUD" overhaul. 

## 1. Unused Components (Safe to Delete)

### Home Section
- `src/components/home/HeroV2.tsx`: Replaced by the primary `HeroSection.tsx`.
- `src/components/home/hero/`: Entire directory can be removed if `HeroV2` was the only consumer of these specific sub-components (TerminalBody, TerminalHeader, etc. - **Wait**: check if `TerminalUI.tsx` uses them).
- `src/components/home/TerminalEngine.ts`: Verify if `TerminalUI.tsx` uses this or if it was specific to `HeroV2`.

### Featured Projects
- `src/components/projects/ProjectCard.tsx`: Legacy V1 card.
- `src/components/projects/ProjectCardV2.tsx`: Legacy V2 card.
- `src/components/projects/ProjectCardV3.tsx`: Redundant high-density card replaced by specialized `cards/` components.

## 2. CSS Audit (`src/index.css`)

The following keyframes and classes appear to be legacy artifacts from early design iterations:

- `@keyframes vinylSpin`: Used in early "Music" project concepts.
- `@keyframes orbitSpin35` / `orbitSpin48`: Used in older orbital node designs.
- `.hero-node-dot`: Review if the current `NeuralNetCanvas` still uses this class or handles it internally via Canvas API.

## 3. Asset Cleanup

- `public/resources/`: Ensure only the latest `Justin_Clarke_resume.pdf` is present.
- `public/images/`: Remove any static screenshots of projects that have been replaced by programmatic SVGs/Canvas visuals.

## 4. Proposed Execution Steps

1. **Grep Check**: Run `grep -r "ComponentPath" src` to confirm zero imports.
2. **File Deletion**: Remove files listed above.
3. **Index Cleanup**: Update `src/components/home/index.ts` and `src/components/projects/index.ts` to remove legacy exports.
4. **Tailwind Purge Check**: Ensure `tailwind.config.ts` doesn't have custom values for colors/spacing that were only used in the deleted components.

---
*Created: May 12, 2026*
