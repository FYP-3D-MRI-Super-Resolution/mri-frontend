import { useState } from 'react'

import { useJobs } from '@/section/user/hooks'
import type { Job } from '@/shared/types'
import JobsTable from '@/section/user/pages/jobs/components/JobsTable'
import { JobsTableSkeleton } from '@/shared/components/Skeleton'
import JobsHeader from '@/section/user/pages/jobs/components/JobsHeader'
import JobsPagination from '@/section/user/pages/jobs/components/JobsPagination'
import { DEFAULT_PAGE_SIZE, JOBS_REFETCH_INTERVAL } from '@/section/user/pages/jobs/constants'

const AdminJobs = () => {
  const [page, setPage] = useState(1)
  const [scope, setScope] = useState<'all' | 'dataset' | 'inference'>('all')

  const { data, isLoading, error, refetch, isFetching } = useJobs(
    { page, size: DEFAULT_PAGE_SIZE, scope },
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">All Jobs</h1>
          <p className="mt-2 text-slate-400">
            View and manage all system jobs across dataset preprocessing and inference tasks.
          </p>
        </div>

        {/* Scope Filter */}
        <div className="mb-6 flex gap-3">
          {(['all', 'dataset', 'inference'] as const).map((s) => (
            <button
              key={s}
              onClick={() => {
                setScope(s)
                setPage(1)
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                scope === s
                  ? 'bg-cyan-500 text-white'
                  : 'bg-slate-700/40 text-slate-400 hover:bg-slate-600/60 hover:text-slate-100'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {/* Jobs Section */}
        {jobs.length === 0 ? (
          <div className="card">
            <p className="text-slate-400">No jobs found for this scope.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <JobsHeader onRefresh={refetch} isRefreshing={isFetching} />
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

export default AdminJobs
