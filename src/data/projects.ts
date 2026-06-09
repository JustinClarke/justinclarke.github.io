import { Project } from '@/types';

export const projectsData: Project[] = [
  {
    id: "off-the-pace",
    projectType: 'data engineering',
    title: 'Off The Pace',
    tech: ['Python', 'dbt', 'ML', 'Fabric'],
    copy: 'Formula 1 telemetry pipeline utilizing FastF1 API and Microsoft Fabric for multi-season performance modeling.',
    fullDescription: 'Architecting a headless data engineering pipeline to ingest, transform, and model multi-season Formula 1 telemetry data. Utilizing the FastF1 API, Python, and dbt within a Microsoft Fabric environment to evaluate team pit stop strategies and race pace optimization.',
    visualDescription: "F1 telemetry dashboard displaying speed, throttle, and braking traces overlaid on circuit sector maps.",
    pageMetrics: [
      { val: '2.4M', label: 'Telemetry Rows' },
      { val: 'Medallion', label: 'Architecture' },
      { val: 'dbt', label: 'Transformations' },
      { val: 'XGBoost', label: 'Pace Model' },
    ],
    pageStatus: {
      text: 'In Development',
      color: 'bg-viz-mac-yellow',
      blink: true,
    }
  },
  {
    id: "litestore",
    projectType: 'production saas',
    title: 'Retail as a Service',
    tech: ['Next.js', 'Tailwind', 'GA4', 'Vercel'],
    copy: 'Full-stack serverless platform for mid-market retail. Achieved 0.6s LCP via edge caching and 20% conversion uplift through A/B experimentation.',
    fullDescription: 'Sole engineer on a production serverless platform. Built event tracking and GA4 telemetry pipelines feeding conversion dashboards, achieving a 20% conversion uplift via A/B experiments and 0.6s page loads.',
    visualDescription: "Serverless architecture diagram showing Next.js SSR, AWS cloud infrastructure, and Vercel edge deployment for optimized retail performance.",
    pageMetrics: [
      { val: '80%', label: 'Load time reduction' },
      { val: '0.6s', label: 'P95 LCP' },
      { val: 'SSR', label: 'Architecture' },
    ],
    pageStatus: {
      text: 'Production',
      color: 'bg-litestore',
      blink: true,
    }
  },
  {
    id: "sql-disaster",
    projectType: 'relational architecture',
    title: 'Disaster Response System',
    tech: ['MySQL', 'OLAP', 'Data Modeling'],
    copy: 'MySQL relational engine modeled for Philippine disaster relief ops. 11 entities, composite PKs, OLAP-ready reporting layer.',
    fullDescription: 'Designed an 11-entity relational database system optimized for disaster relief logistics. Implemented complex schema constraints including composite primary keys, check constraints for resource validation, and junction tables for multi-agency resource allocation.',
    visualDescription: "Entity Relationship Diagram (ERD) showing complex junction tables and relational constraints for emergency resource management.",
    pageMetrics: [
      { val: '11', label: 'Entities' },
      { val: '47', label: 'Queries' },
      { val: '< 200ms', label: 'P95 Latency' },
    ],
    pageStatus: {
      text: 'Operational',
      color: 'bg-red-600',
      blink: true,
    }
  },
  {
    id: "spotify-engine",
    projectType: 'msc research',
    title: 'Spotify: Predictive Engine',
    tech: ['Python', 'Scikit-Learn', 'Vector Modeling'],
    copy: 'Hybrid recommendation engine utilizing TF-IDF genre vectorization and Cosine Similarity modeling across a 1.2M track acoustic dataset.',
    fullDescription: 'Architected a hybrid recommendation engine utilizing vector-space modeling (Cosine Similarity) and TF-IDF genre vectorization. Analyzed 12+ audio dimensions-including danceability, energy, and valence-across the Million Song Dataset (MSD) to deliver personalized discovery through multi-domain similarity logic.',
    visualDescription: "Multidimensional vector visualization showing the mapping of audio features (valence, energy, tempo) across the Million Song Dataset.",
    pageMetrics: [
      { val: '1.2M', label: 'Tracks Processed' },
      { val: '12D', label: 'Feature Space' },
      { val: 'Cosine', label: 'Vector Logic' },
    ],
    pageStatus: {
      text: 'Distinction',
      color: 'bg-brand-primary',
      blink: false,
    }
  },
  {
    id: "hr-archetype",
    projectType: 'behavioural ai',
    title: 'Behavioural Intelligence',
    tech: ['Gemini AI', 'Firestore', 'React'],
    copy: 'Workforce retention analytics platform detecting flight risk across 8 behavioural archetypes. Real-time risk scoring with Gemini AI-powered retention recommendations.',
    fullDescription: 'A workforce retention platform that classifies employee flight risk across 8 behavioural archetypes. Built with a 13-axis diagnostic engine, Gemini AI recommendations, and real-time risk prediction scoring.',
    visualDescription: "AI dashboard showing behavioural quadrant mapping and real-time employee retention risk analysis.",
    pageMetrics: [
      { val: '8', label: 'Risk Archetypes' },
      { val: '94%', label: 'Prediction Accuracy' },
      { val: '13-Axis', label: 'Diagnostic' },
    ],
    pageStatus: {
      text: 'Active',
      color: 'bg-green-500',
      blink: true,
    }
  },
];
