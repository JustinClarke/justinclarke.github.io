/**
 * DocsGovernanceSection section "08 / Docs & Governance": three CI-workflow
 * cards, four documentation "pillar" cards, and an ADR strip with a docs link.
 *
 * Fits in: rendered by SourceView's final block.
 * Note:    Each CI workflow carries its own `style` object (token-based colours
 *          via color-mix) so the three cards read amber / blue / green.
 */
import React from 'react';
import { STATS, LINKS } from '../../data/projectStats';

interface DocsGovernanceSectionProps {
  id: string;
}

const CI_WORKFLOWS = [
  {
    name: 'dbt-ci.yml',
    desc: `Full dbt build + ${STATS.tests} tests on every PR. Fails if any test breaks or assert_lap_7term_identity drifts.`,
    badge: 'dbt + DuckDB',
    style: { color: 'var(--color-viz-warning)', borderColor: 'color-mix(in srgb, var(--color-viz-warning) 20%, transparent)', backgroundColor: 'color-mix(in srgb, var(--color-viz-warning) 5%, transparent)' },
  },
  {
    name: 'docs-ci.yml',
    desc: 'Reference drift check - git diff --exit-code on auto-generated schema docs. Docs can never drift from the live schema.',
    badge: 'Docusaurus',
    style: { color: 'var(--color-viz-info)', borderColor: 'color-mix(in srgb, var(--color-viz-info) 20%, transparent)', backgroundColor: 'color-mix(in srgb, var(--color-viz-info) 5%, transparent)' },
  },
  {
    name: 'ml-ci.yml',
    desc: `${STATS.mlTests} ML tests on every PR. ONNX parity check (atol=1e-5), leakage spine validation, calibration coverage assertion.`,
    badge: 'XGBoost + ONNX',
    style: { color: 'var(--color-viz-success)', borderColor: 'color-mix(in srgb, var(--color-viz-success) 20%, transparent)', backgroundColor: 'color-mix(in srgb, var(--color-viz-success) 5%, transparent)' },
  },
];

const DOC_PILLARS = [
  {
    title: 'Understand',
    desc: 'Narrative documentation  - thesis, design decisions, why each layer exists and what problem it solves.',
  },
  {
    title: 'Learn-dbt',
    desc: '13 chapters walking the DAG from Bronze to Gold. Each chapter is a dbt node with annotated SQL.',
  },
  {
    title: 'ML Docs',
    desc: '8 pages covering training, calibration, ONNX export, leakage probe, and the limitation register.',
  },
  {
    title: 'Auto-Reference',
    desc: `dbt-generated schema reference  - all ${STATS.dbtModels} models, columns, tests, lineage : CI-enforced to never drift.`,
  },
];

export const DocsGovernanceSection: React.FC<DocsGovernanceSectionProps> = ({ id }) => {
  return (
    <section id={id} className="w-full scroll-mt-32 reveal-element">
      <div className="max-w-6xl mx-auto py-16">
        <span className="font-jetbrains text-micro text-f1-red uppercase tracking-mega mb-4 block">
          08 / Docs & Governance
        </span>
        <h2 className="text-3xl md:text-4xl font-noto font-black text-text-primary uppercase tracking-tighter mb-4">
          Docusaurus + three CI workflows.<br />Docs can't drift.
        </h2>
        <p className="text-text-tertiary text-sm max-w-xl font-jetbrains leading-relaxed mb-10">
          The project ships a full Docusaurus site alongside the code  - four sections, ADR register, and a reference layer auto-generated from the dbt schema. A <code className="text-xs" style={{ color: 'var(--color-viz-success)' }}>git diff --exit-code</code> in CI ensures the reference never falls out of sync.
        </p>

        {/* Three CI workflows */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {CI_WORKFLOWS.map((wf) => (
            <div
              key={wf.name}
              className="border rounded-xl p-6 transition-all duration-300 hover:border-opacity-60"
              style={{ ...wf.style, borderWidth: '1px' }}
            >
              <div className="font-jetbrains text-xs font-bold uppercase tracking-wider mb-1" style={{ color: wf.style.color }}>
                {wf.name}
              </div>
              <div className="font-jetbrains text-micro uppercase tracking-widest text-text-tertiary mb-3">{wf.badge}</div>
              <p className="font-jetbrains text-fine text-text-tertiary leading-relaxed">{wf.desc}</p>
            </div>
          ))}
        </div>

        {/* Four doc pillars */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {DOC_PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="bg-graphite-800/30 border border-white/5 rounded-xl p-5 hover:border-white/10 hover:bg-graphite-800/60 transition-all duration-300"
            >
              <div className="font-jetbrains text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                {pillar.title}
              </div>
              <p className="font-jetbrains text-fine text-text-tertiary leading-relaxed">{pillar.desc}</p>
            </div>
          ))}
        </div>

        {/* ADR + links strip */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-white/[0.06]">
          <div className="font-jetbrains text-fine text-text-tertiary leading-relaxed">
            <span className="text-text-tertiary font-semibold">ADR register</span>  - architectural decisions recorded as numbered ADRs in <code className="text-text-tertiary">docs/adr/</code>. Each non-obvious design choice has an entry.
          </div>
          <a
            href={LINKS.docs}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 border border-white/15 text-text-tertiary hover:text-text-primary hover:border-white/30 font-jetbrains text-xs uppercase tracking-wider px-4 py-2.5 rounded transition-all duration-200"
          >
            Read the Docs →
          </a>
        </div>
      </div>
    </section>
  );
};
