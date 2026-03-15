import { Experience, Education, HeroMetadata, CloserMetadata } from '@/types';

export const experiences: Experience[] = [
  {
    index: '01',
    company: 'VNS Solutions',
    role: 'BI & Analytics Developer',
    year: 'Jan 2024 – Dec 2025',
    tag: 'Microsoft Fabric · Power BI · Python · SQL',
    details: [
      'Built end-to-end analytics for clients across retail, F&B, and online services; Fabric ingestion and notebook-based Python transformations feeding Power BI dashboards',
      'Replaced a client\'s manual weekly reporting (~12 hrs/week) with KPI models and real-time dashboards',
      'Built automated refresh and validation across pipelines so reporting stayed reliable without intervention',
    ],
  },
  {
    index: '02',
    company: 'LiteStore',
    role: 'Product & Analytics Developer',
    year: 'Apr 2021 – Apr 2023',
    tag: 'Next.js · AWS · MongoDB · GA4',
    details: [
      'Sole engineer on a short-term retail space booking platform (litestore.in); built full stack on Next.js + MongoDB + AWS across 10+ live locations',
      'Led CRA → Next.js migration with SSR and edge caching, reducing page load 3.0s → 0.6s',
      'GA4 instrumentation fed A/B experiments that drove a 20% conversion uplift',
      'Owned product, client communications, brand identity, hiring/onboarding my own replacement at handoff',
    ],
  },
  {
    index: '03',
    company: 'Drop',
    role: 'Frontend & Brand Developer',
    year: 'Jan 2021 – Apr 2021',
    tag: 'React · TypeScript',
    details: [
      'Built React surfaces for a smart-lockbox delivery product; owned backend services, CD pipeline, hosting, and brand identity as the sole technical and creative contributor.',
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
  bio: 'Data to decisions and decisions into products',
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
