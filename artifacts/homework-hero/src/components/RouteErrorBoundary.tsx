import { Component, type ReactNode, type ErrorInfo } from "react";
import { Link } from "wouter";

interface Props  { children: ReactNode; }
interface State  { error: Error | null; }

export class RouteErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary] Unhandled error caught:", error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-5">
        <div className="max-w-sm w-full bg-white border border-slate-200 rounded-2xl p-6 text-center space-y-4">
          <p className="text-3xl">⚠️</p>
          <h2 className="text-base font-bold text-slate-900">Something went wrong</h2>
          <p className="text-xs text-slate-500 font-mono break-all">
            {this.state.error.message}
          </p>
          <Link href="/">
            <button className="w-full py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold">
              ← Back to Home
            </button>
          </Link>
        </div>
      </div>
    );
  }
}
