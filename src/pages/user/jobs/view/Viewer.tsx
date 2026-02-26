import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useJob } from '@/hooks'
import { ViewerSkeleton } from '../../../../components/Skeleton'
import ViewerHeader from './components/ViewerHeader'
import ViewerControls from './components/ViewerControls'
import ViewerDisplay from './components/ViewerDisplay'
import ViewerMetrics from './components/ViewerMetrics'
import type { ViewMode } from './constants'

const Viewer = () => {
  const { jobId } = useParams<{ jobId: string }>()
  const [viewMode, setViewMode] = useState<ViewMode>('side-by-side')
  const [opacity, setOpacity] = useState(0.5)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const { data: job, isLoading, error } = useJob(jobId!, !!jobId)

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
    return `/api/files/${jobId}/${parts[parts.length - 1]}`
  }

  const outputFiles = job?.output_files ?? []
  const hasPairOutputs =
    outputFiles.length > 0 &&
    typeof outputFiles[0] === 'object' &&
    outputFiles[0] !== null &&
    'hr' in outputFiles[0] &&
    'lr' in outputFiles[0]
  const hasStringOutputs = outputFiles.length > 0 && typeof outputFiles[0] === 'string'

  let lrUrl = job?.lr_file_url
  let hrUrl = job?.hr_file_url

  if (hasPairOutputs) {
    const pair = outputFiles[selectedIndex] as { hr: string; lr: string }
    lrUrl = normalizeFileUrl(pair.lr)
    hrUrl = normalizeFileUrl(pair.hr)
  } else if (hasStringOutputs) {
    hrUrl = normalizeFileUrl(outputFiles[selectedIndex] as string)
  }

  if (isLoading) {
    return (
      <div className="px-4 py-8">
        <ViewerSkeleton />
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="px-4 py-8">
        <div className="card border border-red-500/30 bg-red-500/10">
          <p className="text-red-400">
            Error loading job: {error instanceof Error ? error.message : 'Not found'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-8">
      <div className="w-full space-y-6">
        <ViewerHeader jobId={jobId!} />

        <ViewerControls
          viewMode={viewMode}
          opacity={opacity}
          selectedIndex={selectedIndex}
          lrUrl={lrUrl}
          hrUrl={hrUrl}
          outputFiles={outputFiles}
          onViewModeChange={setViewMode}
          onOpacityChange={setOpacity}
          onFileSelect={setSelectedIndex}
        />

        <ViewerDisplay viewMode={viewMode} lrUrl={lrUrl} hrUrl={hrUrl} />

        {job.metrics && <ViewerMetrics metrics={job.metrics} />}
      </div>
    </div>
  )
}

export default Viewer
