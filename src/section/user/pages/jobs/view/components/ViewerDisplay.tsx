import MRIViewer from './MRIViewer'
import { VIEWER_COPY, type ViewMode, type ViewerVariant } from '../constants'

interface ViewerDisplayProps {
  viewMode: ViewMode
  variant?: ViewerVariant
  userHasSrOutput?: boolean
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
  userHasSrOutput = false,
  lrUrl,
  hrUrl,
  volumeUrl,
}: ViewerDisplayProps) => {
  const userCopy = VIEWER_COPY.user
  const adminCopy = VIEWER_COPY.admin

  return (
  <div>
    {variant === 'user' && userHasSrOutput && viewMode === 'side-by-side' && lrUrl && hrUrl && (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <MRIViewer fileUrl={hrUrl} title={userCopy.inputTitle} />
        <MRIViewer fileUrl={lrUrl} title={userCopy.outputTitle} />
      </div>
    )}

    {variant === 'user' && userHasSrOutput && viewMode === 'lr-only' && lrUrl && (
      <MRIViewer fileUrl={lrUrl} title={userCopy.outputTitle} />
    )}

    {variant === 'user' && userHasSrOutput && viewMode === 'hr-only' && hrUrl && (
      <MRIViewer fileUrl={hrUrl} title={userCopy.inputTitle} />
    )}

    {variant === 'user' && !userHasSrOutput && viewMode === 'single' && volumeUrl && (
      <MRIViewer fileUrl={volumeUrl} title={userCopy.singleTitle} />
    )}

    {variant === 'admin' && viewMode === 'side-by-side' && lrUrl && hrUrl && (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <MRIViewer fileUrl={hrUrl} title={adminCopy.inputTitle} />
        <MRIViewer fileUrl={lrUrl} title={adminCopy.outputTitle} />
      </div>
    )}

    {variant === 'admin' && viewMode === 'overlay' && hrUrl && (
      <MRIViewer fileUrl={hrUrl} title={adminCopy.overlayTitle} />
    )}

    {variant === 'admin' && viewMode === 'lr-only' && lrUrl && (
      <MRIViewer fileUrl={lrUrl} title={adminCopy.outputTitle} />
    )}
    {variant === 'admin' && viewMode === 'hr-only' && hrUrl && (
      <MRIViewer fileUrl={hrUrl} title={adminCopy.inputTitle} />
    )}

    {variant === 'user' && userHasSrOutput && viewMode === 'side-by-side' && (!lrUrl || !hrUrl) && (
      <Unavailable />
    )}
    {variant === 'user' && !userHasSrOutput && viewMode === 'single' && !volumeUrl && <Unavailable />}
    {variant === 'admin' && viewMode === 'side-by-side' && (!lrUrl || !hrUrl) && <Unavailable />}
    {variant === 'admin' && viewMode !== 'side-by-side' && !hrUrl && <Unavailable />}
  </div>
  )
}

export default ViewerDisplay
