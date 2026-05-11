import React from 'react';
import { Project } from '@/types';
import {
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
    id: "spotify-engine",
    projectType: 'MSc Project',
    title: 'Predictive Music Engine',
    tech: ['Python', 'Pandas', 'Scikit-Learn', 'Spotify API', 'Vector Modeling'],
    copy: 'High-fidelity recommendation engine utilizing vector-similarity modeling and acoustic feature analytics across a 1.2M track dataset.',
    fullDescription: 'Architected a hybrid recommendation engine utilizing vector-space modeling (Cosine Similarity) and TF-IDF genre vectorization. Analyzed 12+ audio dimensions—including danceability, energy, and valence—across the Million Song Dataset (MSD) to deliver personalized discovery through multi-domain similarity logic.',
    visual: <SpotifyVisual />,
    heroVisual: <SpotifyHeroVisual />,
    visualDescription: "Multidimensional vector visualization showing the mapping of audio features (valence, energy, tempo) across the Million Song Dataset.",
    pageMetrics: [
      { val: '1.2M', label: 'Songs Processed' },
      { val: '12D', label: 'Feature Space' },
      { val: 'Cosine', label: 'Similarity' },
    ],
    pageStatus: {
      text: 'Distinction Grade',
      color: 'bg-brand-primary',
      blink: false,
    },
    caseStudy: {
      problem: 'Traditional collaborative filtering often fails at the "cold start" problem and lacks the granular acoustic depth required for nuanced discovery in niche genres.',
      approach: 'Developed a hybrid model combining TF-IDF vectorized genre profiles with MinMax-scaled audio features (Energy, Valence, etc.). Implemented a weighted Cosine Similarity logic to rank 1.2M tracks against a dynamic user-profile vector.',
      outcome: 'Engineered a functional predictive tool achieving a Distinction grade, delivering high-accuracy recommendations validated against the Spotify Million Playlist Dataset.'
    }
  },
  {
    id: "litestore",
    projectType: 'LiteStore',
    title: 'Retail as a Service',
    tech: ['Next.js', 'Tailwind', 'GA4', 'Vercel'],
    copy: 'Sole engineer on a production serverless platform — behavioral telemetry (GA4) and 20% conversion uplift.',
    fullDescription: 'Sole engineer on a production serverless platform. Built event tracking and GA4 telemetry pipelines feeding conversion dashboards, achieving a 20% conversion uplift via A/B experiments and 0.6s page loads.',
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
  }
];
