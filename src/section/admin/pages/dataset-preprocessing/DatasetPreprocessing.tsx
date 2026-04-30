import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useJobs } from '@/section/user/hooks'
import type { Job } from '@/shared/types'
import UploadForm from '@/section/user/pages/upload/components/UploadForm'
import UploadSuccess from '@/section/user/pages/upload/components/UploadSuccess'
import UploadGuidelines from '@/section/user/pages/upload/components/UploadGuidelines'
import JobsTable from '@/section/user/pages/jobs/components/JobsTable'
import JobsHeader from '@/section/user/pages/jobs/components/JobsHeader'
import { JobsTableSkeleton } from '@/shared/components/Skeleton'
import JobsPagination from '@/section/user/pages/jobs/components/JobsPagination'
import { DEFAULT_PAGE_SIZE, JOBS_REFETCH_INTERVAL } from '@/section/user/pages/jobs/constants'

const DatasetPreprocessing = () => {
  const navigate = useNavigate()
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [jobId, setJobId] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const mode = 'dataset-preprocess' as const

  const handleUploadSuccess = (newJobId: string) => {
    setJobId(newJobId)
    setUploadSuccess(true)
  }

  const { data, isLoading, error, refetch, isFetching } = useJobs(
    { page, size: DEFAULT_PAGE_SIZE, scope: 'dataset' },
    { refetchInterval: JOBS_REFETCH_INTERVAL }
  )

  const jobs = data?.items ?? []
  const totalPages = data?.pages ?? 1

  return (
    <div className="px-4 py-8">
      <div className="w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Dataset Preprocessing</h1>
          <p className="mt-2 text-slate-400">
            Upload one or more MRI scans to prepare training-ready dataset outputs.
          </p>
        </div>

        {uploadSuccess && jobId ? (
          <UploadSuccess
            jobId={jobId}
            message="Your dataset upload has been saved and preprocessing has started. You can return to the admin dashboard to review system activity."
            primaryActionLabel="Back to Dashboard"
            onViewJobs={() => navigate('/admin/dashboard')}
            onUploadMore={() => {
              setUploadSuccess(false)
              setJobId(null)
            }}
          />
        ) : (
          <div className="card">
            <UploadForm mode={mode} onSuccess={handleUploadSuccess} />
          </div>
        )}

        <UploadGuidelines />

        {/* Dataset Jobs Section */}
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-white">Dataset Preprocessing Jobs</h2>

          {isLoading ? (
            <JobsTableSkeleton />
          ) : error ? (
            <div className="card border border-red-500/30 bg-red-500/10">
              <p className="text-red-400">
                Error loading jobs: {error instanceof Error ? error.message : 'Unknown error'}
              </p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="card">
              <p className="text-slate-400">No dataset preprocessing jobs yet.</p>
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
    </div>
  )
}

export default DatasetPreprocessing
