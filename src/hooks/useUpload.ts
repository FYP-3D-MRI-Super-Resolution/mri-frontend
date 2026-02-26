/**
 * Upload Hooks
 * Custom hooks for file upload and preprocessing
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { preprocessService } from '@/api/services'
import { QUERY_KEYS } from '@/constants'
import { useState } from 'react'

/**
 * Hook to upload files with progress tracking
 */
export const useUploadFiles = () => {
  const queryClient = useQueryClient()
  const [uploadProgress, setUploadProgress] = useState(0)
  
  const mutation = useMutation({
    mutationFn: (files: File[]) => 
      preprocessService.uploadFiles(files, setUploadProgress),
    onSuccess: () => {
      // Invalidate jobs queries to show new job
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

/**
 * Hook to validate files before upload
 */
export const useFileValidation = () => {
  const validateFiles = (files: File[]) => {
    try {
      // This will throw error if validation fails
      preprocessService['validateFiles'](files)
      return { valid: true, error: null }
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'Invalid files',
      }
    }
  }
  
  const allowedTypes = preprocessService.getAllowedFileTypes()
  const maxFileSize = preprocessService.getMaxFileSize()
  
  return {
    validateFiles,
    allowedTypes,
    maxFileSize,
  }
}
