interface JobsPaginationProps {
  page: number
  totalPages: number
  onPrev: () => void
  onNext: () => void
}

const JobsPagination = ({ page, totalPages, onPrev, onNext }: JobsPaginationProps) => (
  <div className="flex items-center justify-between pt-4">
    <p className="text-sm text-dim">
      Page {page} of {totalPages}
    </p>
    <div className="flex space-x-2">
      <button
        onClick={onPrev}
        disabled={page <= 1}
        className="btn btn-secondary text-sm disabled:opacity-50"
      >
        Previous
      </button>
      <button
        onClick={onNext}
        disabled={page >= totalPages}
        className="btn btn-secondary text-sm disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
)

export default JobsPagination
