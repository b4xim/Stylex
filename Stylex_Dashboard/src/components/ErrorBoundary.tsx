import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Dashboard:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetCache = () => {
    try {
      // Clear specific corrupted storage items while preserving login session if possible
      const session = localStorage.getItem('stylex_session_active');
      const email = localStorage.getItem('stylex_current_user_email_v2');
      const keysToClear = [
        'stylex_tirur_v7_appointments',
        'stylex_tirur_v6_services',
        'stylex_tirur_v7_schedule',
        'stylex_tirur_v6_blackouts',
        'stylex_tirur_v6_banners',
        'stylex_tirur_v6_reels',
        'stylex_tirur_v6_portfolio',
        'stylex_tirur_v6_stylists',
        'stylex_tirur_v6_stylist_leaves',
        'stylex_tirur_v6_inquiries',
        'stylex_tirur_v6_settings',
      ];
      keysToClear.forEach((k) => localStorage.removeItem(k));
      if (session) {
        try { localStorage.setItem('stylex_session_active', session); } catch {}
      }
      if (email) {
        try { localStorage.setItem('stylex_current_user_email_v2', email); } catch {}
      }
    } catch (e) {
      try { localStorage.clear(); } catch {}
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0d2217] flex flex-col items-center justify-center p-6 text-white text-center font-sans antialiased">
          <div className="max-w-md w-full bg-[#152e21] border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-[#fe753c]/20 border border-[#fe753c]/30 flex items-center justify-center text-[#fe753c] mb-6">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <h1 className="font-serif text-2xl font-bold tracking-tight text-white mb-2">
              Dashboard Recovery Mode
            </h1>
            <p className="text-sm text-neutral-300 mb-6 leading-relaxed">
              An unexpected render issue occurred while loading atelier state. You can reload or reset cached local data.
            </p>

            {this.state.error?.message && (
              <div className="w-full bg-black/30 rounded-xl p-3 mb-6 text-left border border-white/5 overflow-x-auto text-[11px] font-mono text-amber-300/80">
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 py-3 px-4 rounded-xl bg-[#fe753c] hover:bg-[#e06530] text-white font-semibold text-sm transition-all shadow-md cursor-pointer"
              >
                Reload Dashboard
              </button>
              <button
                type="button"
                onClick={this.handleResetCache}
                className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white/90 font-medium text-sm border border-white/10 transition-all cursor-pointer"
              >
                Reset Cache & Reload
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
