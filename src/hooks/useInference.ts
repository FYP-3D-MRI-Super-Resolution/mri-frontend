/**
 * Inference Hooks
 * Custom hooks for inference operations
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { inferenceService } from '@/api/services'
import { QUERY_KEYS } from '@/constants'
import type { InferenceRunRequest } from '@/types/api.types'
import { useState } from 'react'

/**
 * Hook to run inference
 */
export const useRunInference = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (request: InferenceRunRequest) => 
      inferenceService.runInference(request),
    onSuccess: () => {
      // Invalidate jobs queries to show new inference job
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.JOBS.ALL })
    },
  })
}

/**
 * Hook to run inference (simple version)
 */
export const useRunInferenceSimple = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (lrFileId: string) => 
      inferenceService.runInferenceSimple(lrFileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.JOBS.ALL })
    },
  })
}

/**
 * Hook to upload a low-resolution MRI for inference preprocessing.
 */
export const useUploadLowResForInferencePreprocess = () => {
  const queryClient = useQueryClient()
  const [uploadProgress, setUploadProgress] = useState(0)

  const mutation = useMutation({
    mutationFn: (file: File) =>
      inferenceService.uploadLowResForPreprocess(file, setUploadProgress),
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
