import { SkillGroup } from '@/shared/types';

export const expertiseColumns: SkillGroup[] = [
  {
    index: '01',
    category: 'Languages & Data',
    description: 'Core programming & data manipulation',
    colorClass: 'lang',
    footerCountLabel: '7 languages',
    skills: [
      { name: 'Python', level: 90, sub: 'Pandas · NumPy · scikit-learn · Matplotlib · Seaborn · Requests' },
      { name: 'SQL', level: 85, sub: 'PostgreSQL · T-SQL · query optimisation · stored procedures' },
      { name: 'TypeScript', level: 80, sub: 'React · Node.js · REST APIs · type safety' },
      { name: 'R', level: 75, sub: 'Statistical computing · research scripts' },
      { name: 'C/C++', level: 70, sub: 'Low-level systems · resource management' },
      { name: 'Java', level: 60, sub: 'Enterprise logic · cross-platform architecture' },
      { name: 'Flutter', level: 60, sub: 'Cross-platform mobile UI' },
    ],
  },
  {
    index: '02',
    category: 'Cloud & DevOps',
    description: 'Infrastructure, pipelines & deployment',
    colorClass: 'cloud',
    footerCountLabel: '7 platforms',
    skills: [
      { name: 'MS Fabric', level: 95, sub: 'Data Factory · Eventhouse · OneLake · Pipelines' },
      { name: 'Azure', level: 85, sub: 'Azure DevOps · ARM Templates · Azure AD · Resource Groups' },
      { name: 'Git/GitHub', level: 90, sub: 'Actions · CI workflows · branching strategies' },
      { name: 'CI/CD', level: 80, sub: 'GitHub Actions · automated testing · deployment pipelines' },
      { name: 'Next.js', level: 85, sub: 'SSR · Edge · App Router' },
      { name: 'Vercel', level: 82, sub: 'Edge network · preview deployments · serverless functions' },
      { name: 'AWS', level: 78, sub: 'Lambda · S3 · CloudFront · IAM' },
    ],
  },
  {
    index: '03',
    category: 'Analytics & BI',
    description: 'Querying, modelling & visualisation',
    colorClass: 'bi',
    footerCountLabel: '5 tools',
    skills: [
      { name: 'Power BI', level: 95, sub: 'DAX · Power Query · M language' },
      { name: 'KQL', level: 90, sub: 'Eventhouse · real-time streams · time series queries' },
      { name: 'MongoDB', level: 85, sub: 'Aggregation pipelines · Atlas · document modelling' },
      { name: 'Jupyter', level: 90, sub: 'Notebooks · EDA · data storytelling · visualisation' },
      { name: 'ML/Stats', level: 80, sub: 'Regression · classification · recommendation · clustering · scikit-learn' },
    ],
  },
  {
    index: '04',
    category: 'Design',
    description: 'UI, systems & visual production',
    colorClass: 'creative',
    footerCountLabel: '5 tools',
    skills: [
      { name: 'Figma', level: 90, sub: 'Components · auto-layout · prototyping' },
      { name: 'Adobe CC', level: 85, sub: 'Photoshop · Illustrator · Lightroom · Premiere · After Effects' },
      { name: 'UI/UX', level: 85, sub: 'Wireframing · user flows · design systems' },
      { name: 'Photography', level: 80, sub: 'Architecture · landscape · editorial' },
      { name: 'Illustration', level: 75, sub: 'Vector iconography · technical diagrams' },
    ],
  },
];
