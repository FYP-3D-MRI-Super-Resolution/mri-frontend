/**
 * Preprocess Service
 * Single Responsibility: Handle all preprocessing-related operations
 */

import { fileUploadClient } from '../config'
import { API_ENDPOINTS, JOB_CONFIG } from '@/constants'
import type { PreprocessUploadResponse } from '@/types/api.types'

/**
 * Preprocess Service Class
 * Handles file uploads and preprocessing operations
 */
class PreprocessService {
  /**
   * Upload MRI files for preprocessing
   */
  async uploadFiles(
    files: File[],
    onUploadProgress?: (progress: number) => void
  ): Promise<PreprocessUploadResponse> {
    // Validate files
    this.validateFiles(files)
    
    // Create FormData
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })
    
    // Upload with progress tracking
    const response = await fileUploadClient.post<PreprocessUploadResponse>(
      API_ENDPOINTS.PREPROCESS.UPLOAD,
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

  /**
   * Validate files before upload
   */
  private validateFiles(files: File[]): void {
    if (files.length === 0) {
      throw new Error('No files selected')
    }
    
    if (files.length > JOB_CONFIG.MAX_FILES_PER_UPLOAD) {
      throw new Error(`Maximum ${JOB_CONFIG.MAX_FILES_PER_UPLOAD} files allowed`)
    }
    
    files.forEach((file) => {
      // Check file size
      if (file.size > JOB_CONFIG.MAX_FILE_SIZE) {
        throw new Error(`File ${file.name} exceeds maximum size of ${JOB_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB`)
      }
      
      // Check file type
      const fileExtension = file.name.toLowerCase()
      const isValidType = JOB_CONFIG.ALLOWED_FILE_TYPES.some(ext => 
        fileExtension.endsWith(ext)
      )
      
      if (!isValidType) {
        throw new Error(`File ${file.name} has invalid type. Allowed: ${JOB_CONFIG.ALLOWED_FILE_TYPES.join(', ')}`)
      }
    })
  }

  /**
   * Get allowed file extensions
   */
  getAllowedFileTypes(): string[] {
    return [...JOB_CONFIG.ALLOWED_FILE_TYPES]
  }

  /**
   * Get max file size
   */
  getMaxFileSize(): number {
    return JOB_CONFIG.MAX_FILE_SIZE
  }
}

// Export singleton instance
export const preprocessService = new PreprocessService()
export default preprocessService
