import { ReactNode } from 'react';
import { ModalProvider } from './ModalProvider';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';

interface RootProvidersProps {
  children: ReactNode;
}

/**
 * Centralized provider wrapper to handle app-wide contexts and boundaries.
 */
export function RootProviders({ children }: RootProvidersProps) {
  return (
    <ErrorBoundary>
      <ModalProvider>
        {children}
      </ModalProvider>
    </ErrorBoundary>
  );
}
