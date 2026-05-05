/**
 * Dashboard Error Boundary
 * Catches errors in dashboard components and displays fallback UI
 */

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class DashboardErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error) {
    console.error('Dashboard error:', error)
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="space-y-8">
          <div className="rounded-2xl border border-red-700/40 bg-red-900/20 p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-red-200">Dashboard Error</h3>
                <p className="mt-2 text-sm text-red-300">
                  {this.state.error?.message || 'An unexpected error occurred in the dashboard'}
                </p>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={this.resetError}
                    className="inline-flex items-center px-4 py-2 rounded-lg bg-red-400/20 text-red-300 hover:bg-red-400/30 transition-colors font-medium"
                    aria-label="Reload dashboard"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center px-4 py-2 rounded-lg bg-slate-600/20 text-slate-300 hover:bg-slate-600/30 transition-colors font-medium"
                    aria-label="Reload page"
                  >
                    Reload Page
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default DashboardErrorBoundary
