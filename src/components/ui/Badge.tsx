import React from 'react';

/**
 * @fileoverview Standardized Badge component for professional credentials and technology tags.
 * Supports various thematic 'Studio' and 'Dark' variants.
 */

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'teal' | 'outline' | 'ghost' | 'soft-bg';
  className?: string;
  size?: 'xs' | 'sm';
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'soft-bg', 
  className = '',
  size = 'sm'
}) => {
  const sizeClasses = size === 'xs' ? 'px-1.5 py-0.5 text-[9px]' : 'px-2.5 py-1 text-[11px]';
  
  const variantClasses = {
    'teal': 'bg-teal-50 text-teal-600 border-teal-100/50 dark:bg-teal-500/10 dark:text-teal-400 dark:border-teal-500/20',
    'outline': 'bg-transparent border-black/10 text-black/60 dark:border-white/10 dark:text-white/60',
    'ghost': 'bg-black/5 text-black/60 dark:bg-white/5 dark:text-white/60 border-transparent',
    'soft-bg': 'bg-[#f5f5f5] text-black/45 border-black/5 uppercase dark:bg-white/5 dark:text-white/45 dark:border-white/5'
  };

  return (
    <span className={`
      inline-flex items-center justify-center 
      font-mono font-bold uppercase tracking-[0.1em] 
      border rounded-[3px]
      ${sizeClasses}
      ${variantClasses[variant]}
      ${className}
    `}>
      {children}
    </span>
  );
};
