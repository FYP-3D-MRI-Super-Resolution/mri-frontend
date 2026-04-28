interface JobsHeaderProps {
  onRefresh: () => void
  isRefreshing: boolean
}

const JobsHeader = ({ onRefresh, isRefreshing }: JobsHeaderProps) => (
  <div className="flex justify-between items-center mb-8">
    <div>
      <h1 className="text-3xl font-bold text-white">Processing Jobs</h1>
      <p className="mt-2 text-dim">
        Track the status of your preprocessing and inference jobs
      </p>
    </div>
    <button onClick={onRefresh} disabled={isRefreshing} className="btn btn-secondary">
      🔄 {isRefreshing ? 'Refreshing…' : 'Refresh'}
    </button>
  </div>
)

export default JobsHeader
