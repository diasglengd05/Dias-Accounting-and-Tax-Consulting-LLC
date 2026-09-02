import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught application error:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-navy-950 text-white flex items-center justify-center p-6 select-none">
          <div className="max-w-md w-full bg-navy-900 border border-gold-500/30 rounded-2xl p-8 text-center shadow-2xl">
            <div className="w-16 h-16 bg-gold-500/10 border border-gold-500/40 rounded-full flex items-center justify-center mx-auto mb-6 text-gold-400">
              <AlertTriangle className="w-8 h-8" />
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-2 font-serif">
              Dias Accounting & Tax
            </h1>
            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
              We encountered a minor display issue loading this section. Please click below to refresh and continue.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={this.handleReload}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-bold px-6 py-3 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Page
              </button>
              
              <button
                type="button"
                onClick={this.handleReset}
                className="inline-flex items-center justify-center gap-2 bg-navy-800 hover:bg-navy-700 text-slate-200 font-medium px-5 py-3 rounded-xl border border-slate-700 transition-all"
              >
                <Home className="w-4 h-4" />
                Return to Site
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
