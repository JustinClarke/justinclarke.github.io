/**
 * DataScopePage the DataScope + DuckChat case study (route /datascope).
 *
 * Fits in: one page ordered by depth. The hero is the product and a launch
 *          pad into the live app; each chapter after it goes a level deeper
 *          (engine, language, correctness, experiments, frontier), so the
 *          engineering gets more specific the further a reader goes.
 *          Lazy-loaded by App.tsx.
 * Note:    every claim and number is in data/datascopeData.ts with its source.
 *          `data-theme-lock="dark"` pins the subtree to the dark theme, and
 *          overflow-x-clip (not hidden) keeps the root from becoming a scroll
 *          container.
 */
import { SEO } from '@/components/layout';
import { TheCloser } from '@/components/layout/TheCloser';
import { routeMeta } from '@/content';
import { ChapterNav } from './components/ui/ChapterNav';
import { DataScopeHero } from './components/hero/DataScopeHero';
import { EngineChapter } from './components/sections/EngineChapter';
import { LanguageChapter } from './components/sections/LanguageChapter';
import { CorrectnessChapter } from './components/sections/CorrectnessChapter';
import { ExperimentsChapter } from './components/sections/ExperimentsChapter';
import { FrontierChapter } from './components/sections/FrontierChapter';
import { ClosingBand } from './components/sections/ClosingBand';

export function DataScopePage() {
  return (
    <div
      data-theme-lock="dark"
      className="min-h-screen overflow-x-clip bg-ds-canvas font-sans text-text-primary selection:bg-ds-amber/30 selection:text-text-primary"
    >
      <SEO {...routeMeta('/datascope')} />
      <ChapterNav />
      <main>
        <DataScopeHero />
        <EngineChapter />
        <LanguageChapter />
        <CorrectnessChapter />
        <ExperimentsChapter />
        <FrontierChapter />
        <ClosingBand />
      </main>
      <TheCloser />
    </div>
  );
}
