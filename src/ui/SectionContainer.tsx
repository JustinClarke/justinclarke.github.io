/**
 * SectionContainer the standard <section> wrapper used by every page block.
 *
 * Fits in: wrap each major page section in this so spacing and max-width match
 *          across the whole site (Hero, Projects, Expertise, Footer, etc.).
 * Note:    `containerVariant` swaps the inner max-width preset ('site' wide,
 *          'project' narrower, 'none' for full-bleed). Change spacing here once,
 *          and every section updates.
 *
 * For beginners ----------------------------------------------------------------
 * `forwardRef` passes a parent's ref down to the real <section> element, so a
 * parent can scroll to or measure this section. `cn(...)` just joins class
 * strings together (and drops empty ones) see src/utils/cn.ts.
 * -----------------------------------------------------------------------------
 */
import React, { ReactNode, forwardRef } from 'react';
import { cn } from '@/utils';

interface SectionContainerProps {
  /** Optional ID for navigation target */
  id?: string;
  /** Custom CSS classes for the root section */
  className?: string;
  /** Custom CSS classes for the inner container */
  innerClassName?: string;
  /** Utility for the inner content (e.g. 'site-container' or 'project-container') */
  containerVariant?: 'site' | 'project' | 'none';
  /** The content to be wrapped */
  children: ReactNode;
}

/**
 * SectionContainer wraps content with standardized HUD spacing.
 * Standardizes layout patterns across Hero, Projects, Expertise, and Footer.
 */
export const SectionContainer = forwardRef<HTMLElement, SectionContainerProps>(
  ({ id, className = '', innerClassName = '', containerVariant = 'site', children }, ref) => {
    const containerClass = containerVariant === 'site' 
      ? 'site-container' 
      : containerVariant === 'project' 
        ? 'project-container' 
        : 'container-layout';

    return (
      <section
        id={id}
        ref={ref}
        className={cn("section-layout relative w-full", className)}
      >
        <div className={cn(containerClass, "w-full", innerClassName)}>
          {children}
        </div>
      </section>
    );
  }
);

SectionContainer.displayName = 'SectionContainer';
