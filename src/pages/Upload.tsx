import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UploadForm from '../components/UploadForm'

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Upload MRI Scans
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Upload your NIfTI files to start the preprocessing pipeline
          </p>
        </div>

        {uploadSuccess && jobId ? (
          <div className="card space-y-6">
            <div className="flex items-center space-x-3 text-green-600">
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h2 className="text-xl font-semibold">Upload Successful!</h2>
                <p className="text-sm text-gray-600">Job ID: {jobId}</p>
              </div>
            </div>

            <p className="text-gray-700 dark:text-gray-300">
              Your files have been uploaded and preprocessing has started. You can
              track the progress in the Jobs page.
            </p>

            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/jobs')}
                className="btn btn-primary"
              >
                View Job Status
              </button>
              <button
                onClick={() => {
                  setUploadSuccess(false)
                  setJobId(null)
                }}
                className="btn btn-secondary"
              >
                Upload More Files
              </button>
            </div>
          </div>
        ) : (
          <div className="card">
            <UploadForm onSuccess={handleUploadSuccess} />
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 card bg-blue-50 dark:bg-blue-900/20 border-blue-200">
          <h3 className="text-lg font-semibold mb-3 text-blue-900 dark:text-blue-100">
            📋 Upload Guidelines
          </h3>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <li>• Supported formats: .nii, .nii.gz</li>
            <li>• Maximum file size: 500 MB per file</li>
            <li>• Preprocessing typically takes 5-15 minutes per scan</li>
            <li>• Files are automatically deleted after 7 days</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Upload
