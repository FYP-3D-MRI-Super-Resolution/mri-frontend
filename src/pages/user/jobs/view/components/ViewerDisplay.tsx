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
  <div className="card">
    {viewMode === 'side-by-side' && lrUrl && hrUrl && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MRIViewer fileUrl={lrUrl} title="Low Resolution" />
        <MRIViewer fileUrl={hrUrl} title="Super Resolution" />
      </div>
    )}

    {viewMode === 'overlay' && hrUrl && (
      <div className="space-y-4">
        <p className="text-sm text-dim">Overlay visualization (adjust opacity above)</p>
        <MRIViewer fileUrl={hrUrl} title="Overlay View" />
      </div>
    )}

    {viewMode === 'lr-only' && lrUrl && <MRIViewer fileUrl={lrUrl} title="Low Resolution" />}
    {viewMode === 'hr-only' && hrUrl && <MRIViewer fileUrl={hrUrl} title="Super Resolution" />}

    {viewMode === 'side-by-side' && (!lrUrl || !hrUrl) && <Unavailable />}
    {viewMode !== 'side-by-side' && !hrUrl && <Unavailable />}
  </div>
)

export default ViewerDisplay
