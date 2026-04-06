import { SkillGroup } from '@/shared/types';

export const expertiseColumns: SkillGroup[] = [
  {
    index: '01',
    category: 'Languages & Data',
    description: 'Core programming & data manipulation',
    colorClass: 'lang',
    footerCountLabel: '5 languages',
    skills: [
      { name: 'Python & R', level: 100, sub: 'Pandas · NumPy · scikit-learn · Statistical Research' },
      { name: 'SQL', level: 100, sub: 'PostgreSQL · T-SQL · query optimisation · stored procedures' },
      { name: 'C/C++', level: 100, sub: 'Low-level systems · resource management' },
      { name: 'Java', level: 100, sub: 'cross-platform architecture · Flutter' },
      { name: 'TypeScript', level: 100, sub: 'React · Node.js · REST APIs · type safety' },
    ],
  },
  {
    index: '02',
    category: 'Systems & Deploy',
    description: 'Infrastructure, pipelines & deployment',
    colorClass: 'cloud',
    footerCountLabel: '5 platforms',
    skills: [
      { name: 'CI/CD', level: 100, sub: 'GitHub Actions · automated testing · deployment pipelines' },
      { name: 'Git/GitHub', level: 100, sub: 'Actions · CI workflows · branching strategies' },
      { name: 'MongoDB', level: 100, sub: 'Aggregation pipelines · Atlas · document modelling' },
      { name: 'Next.js', level: 100, sub: 'SSR · Edge · App Router' },
      { name: 'Vercel', level: 100, sub: 'Edge network · serverless functions' },
    ],
  },
  {
    index: '03',
    category: 'Analytics & BI',
    description: 'Querying, modelling & visualisation',
    colorClass: 'bi',
    footerCountLabel: '5 tools',
    skills: [
      { name: 'Microsoft Fabric', level: 100, sub: 'Data Factory · Eventhouse · OneLake · Pipelines' },
      { name: 'Power BI', level: 100, sub: 'DAX · Power Query · M language' },
      { name: 'KQL', level: 100, sub: 'real-time streams · time series queries' },
      { name: 'ML/Stats', level: 100, sub: 'Regression · classification · clustering · scikit-learn' },
      { name: 'Jupyter', level: 100, sub: 'EDA · data storytelling · visualisation' },
    ],
  },
  {
    index: '04',
    category: 'Design',
    description: 'UI, systems & visual production',
    colorClass: 'creative',
    footerCountLabel: '5 tools',
    skills: [
      { name: 'Figma/Adobe XD', level: 100, sub: 'Components · auto-layout · prototyping' },
      { name: 'UI/UX', level: 100, sub: 'Wireframing · user flows · design systems' },
      { name: 'Illustration', level: 100, sub: 'Vector iconography · technical diagrams' },
      { name: 'Photography', level: 100, sub: 'Architecture · landscape · editorial' },
      { name: 'Adobe Creative Cloud', level: 100, sub: 'Photoshop · Illustrator · Lightroom · After Effects' },
    ],
  },
];
