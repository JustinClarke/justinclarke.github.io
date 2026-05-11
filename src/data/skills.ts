import { SkillGroup } from '@/types';

export const expertiseColumns: SkillGroup[] = [
  {
    index: '01',
    category: 'Languages & Engine',
    description: 'High-performance querying & logic',
    colorClass: 'lang',
    footerCountLabel: 'Query & Logic',
    skills: [
      { name: 'SQL', level: 100, sub: 'PostgreSQL · T-SQL · Query Optimization · CTEs' },
      { name: 'Python', level: 100, sub: 'Pandas · NumPy · scikit-learn · Automation' },
      { name: 'DAX', level: 100, sub: 'Power BI measures · Time Intelligence · Performance' },
      { name: 'REST APIs', level: 100, sub: 'Data Ingestion · Webhooks · Authentication' },
      { name: 'KQL', level: 100, sub: 'Real-time streams · Kusto · Time Series' },
    ],
  },
  {
    index: '02',
    category: 'Architecture & Infra',
    description: 'Data fabric & systems engineering',
    colorClass: 'cloud',
    footerCountLabel: 'Systems & Flow',
    skills: [
      { name: 'Microsoft Fabric', level: 100, sub: 'OneLake · Data Factory · Lakehouse · Pipelines' },
      { name: 'PostgreSQL', level: 100, sub: 'Relational modelling · JSONB · Indexing' },
      { name: 'AWS', level: 100, sub: 'S3 · EC2 · Lambda · Cloud Infrastructure' },
      { name: 'Docker', level: 100, sub: 'Containerization · Environment Isolation' },
      { name: 'Data Modelling', level: 100, sub: 'Star Schema · Snowflake · Normalization' },
    ],
  },
  {
    index: '03',
    category: 'Intelligence & BI',
    description: 'Advanced visualization & signals',
    colorClass: 'bi',
    footerCountLabel: 'Insights & Visuals',
    skills: [
      { name: 'Power BI', level: 100, sub: 'Dashboarding · Power Query · Workspace Admin' },
      { name: 'Mixpanel', level: 100, sub: 'Product Analytics · Funnels · Cohort Analysis' },
      { name: 'Excel', level: 100, sub: 'VBA · Power Pivot · Advanced Modelling' },
      { name: 'Dashboarding', level: 100, sub: 'UI/UX for Data · Storytelling · Interactivity' },
      { name: 'Reporting', level: 100, sub: 'Automated Delivery · Alerting · Quality Control' },
    ],
  },
  {
    index: '04',
    category: 'Product Strategy',
    description: 'Metrics, KPIs & product loop',
    colorClass: 'creative',
    footerCountLabel: 'Logic & Growth',
    skills: [
      { name: 'KPI Development', level: 100, sub: 'Business logic mapping · Goal Tracking' },
      { name: 'Product Analytics', level: 100, sub: 'User Journeys · Retention · Feature Adoption' },
      { name: 'Event Tracking', level: 100, sub: 'Telemetry Design · Schema Enforcement' },
      { name: 'Optimization', level: 100, sub: 'A/B Testing · Funnel Friction · Conversion' },
      { name: 'Measurement', level: 100, sub: 'Attribution · ROI · Predictive Signals' },
    ],
  },
];
