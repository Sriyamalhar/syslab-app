import { Component, type ReactNode } from 'react';

interface Props { children: ReactNode; }
interface State { error: Error | null; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-background text-foreground gap-4">
          <h1 className="text-2xl font-semibold">Something went wrong</h1>
          <p className="text-muted-foreground text-sm max-w-md text-center">
            {this.state.error.message || 'An unexpected error occurred.'}
          </p>
          <button
            className="mt-2 px-4 py-2 rounded bg-primary text-primary-foreground text-sm"
            onClick={() => { this.setState({ error: null }); window.location.href = '/'; }}
          >
            Go home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
