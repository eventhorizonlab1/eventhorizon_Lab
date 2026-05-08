import React from 'react';

interface Props {
  children: React.ReactNode;
  name?: string;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, info: React.ErrorInfo) {
    const tag = this.props.name ? `[${this.props.name}]` : '[ErrorBoundary]';
    console.error(tag, error, info.componentStack);
  }

  override render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback !== undefined) return this.props.fallback;

    const lang = typeof document !== 'undefined' ? document.documentElement.lang : 'fr';
    const isFr = lang.startsWith('fr');
    const message = isFr
      ? "Cette section n'a pas pu être chargée."
      : 'This section could not be loaded.';

    return (
      <div
        role="alert"
        className="w-full py-12 px-6 text-center text-sm text-gray-500 bg-gray-50 border-y border-gray-100"
      >
        {message}
      </div>
    );
  }
}
