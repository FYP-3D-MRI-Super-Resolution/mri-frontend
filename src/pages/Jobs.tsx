import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { jobsService } from '@/api/services'
import type { Job } from '@/types'
import JobStatus from '../components/JobStatus'

const Jobs = () => {
  const { data: jobs, isLoading, error, refetch } = useQuery({
    queryKey: ['jobs'],
    queryFn: () => jobsService.getJobs(),
    refetchInterval: 5000, // Refetch every 5 seconds
  })

  if (isLoading) {
    return (
      <div className="px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading jobs...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="card bg-red-50 border border-red-200">
            <p className="text-red-700">
              Error loading jobs: {error instanceof Error ? error.message : 'Unknown error'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Processing Jobs
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Track the status of your preprocessing and inference jobs
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="btn btn-secondary"
          >
            🔄 Refresh
          </button>
        </div>

        {!jobs || jobs.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No Jobs Yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Upload MRI scans to start processing
            </p>
            <Link to="/upload" className="btn btn-primary inline-block">
              Upload Files
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job: Job) => (
              <div key={job.id} className="relative">
                <JobStatus
                  jobId={job.id}
                  status={job.status}
                  progress={job.progress}
                  error={job.error_message}
                  processingTimeSeconds={job.processing_time_seconds}
                  preprocessingFileCount={job.preprocessing_file_count}
                />
                {job.status === 'completed' && (
                  <div className="mt-2 flex space-x-2">
                    <Link
                      to={`/viewer/${job.id}`}
                      className="btn btn-primary text-sm"
                    >
                      View Results
                    </Link>
                    <button className="btn btn-secondary text-sm">
                      Download
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Jobs
