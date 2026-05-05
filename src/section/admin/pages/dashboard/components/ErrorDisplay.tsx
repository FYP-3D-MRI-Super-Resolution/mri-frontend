/**
 * Error Display Component
 * Handles error states with retry functionality
 */

interface ErrorDisplayProps {
  error: Error | null
  onRetry?: () => void
  title?: string
}

const ErrorDisplay = ({
  error,
  onRetry,
  title = 'Something went wrong',
}: ErrorDisplayProps) => {
  return (
    <div className="rounded-2xl border border-red-700/40 bg-red-900/20 p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <svg
            className="h-6 w-6 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
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
          <h3 className="text-sm font-medium text-red-200">{title}</h3>
          {error && (
            <p className="mt-2 text-sm text-red-300">
              {error.message || 'An unexpected error occurred'}
            </p>
          )}
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-4 inline-flex items-center px-3 py-2 rounded-lg bg-red-400/20 text-red-300 hover:bg-red-400/30 transition-colors text-sm font-medium"
              aria-label="Retry loading data"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ErrorDisplay
