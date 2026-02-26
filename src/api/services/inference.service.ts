/**
 * Inference Service
 * Single Responsibility: Handle all inference-related operations
 */

import { apiClient } from '../config'
import { API_ENDPOINTS } from '@/constants'
import type { InferenceRunRequest, InferenceRunResponse } from '@/types/api.types'

/**
 * Inference Service Class
 * Handles super-resolution inference operations
 */
class InferenceService {
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
