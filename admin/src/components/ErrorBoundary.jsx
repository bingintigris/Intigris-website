import { Component } from 'react';

// Catches render/runtime errors so a crash shows a readable message
// instead of a blank white page.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Admin portal error:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24 }}>
          <div style={{
            maxWidth: 640, margin: '40px auto', background: '#fff',
            border: '1px solid #e8ddc6', borderRadius: 16, padding: 24,
            fontFamily: 'Inter Tight, system-ui, sans-serif', color: '#402301',
          }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 500 }}>Something went wrong on this screen.</h2>
            <p style={{ marginTop: 8, fontSize: 14, color: '#6c5740' }}>
              The error below helps pinpoint the cause:
            </p>
            <pre style={{
              marginTop: 12, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
              background: '#fbf3e6', border: '1px solid #e8ddc6', borderRadius: 10,
              padding: 12, fontSize: 12.5, color: '#7a2f0b',
            }}>{String(this.state.error?.message || this.state.error)}</pre>
            <button
              onClick={() => this.setState({ error: null })}
              style={{
                marginTop: 16, background: '#ff5f36', color: '#fff', border: 0,
                borderRadius: 999, padding: '9px 18px', fontSize: 14, cursor: 'pointer',
              }}
            >
              Dismiss
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
