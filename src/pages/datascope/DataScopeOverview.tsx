/**
 * DataScopeOverview.tsx
 * The flagship Apple Keynote & AWS Summit presentation for DataScope (/datascope).
 * Tailored to wow recruiters, sales executives, and lead AI & Data platform engineers.
 */
import { SEO } from '@/components/layout';
import { routeMeta } from '@/content';
import { DataScopeNav } from './components/ui/DataScopeNav';
import { KeynoteLighting } from './components/ui/KeynoteLighting';
import { DataScopeHero } from './components/hero/DataScopeHero';
import { ExecutivePillars } from './components/sections/ExecutivePillars';
import { ArchitectureTopology } from './components/sections/ArchitectureTopology';
import { DuckChatRepairLab } from './components/sections/DuckChatRepairLab';
import { GroundingLadderSection } from './components/sections/GroundingLadderSection';
import { EngineeringRigorStrip } from './components/sections/EngineeringRigorStrip';
import { DataScopeClosingCTA } from './components/sections/DataScopeClosingCTA';

export function DataScopeOverview() {
  return (
    <div
      data-theme-lock="dark"
      className="datascope-scope min-h-screen bg-[#07080b] text-white font-sans selection:bg-[#863bff]/40 selection:text-white overflow-x-hidden relative"
    >
      <SEO {...routeMeta('/datascope')} />

      {/* Persistent Keynote Navigation */}
      <DataScopeNav />

      {/* Atmospheric Stage Lighting & Grids */}
      <KeynoteLighting />

      {/* Content Flow */}
      <main className="relative z-10">
        <DataScopeHero />
        <ExecutivePillars />
        <ArchitectureTopology />
        <DuckChatRepairLab />
        <GroundingLadderSection />
        <EngineeringRigorStrip />
        <DataScopeClosingCTA />
      </main>
    </div>
  );
}
