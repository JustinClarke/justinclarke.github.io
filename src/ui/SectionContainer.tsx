import React, { ReactNode, forwardRef } from 'react';
import { cn } from '@/utils';

/**
 * @fileoverview Standardized container for section layouts.
 * Enforces consistent max-width and horizontal padding across the entire site.
 */

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
