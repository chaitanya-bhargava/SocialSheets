import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px',
          textAlign: 'center',
          backgroundColor: '#0d1117',
          color: '#e6edf3',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>
            Something went wrong
          </h1>
          <p style={{ color: '#8b949e', marginBottom: '24px', maxWidth: '400px' }}>
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 24px',
              fontSize: '0.95rem',
              fontWeight: 600,
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              backgroundColor: '#58a6ff',
              color: '#fff',
              fontFamily: 'inherit',
            }}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
