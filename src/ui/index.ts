/**
 * ui/index.ts the barrel for shared UI primitives.
 *
 * Note: ConfirmPrompt and InteractiveHint are NOT re-exported here and are
 * imported directly by path - the barrel is a convenience, not a requirement.
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
