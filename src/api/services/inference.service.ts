/**
 * Inference Service
 * Single Responsibility: Handle all inference-related operations
 */

import { apiClient } from '../config'
import { fileUploadClient } from '../config'
import { API_ENDPOINTS } from '@/constants'
import type { InferenceRunRequest, InferenceRunResponse } from '@/types/api.types'
import type { PreprocessUploadResponse } from '@/types/api.types'

/**
 * Inference Service Class
 * Handles super-resolution inference operations
 */
class InferenceService {
  /**
   * Upload a low-resolution MRI scan for inference preprocessing.
   */
  async uploadLowResForPreprocess(
    file: File,
    onUploadProgress?: (progress: number) => void
  ): Promise<PreprocessUploadResponse> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fileUploadClient.post<PreprocessUploadResponse>(
      API_ENDPOINTS.INFERENCE.PREPROCESS_UPLOAD,
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
   * Run inference on preprocessed LR image
   */
  async runInference(request: InferenceRunRequest): Promise<InferenceRunResponse> {
    const response = await apiClient.post<InferenceRunResponse>(
      API_ENDPOINTS.INFERENCE.RUN,
      request
    )
    return response.data
  }

  /**
   * Run inference with default configuration
   */
  async runInferenceSimple(lrFileId: string): Promise<InferenceRunResponse> {
    return this.runInference({
      lr_file_id: lrFileId,
    })
  }

  /**
   * Run inference with custom model configuration
   */
  async runInferenceWithConfig(
    lrFileId: string,
    modelConfig: {
      model_name?: string
      scale_factor?: number
    }
  ): Promise<InferenceRunResponse> {
    return this.runInference({
      lr_file_id: lrFileId,
      model_config: modelConfig,
    })
  }
}

// Export singleton instance
export const inferenceService = new InferenceService()
export default inferenceService
