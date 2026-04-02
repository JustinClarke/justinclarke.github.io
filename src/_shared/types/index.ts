import { ReactNode } from 'react';

/**
 * @fileoverview Centralized TypeScript type and interface definitions.
 * Enforces strict schemas for project metadata and professional history.
 */

// ─── HERO & NAVIGATION TYPES ──────────────────────────────────────────────

/**
 * Metadata specifically for the primary landing Hero section.
 */
export interface HeroMetadata {
  /** The professional tagline (e.g., 'Full-Stack Engineer') */
  role: string;
  /** Full name for display */
  name: string;
  /** Short biographical hook */
  bio: string;
  /** Calls to action text */
  cta: string;
}

/**
 * Quick access project definitions for navigation rows.
 */
export interface QuickLink {
  /** Project ID mapping to projectsData */
  id: string;
  /** Short label for navigation */
  label: string;
}

// ─── PROFESSIONAL BACKGROUND TYPES ────────────────────────────────────────

/**
 * An individual technical skill with level metrics.
 */
export interface Skill {
  /** Primary technology name */
  name: string;
  /** Skill depth or proficiency (0-100 percentage) */
  level: number;
  /** Comma-separated secondary technologies or specific specializations */
  sub?: string;
}

/**
 * Categorized groups of professional skills for the Expertise Pipeline.
 */
export interface SkillGroup {
  /** Zero-padded index for grid ordering (e.g., '01') */
  index: string;
  /** Skill vertical (e.g., 'Languages', 'Cloud') */
  category: string;
  /** High-level summary of expertise in this area */
  description: string;
  /** Array of nested skill entries */
  skills: Skill[];
  /** Color-theming key for visual differentiation */
  colorClass: 'lang' | 'cloud' | 'bi' | 'creative';
  /** Label for the summary count in the footer */
  footerCountLabel: string;
}

/**
 * Represents a professional work experience entry for the accordion.
 */
export interface Experience {
  /** Zero-padded index for chronological ordering */
  index: string;
  /** Employer or Organization name */
  company: string;
  /** Official job title */
  role: string;
  /** Duration string (e.g., 'Jan 2024 – Present') */
  year: string;
  /** High-impact technology highlight */
  tag: string;
  /** Bullet points of key achievements and technical contributions */
  details: string[];
}

/**
 * Represents an academic background entry.
 */
export interface Education {
  /** Program tier (e.g., 'Postgraduate', 'Undergraduate') */
  type: string;
  /** Academic institution name */
  school: string;
  /** Full degree name */
  degree: string;
  /** Graduation or duration year */
  year: string;
  /** Academic standing or status (e.g., 'Distinction', 'In Progress') */
  badge: string;
  /** Summary of key research or focus areas */
  note: string;
  /** Visual indicator for ongoing studies */
  isOngoing?: boolean;
}

// ─── PORTFOLIO PROJECT TYPES ──────────────────────────────────────────────

/**
 * Standardized key performance indicators (KPIs) for project dashboards.
 */
export interface ProjectMetric {
  /** Quantitative value (e.g., '80%', '12') */
  val: string;
  /** Descriptive label (e.g., 'Improvement', 'Stakeholders') */
  label: string;
}

/**
 * Pipeline/Deployment status indication for project footers.
 */
export interface ProjectStatus {
  /** Status text (e.g., 'Production', 'Academic') */
  text: string;
  /** Tailwind background color class */
  color: string;
  /** Whether the status indicator should have a pulse animation */
  blink: boolean;
}

/**
 * Narrative structure for high-fidelity case studies.
 */
export interface ProjectCaseStudy {
  /** The business or technical challenge */
  problem: string;
  /** The specific technical methodology and execution */
  approach: string;
  /** The measurable quantitative and qualitative results */
  outcome: string;
}

/**
 * Core entity representing a portfolio project.
 */
export interface Project {
  /** Unique kebab-case identifier for routing and URL logic */
  id: string;
  /** High-level project category (e.g., 'Personal Project') */
  projectType: string;
  /** The full title of the project */
  title: string;
  /** Array of primary technologies used */
  tech: string[];
  /** High-impact executive summary */
  copy: string;
  /** Optional summary highlight metric for the grid view */
  metric?: { num: string; label: string };
  /** Comprehensive technical description */
  fullDescription: string;
  /** High-performance visual component for the preview card */
  visual: ReactNode;
  /** Immersive visual component for the dashboard header */
  heroVisual: ReactNode;
  /** Screen reader description for accessibility audits */
  visualDescription?: string;
  /** Array of KPIs relevant to the project success */
  pageMetrics?: ProjectMetric[];
  /** Live status or environment indicator */
  pageStatus?: ProjectStatus;
  /** Full narrative case study details */
  caseStudy?: ProjectCaseStudy;
}

// ─── ANIMATION & VISUAL TYPES ─────────────────────────────────────────────

/**
 * Point representation for the NetworkIllustration SVG animation.
 */
export interface NetworkNode {
  /** X-coordinate focal point */
  cx: number;
  /** Y-coordinate focal point */
  cy: number;
  /** Staggered animation delay */
  delay: string;
  /** Highlights the node for visual emphasis */
  highlight?: boolean;
}

/**
 * Mapping of node connection indices (START_INDEX to END_INDEX).
 */
export type NetworkConnection = [number, number];
