import { useState } from 'react'

import { useJobs } from '@/hooks'
import type { Job } from '@/types'
import JobsTable from './components/JobsTable'
import { JobsTableSkeleton } from '../../../components/Skeleton'
import JobsHeader from './components/JobsHeader'
import JobsEmpty from './components/JobsEmpty'
import JobsPagination from './components/JobsPagination'
import { DEFAULT_PAGE_SIZE, JOBS_REFETCH_INTERVAL } from './constants'

const Jobs = () => {
  const [page, setPage] = useState(1)

  const { data, isLoading, error, refetch, isFetching } = useJobs(
    { page, size: DEFAULT_PAGE_SIZE },
    { refetchInterval: JOBS_REFETCH_INTERVAL }
  )

  const jobs = data?.items ?? []
  const totalPages = data?.pages ?? 1

  if (isLoading) {
    return (
      <div className="px-4 py-8">
        <JobsTableSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-4 py-8">
        <div className="card border border-red-500/30 bg-red-500/10">
          <p className="text-red-400">
            Error loading jobs: {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-8">
      <div className="w-full">
        <JobsHeader onRefresh={refetch} isRefreshing={isFetching} />

        {jobs.length === 0 ? (
          <JobsEmpty />
        ) : (
          <div className="space-y-4">
            <JobsTable jobs={jobs as Job[]} />
            <JobsPagination
              page={page}
              totalPages={totalPages}
              onPrev={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Jobs
