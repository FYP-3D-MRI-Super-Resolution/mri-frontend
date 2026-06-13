import type { ViewerVariant } from '../constants'

interface ViewerHeaderProps {
  jobId: string
  variant?: ViewerVariant
}

const ViewerHeader = ({ jobId, variant = 'user' }: ViewerHeaderProps) => (
  <div>
    <h1 className="text-3xl font-bold text-white">3D MRI Viewer</h1>
    <p className="mt-2 text-dim">
      {variant === 'admin'
        ? 'Compare HR reference volumes with simulated LR variants.'
        : 'Inspect your inference-ready preprocessed scan.'}
    </p>
    <p className="mt-1 text-sm text-dim">Job ID: {jobId}</p>
  </div>
)

export default ViewerHeader
