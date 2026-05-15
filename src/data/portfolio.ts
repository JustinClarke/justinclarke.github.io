import { Experience, Education, HeroMetadata, CloserMetadata } from '@/types';

export const experiences: Experience[] = [
  {
    index: '01',
    company: 'VNS Solutions',
    role: 'Analytics Engineer',
    year: 'Jan 2024 – Jan 2026',
    tag: 'Microsoft Fabric · Power BI · SQL',
    details: [
      'Automated telemetry ingestion and reporting workflows, reducing manual analysis effort by 12+ hrs/week',
      'Owned product analytics loop: usage insights → architecture decisions → prioritised engineering initiatives',
      'Built KPI dashboards and operational reports (SQL, Python, and Power BI) to support faster decision-making',
      'Implemented event tracking analytics across customer-facing platforms to improve feature adoption visibility',
      'Developed backend APIs and internal tools supporting analytics and operational workflows',
    ],
  },
  {
    index: '02',
    company: 'LiteStore',
    role: 'Technical Lead, Full Stack & Web Performance',
    year: 'Apr 2021 – Apr 2023',
    tag: 'Next.js · AWS · Vercel',
    details: [
      'Sole engineer on a production serverless platform - BTech final year through MSc completion at Queen Mary',
      'Built event tracking and behavioural telemetry pipelines (GA4) feeding conversion + funnel dashboards',
      '↑ 20% conversion via A/B experiments designed off telemetry insights',
      'CI/CD pipelines with automated testing · 3.0s → 0.6s page load via SSR + caching',
    ],
  },
  {
    index: '03',
    company: 'Drop',
    role: 'Frontend Developer',
    year: 'Jan 2021 – Apr 2021',
    tag: 'React · TypeScript',
    details: [
      'Built and shipped React frontend features within a fast-paced agile team',
    ],
  },
];

export const education: Education[] = [
  {
    type: 'Postgraduate',
    school: 'Birla Institute of Technology and Science',
    degree: 'MBA in Business Analytics',
    year: 'Feb 2026 – 2028',
    badge: 'In Progress',
    note: 'Focusing on the intersection of data analytics and business strategy, applying machine learning and statistical methods to business problems.',
    isOngoing: true,
  },
  {
    type: 'Postgraduate',
    school: 'Queen Mary University of London',
    degree: 'MSc in Computer Science',
    year: '2022 – 2023',
    badge: 'Distinction',
    note: 'Distinction in semi-structured data analysis; built a predictive analytics model for music recommendation. Completed concurrently with full-time role at LiteStore.',
  },
  {
    type: 'Undergraduate',
    school: 'Gandhi Institute of Technology and Management',
    degree: 'BTech in Computer Science & Engineering',
    year: '2018 – 2022',
    badge: 'Distinction',
    note: 'Algorithms, optimisation, and advanced mathematics; researched encryption using quantum key generation.',
  },
];

export const heroMetadata: HeroMetadata = {
  role: 'Full-Stack · Analytics Engineer',
  name: 'Justin\nClarke',
  bio: 'I build pipelines and the products they power.',
  cta: 'Get in touch',
  tooltips: {
    role: "I've spent approximately 4,200 hours staring at pipelines. Most of them didn't leak.",
    name: "Fun fact: My terminal and I have a complicated relationship.",
    bio: "I specialise in moving data from place A to place B while making it look easy (it rarely is).",
    cta: "I respond faster than a Power BI refresh. Mostly.",
  }
};

export const closerMetadata: CloserMetadata = {
  heading: "Need a high-performance\ndata partner?",
  subHeading: "Currently open to new projects and engineering engagements.",
  email: "justinsavioclarke@outlook.com",
  brandLine: "built with ♥️ by Justin Clarke",
  tooltips: {
    email: "No recruiters were harmed in the making of this button",
    logo: "My core brand identity. Simple. Effective.",
  }
};
