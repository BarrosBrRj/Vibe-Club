import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
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
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    try {
      const errMsg = (this.state.error?.message || '').toLowerCase();
      if (errMsg.includes('quota') || errMsg.includes('storage') || errMsg.includes('setitem')) {
        try {
          localStorage.removeItem('vibe_moderation_reports');
          localStorage.removeItem('vibe_moderation_audit_log');
        } catch {}
      }
    } catch {}
    this.setState({ hasError: false, error: null });
  };

  private handleClearDataAndReload = () => {
    try {
      localStorage.removeItem('vibe_moderation_reports');
      localStorage.removeItem('vibe_moderation_audit_log');
      localStorage.removeItem('vibe_installed_apps');
    } catch {}
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isQuotaError = (this.state.error?.message || '').toLowerCase().includes('quota') || 
                           (this.state.error?.message || '').toLowerCase().includes('storage');

      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4 font-sans text-slate-800">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 text-center space-y-4">
            <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            
            <h2 className="text-xl font-black text-slate-900">Ops! Algo deu errado</h2>
            <p className="text-sm text-slate-600">
              {isQuotaError 
                ? 'O limite de armazenamento do navegador foi atingido por fotos ou dados locais. Clique abaixo para liberar espaço.'
                : 'Ocorreu uma instabilidade inesperada na exibição. Clique no botão abaixo para restaurar a página.'}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
              <button
                onClick={this.handleReset}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md shadow-purple-500/20 transition-all cursor-pointer"
              >
                Tentar Novamente
              </button>
              {isQuotaError ? (
                <button
                  onClick={this.handleClearDataAndReload}
                  className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-rose-200"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Liberar Armazenamento</span>
                </button>
              ) : (
                <button
                  onClick={this.handleReload}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Recarregar Página</span>
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
