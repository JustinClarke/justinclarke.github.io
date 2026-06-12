/**
 * SkeletonLoader a grey placeholder shape shown while real content loads.
 *
 * Fits in: rendered as the `fallback` for lazy-loaded pages/sections so the
 *          layout doesn't jump when the real content arrives.
 * Note:    `variant` picks a preset size (text line, card, hero, project grid).
 *
 * For beginners ----------------------------------------------------------------
 * It's pure CSS the `animate-pulse` class fades it in and out, and the inner
 * gradient div sweeps a "shimmer" across it. No data, no logic, just a shape.
 * -----------------------------------------------------------------------------
 */
import React from 'react';
import { cn } from '@/utils';

interface SkeletonProps {
  variant?: 'text' | 'card' | 'hero' | 'project-grid';
  className?: string;
}

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
