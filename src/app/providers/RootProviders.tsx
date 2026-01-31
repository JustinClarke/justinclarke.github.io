/**
 * RootProviders stacks every app-wide context provider in the correct order.
 * Fits in: wraps the entire React tree in main.tsx.
 * Note: provider order matters ThemeProvider is outermost so every
 *   child (including ErrorBoundary) can safely call useTheme().
 */
import { ReactNode } from 'react';
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
          <ModalProvider>
            {children}
          </ModalProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </HelmetProvider>
  );
}
