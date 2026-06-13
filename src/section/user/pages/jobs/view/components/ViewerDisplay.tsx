import MRIViewer from './MRIViewer'
import type { ViewMode, ViewerVariant } from '../constants'

interface ViewerDisplayProps {
  viewMode: ViewMode
  variant?: ViewerVariant
  lrUrl?: string
  hrUrl?: string
  volumeUrl?: string
}

const Unavailable = () => (
  <div className="text-center py-12 text-dim">
    <p>Files not yet available. Please wait for processing to complete.</p>
  </div>
)

const ViewerDisplay = ({
  viewMode,
  variant = 'user',
  lrUrl,
  hrUrl,
  volumeUrl,
}: ViewerDisplayProps) => (
  <div>
    {variant === 'user' && viewMode === 'single' && volumeUrl && (
      <MRIViewer fileUrl={volumeUrl} title="Preprocessed Scan" />
    )}

    {variant === 'admin' && viewMode === 'side-by-side' && lrUrl && hrUrl && (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <MRIViewer fileUrl={lrUrl} title="Low Resolution" />
        <MRIViewer fileUrl={hrUrl} title="High Resolution" />
      </div>
    )}

    {variant === 'admin' && viewMode === 'overlay' && hrUrl && (
      <MRIViewer fileUrl={hrUrl} title="Overlay View" />
    )}

    {variant === 'admin' && viewMode === 'lr-only' && lrUrl && (
      <MRIViewer fileUrl={lrUrl} title="Low Resolution" />
    )}
    {variant === 'admin' && viewMode === 'hr-only' && hrUrl && (
      <MRIViewer fileUrl={hrUrl} title="High Resolution" />
    )}

    {variant === 'user' && viewMode === 'single' && !volumeUrl && <Unavailable />}
    {variant === 'admin' && viewMode === 'side-by-side' && (!lrUrl || !hrUrl) && <Unavailable />}
    {variant === 'admin' && viewMode !== 'side-by-side' && !hrUrl && <Unavailable />}
  </div>
)

export default ViewerDisplay
