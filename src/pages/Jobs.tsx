import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { jobsService } from '@/api/services'
import type { Job } from '@/types'
import type { JobsListResponse } from '@/types/api.types'
import JobsTable from '../components/JobsTable'

const Jobs = () => {
  const [page, setPage] = useState(1)
  const [size] = useState(10)

  const { data, isLoading, error, refetch } = useQuery<JobsListResponse>({
    queryKey: ['jobs', page, size],
    queryFn: () => jobsService.getJobs({ page, size }),
    refetchInterval: 5000, // Refetch every 5 seconds
  })

  const jobs = data?.items ?? []
  const totalPages = data?.pages ?? 1

  if (isLoading) {
    return (
      <div className="px-4 py-8">
        <div className="w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading jobs...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-4 py-8">
        <div className="w-full">
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
      <div className="w-full">
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

        {jobs.length === 0 ? (
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
            <JobsTable jobs={jobs as Job[]} />

            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Page {page} of {totalPages}
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page <= 1}
                  className="btn btn-secondary text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={page >= totalPages}
                  className="btn btn-secondary text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Jobs
