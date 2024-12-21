// src/components/ErrorBoundary/ErrorBoundary.jsx

import React from 'react';
import './styles.scss';

class PayPalErrorBoundary extends React.Component {
constructor(props) {
  super(props);
  this.state = { hasError: false, error: null };
}

static getDerivedStateFromError(error) {
  return { hasError: true, error };
}

componentDidCatch(error, errorInfo) {
  console.error('PayPal Error:', error, errorInfo);
}

render() {
  if (this.state.hasError) {
    return (
      <div className="error-boundary">
        <h3>Something went wrong with PayPal</h3>
        <p>{this.state.error?.message}</p>
        <button onClick={() => this.setState({ hasError: false, error: null })}>
          Try Again
        </button>
      </div>
    );
  }

  return this.props.children;
}
}

export default PayPalErrorBoundary;