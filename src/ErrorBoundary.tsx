import React, { ErrorInfo } from 'react';

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
        console.log('ErrorBoundary - constructor');
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        console.error('ErrorBoundary - getDerivedStateFromError:', error);
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('ErrorBoundary - componentDidCatch:', error, errorInfo);
    }

    render() {
        console.log('ErrorBoundary - render');
        if (this.state.hasError) {
            console.log('ErrorBoundary - Error occurred while loading the component.');
            return <div>Error occurred while loading the component.</div>;
        }

        return this.props.children;
    }
}


export default ErrorBoundary;
