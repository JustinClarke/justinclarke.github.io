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
    subtitle: 'Analytics Engineer',
    period: 'Jan 2024 – Dec 2025',
    start: 2024.0,
    end: 2025.0,
    tags: ['Microsoft Fabric', 'Power BI', 'SQL', 'Python'],
    metrics: [
      { value: '↓ 12+ hrs/wk', label: 'Manual work automated' },
      { value: 'End-to-end', label: 'Analytics loop ownership' },
    ],
    bullets: [
      'Designed and built analytics for clients across retail, F&B, and online services: SQL pipelines, Python transformations, Fabric workflows, and Power BI dashboards consolidating ordering and operational data',
      "Replaced a client's weekly reporting (~12 hrs/week) with standardised KPI models and near-real-time dashboards; drill-downs surfaced peak-hour delays that drove staffing changes and faster service turnaround",
      'Built automated refresh and validation across pipelines so reporting stayed reliable without intervention',
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
    tags: ['Next.js', 'AWS', 'Vercel', 'GA4'],
    concurrent: 'BTech → MSc',
    metrics: [
      { value: '↑ 20%', label: 'Conversion via A/B tests' },
      { value: '3.0s → 0.6s', label: 'Page load (SSR + caching)' },
    ],
    bullets: [
      'Sole engineer on a multi-tenant retail-as-a-service platform (Next.js, SSR, Vercel). 11 brands across 3 malls, live at litestore.in; GA4 telemetry layer built in, A/B experiments off that instrumentation drove a 20% conversion uplift',
      'Reduced page load 3.0s → 0.6s via CRA → Next.js migration and edge caching; the stack the client used to pitch ₹2.2 Cr+ GMV and 48-hour brand transitions',
      'Owned end-to-end: client comms, brand identity, Google Workspace admin, and hiring/onboarding my own replacement at handoff',
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
