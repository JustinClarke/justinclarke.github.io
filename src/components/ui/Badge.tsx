import React from 'react';

/**
 * Badge Component
 * 
 * Standardized tag for technology and credentials.
 * Supports various semantic variants (teal, outline, ghost, soft-bg).
 * Migration Status: Colors moved to theme-aware tokens.
 */

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'teal' | 'outline' | 'ghost' | 'soft-bg';
  className?: string;
  size?: 'xs' | 'sm';
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'soft-bg', 
  className = '',
  size = 'sm',
  ...props
}) => {
  const sizeClasses = size === 'xs' ? 'px-1.5 py-0.5 text-[9px]' : 'px-2.5 py-1 text-[11px]';
  
  const variantClasses = {
    'teal': 'bg-brand-primary/10 text-brand-primary border-brand-primary/20 dark:bg-brand-primary/10 dark:text-brand-primary dark:border-brand-primary/20',
    'outline': 'bg-transparent border-light-border text-light-text-muted dark:border-white/10 dark:text-white/60',
    'ghost': 'bg-light-border/20 text-light-text-muted dark:bg-white/5 dark:text-white/60 border-transparent',
    'soft-bg': 'bg-light-border/20 text-light-text-muted border-transparent uppercase dark:bg-white/5 dark:text-white/45'
  };

  return (
    <span className={`
      inline-flex items-center justify-center 
      font-mono font-bold uppercase tracking-[0.1em] 
      border rounded-[3px]
      ${sizeClasses}
      ${variantClasses[variant]}
      ${className}
    `}
    {...props}
    >
      {children}
    </span>
  );
};
