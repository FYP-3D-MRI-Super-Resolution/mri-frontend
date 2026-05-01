interface ViewerHeaderProps {
  jobId: string
}

const ViewerHeader = ({ jobId }: ViewerHeaderProps) => (
  <div>
    <h1 className="text-3xl font-bold text-white">3D MRI Viewer</h1>
    <p className="mt-2 text-dim">Job ID: {jobId}</p>
  </div>
)

export default ViewerHeader
