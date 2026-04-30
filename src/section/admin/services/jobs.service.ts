/**
 * Admin Jobs Service
 * Single Responsibility: Handle admin dataset job API calls
 */

import { apiClient } from '../../../api/config'
import { API_ENDPOINTS } from '@/shared/constants'
import type { JobsListRequest, JobsListResponse } from '@/shared/types/api.types'

/**
 * Admin Jobs Service Class
 * Provides dataset-only job queries for admin views
 */
class AdminJobsService {
  /**
   * Get dataset preprocessing jobs with optional filters
   */
  async getJobs(params?: JobsListRequest): Promise<JobsListResponse> {
    const response = await apiClient.get<JobsListResponse>(API_ENDPOINTS.JOBS.LIST, {
      params: {
        ...params,
        scope: 'dataset',
      },
    })
    return response.data
  }
}

export const adminJobsService = new AdminJobsService()
export default adminJobsService
