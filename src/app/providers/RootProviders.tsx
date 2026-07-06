/**
 * RootProviders stacks every app-wide context provider in the correct order.
 * Fits in: wraps the entire React tree in main.tsx.
 * Note: provider order matters ThemeProvider is outermost so every
 *   child (including ErrorBoundary) can safely call useTheme().
 */
import { ReactNode } from 'react';
import { MotionConfig } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import { ModalProvider } from './ModalProvider';
import { ThemeProvider } from './ThemeProvider';
import { ErrorBoundary } from '@/ui/ErrorBoundary';

interface RootProvidersProps {
  children: ReactNode;
}

export function RootProviders({ children }: RootProvidersProps) {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <ErrorBoundary>
          {/*
           * reducedMotion="user" makes every descendant framer-motion animation
           * honour the OS "reduce motion" setting in one place: transform/layout
           * animations degrade to instant, opacity fades still play. Covers all
           * ~34 motion consumers without per-component guards. Non-framer motion
           * (canvas games, custom cursor, preloader) is handled separately via
           * the useReducedMotion hook.
           */}
          <MotionConfig reducedMotion="user">
            <ModalProvider>
              {children}
            </ModalProvider>
          </MotionConfig>
        </ErrorBoundary>
      </ThemeProvider>
    </HelmetProvider>
  );
}
