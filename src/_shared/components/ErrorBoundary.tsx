import React, { ReactNode, ErrorInfo } from 'react';
import { AlertCircle, RotateCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary Component
 * 
 * Catches component-level crashes and provides a graceful, theme-aware fallback UI.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-brand-bg border border-viz-error/20 rounded-2xl m-4">
            <div className="mb-6">
              <AlertCircle className="w-16 h-16 text-viz-error mx-auto opacity-75" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
            <p className="text-text-muted mb-6 max-w-md mx-auto">
              We encountered an unexpected error. Try refreshing the page or check your connection.
            </p>
            {this.state.error && (
              <details className="text-left mb-6 text-xs text-text-dim w-full max-w-sm mx-auto">
                <summary className="cursor-pointer hover:text-text-muted mb-2 font-mono">Error details</summary>
                <code className="bg-black/50 p-4 rounded-lg block overflow-auto text-viz-error/60 font-mono border border-viz-error/20">
                  {this.state.error.toString()}
                </code>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-6 py-2.5 bg-viz-error hover:bg-viz-error/80 text-white rounded-lg font-medium transition-all active:scale-95 shadow-lg shadow-viz-error/20"
            >
              <RotateCw className="w-4 h-4" />
              Refresh Page
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
