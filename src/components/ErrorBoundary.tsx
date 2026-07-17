"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-[400px] flex items-center justify-center p-8 bg-surface-bright">
          <div className="max-w-md w-full bg-pure-white p-8 border-2 border-pure-black shadow-[8px_8px_0_0_#0F0E0E] text-center">
            <AlertTriangle className="w-12 h-12 text-signal-red mx-auto mb-4" />
            <h2 className="font-playfair text-[24px] font-bold text-pure-black mb-2 uppercase">Application Error</h2>
            <p className="font-mono-label text-[12px] text-on-surface-variant mb-6 uppercase">
              {this.state.error?.message || "Something went wrong loading this component."}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="bg-primary text-pure-white px-6 py-3 font-dot text-[14px] uppercase hover:bg-inverse-surface transition-colors inline-flex items-center gap-2"
            >
              <RefreshCcw className="w-4 h-4" /> Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
