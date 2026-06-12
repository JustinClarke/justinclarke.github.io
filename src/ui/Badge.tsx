/**
 * Badge a small pill/tag for a technology name or credential.
 *
 * Fits in: used all over the site (project cards, tech lists, the closer).
 * Note:    if you pass a string child it auto-looks-up a hover tooltip for it.
 *
 * For beginners ----------------------------------------------------------------
 * This is a "presentational" component: it takes some text in and returns the
 * styled HTML to show it. The four `variant` names (teal/outline/ghost/soft-bg)
 * are just preset colour schemes, picked with a lookup object below.
 * -----------------------------------------------------------------------------
 */
import React from 'react';
import { getTooltip } from '@/config/tooltips';

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
  const sizeClasses = size === 'xs' ? 'px-1.5 py-0.5 text-[9px]' : 'px-2.5 py-1 text-[11px]';

  // LEARN: an object used as a lookup table. `variantClasses[variant]` picks one
  //    string of Tailwind classes by the variant name, the same idea as a CSS
  //    class you'd switch between in HTML.
  const variantClasses = {
    'teal': 'bg-brand-primary/10 text-brand-primary border-brand-primary/20 dark:bg-brand-primary/10 dark:text-brand-primary dark:border-brand-primary/20',
    'outline': 'bg-transparent border-light-border text-light-text-muted dark:border-white/10 dark:text-white/60',
    'ghost': 'bg-light-border/20 text-light-text-muted dark:bg-white/5 dark:text-white/60 border-transparent',
    'soft-bg': 'bg-light-border/20 text-light-text-muted border-transparent uppercase dark:bg-white/5 dark:text-white/45'
  };

  // LEARN: if no tooltip was passed AND the badge's text is a plain string, look
  //    one up by that text. `typeof children === 'string'` guards the lookup so
  //    we don't try it when children is, say, an icon element.
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
