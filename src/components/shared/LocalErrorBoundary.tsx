'use client';
import React from 'react';

export class LocalErrorBoundary extends React.Component<
  { children: React.ReactNode, fallback?: React.ReactNode },
  { hasError: boolean, error: Error | null }
> {
  constructor(props: { children: React.ReactNode, fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 m-2 border-2 border-red-500/50 bg-red-500/10 text-red-500 text-[10px] font-mono rounded-xl">
            [Erro de Renderização Isolado] {this.state.error?.message}
        </div>
      );
    }
    return this.props.children;
  }
}
