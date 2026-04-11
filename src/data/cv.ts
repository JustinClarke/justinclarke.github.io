import { Experience, Education, HeroMetadata, CloserMetadata } from '@/shared/types';

export const experiences: Experience[] = [
  {
    index: '01',
    company: 'VNS Solutions',
    role: 'Product Developer',
    year: 'Jan 2024 – Jan 2026',
    tag: 'Microsoft Fabric',
    details: [
      'Automated product telemetry ingestion using Microsoft Fabric data pipelines',
      'Reclaimed 12 hrs/week across 2 engineering teams through pipeline automation',
      'Built real-time dashboards in Power BI for stakeholder decision-making',
      'Architected end-to-end data flows using KQL and Eventhouse',
    ],
  },
  {
    index: '02',
    company: 'LiteStore',
    role: 'Technical Lead, Full Stack & Web Performance',
    year: 'Apr 2021 – Apr 2023',
    tag: 'Next.js · AWS',
    details: [
      'Led end-to-end development of a production serverless rental platform',
      'Reduced page load from 3.0s to 0.6s via SSR and aggressive caching',
      'Improved SEO ranking and conversion rates by 20% post-launch',
      'Architected on Next.js, AWS Lambda, and Vercel edge network',
    ],
  },
  {
    index: '03',
    company: 'Drop',
    role: 'Frontend Developer',
    year: 'Jan 2021 – Apr 2021',
    tag: 'React',
    details: [
      'Built and shipped frontend features for a consumer-facing product',
      'Worked within a fast-paced agile team across design and engineering',
    ],
  },
];

export const education: Education[] = [
  {
    type: 'Postgraduate',
    school: 'Birla Institute of Technology and Science',
    degree: 'MBA in Business Analytics',
    year: '2026 – 2028',
    badge: 'In Progress',
    note: 'Focusing on the intersection of data analytics and business strategy, applying machine learning and statistical methods to business problems',
    isOngoing: true,
  },
  {
    type: 'Postgraduate',
    school: 'Queen Mary University of London',
    degree: 'MSc in Computer Science',
    year: '2022 – 2023',
    badge: 'Distinction',
    note: 'Distinction in semi-structured data analysis. Built a predictive analytics model for music recommendation.',
  },
  {
    type: 'Undergraduate',
    school: 'Gandhi Institute of Technology and Management',
    degree: 'BTech in Computer Science & Engineering',
    year: '2018 – 2022',
    badge: 'Distinction',
    note: 'Algorithms, optimisation, and advanced mathematics. Researched encryption using quantum key generation.',
  },
];

export const heroMetadata: HeroMetadata = {
  role: 'Data Analyst & Full-Stack Engineer',
  name: 'Justin\nClarke',
  bio: 'Pipelines to dashboards\nEngineering to insights',
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
