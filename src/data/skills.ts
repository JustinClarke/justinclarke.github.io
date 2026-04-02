import { SkillGroup } from '@/shared/types';

export const expertiseColumns: SkillGroup[] = [
  {
    index: '01',
    category: 'Languages & Data',
    description: 'Core programming & data manipulation',
    colorClass: 'lang',
    footerCountLabel: '7 languages',
    skills: [
      { name: 'Python', level: 90, sub: 'Pandas · NumPy · scikit-learn · Matplotlib' },
      { name: 'SQL', level: 85, sub: 'PostgreSQL · T-SQL' },
      { name: 'TypeScript', level: 80, sub: 'React · Node.js' },
      { name: 'R', level: 75 },
      { name: 'C/C++', level: 70 },
      { name: 'Java', level: 60 },
      { name: 'Flutter', level: 60 },
    ],
  },
  {
    index: '02',
    category: 'Cloud & DevOps',
    description: 'Infrastructure, pipelines & deployment',
    colorClass: 'cloud',
    footerCountLabel: '6 platforms',
    skills: [
      { name: 'MS Fabric', level: 95 },
      { name: 'Azure', level: 85, sub: 'Azure DevOps · ARM Templates' },
      { name: 'Git/GitHub', level: 90, sub: 'Actions · branching' },
      { name: 'CI/CD', level: 80 },
      { name: 'Next.js', level: 85, sub: 'SSR · Edge · App Router' },
      { name: 'Vercel/AWS', level: 80 },
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
      { name: 'KQL', level: 90, sub: 'Eventhouse · real-time streams' },
      { name: 'MongoDB', level: 85, sub: 'Aggregation · Atlas' },
      { name: 'Jupyter', level: 90, sub: 'notebooks · EDA workflows' },
      { name: 'ML/Stats', level: 80, sub: 'regression · recommendation · clustering' },
    ],
  },
  {
    index: '04',
    category: 'Design & Creative',
    description: 'UI, systems & visual production',
    colorClass: 'creative',
    footerCountLabel: '5 tools',
    skills: [
      { name: 'Figma', level: 90, sub: 'components · auto-layout · prototyping' },
      { name: 'Adobe CC', level: 85, sub: 'Photoshop · Illustrator · Lightroom · Premiere' },
      { name: 'UI/UX', level: 85, sub: 'wireframing · user flows · design systems' },
      { name: 'Photography', level: 80 },
      { name: 'Illustration', level: 75 },
    ],
  },
];
