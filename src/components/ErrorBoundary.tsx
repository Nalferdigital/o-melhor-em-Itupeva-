import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    (this as any).state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    const self = this as any;
    if (self.state.hasError) {
      let errorMessage = 'Algo deu errado. Por favor, tente novamente mais tarde.';
      
      try {
        const firestoreError = JSON.parse(self.state.error?.message || '{}');
        if (firestoreError.error && firestoreError.error.includes('Missing or insufficient permissions')) {
          errorMessage = 'Você não tem permissão para realizar esta ação. Verifique se você está logado corretamente.';
        }
      } catch (e) {
        // Not a JSON error, use default
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full text-center p-8 bg-white rounded-3xl shadow-xl border border-gray-100">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ops! Ocorreu um erro</h2>
            <p className="text-gray-600 mb-8">{errorMessage}</p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-2xl hover:bg-blue-700 transition-colors shadow-lg"
            >
              Recarregar Página
            </button>
          </div>
        </div>
      );
    }

    return self.props.children;
  }
}

export default ErrorBoundary;
