/**
 * Admin Upload Hooks
 * Custom hooks for admin dataset preprocessing uploads
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { adminUploadService } from '@/section/admin/services'
import { QUERY_KEYS } from '@/shared/constants'

/**
 * Hook to upload dataset preprocessing files
 */
export const useUploadDatasetPreprocess = () => {
  const queryClient = useQueryClient()
  const [uploadProgress, setUploadProgress] = useState(0)

  const mutation = useMutation({
    mutationFn: (files: File[]) => adminUploadService.uploadFiles(files, setUploadProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.JOBS.ALL })
      setUploadProgress(0)
    },
    onError: () => {
      setUploadProgress(0)
    },
  })

  return {
    ...mutation,
    uploadProgress,
  }
}