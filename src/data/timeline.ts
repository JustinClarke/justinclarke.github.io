/**
 * data/timeline.ts the combined career + education timeline entries.
 *
 * Fits in: read by the CareerTimeline section. Unlike portfolio.ts, this file
 *          defines its OWN `Entry` type here (it isn't shared via @/types).
 * Note:    `start`/`end` are decimal years (e.g. 2024.0) so the timeline can
 *          position and overlap entries on a numeric axis; `concurrent` links
 *          entries that ran at the same time.
 *
 * For beginners ----------------------------------------------------------------
 * `interface Entry { ... }` describes the shape of one timeline item; `ENTRIES`
 * below is the array of them. A `?` after a field (badge?, ongoing?) marks it
 * optional that item may or may not include it.
 * -----------------------------------------------------------------------------
 */
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
    badge: 'Distinction',
    tags: ['C/C++', 'Algorithms', 'Maths'],
    bullets: [
      'Algorithms, optimisation, and advanced mathematics. Entered the workforce in the final years - Drop and LiteStore both began before graduation.',
    ],
  },
];
