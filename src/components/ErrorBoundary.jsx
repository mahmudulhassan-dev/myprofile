import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-8">
                    <div className="max-w-2xl bg-slate-800 p-6 rounded-lg border border-red-500">
                        <h1 className="text-2xl font-bold text-red-500 mb-4">Something went wrong.</h1>
                        <p className="mb-4 text-slate-300">Please show this error to the developer:</p>
                        <pre className="bg-black/50 p-4 rounded text-xs font-mono overflow-auto mb-4 text-red-300">
                            {this.state.error && this.state.error.toString()}
                        </pre>
                        <details className="whitespace-pre-wrap text-xs text-slate-500">
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </details>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-6 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
