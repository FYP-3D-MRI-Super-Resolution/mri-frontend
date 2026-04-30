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
  const mode = 'inference-preprocess' as const

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
            message="Your low-resolution scan has been uploaded and inference preprocessing has started. You can track progress in the Jobs page."
            onViewJobs={() => navigate('/app/jobs')}
            onUploadMore={() => {
              setUploadSuccess(false)
              setJobId(null)
            }}
          />
        ) : (
          <div className="card">
            <UploadForm mode={mode} onSuccess={handleUploadSuccess} />
          </div>
        )}

        <UploadGuidelines />
      </div>
    </div>
  )
}

export default Upload
