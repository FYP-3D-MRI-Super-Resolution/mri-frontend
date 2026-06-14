import type { ViewMode, ViewerVariant } from '../constants'
import { VIEW_MODE_BUTTONS } from '../constants'
import type { LRVariants, OutputFileEntry } from '@/shared/types'
import { filesService } from '@/section/user/services/files.service'

interface ViewerControlsProps {
  viewMode: ViewMode
  variant?: ViewerVariant
  userHasSrOutput?: boolean
  opacity: number
  selectedIndex: number
  selectedVariant: string
  lrUrl?: string
  hrUrl?: string
  volumeUrl?: string
  outputFiles: OutputFileEntry[]
  lrVariants: LRVariants
  onViewModeChange: (mode: ViewMode) => void
  onOpacityChange: (value: number) => void
  onFileSelect: (index: number) => void
  onVariantChange: (variant: string) => void
}

const USER_SR_VIEW_MODES: ViewMode[] = ['side-by-side', 'lr-only', 'hr-only']

const ViewerControls = ({
  viewMode,
  variant = 'user',
  userHasSrOutput = false,
  opacity,
  selectedIndex,
  selectedVariant,
  lrUrl,
  hrUrl,
  volumeUrl,
  outputFiles,
  lrVariants,
  onViewModeChange,
  onOpacityChange,
  onFileSelect,
  onVariantChange,
}: ViewerControlsProps) => {
  const adminVariantKeys = Object.keys(lrVariants).filter((key) => key !== 'preprocessed')
  const isAdmin = variant === 'admin'

  const handleDownloadHR = async () => {
    if (!hrUrl) return
    try {
      await filesService.downloadNifti(hrUrl)
    } catch {
      window.alert('Download failed. Please try again.')
    }
  }

  const handleDownloadLR = async () => {
    if (!lrUrl) return
    try {
      await filesService.downloadNifti(lrUrl)
    } catch {
      window.alert('Download failed. Please try again.')
    }
  }

  const handleDownloadVolume = async () => {
    if (!volumeUrl) return
    try {
      await filesService.downloadNifti(volumeUrl)
    } catch {
      window.alert('Download failed. Please try again or check that the job finished successfully.')
    }
  }

  if (!isAdmin && !userHasSrOutput) {
    return (
      <div className="card space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-dim">
            Viewing the preprocessed scan prepared for downstream inference.
          </p>
          {volumeUrl && (
            <button
              onClick={handleDownloadVolume}
              className="btn btn-secondary text-sm flex items-center gap-1"
              title="Download preprocessed NIfTI file"
            >
              ↓ Download Preprocessed NIfTI
            </button>
          )}
        </div>

        {outputFiles.length > 1 && (
          <div className="flex items-center space-x-3">
            <label className="text-sm text-dim">Subject:</label>
            <select
              value={selectedIndex}
              onChange={(e) => onFileSelect(Number(e.target.value))}
              className="rounded-lg border border-slate-600 bg-slate-800 text-white text-sm px-3 py-1 focus:outline-none focus:border-cyan-400"
            >
              {outputFiles.map((file, index) => {
                const parts = (file.hr ?? '').split('/')
                const label = parts[parts.length - 1] || `Subject ${index + 1}`
                return (
                  <option key={index} value={index}>
                    {label}
                  </option>
                )
              })}
            </select>
          </div>
        )}
      </div>
    )
  }

  if (!isAdmin && userHasSrOutput) {
    return (
      <div className="card space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex flex-wrap gap-2">
            {USER_SR_VIEW_MODES.map((mode) => {
              const label =
                mode === 'side-by-side'
                  ? 'Side by Side'
                  : mode === 'lr-only'
                    ? 'Preprocessed Only'
                    : 'SR Output Only'
              return (
                <button
                  key={mode}
                  onClick={() => onViewModeChange(mode)}
                  className={`btn text-sm ${viewMode === mode ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {label}
                </button>
              )
            })}
          </div>

          <div className="flex gap-2">
            {lrUrl && (
              <button
                onClick={handleDownloadLR}
                className="btn btn-secondary text-sm flex items-center gap-1"
                title="Download preprocessed NIfTI file"
              >
                ↓ Preprocessed
              </button>
            )}
            {hrUrl && (
              <button
                onClick={handleDownloadHR}
                className="btn btn-secondary text-sm flex items-center gap-1"
                title="Download super-resolution NIfTI file"
              >
                ↓ SR Output
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex flex-wrap gap-2">
          {VIEW_MODE_BUTTONS.map(({ mode, label, requiresBoth }) => {
            const isVisible = requiresBoth ? !!(lrUrl && hrUrl) : !!hrUrl
            if (!isVisible) return null
            return (
              <button
                key={mode}
                onClick={() => onViewModeChange(mode)}
                className={`btn text-sm ${viewMode === mode ? 'btn-primary' : 'btn-secondary'}`}
              >
                {label}
              </button>
            )
          })}
        </div>

        {viewMode === 'overlay' && (
          <div className="flex items-center space-x-3">
            <label className="text-sm text-dim">Opacity:</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={opacity}
              onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
              className="w-32 accent-cyan-400"
            />
            <span className="text-sm font-medium text-white">{Math.round(opacity * 100)}%</span>
          </div>
        )}
      </div>

      {adminVariantKeys.length > 0 && (
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-dim whitespace-nowrap">LR Variant:</label>
            <select
              value={selectedVariant}
              onChange={(e) => onVariantChange(e.target.value)}
              className="rounded-lg border border-slate-600 bg-slate-800 text-white text-sm px-3 py-1 focus:outline-none focus:border-cyan-400"
            >
              {adminVariantKeys.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 ml-auto">
            {hrUrl && (
              <button
                onClick={handleDownloadHR}
                className="btn btn-secondary text-sm flex items-center gap-1"
                title="Download HR NIfTI file"
              >
                ↓ HR
              </button>
            )}
            {lrUrl && (
              <button
                onClick={handleDownloadLR}
                className="btn btn-secondary text-sm flex items-center gap-1"
                title={`Download LR variant: ${selectedVariant}`}
              >
                ↓ LR ({selectedVariant})
              </button>
            )}
          </div>
        </div>
      )}

      {outputFiles.length > 1 && (
        <div className="flex items-center space-x-3">
          <label className="text-sm text-dim">Subject:</label>
          <select
            value={selectedIndex}
            onChange={(e) => onFileSelect(Number(e.target.value))}
            className="rounded-lg border border-slate-600 bg-slate-800 text-white text-sm px-3 py-1 focus:outline-none focus:border-cyan-400"
          >
            {outputFiles.map((file, index) => {
              const parts = (file.hr ?? '').split('/')
              const label = parts[parts.length - 1] || `Subject ${index + 1}`
              return (
                <option key={index} value={index}>
                  {label}
                </option>
              )
            })}
          </select>
        </div>
      )}
    </div>
  )
}

export default ViewerControls
