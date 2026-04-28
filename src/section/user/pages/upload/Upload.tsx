import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import UploadForm from './components/UploadForm'
import UploadHeader from './components/UploadHeader'
import UploadSuccess from './components/UploadSuccess'
import UploadGuidelines from './components/UploadGuidelines'

const Upload = () => {
  const navigate = useNavigate()
  const [mode, setMode] = useState<'dataset-preprocess' | 'inference-preprocess'>('inference-preprocess')
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
            mode={mode}
            onViewJobs={() => navigate('/jobs')}
            onUploadMore={() => {
              setUploadSuccess(false)
              setJobId(null)
            }}
          />
        ) : (
          <div className="card">
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-300 mb-3">Choose workflow</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setMode('inference-preprocess')}
                  className={`rounded-lg border p-3 text-left transition-colors ${
                    mode === 'inference-preprocess'
                      ? 'border-cyan-400 bg-cyan-500/10 text-cyan-200'
                      : 'border-gray-700 bg-gray-900/40 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <p className="font-semibold">Inference Preprocessing</p>
                  <p className="mt-1 text-xs text-dim">Upload one LR scan and prepare it for the SR model.</p>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('dataset-preprocess')}
                  className={`rounded-lg border p-3 text-left transition-colors ${
                    mode === 'dataset-preprocess'
                      ? 'border-cyan-400 bg-cyan-500/10 text-cyan-200'
                      : 'border-gray-700 bg-gray-900/40 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <p className="font-semibold">Dataset Preprocessing</p>
                  <p className="mt-1 text-xs text-dim">Upload one or more scans to generate training-style outputs.</p>
                </button>
              </div>
            </div>

            <UploadForm mode={mode} onSuccess={handleUploadSuccess} />
          </div>
        )}

        <UploadGuidelines />
      </div>
    </div>
  )
}

export default Upload
