import { JobStatus as JobStatusEnum } from '@/types'

interface JobStatusProps {
  jobId: string
  status: JobStatusEnum | string
  progress?: number
  error?: string
}

const JobStatus = ({ jobId, status, progress = 0, error }: JobStatusProps) => {
  const statusValue = typeof status === 'string' ? status.toLowerCase() : String(status).toLowerCase()
  
  const getStatusColor = () => {
    switch (statusValue) {
      case 'completed':
        return 'text-green-600 bg-green-50'
      case 'processing':
        return 'text-blue-600 bg-blue-50'
      case 'failed':
        return 'text-red-600 bg-red-50'
      case 'cancelled':
        return 'text-gray-600 bg-gray-50'
      default:
        return 'text-yellow-600 bg-yellow-50'
    }
  }

  const getStatusIcon = () => {
    switch (statusValue) {
      case 'completed':
        return '✓'
      case 'processing':
        return '⟳'
      case 'failed':
        return '✗'
      case 'cancelled':
        return '⊘'
      default:
        return '○'
    }
  }

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Job ID</p>
          <p className="font-mono text-sm">{jobId}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}
        >
          {getStatusIcon()} {statusValue.toUpperCase()}
        </span>
      </div>

      {statusValue === 'processing' && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}
    </div>
  )
}

export default JobStatus
