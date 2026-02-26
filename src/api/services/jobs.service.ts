/**
 * Jobs Service
 * Single Responsibility: Handle all job-related API calls
 */

import { apiClient } from '../config'
import { API_ENDPOINTS } from '@/constants'
import type { JobsListRequest, JobsListResponse, JobsRetryResponse, JobsCancelResponse } from '@/types/api.types'
import type { Job } from '@/types'

/**
 * Jobs Service Class
 * Manages job lifecycle operations
 */
class JobsService {
  /**
   * Get list of jobs with optional filters
   */
  async getJobs(params?: JobsListRequest): Promise<JobsListResponse> {
    const response = await apiClient.get<JobsListResponse>(
      API_ENDPOINTS.JOBS.LIST,
      { params }
    )
    return response.data
  }

  /**
   * Get single job by ID
   */
  async getJob(jobId: string): Promise<Job> {
    const response = await apiClient.get<Job>(
      API_ENDPOINTS.JOBS.GET(jobId)
    )
    return response.data
  }

  /**
   * Get job status
   */
  async getJobStatus(jobId: string): Promise<Job> {
    const response = await apiClient.get<Job>(
      API_ENDPOINTS.JOBS.STATUS(jobId)
    )
    return response.data
  }

  /**
   * Retry failed job
   */
  async retryJob(jobId: string): Promise<JobsRetryResponse> {
    const response = await apiClient.post<JobsRetryResponse>(
      API_ENDPOINTS.JOBS.RETRY(jobId)
    )
    return response.data
  }

  /**
   * Cancel running job
   */
  async cancelJob(jobId: string): Promise<JobsCancelResponse> {
    const response = await apiClient.post<JobsCancelResponse>(
      API_ENDPOINTS.JOBS.CANCEL(jobId)
    )
    return response.data
  }

  /**
   * Poll job status until completion
   * Useful for long-running operations
   */
  async pollJobStatus(
    jobId: string,
    onUpdate?: (job: Job) => void,
    interval: number = 5000
  ): Promise<Job> {
    return new Promise((resolve, reject) => {
      const poll = setInterval(async () => {
        try {
          const job = await this.getJobStatus(jobId)
          
          // Call update callback
          onUpdate?.(job)
          
          // Check if job is finished
          if (job.status === 'completed' || job.status === 'failed' || job.status === 'cancelled') {
            clearInterval(poll)
            resolve(job)
          }
        } catch (error) {
          clearInterval(poll)
          reject(error)
        }
      }, interval)
    })
  }
}

// Export singleton instance
export const jobsService = new JobsService()
export default jobsService
