/**
 * Badge a small pill/tag for a technology name or credential.
 *
 * Used all over the site (project cards, tech lists, the closer). Passing a
 * plain-string child auto-looks-up a hover tooltip for it via the tooltip system.
 */
import React from 'react';
import { getTooltip } from '@/utils/tooltipContent';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'teal' | 'outline' | 'ghost' | 'soft-bg';
  className?: string;
  size?: 'xs' | 'sm';
  tooltip?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'soft-bg',
  className = '',
  size = 'sm',
  tooltip,
  ...props
}) => {
  const sizeClasses = size === 'xs' ? 'px-1.5 py-0.5 text-micro' : 'px-2.5 py-1 text-fine';

  const variantClasses = {
    'teal': 'bg-brand-primary/10 text-brand-primary border-brand-primary/20 dark:bg-brand-primary/10 dark:text-brand-primary dark:border-brand-primary/20',
    'outline': 'bg-transparent border-light-border text-light-text-muted dark:border-white/10 dark:text-text-tertiary',
    'ghost': 'bg-light-border/20 text-light-text-muted dark:bg-white/5 dark:text-text-tertiary border-transparent',
    'soft-bg': 'bg-light-border/20 text-light-text-muted border-transparent uppercase dark:bg-white/5 dark:text-text-tertiary'
  };

  // Fall back to a tooltip-system lookup keyed on the badge's text (string children only).
  const tooltipText = tooltip || (typeof children === 'string' ? getTooltip(children) : undefined);

  return (
    <span
      className={`
      inline-flex items-center justify-center
      font-mono font-bold uppercase tracking-[0.1em]
      border rounded-[3px]
      ${sizeClasses}
      ${variantClasses[variant]}
      ${className}
    `}
      data-tooltip={tooltipText}
      {...props}
    >
      {children}
    </span>
  );
};
