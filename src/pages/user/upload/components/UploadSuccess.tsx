interface UploadSuccessProps {
  jobId: string
  onViewJobs: () => void
  onUploadMore: () => void
}

const UploadSuccess = ({ jobId, onViewJobs, onUploadMore }: UploadSuccessProps) => (
  <div className="card space-y-6">
    <div className="flex items-center space-x-3 text-green-400">
      <svg className="h-8 w-8 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <div>
        <h2 className="text-xl font-semibold text-white">Upload Successful!</h2>
        <p className="text-sm text-dim">Job ID: {jobId}</p>
      </div>
    </div>

    <p className="text-dim">
      Your files have been uploaded and preprocessing has started. You can track the
      progress in the Jobs page.
    </p>

    <div className="flex flex-wrap gap-3">
      <button onClick={onViewJobs} className="btn btn-primary">
        View Job Status
      </button>
      <button onClick={onUploadMore} className="btn btn-secondary">
        Upload More Files
      </button>
    </div>
  </div>
)

export default UploadSuccess
