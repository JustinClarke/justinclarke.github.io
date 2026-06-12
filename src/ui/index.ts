/**
 * ui/index.ts the "barrel" for shared UI primitives.
 *
 * For beginners ----------------------------------------------------------------
 * A barrel re-exports many files from one place, so callers can write
 * `import { Badge, ThemeToggle } from '@/ui'` instead of one import per file.
 * Note: a couple of components (ConfirmPrompt, InteractiveHint) are NOT
 * re-exported here and are imported directly by path that's fine, the barrel
 * is a convenience, not a requirement.
 * -----------------------------------------------------------------------------
 */
export * from './Badge';
export * from './ThemeToggle';
export * from './MagneticButton';
export * from './SpotlightCard';

export * from './ErrorBoundary';
export * from './ScrollReveal';
export * from './SectionContainer';
export * from './SkeletonLoader';
export * from './BackToTerminal';
export * from './FireParticles';
export * from './TechStack';
