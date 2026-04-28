import { Link } from 'react-router-dom'

const JobsEmpty = () => (
  <div className="card text-center py-12">
    <div className="text-6xl mb-4">📋</div>
    <h2 className="text-xl font-semibold text-white mb-2">No Jobs Yet</h2>
    <p className="text-dim mb-6">Upload MRI scans to start processing</p>
    <Link to="/upload" className="btn btn-primary inline-block">
      Upload Files
    </Link>
  </div>
)

export default JobsEmpty
