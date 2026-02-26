import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { jobsService } from '@/api/services'
import type { Job } from '@/types'
import MRIViewer from '../components/MRIViewer'

type ViewMode = 'side-by-side' | 'overlay' | 'lr-only' | 'hr-only'

const Viewer = () => {
  const { jobId } = useParams<{ jobId: string }>()
  const [viewMode, setViewMode] = useState<ViewMode>('side-by-side')
  const [opacity, setOpacity] = useState(0.5)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const { data: job, isLoading, error } = useQuery<Job>({
    queryKey: ['job', jobId],
    queryFn: () => jobsService.getJob(jobId!),
    enabled: !!jobId,
  })

  useEffect(() => {
    setSelectedIndex(0)
    if (job?.output_files && job.output_files.length > 0) {
      const firstOutput = job.output_files[0]
      const isPair =
        typeof firstOutput === 'object' &&
        firstOutput !== null &&
        'hr' in firstOutput &&
        'lr' in firstOutput
      setViewMode(isPair ? 'side-by-side' : 'hr-only')
    }
  }, [job?.id, job?.output_files])

  const normalizeFileUrl = (filePath?: string) => {
    if (!filePath || !jobId) return ''
    if (filePath.startsWith('/api/files/')) return filePath
    const parts = filePath.split(/[/\\]/)
    const filename = parts[parts.length - 1]
    return `/api/files/${jobId}/${filename}`
  }

  const outputFiles = job?.output_files ?? []
  const hasPairOutputs =
    outputFiles.length > 0 &&
    typeof outputFiles[0] === 'object' &&
    outputFiles[0] !== null &&
    'hr' in outputFiles[0] &&
    'lr' in outputFiles[0]

  const hasStringOutputs =
    outputFiles.length > 0 && typeof outputFiles[0] === 'string'

  let lrUrl = job?.lr_file_url
  let hrUrl = job?.hr_file_url

  if (hasPairOutputs) {
    const pair = outputFiles[selectedIndex] as { hr: string; lr: string }
    lrUrl = normalizeFileUrl(pair.lr)
    hrUrl = normalizeFileUrl(pair.hr)
  } else if (hasStringOutputs) {
    const filePath = outputFiles[selectedIndex] as string
    hrUrl = normalizeFileUrl(filePath)
  }

  if (isLoading) {
    return (
      <div className="px-4 py-8">
        <div className="w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading viewer...</p>
        </div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="px-4 py-8">
        <div className="w-full">
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
      <div className="w-full space-y-6">
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
              {lrUrl && hrUrl && (
                <>
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
                </>
              )}
              {hrUrl && (
                <button
                  onClick={() => setViewMode('hr-only')}
                  className={`btn text-sm ${
                    viewMode === 'hr-only' ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  HR Only
                </button>
              )}
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

          {outputFiles.length > 1 && (
            <div className="mt-4 flex items-center space-x-3">
              <label className="text-sm text-gray-700 dark:text-gray-300">
                Select file:
              </label>
              <select
                value={selectedIndex}
                onChange={(e) => setSelectedIndex(Number(e.target.value))}
                className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm px-3 py-1"
              >
                {outputFiles.map((file, index) => {
                  const filePath =
                    typeof file === 'string'
                      ? file
                      : (file as { hr: string; lr: string }).hr
                  const parts = filePath.split(/[/\\]/)
                  const label = parts[parts.length - 1] || `File ${index + 1}`
                  return (
                    <option key={label} value={index}>
                      {label}
                    </option>
                  )
                })}
              </select>
            </div>
          )}
        </div>

        {/* Viewer */}
        <div className="card">
          {viewMode === 'side-by-side' && lrUrl && hrUrl && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MRIViewer fileUrl={lrUrl} title="Low Resolution" />
              <MRIViewer fileUrl={hrUrl} title="Super Resolution" />
            </div>
          )}

          {viewMode === 'overlay' && hrUrl && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Overlay visualization (adjust opacity above)
              </p>
              {/* TODO: Implement proper overlay viewer with NiiVue */}
              <MRIViewer fileUrl={hrUrl} title="Overlay View" />
            </div>
          )}

          {viewMode === 'lr-only' && lrUrl && (
            <MRIViewer fileUrl={lrUrl} title="Low Resolution" />
          )}

          {viewMode === 'hr-only' && hrUrl && (
            <MRIViewer fileUrl={hrUrl} title="Super Resolution" />
          )}

          {(!lrUrl || !hrUrl) && viewMode === 'side-by-side' && (
            <div className="text-center py-12 text-gray-500">
              <p>Files not yet available. Please wait for processing to complete.</p>
            </div>
          )}
          {!hrUrl && viewMode !== 'side-by-side' && (
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
              {Object.entries(job.metrics).map(([key, value]) => (
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
