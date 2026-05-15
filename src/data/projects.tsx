import React from 'react';
import { Project } from '@/types';
import {
  LiteStoreHeroVisual,
  SpotifyHeroVisual,
  FinanceHeroVisual,
  HRArchetypeHeroVisual,
  SqlHeroVisual
} from '@/components/projects/Visuals';

/**
 * Centralized database of featured and academic projects.
 * Using high-fidelity engineering facts for maximum information density.
 */
export const projectsData: Project[] = [
  {
    id: "litestore",
    projectType: 'Production SaaS',
    title: 'Retail as a Service',
    tech: ['Next.js', 'Tailwind', 'GA4', 'Vercel'],
    copy: 'Full-stack serverless platform for mid-market retail. Achieved 0.6s LCP via edge caching and 20% conversion uplift through A/B experimentation.',
    fullDescription: 'Sole engineer on a production serverless platform. Built event tracking and GA4 telemetry pipelines feeding conversion dashboards, achieving a 20% conversion uplift via A/B experiments and 0.6s page loads.',
    visual: <LiteStoreHeroVisual />,
    heroVisual: <LiteStoreHeroVisual />,
    visualDescription: "Serverless architecture diagram showing Next.js SSR, AWS cloud infrastructure, and Vercel edge deployment for optimized retail performance.",
    pageMetrics: [
      { val: '80%', label: 'Load time reduction' },
      { val: '0.6s', label: 'P95 LCP' },
      { val: 'SSR', label: 'Architecture' },
    ],
    pageStatus: {
      text: 'Production',
      color: 'bg-[#7e7ca6]',
      blink: true,
    }
  },
  {
    id: "sql-disaster",
    projectType: 'Relational Architecture',
    title: 'Disaster Response System',
    tech: ['MySQL', 'OLAP', 'Data Modeling'],
    copy: 'MySQL relational engine modeled for Philippine disaster relief ops. 11 entities, composite PKs, OLAP-ready reporting layer.',
    fullDescription: 'Designed an 11-entity relational database system optimized for disaster relief logistics. Implemented complex schema constraints including composite primary keys, check constraints for resource validation, and junction tables for multi-agency resource allocation.',
    visual: <SqlHeroVisual />,
    heroVisual: <SqlHeroVisual />,
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
    projectType: 'MSc Research',
    title: 'Predictive Music Engine',
    tech: ['Python', 'Scikit-Learn', 'Vector Modeling'],
    copy: 'Hybrid recommendation engine utilizing TF-IDF genre vectorization and Cosine Similarity modeling across a 1.2M track acoustic dataset.',
    fullDescription: 'Architected a hybrid recommendation engine utilizing vector-space modeling (Cosine Similarity) and TF-IDF genre vectorization. Analyzed 12+ audio dimensions—including danceability, energy, and valence—across the Million Song Dataset (MSD) to deliver personalized discovery through multi-domain similarity logic.',
    visual: <SpotifyHeroVisual />,
    heroVisual: <SpotifyHeroVisual />,
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
    projectType: 'Behavioral AI',
    title: 'Behavioral Intelligence',
    tech: ['Gemini AI', 'Firestore', 'React'],
    copy: 'Workforce retention platform classifying employee flight risk across 8 behavioral archetypes with Gemini-powered logic and real-time sync.',
    fullDescription: 'A workforce retention platform that classifies employee flight risk across 8 behavioral archetypes. Built with a 13-axis diagnostic engine, Gemini AI recommendations, and sub-40ms real-time sync.',
    visual: <HRArchetypeHeroVisual />,
    heroVisual: <HRArchetypeHeroVisual />,
    visualDescription: "AI dashboard showing behavioral quadrant mapping and real-time employee retention risk analysis.",
    pageMetrics: [
      { val: '8', label: 'Archetypes' },
      { val: '40ms', label: 'Sync Latency' },
      { val: '13-Axis', label: 'Diagnostic' },
    ],
    pageStatus: {
      text: 'Sync_Active',
      color: 'bg-green-500',
      blink: true,
    }
  },
  {
    id: "capital-budgeting",
    projectType: 'Financial Engineering',
    title: 'Capital Architecture',
    tech: ['WACC', 'Excel', 'DCF', 'Sensitivity Analysis'],
    copy: 'Feasibility modeling for industrial maritime assets. comparative study of WACC adjustments versus long-term asset yield across 3 scenarios.',
    fullDescription: 'Engineering a ₱581M feasibility engine for maritime dredging operations. A comparative study of cost-of-capital versus long-term asset yield, featuring WACC adjustments and sensitivity analysis.',
    visual: <FinanceHeroVisual />,
    heroVisual: <FinanceHeroVisual />,
    visualDescription: "Industrial financial dashboard visualizing NPV, IRR, and payback period for a multi-million peso capital asset.",
    pageMetrics: [
      { val: '24.8%', label: 'IRR Projected' },
      { val: '₱581M', label: 'CapEx Model' },
      { val: '3.2Y', label: 'Payback' },
    ],
    pageStatus: {
      text: 'Final Directive',
      color: 'bg-[#E6A100]',
      blink: false,
    }
  }
];
