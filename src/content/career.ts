/**
 * content/career.ts work history and education in both shapes the site uses:
 * the prose experience/education records (from the old data/portfolio.ts) and
 * the numeric-axis timeline entries (from the old data/timeline.ts).
 *
 * Fits in: CareerTimeline + TimelineCard read ENTRIES/Entry; the experience
 *          and education arrays are the longer-form records.
 * Note:    `start`/`end` on Entry are decimal years (e.g. 2024.25) so the
 *          timeline can position and overlap entries on a numeric axis;
 *          `concurrent` links entries that ran at the same time.
 * -----------------------------------------------------------------------------
 */
import { Experience, Education } from '@/types';

export const experiences: Experience[] = [
  {
    index: '01',
    company: 'VNS Solutions',
    role: 'Analytics Engineer',
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

export interface Entry {
  id: string;
  type: 'work' | 'edu';
  title: string;
  subtitle: string;
  period: string;
  start: number;
  end: number;
  badge?: string;
  ongoing?: boolean;
  tags: string[];
  bullets: string[];
  metrics?: { value: string; label: string }[];
  concurrent?: string;
}

export const ENTRIES: Entry[] = [
  {
    id: 'vns',
    type: 'work',
    title: 'VNS Solutions',
    subtitle: 'Analytics Consultant',
    period: 'Apr 2024 – Nov 2025',
    start: 2024.25,
    end: 2025.9,
    tags: ['Microsoft Fabric', 'Power BI', 'SQL', 'Python'],
    metrics: [
      { value: '↓ 12+ hrs/wk', label: 'Manual work automated' },
      { value: '~45m → ~20m', label: 'Report refresh time' },
    ],
    bullets: [
      'Assisted in building and modifying 12+ Power BI dashboards for ~8-10 clients, updating layouts and writing foundational DAX measures that automated reporting and saved roughly 12 hours/week of manual effort',
      'Extracted and transformed multi-million-record datasets using standard SQL queries and Power Query, cutting average report refresh times from ~45 minutes to ~20 minutes',
      'Performed manual data validation and reconciliation, comparing dashboard outputs against raw source data to ensure reporting accuracy across client accounts',
    ],
  },
  {
    id: 'litestore',
    type: 'work',
    title: 'LiteStore',
    subtitle: 'Product & Analytics Developer',
    period: 'Apr 2021 – Apr 2023',
    start: 2021.34,
    end: 2023.3,
    tags: ['Next.js', 'React', 'Tailwind CSS', 'GA4'],
    concurrent: 'BTech → MSc',
    metrics: [
      { value: '↑ 20%', label: 'Conversion via A/B tests' },
      { value: '3.0s → 0.6s', label: 'Page load (SSR + caching)' },
    ],
    bullets: [
      'Sole engineer for a Retail-as-a-Service platform serving 11 retail brands across 3 mall locations owning frontend architecture, multi-tenant theming, analytics, and client-facing feature delivery end-to-end',
      'Led the Create React App -> Next.js 12 migration, redesigning around statically pre-rendered routes (Pages Router + getStaticProps) for SEO-friendly storefronts and edge caching, cutting average page load from ~3.0s to 0.6s',
      'Instrumented Google Analytics 4 across the platform with staging/production env isolation, and used the analytics to drive A/B experiments that delivered a 20% conversion uplift',
    ],
  },
  {
    id: 'drop',
    type: 'work',
    title: 'Drop',
    subtitle: 'Frontend & Brand Developer',
    period: 'Jan – Apr 2021',
    start: 2021.0,
    end: 2021.28,
    tags: ['React', 'TypeScript'],
    concurrent: 'During BTech',
    bullets: [
      'Built React surfaces for a smart-lockbox delivery product: the courier-side OTP unlock flow and homeowner app screens for viewing deliveries and sharing one-time access codes with couriers',
    ],
  },
  {
    id: 'mba',
    type: 'edu',
    title: 'Birla Institute of Technology and Science, Pilani',
    subtitle: 'MBA in Business Analytics',
    period: 'Feb 2026 – 2028',
    start: 2026.1,
    end: 2028.5,
    ongoing: true,
    tags: ['Analytics', 'Strategy', 'ML'],
    bullets: [
      'Intersection of data analytics and business strategy. Evening programme - fully available for full-time roles.',
    ],
  },
  {
    id: 'msc',
    type: 'edu',
    title: 'Queen Mary, University of London',
    subtitle: 'MSc in Computer Science',
    period: '2022 – 2023',
    start: 2022.75,
    end: 2023.75,
    tags: ['Python', 'ML', 'Research'],
    bullets: [
      'Distinction in semi-structured data analysis · ML model for music recommendation · completed alongside the LiteStore Tech Lead role',
    ],
  },
  {
    id: 'btech',
    type: 'edu',
    title: 'Gandhi Institute of Technology and Management',
    subtitle: 'BTech, Computer Science & Engineering',
    period: '2018 – 2022',
    start: 2018.6,
    end: 2022.5,
    // badge: 'Distinction',
    tags: ['C/C++', 'Algorithms', 'Maths'],
    bullets: [
      'Algorithms, optimisation, and advanced mathematics. Entered the workforce in the final years - Drop and LiteStore both began before graduation.',
    ],
  },
];
