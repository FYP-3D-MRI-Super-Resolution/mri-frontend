import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import UploadForm from './components/UploadForm'
import UploadHeader from './components/UploadHeader'
import UploadSuccess from './components/UploadSuccess'
import UploadGuidelines from './components/UploadGuidelines'

const Upload = () => {
  const navigate = useNavigate()
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [jobId, setJobId] = useState<string | null>(null)

  const handleUploadSuccess = (newJobId: string) => {
    setJobId(newJobId)
    setUploadSuccess(true)
  }

  return (
    <div className="px-4 py-8">
      <div className="w-full">
        <UploadHeader />

        {uploadSuccess && jobId ? (
          <UploadSuccess
            jobId={jobId}
            onViewJobs={() => navigate('/jobs')}
            onUploadMore={() => {
              setUploadSuccess(false)
              setJobId(null)
            }}
          />
        ) : (
          <div className="card">
            <UploadForm onSuccess={handleUploadSuccess} />
          </div>
        )}

        <UploadGuidelines />
      </div>
    </div>
  )
}

export default Upload
