import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useJob } from '@/section/user/hooks'
import type { OutputFileEntry } from '@/shared/types'
import { ViewerSkeleton } from '../../../../../shared/components/Skeleton'
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
  const [selectedVariant, setSelectedVariant] = useState<string>('')

  const { data: job, isLoading, error } = useJob(jobId!, !!jobId)

  // Follow chained inference job if this is a preprocessing job
  const chainedJobId = job?.metrics?.chained_inference_job_id as string | undefined
  const { data: inferenceJob } = useJob(chainedJobId!, !!chainedJobId)

  // Use the inference job if it's completed, otherwise fall back to the base job
  // This satisfies the requirement to show SOUP-GAN output instead of preprocessing output
  const displayJob = (inferenceJob && inferenceJob.status === 'completed') ? inferenceJob : job

  // Derive output files with the new OutputFileEntry shape
  const outputFiles: OutputFileEntry[] = (displayJob?.output_files ?? []) as OutputFileEntry[]
  const currentEntry = outputFiles[selectedIndex] ?? {}

  const hrUrl = currentEntry.hr ?? displayJob?.hr_file_url ?? ''
  const lrVariants = currentEntry.lr_variants ?? {}
  const lrVariantKeys = Object.keys(lrVariants)
  const lrVariantKeysStr = lrVariantKeys.join(',')

  // Auto-select first LR variant when variant list changes or on first load
  useEffect(() => {
    if (!lrVariantKeysStr) return
    const keys = lrVariantKeysStr.split(',')
    if (keys.length > 0 && !selectedVariant) {
      const preferred = keys.find((k) => k === 'inplane_ds2') ?? keys[0]
      setSelectedVariant(preferred)
    }
  }, [lrVariantKeysStr, selectedVariant])

  // Reset selected file index and choose view mode when job changes
  useEffect(() => {
    setSelectedIndex(0)
    const files = (displayJob?.output_files ?? []) as OutputFileEntry[]
    if (files.length > 0) {
      const hasLR = Object.keys(files[0]?.lr_variants ?? {}).length > 0
      setViewMode(hasLR ? 'side-by-side' : 'hr-only')
    }
  }, [displayJob?.id, displayJob?.output_files])

  const lrUrl = lrVariants[selectedVariant] ?? displayJob?.lr_file_url ?? job?.lr_file_url ?? ''

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
          selectedVariant={selectedVariant}
          lrUrl={lrUrl}
          hrUrl={hrUrl}
          outputFiles={outputFiles}
          lrVariants={lrVariants}
          onViewModeChange={setViewMode}
          onOpacityChange={setOpacity}
          onFileSelect={setSelectedIndex}
          onVariantChange={setSelectedVariant}
        />

        <ViewerDisplay viewMode={viewMode} lrUrl={lrUrl} hrUrl={hrUrl} />

        {displayJob.metrics && <ViewerMetrics metrics={displayJob.metrics} />}
      </div>
    </div>
  )
}

export default Viewer
