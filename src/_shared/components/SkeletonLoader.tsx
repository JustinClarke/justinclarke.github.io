import React from 'react';
import { cn } from '@/shared/utils';

interface SkeletonProps {
  variant?: 'text' | 'card' | 'hero' | 'project-grid';
  className?: string;
}

/**
 * Premium Skeleton Loader with shimmer effect and pulse animation.
 * Used for high-fidelity lazy loading states.
 */
export function SkeletonLoader({ variant = 'text', className }: SkeletonProps) {
  const variantClasses = {
    text: 'h-4 w-full rounded',
    card: 'h-64 w-full rounded-2xl',
    hero: 'h-96 w-full rounded-3xl',
    'project-grid': 'h-[500px] w-full rounded-[32px]',
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-white/5 animate-pulse',
        variantClasses[variant],
        className
      )}
    >
      {/* Shimmer effect overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent"
        style={{
          animation: 'shimmer 2.5s infinite linear',
        }}
      />
    </div>
  );
}
