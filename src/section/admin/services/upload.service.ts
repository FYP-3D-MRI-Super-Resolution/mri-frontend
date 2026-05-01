/**
 * Admin Upload Service
 * Single Responsibility: Handle admin dataset preprocessing uploads
 */

import { fileUploadClient } from '../../../api/config'
import { API_ENDPOINTS } from '@/shared/constants'
import type { PreprocessUploadResponse } from '@/shared/types/api.types'

class AdminUploadService {
  async uploadFiles(
    files: File[],
    onUploadProgress?: (progress: number) => void
  ): Promise<PreprocessUploadResponse> {
    if (files.length === 0) {
      throw new Error('No files selected')
    }

    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })

    const response = await fileUploadClient.post<PreprocessUploadResponse>(
      API_ENDPOINTS.ADMIN.DATASET_PREPROCESS_UPLOAD,
      formData,
      {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            onUploadProgress?.(progress)
          }
        },
      }
    )

    return response.data
  }
}

export const adminUploadService = new AdminUploadService()
export default adminUploadService