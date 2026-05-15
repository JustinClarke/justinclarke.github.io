import { ReactNode } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { ModalProvider } from './ModalProvider';
import { ErrorBoundary } from '@/ui/ErrorBoundary';

interface RootProvidersProps {
  children: ReactNode;
}

/**
 * Centralized provider wrapper to handle app-wide contexts and boundaries.
 */
export function RootProviders({ children }: RootProvidersProps) {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <ModalProvider>
          {children}
        </ModalProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}
