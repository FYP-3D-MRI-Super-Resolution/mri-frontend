import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useMutation } from '@tanstack/react-query'
import { uploadFiles } from '../api/client'

interface UploadFormProps {
  onSuccess?: (jobId: string) => void
}

const UploadForm = ({ onSuccess }: UploadFormProps) => {
  const [files, setFiles] = useState<File[]>([])

  const uploadMutation = useMutation({
    mutationFn: uploadFiles,
    onSuccess: (data) => {
      if (onSuccess) {
        onSuccess(data.job_id)
      }
      setFiles([])
    },
  })

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const niftiFiles = acceptedFiles.filter(
      (file) =>
        file.name.endsWith('.nii') ||
        file.name.endsWith('.nii.gz') ||
        file.name.endsWith('.gz')
    )
    setFiles((prev) => [...prev, ...niftiFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/x-nifti': ['.nii', '.nii.gz'],
      'application/gzip': ['.gz'],
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (files.length === 0) return

    uploadMutation.mutate(files)
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-gray-300 hover:border-gray-400 dark:border-gray-600'
        }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-2">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {isDragActive ? (
              <p className="font-medium text-primary-600">Drop files here...</p>
            ) : (
              <>
                <p>
                  <span className="font-medium text-primary-600">Click to upload</span>{' '}
                  or drag and drop
                </p>
                <p className="text-xs">NIfTI files (.nii, .nii.gz)</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Selected Files ({files.length})
          </h3>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700 border rounded-lg">
            {files.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="ml-4 text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Error Message */}
      {uploadMutation.isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error: {uploadMutation.error instanceof Error ? uploadMutation.error.message : 'Upload failed'}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={files.length === 0 || uploadMutation.isPending}
        className="btn btn-primary w-full"
      >
        {uploadMutation.isPending ? 'Uploading...' : 'Start Preprocessing'}
      </button>
    </form>
  )
}

export default UploadForm
