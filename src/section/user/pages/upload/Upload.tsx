import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUploadLowResForInferencePreprocess } from '@/section/user/hooks'

import UploadForm from '../../../../shared/components/upload/UploadForm'
import UploadHeader from './components/UploadHeader'
import UploadSuccess from '../../../../shared/components/upload/UploadSuccess'
import UploadGuidelines from '../../../../shared/components/upload/UploadGuidelines'

const Upload = () => {
  const navigate = useNavigate()
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [jobId, setJobId] = useState<string | null>(null)
  const mode = 'inference-preprocess' as const
  const uploadMutation = useUploadLowResForInferencePreprocess()

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
            message="Your low-resolution scan has been uploaded. Preprocessing and LoHiResGAN super-resolution have started. Track progress on the Jobs page."
            onViewJobs={() => navigate('/app/jobs')}
            onUploadMore={() => {
              setUploadSuccess(false)
              setJobId(null)
            }}
          />
        ) : (
          <div className="card">
            <UploadForm
              mode={mode}
              onSubmit={(files) => {
                uploadMutation.mutate(files[0], {
                  onSuccess: (data) => handleUploadSuccess(data.job_id),
                })
              }}
              isSubmitting={uploadMutation.isPending}
              error={uploadMutation.error instanceof Error ? uploadMutation.error.message : null}
            />
          </div>
        )}

        <UploadGuidelines />
      </div>
    </div>
  )
}

export default Upload
