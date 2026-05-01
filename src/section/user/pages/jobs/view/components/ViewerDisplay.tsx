import MRIViewer from './MRIViewer'
import type { ViewMode } from '../constants'

interface ViewerDisplayProps {
  viewMode: ViewMode
  lrUrl?: string
  hrUrl?: string
}

const Unavailable = () => (
  <div className="text-center py-12 text-dim">
    <p>Files not yet available. Please wait for processing to complete.</p>
  </div>
)

const ViewerDisplay = ({ viewMode, lrUrl, hrUrl }: ViewerDisplayProps) => (
  <div>
    {viewMode === 'side-by-side' && lrUrl && hrUrl && (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <MRIViewer fileUrl={lrUrl} title="Low Resolution" />
        <MRIViewer fileUrl={hrUrl} title="Super Resolution" />
      </div>
    )}

    {viewMode === 'overlay' && hrUrl && (
      <MRIViewer fileUrl={hrUrl} title="Overlay View" />
    )}

    {viewMode === 'lr-only' && lrUrl && <MRIViewer fileUrl={lrUrl} title="Low Resolution" />}
    {viewMode === 'hr-only' && hrUrl && <MRIViewer fileUrl={hrUrl} title="Super Resolution" />}

    {viewMode === 'side-by-side' && (!lrUrl || !hrUrl) && <Unavailable />}
    {viewMode !== 'side-by-side' && !hrUrl && <Unavailable />}
  </div>
)

export default ViewerDisplay
