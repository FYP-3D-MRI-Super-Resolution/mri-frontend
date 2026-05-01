interface JobsHeaderProps {
  onRefresh: () => void
  isRefreshing: boolean
  title?: string
  description?: string
}

const JobsHeader = ({ 
  onRefresh, 
  isRefreshing,
  title = "Processing Jobs",
  description = "Track the status of your preprocessing and inference jobs"
}: JobsHeaderProps) => (
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8">
    <div>
      <h1 className="text-3xl font-bold text-white">{title}</h1>
      <p className="mt-2 text-dim">
        {description}
      </p>
    </div>
    <button onClick={onRefresh} disabled={isRefreshing} className="btn btn-secondary">
      🔄 {isRefreshing ? 'Refreshing…' : 'Refresh'}
    </button>
  </div>
)

export default JobsHeader
