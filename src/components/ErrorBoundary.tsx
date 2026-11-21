import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { firebaseConfig } from '../firebase';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
  isQuotaError: boolean;
  isFreeTierReadLimit: boolean;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = {
      hasError: false,
      message: '',
      isQuotaError: false,
      isFreeTierReadLimit: false,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    const raw = error?.message || 'An unexpected application error occurred.';
    let readable = raw;
    try {
      const parsed = JSON.parse(raw) as { error?: string; operationType?: string; path?: string };
      if (parsed?.error) {
        readable = `${parsed.error}${parsed.path ? ` (${parsed.operationType ?? 'op'} at ${parsed.path})` : ''}`;
      }
    } catch {
      // plain error message
    }
    const isQuotaError = /Quota exceeded/i.test(readable);
    const isFreeTierReadLimit = /Free daily read units per project/i.test(readable);
    return {
      hasError: true,
      message: readable,
      isQuotaError,
      isFreeTierReadLimit,
    };
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const upgradeUrl = `https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore/databases/${firebaseConfig.firestoreDatabaseId}/data?openUpgradeDialog=true`;

    return (
      <div className="min-h-screen bg-[#07090F] text-slate-100 flex items-center justify-center p-6">
        <div
          role="alert"
          className="max-w-lg w-full rounded-2xl bg-slate-900 border border-rose-500/40 p-6 space-y-4 shadow-2xl"
        >
          <div className="flex items-center gap-3 text-rose-400">
            <AlertTriangle className="w-6 h-6 shrink-0" />
            <h1 className="font-display text-lg font-bold text-white">
              {this.state.isQuotaError ? 'Cloud Database Daily Quota Reached' : 'Something Went Wrong'}
            </h1>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {this.state.isQuotaError
              ? 'Firestore free-tier daily quota was exceeded. Your local study progress remains safe in browser storage and the cloud quota resets tomorrow.'
              : this.state.message}
          </p>

          {this.state.isFreeTierReadLimit && (
            <a
              href={upgradeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-xs text-cyan-400 hover:text-cyan-300 underline"
            >
              View Firestore Database &amp; Quota Details
            </a>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => this.setState({ hasError: false, message: '', isQuotaError: false, isFreeTierReadLimit: false })}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              Reload App
            </button>
          </div>
        </div>
      </div>
    );
  }
}
