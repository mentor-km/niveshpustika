import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('App error boundary:', error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="min-h-[100dvh] bg-gradient-to-br from-[#f8fffe] via-[#f0fdfa] to-[#ecfdf5] flex items-center justify-center p-6 safe-top safe-bottom">
        <div className="max-w-md w-full rounded-xl border border-teal-200 bg-white p-8 shadow-lg text-center">
          <h1 className="text-xl font-bold text-slate-800 font-heading">Something went wrong</h1>
          <p className="text-slate-600 mt-3 text-sm">
            The app hit an unexpected error. Reloading usually fixes this.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Button
              onClick={this.handleReload}
              className="w-full bg-[#2d8b8b] hover:bg-[#267a7a] text-white"
            >
              Reload app
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/app">Go to sign in</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
