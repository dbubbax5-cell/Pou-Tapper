import React, { Component, ErrorInfo, ReactNode } from 'react';
import { GameScreen } from './components/game/GameScreen';

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-red-500 bg-red-50 h-screen flex flex-col items-center justify-center">
          <h1 className="text-xl font-bold mb-2">Something went wrong.</h1>
          <pre className="text-sm bg-gray-100 p-2 rounded">{this.state.error?.message}</pre>
          <button 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
            onClick={() => window.location.reload()}
          >
            Reload Game
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <div className="w-full h-full max-w-full max-h-full">
        <GameScreen />
      </div>
    </ErrorBoundary>
  );
};

export default App;
