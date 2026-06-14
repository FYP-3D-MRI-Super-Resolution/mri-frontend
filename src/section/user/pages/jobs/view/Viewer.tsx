import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useJob } from '@/section/user/hooks'
import type { OutputFileEntry } from '@/shared/types'
import { ViewerSkeleton } from '../../../../../shared/components/Skeleton'
import ViewerHeader from './components/ViewerHeader'
import ViewerControls from './components/ViewerControls'
import ViewerDisplay from './components/ViewerDisplay'
import ViewerMetrics from './components/ViewerMetrics'
import type { ViewMode, ViewerVariant } from './constants'

interface ViewerProps {
  variant?: ViewerVariant
}

const Viewer = ({ variant = 'user' }: ViewerProps) => {
  const { jobId } = useParams<{ jobId: string }>()
  const isAdmin = variant === 'admin'
  const [viewMode, setViewMode] = useState<ViewMode>(isAdmin ? 'side-by-side' : 'single')
  const [opacity, setOpacity] = useState(0.5)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState<string>('')

  const { data: job, isLoading, error } = useJob(jobId!, !!jobId)

  const outputFiles: OutputFileEntry[] = (job?.output_files ?? []) as OutputFileEntry[]
  const currentEntry = outputFiles[selectedIndex] ?? {}

  const srUrl = currentEntry.hr ?? job?.hr_file_url ?? ''
  const lrVariants = currentEntry.lr_variants ?? {}
  const preprocessedUrl = lrVariants.preprocessed ?? job?.lr_file_url ?? ''
  const lrVariantKeys = Object.keys(lrVariants).filter((key) => key !== 'preprocessed')
  const lrVariantKeysStr = lrVariantKeys.join(',')

  const userHasSrOutput = !isAdmin && !!preprocessedUrl && !!srUrl

  useEffect(() => {
    if (!isAdmin || !lrVariantKeysStr) return
    const keys = lrVariantKeysStr.split(',')
    if (keys.length > 0 && !selectedVariant) {
      const preferred = keys.find((k) => k === 'inplane_ds2') ?? keys[0]
      setSelectedVariant(preferred)
    }
  }, [isAdmin, lrVariantKeysStr, selectedVariant])

  useEffect(() => {
    setSelectedIndex(0)

    if (!isAdmin) {
      setViewMode(userHasSrOutput ? 'side-by-side' : 'single')
      return
    }

    const files = (job?.output_files ?? []) as OutputFileEntry[]
    if (files.length > 0) {
      const hasLR = Object.keys(files[0]?.lr_variants ?? {}).filter(
        (key) => key !== 'preprocessed',
      ).length > 0
      setViewMode(hasLR ? 'side-by-side' : 'hr-only')
    }
  }, [job?.id, job?.output_files, isAdmin, userHasSrOutput])

  const adminLrUrl = lrVariants[selectedVariant] ?? job?.lr_file_url ?? ''
  const lrUrl = isAdmin ? adminLrUrl : preprocessedUrl
  const hrUrl = srUrl
  const volumeUrl = preprocessedUrl || srUrl

  if (isLoading) {
    return (
      <div className="px-4 py-8">
        <ViewerSkeleton variant={variant} />
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
        <ViewerHeader
          jobId={jobId!}
          variant={variant}
          hasSrOutput={userHasSrOutput}
        />

        <ViewerControls
          variant={variant}
          viewMode={viewMode}
          opacity={opacity}
          selectedIndex={selectedIndex}
          selectedVariant={selectedVariant}
          lrUrl={lrUrl}
          hrUrl={hrUrl}
          volumeUrl={volumeUrl}
          outputFiles={outputFiles}
          lrVariants={lrVariants}
          userHasSrOutput={userHasSrOutput}
          onViewModeChange={setViewMode}
          onOpacityChange={setOpacity}
          onFileSelect={setSelectedIndex}
          onVariantChange={setSelectedVariant}
        />

        <ViewerDisplay
          variant={variant}
          viewMode={viewMode}
          lrUrl={lrUrl}
          hrUrl={hrUrl}
          volumeUrl={volumeUrl}
          userHasSrOutput={userHasSrOutput}
        />

        {job.metrics && <ViewerMetrics metrics={job.metrics} />}
      </div>
    </div>
  )
}

export default Viewer
