import { Link } from 'react-router-dom'
import type { Job } from '@/types'

interface JobsTableProps {
  jobs: Job[]
}

const formatDuration = (totalSeconds?: number) => {
  if (totalSeconds === undefined || totalSeconds === null) return '-'
  if (totalSeconds < 0) return '-'
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`
  if (minutes > 0) return `${minutes}m ${seconds}s`
  return `${seconds}s`
}

const getStatusStyles = (status: string) => {
  switch (status) {
    case 'completed':
      return 'text-green-700 bg-green-100'
    case 'processing':
      return 'text-blue-700 bg-blue-100'
    case 'failed':
      return 'text-red-700 bg-red-100'
    case 'cancelled':
      return 'text-gray-700 bg-gray-100'
    default:
      return 'text-yellow-700 bg-yellow-100'
  }
}

const JobsTable = ({ jobs }: JobsTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Job ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Progress
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Files
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Time
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {jobs.map((job) => {
            const statusValue = typeof job.status === 'string' ? job.status : String(job.status)
            return (
              <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-mono">
                  {job.id}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles(statusValue)}`}>
                    {statusValue.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-28 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${job.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-300">{job.progress}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                  {job.preprocessing_file_count ?? '-'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                  {formatDuration(job.processing_time_seconds)}
                </td>
                <td className="px-4 py-3 text-right">
                  {statusValue === 'completed' ? (
                    <Link
                      to={`/viewer/${job.id}`}
                      className="btn btn-primary text-sm"
                    >
                      View Results
                    </Link>
                  ) : (
                    <span className="text-xs text-gray-500 dark:text-gray-400">Not ready</span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default JobsTable
