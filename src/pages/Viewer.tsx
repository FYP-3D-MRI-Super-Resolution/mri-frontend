import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchJobDetails } from '../api/client'
import MRIViewer from '../components/MRIViewer'

type ViewMode = 'side-by-side' | 'overlay' | 'lr-only' | 'hr-only'

const Viewer = () => {
  const { jobId } = useParams<{ jobId: string }>()
  const [viewMode, setViewMode] = useState<ViewMode>('side-by-side')
  const [opacity, setOpacity] = useState(0.5)

  const { data: job, isLoading, error } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => fetchJobDetails(jobId!),
    enabled: !!jobId,
  })

  if (isLoading) {
    return (
      <div className="px-4 py-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading viewer...</p>
        </div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="card bg-red-50 border border-red-200">
            <p className="text-red-700">
              Error loading job: {error instanceof Error ? error.message : 'Not found'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            3D MRI Viewer
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Job ID: {jobId}
          </p>
        </div>

        {/* View Mode Controls */}
        <div className="card">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="space-x-2">
              <button
                onClick={() => setViewMode('side-by-side')}
                className={`btn text-sm ${
                  viewMode === 'side-by-side' ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                Side by Side
              </button>
              <button
                onClick={() => setViewMode('overlay')}
                className={`btn text-sm ${
                  viewMode === 'overlay' ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                Overlay
              </button>
              <button
                onClick={() => setViewMode('lr-only')}
                className={`btn text-sm ${
                  viewMode === 'lr-only' ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                LR Only
              </button>
              <button
                onClick={() => setViewMode('hr-only')}
                className={`btn text-sm ${
                  viewMode === 'hr-only' ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                HR Only
              </button>
            </div>

            {viewMode === 'overlay' && (
              <div className="flex items-center space-x-3">
                <label className="text-sm text-gray-700 dark:text-gray-300">
                  Opacity:
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={opacity}
                  onChange={(e) => setOpacity(parseFloat(e.target.value))}
                  className="w-32"
                />
                <span className="text-sm font-medium">{Math.round(opacity * 100)}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Viewer */}
        <div className="card">
          {viewMode === 'side-by-side' && job.lr_file_url && job.hr_file_url && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MRIViewer fileUrl={job.lr_file_url} title="Low Resolution" />
              <MRIViewer fileUrl={job.hr_file_url} title="Super Resolution" />
            </div>
          )}

          {viewMode === 'overlay' && job.hr_file_url && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Overlay visualization (adjust opacity above)
              </p>
              {/* TODO: Implement proper overlay viewer with NiiVue */}
              <MRIViewer fileUrl={job.hr_file_url} title="Overlay View" />
            </div>
          )}

          {viewMode === 'lr-only' && job.lr_file_url && (
            <MRIViewer fileUrl={job.lr_file_url} title="Low Resolution" />
          )}

          {viewMode === 'hr-only' && job.hr_file_url && (
            <MRIViewer fileUrl={job.hr_file_url} title="Super Resolution" />
          )}

          {(!job.lr_file_url || !job.hr_file_url) && (
            <div className="text-center py-12 text-gray-500">
              <p>Files not yet available. Please wait for processing to complete.</p>
            </div>
          )}
        </div>

        {/* Metrics */}
        {job.metrics && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Quality Metrics
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(job.metrics).map(([key, value]: [string, any]) => (
                <div key={key} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded">
                  <p className="text-sm text-gray-600 dark:text-gray-400 uppercase">
                    {key}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {typeof value === 'number' ? value.toFixed(4) : value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Viewer
