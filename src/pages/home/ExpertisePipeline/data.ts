/**
 * data.ts static data for the ExpertisePipeline section.
 *
 * SKILLS drives the three stage columns; ALL_EDGES defines the DAG topology;
 * NARRATIVES maps each node to the one-line lineage story shown in the console.
 *
 * For beginners ----------------------------------------------------------------
 * Content lives here, behaviour lives in the components add a skill or an
 * edge by editing these arrays, no component changes needed. This is a .ts
 * file (not .tsx), so it can't use JSX tags; the icons are therefore built
 * with React.createElement, which is exactly what JSX compiles into anyway:
 * createElement('svg', { props }, ...children) === <svg {...props}>...</svg>.
 * -----------------------------------------------------------------------------
 */
import React from 'react';
import {
  Workflow, LayoutDashboard, Target, Activity, Cpu,
  GitCompare, Layers, Hexagon, Gauge, MousePointerClick,
} from 'lucide-react';

export interface SkillItem {
  name: string;
  desc: string;
  icon: React.ReactNode;
}

// LEARN: each stage carries its colour three ways for three consumers:
//    `color`/`bg` are Tailwind class names dropped into className, while `rgb`
//    is raw "R, G, B" components for the --tech-rgb CSS variable and the SVG
//    edges, which need to mix their own alpha via rgba(var(--tech-rgb), …).
export interface SkillStage {
  cat: string;
  stage: string;
  title: string;
  color: string;
  bg: string;
  rgb: string;
  items: SkillItem[];
}

export const SKILLS: SkillStage[] = [
  {
    cat: 'Code & Logic',
    stage: 'Stage 1',
    title: 'Deep Query Logic & Infrastructure',
    color: 'text-brand-primary',
    bg: 'bg-brand-primary',
    rgb: '0, 200, 180',
    items: [
      {
        name: 'SQL',
        desc: 'Core querying and transformation engine.',
        icon: React.createElement('svg', { viewBox: '0 0 24 24', className: 'w-4 h-4 fill-none stroke-current', strokeWidth: '2.5', strokeLinecap: 'round', strokeLinejoin: 'round' },
          React.createElement('rect', { x: '3', y: '3', width: '18', height: '18', rx: '2', ry: '2' }),
          React.createElement('path', { d: 'M3 9h18' }),
          React.createElement('path', { d: 'M9 21V9' })
        ),
      },
      {
        name: 'Python',
        desc: 'For advanced data science, causal identification pipelines, and ML modeling.',
        icon: React.createElement('svg', { viewBox: '0 0 24 24', className: 'w-4 h-4 fill-current' },
          React.createElement('path', { d: 'M14.25.18c-.98-.08-1.97-.03-2.96-.03-.89.03-1.78-.05-2.66.12A6.52 6.52 0 003.88 5c-.75 1.54-.7 3.32-.7 4.97V11h3.1v-1.12c.03-1.6.86-3.23 2.45-3.66.92-.25 1.9-.12 2.85-.16h3.48c1.3-.04 2.47.88 2.68 2.18.23 1.45-.63 2.89-2.07 3.2-1 .2-2.03.11-3.04.12H9.08c-1.74.03-3.53.53-4.8 1.77a6.22 6.22 0 00-1.74 4.88c.07 1.63.76 3.23 2 4.25A7 7 0 009 23.95c1.47-.07 2.95 0 4.42-.03.73-.04 1.46.03 2.18-.1a6.38 6.38 0 00-4.55-4.43c.72-1.63.66-3.46.67-5.2V13h-3.1v1.17c-.03 1.5-.78 3.02-2.22 3.51-.9.3-1.89.17-2.83.2H9.17c-1.32.04-2.52-.89-2.73-2.2-.24-1.48.65-2.94 2.12-3.23 1.05-.2 2.12-.11 3.19-.12h3.58c1.8-.02 3.68-.53 4.96-1.86a6.39 6.39 0 001.7-5.08 6.46 6.46 0 00-2.32-4.7A7.32 7.32 0 0014.25.18zM8.34 3.03a1.16 1.16 0 11.02 2.33 1.16 1.16 0 01-.02-2.33zm7.32 15.61a1.16 1.16 0 11.02 2.33 1.16 1.16 0 01-.02-2.33z' })
        ),
      },
      {
        name: 'dbt',
        desc: 'Semantic layer, automated testing, and DAG lineage execution.',
        icon: React.createElement('svg', { viewBox: '0 0 24 24', className: 'w-4 h-4 fill-current' },
          React.createElement('path', { d: 'M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12zm0-21.75c-5.38 0-9.75 4.37-9.75 9.75a9.72 9.72 0 0 0 2.22 6.17l.08.1.02.02c2.03 2.33 4.97 3.46 7.43 3.46 5.38 0 9.75-4.37 9.75-9.75 0-2.58-1.01-4.94-2.86-6.79A9.7 9.7 0 0 0 12 2.25zm0 13.5a3.75 3.75 0 1 1 3.75-3.75 3.75 3.75 0 0 1-3.75 3.75z' })
        ),
      },
      {
        name: 'Medallion Architecture',
        desc: 'The engineering standard for building structured multi-stage data lakes (Bronze → Silver → Gold).',
        icon: React.createElement(Layers, { className: 'w-4 h-4 stroke-[2.2]' }),
      },
      {
        name: 'DuckDB-Wasm',
        desc: 'Compiling serverless, in-browser columnar database engines to execute lightning-fast analytical queries directly at the edge.',
        icon: React.createElement('svg', { viewBox: '0 0 24 24', className: 'w-4 h-4 fill-none stroke-current', strokeWidth: '2.5' },
          React.createElement('path', { d: 'M12 3c-4.42 0-8 1.79-8 4s3.58 4 8 4 8-1.79 8-4-3.58-4-8-4z' }),
          React.createElement('path', { d: 'M4 7v5c0 2.21 3.58 4 8 4s8-1.79 8-4V7' }),
          React.createElement('path', { d: 'M4 12v5c0 2.21 3.58 4 8 4s8-1.79 8-4v-5' })
        ),
      },
    ],
  },
  {
    cat: 'Signals & BI',
    stage: 'Stage 2',
    title: 'Predictive Signals & Telemetry',
    color: 'text-purple-400',
    bg: 'bg-purple-500',
    rgb: '168, 85, 247',
    items: [
      {
        name: 'Power BI',
        desc: 'Enterprise business intelligence, DAX modeling, and analytical distribution.',
        icon: React.createElement('svg', { viewBox: '0 0 24 24', className: 'w-4 h-4 fill-current' },
          React.createElement('rect', { x: '3', y: '10', width: '4', height: '11', rx: '1' }),
          React.createElement('rect', { x: '10', y: '5', width: '4', height: '16', rx: '1' }),
          React.createElement('rect', { x: '17', y: '1', width: '4', height: '20', rx: '1' })
        ),
      },
      {
        name: 'Microsoft Fabric',
        desc: 'Unified SaaS Lakehouse environments and modern data platform orchestration.',
        icon: React.createElement(Hexagon, { className: 'w-4 h-4 stroke-[2.2]' }),
      },
      {
        name: 'Causal Inference',
        desc: 'Moving beyond correlation to isolate true variables using advanced econometrics (e.g., Frisch-Waugh-Lovell detrending).',
        icon: React.createElement(Workflow, { className: 'w-4 h-4 stroke-[2.2]' }),
      },
      {
        name: 'Telemetry Platforms',
        desc: 'Processing multi-axis structural parameters down to high-performance operational metrics.',
        icon: React.createElement(Gauge, { className: 'w-4 h-4 stroke-[2.2]' }),
      },
      {
        name: 'XGBoost / ONNX',
        desc: 'Training production machine learning models and exporting them for zero-cloud client-side runtime inference.',
        icon: React.createElement('svg', { viewBox: '0 0 24 24', className: 'w-4 h-4 fill-none stroke-current', strokeWidth: '2.5', strokeLinecap: 'round', strokeLinejoin: 'round' },
          React.createElement('path', { d: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' })
        ),
      },
    ],
  },
  {
    cat: 'Product & Growth',
    stage: 'Stage 3',
    title: 'Product Analytics & Applications',
    color: 'text-rose-400',
    bg: 'bg-rose-500',
    rgb: '251, 113, 133',
    items: [
      {
        name: 'React',
        desc: 'Building the front-end application layer, custom dashboard chrome, and design system tokens.',
        icon: React.createElement('svg', { viewBox: '-11.5 -10.23 23 20.47', className: 'w-4 h-4 fill-none stroke-current', strokeWidth: '1.5' },
          React.createElement('ellipse', { rx: '11', ry: '4.2' }),
          React.createElement('ellipse', { rx: '11', ry: '4.2', transform: 'rotate(60)' }),
          React.createElement('ellipse', { rx: '11', ry: '4.2', transform: 'rotate(120)' }),
          React.createElement('circle', { r: '2', fill: 'currentColor' })
        ),
      },
      {
        name: 'KPI Development',
        desc: 'Designing custom, unified analytical metrics tailored to clear business domain definitions.',
        icon: React.createElement(Target, { className: 'w-4 h-4 stroke-[2.2]' }),
      },
      {
        name: 'Event Tracking',
        desc: 'Constructing clean client event collection architectures (e.g., PostHog / Plausible primitives).',
        icon: React.createElement(MousePointerClick, { className: 'w-4 h-4 stroke-[2.2]' }),
      },
      {
        name: 'Data Products',
        desc: 'Packaging complex analytics backend pipelines into standalone, consumer-facing software.',
        icon: React.createElement(Cpu, { className: 'w-4 h-4 stroke-[2.2]' }),
      },
      {
        name: 'A/B Testing',
        desc: 'Designing, deploying, and tracking statistically rigorous framework experiments to drive growth.',
        icon: React.createElement(GitCompare, { className: 'w-4 h-4 stroke-[2.2]' }),
      },
    ],
  },
];

// LEARN: `[string, string][]` is an array of two-element tuples each entry
//    is one arrow in the diagram, [from, to], matched by skill NAME, so the
//    names here must spell skills in SKILLS exactly.
export const ALL_EDGES: [string, string][] = [
  ['DuckDB-Wasm', 'Telemetry Platforms'],
  ['Telemetry Platforms', 'React'],
  ['Telemetry Platforms', 'Data Products'],
  ['Python', 'XGBoost / ONNX'],
  ['Python', 'Causal Inference'],
  ['XGBoost / ONNX', 'A/B Testing'],
  ['Causal Inference', 'A/B Testing'],
  ['Medallion Architecture', 'Microsoft Fabric'],
  ['Microsoft Fabric', 'KPI Development'],
  ['Microsoft Fabric', 'Event Tracking'],
  ['SQL', 'Power BI'],
  ['SQL', 'Microsoft Fabric'],
  ['Power BI', 'KPI Development'],
  ['dbt', 'Microsoft Fabric'],
  ['dbt', 'Causal Inference'],
];

export const NARRATIVES: Record<string, string> = {
  'SQL': 'Core query logic → BI distribution → unified KPI framework',
  'Python': 'ML models + causal identification → rigorous A/B experimentation',
  'dbt': 'Semantic transforms → causal models + KPI definitions',
  'Medallion Architecture': 'Enterprise lakehouse → standardized KPIs + event tracking',
  'DuckDB-Wasm': 'Edge compute → telemetry dashboards → React data products',
  'Power BI': 'SQL data ingestion → Power BI semantic models → unified KPI definitions',
  'Microsoft Fabric': 'Multi-source integration → unified Fabric Lakehouse → metric outputs',
  'Causal Inference': 'Experimental & observational data → causal models → A/B validation',
  'Telemetry Platforms': 'High-frequency telemetry → DuckDB-Wasm → React analytical apps',
  'XGBoost / ONNX': 'Python model training → ONNX client-side runtime → edge testing',
  'React': 'Telemetry & dashboard data → high-fidelity React UI layers',
  'KPI Development': 'Standardized enterprise logic → BI dashboards & Fabric telemetry',
  'Event Tracking': 'User interactions → Fabric ingestion → product growth analytics',
  'Data Products': 'Embedded analytical engines → fully packaged client-facing applications',
  'A/B Testing': 'Statistically rigorous experimental paths → causal framework validation',
};
