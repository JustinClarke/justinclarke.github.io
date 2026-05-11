import React, { ReactNode, forwardRef } from 'react';

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
  /** Max width for the inner content (e.g. 'max-w-4xl' for text readability) */
  contentMaxWidth?: string;
  /** The content to be wrapped */
  children: ReactNode;
}

/**
 * SectionContainer wraps content in a max-w-7xl centered flexbox.
 * Standardizes layout patterns across Hero, Projects, Expertise, and Footer.
 */
export const SectionContainer = forwardRef<HTMLElement, SectionContainerProps>(
  ({ id, className = '', innerClassName = '', contentMaxWidth = 'max-w-7xl', children }, ref) => {
    return (
      <section
        id={id}
        ref={ref}
        className={`relative w-full ${className}`}
      >
        <div className={`${contentMaxWidth} mx-auto px-6 md:px-12 xl:px-8 w-full ${innerClassName}`}>
          {children}
        </div>
      </section>
    );
  }
);

SectionContainer.displayName = 'SectionContainer';
