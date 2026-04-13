import React from 'react';
import { Project } from '@/shared/types';
import {
  LtvVisual,
  LtvHeroVisual,
  TelemetryVisual,
  TelemetryHeroVisual,
  LiteStoreVisual,
  LiteStoreHeroVisual,
  SpotifyVisual,
  SpotifyHeroVisual
} from '@/components/projects/Visuals';

/**
 * Centalized database of featured and academic projects.
 */
export const projectsData: Project[] = [
  {
    id: 'ltv-analytics',
    projectType: 'Personal Project',
    title: 'Customer Lifetime Value Analytics',
    tech: ['Microsoft Fabric', 'Eventhouse', 'KQL', 'Power BI', 'Python'],
    copy: 'End-to-end LTV solution on Microsoft Fabric with real-time event processing and dynamic Power BI dashboards.',
    fullDescription: 'Built an end-to-end LTV solution on Microsoft Fabric: Lakehouse ingestion, real-time event processing via Eventhouse and KQL, surfaced through a dynamic Power BI dashboard. Automated data generation and exception handling via Python, enabling live segmentation and risk tracking.',
    visual: <LtvVisual />,
    heroVisual: <LtvHeroVisual />,
    visualDescription: "Real-time event flow diagram showing 4000+ events per second flowing through Eventhouse, KQL processing, and Power BI dashboards.",
    pageMetrics: [
      { val: '4K+', label: 'Events / sec' },
      { val: '7', label: 'Months tracked' },
      { val: 'Real-time', label: 'Processing' },
    ],
    pageStatus: {
      text: 'Pipeline active',
      color: 'bg-viz-success',
      blink: true,
    },
    caseStudy: {
      problem: 'No real-time visibility into customer lifetime value, making it impossible to segment and target high-value users dynamically.',
      approach: 'Built a real-time ingestion pipeline using Microsoft Fabric Eventhouse and KQL, visualised in dynamic Power BI dashboards.',
      outcome: 'Enabled live risk tracking and dynamic segmentation, improving marketing targeting efficiency across all user tiers.'
    }
  },
  {
    id: "spotify-engine",
    projectType: 'MSc Project',
    title: 'Neural Music Engine',
    tech: ['Python', 'Pandas', 'NumPy', 'Spotify API', 'ML Model'],
    copy: 'Python-based tool using Spotify API for personalised music recommendations via predictive analytics.',
    fullDescription: 'Python-based tool using Spotify API to analyse energy, key signatures, and acoustic properties for personalised music recommendations.',
    visual: <SpotifyVisual />,
    heroVisual: <SpotifyHeroVisual />,
    visualDescription: "Data visualization of audio features including energy, valence, and danceability from the Spotify API, modeled for predictive recommendations.",
    pageMetrics: [
      { val: 'Hybrid', label: 'Vector Logic' },
      { val: '20+', label: 'Audio Features' },
      { val: 'Cosine', label: 'Similarity' },
    ],
    pageStatus: {
      text: 'Academic',
      color: 'bg-acc-cloud',
      blink: false,
    },
    caseStudy: {
      problem: 'Standard collaborative filtering lacks depth needed a tool that analysed audio features for truly personalised discovery.',
      approach: 'Used Python, Pandas and the Spotify API to analyse energy, key signatures, and acoustic properties across track datasets.',
      outcome: 'Successfully built a predictive analytics model achieving Distinction grade highly personalised music recommendation output.'
    }
  },
  {
    id: "litestore",
    projectType: 'LiteStore',
    title: 'Retail as a Service',
    tech: ['Next.js', 'AWS', 'Vercel'],
    copy: 'Led end-to-end development of a production serverless platform, improving SEO and conversion rates.',
    fullDescription: 'Led end-to-end development of a production serverless platform. Reduced page load times (3s to 0.6s) through SSR, caching and optimisation, improving SEO rankings and conversion rates by 20%.',
    visual: <LiteStoreVisual />,
    heroVisual: <LiteStoreHeroVisual />,
    visualDescription: "Serverless architecture diagram showing Next.js SSR, AWS cloud infrastructure, and Vercel edge deployment for optimized retail performance.",
    pageMetrics: [
      { val: '80%', label: 'Load time reduction' },
      { val: '20%', label: 'Conversion uplift' },
      { val: 'SSR', label: 'Architecture' },
    ],
    pageStatus: {
      text: 'Production',
      color: 'bg-viz-info',
      blink: true,
    },
    caseStudy: {
      problem: 'Slow page load times and poor SEO rankings were directly damaging user conversion and organic discovery.',
      approach: 'Built a serverless platform using Next.js, AWS, and Vercel implementing SSR and aggressive caching strategies throughout.',
      outcome: 'Reduced load times from 3.0s to 0.6s and improved conversion rates by 20% within the first two weeks post-launch.'
    }
  },
  {
    id: "product-telemetry",
    projectType: 'VNS Solutions',
    title: 'Product Telemetry Intelligence',
    tech: ['Microsoft Fabric', 'Data Pipelines'],
    copy: 'Automated product telemetry ingestion using Microsoft Fabric data pipelines.',
    fullDescription: 'Automated product telemetry ingestion using Microsoft Fabric data pipelines, reclaiming 12 hrs/week across 2 teams and 4 stakeholders.',
    visual: <TelemetryVisual />,
    heroVisual: <TelemetryHeroVisual />,
    visualDescription: "Automated data pipeline flow showing telemetry ingestion from multiple sources into a centralized Microsoft Fabric lakehouse repository.",
    pageMetrics: [
      { val: '12', label: 'Hrs/week reclaimed' },
      { val: '2', label: 'Teams impacted' },
      { val: '4', label: 'Stakeholders' },
    ],
    pageStatus: {
      text: 'Pipeline active',
      color: 'bg-viz-success',
      blink: true,
    },
    caseStudy: {
      problem: 'Manual telemetry collection across multiple teams caused delayed insights and wasted engineering hours each sprint.',
      approach: 'Automated data ingestion and transformation using Microsoft Fabric Data Pipelines into a centralised telemetry repository.',
      outcome: 'Reclaimed 12 hours per week across 2 teams and 4 stakeholders, accelerating product iteration cycles significantly.'
    }
  }
];
