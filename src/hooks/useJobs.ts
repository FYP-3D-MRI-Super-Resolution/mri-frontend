/**
 * Jobs Hooks
 * Custom hooks for job operations using React Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { jobsService } from '@/api/services'
import { QUERY_KEYS, JOB_CONFIG } from '@/constants'
import type { JobsListRequest } from '@/types/api.types'
import type { Job } from '@/types'

/**
 * Hook to get list of jobs
 */
export const useJobs = (params?: JobsListRequest) => {
  return useQuery({
    queryKey: QUERY_KEYS.JOBS.LIST(params as Record<string, unknown>),
    queryFn: () => jobsService.getJobs(params),
    staleTime: 30 * 1000, // 30 seconds
  })
}

/**
 * Hook to get single job by ID
 */
export const useJob = (jobId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.JOBS.GET(jobId),
    queryFn: () => jobsService.getJob(jobId),
    enabled: enabled && !!jobId,
    staleTime: 10 * 1000, // 10 seconds
  })
}

/**
 * Hook to get job status with auto-refresh
 */
export const useJobStatus = (
  jobId: string,
  options?: {
    enabled?: boolean
    refetchInterval?: number | false
  }
) => {
  const { enabled = true, refetchInterval } = options || {}
  
  return useQuery({
    queryKey: QUERY_KEYS.JOBS.GET(jobId),
    queryFn: () => jobsService.getJobStatus(jobId),
    enabled: enabled && !!jobId,
    refetchInterval: refetchInterval !== undefined 
      ? refetchInterval 
      : JOB_CONFIG.POLLING_INTERVAL,
    // Stop polling when job is completed/failed/cancelled
    refetchIntervalInBackground: false,
  })
}

/**
 * Hook to retry a job
 */
export const useRetryJob = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (jobId: string) => jobsService.retryJob(jobId),
    onSuccess: (_, jobId) => {
      // Invalidate job queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.JOBS.GET(jobId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.JOBS.ALL })
    },
  })
}

/**
 * Hook to cancel a job
 */
export const useCancelJob = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (jobId: string) => jobsService.cancelJob(jobId),
    onSuccess: (_, jobId) => {
      // Invalidate job queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.JOBS.GET(jobId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.JOBS.ALL })
    },
  })
}

/**
 * Hook to poll job until completion
 */
export const useJobPolling = (
  jobId: string,
  options?: {
    onComplete?: (job: Job) => void
    onError?: (error: Error) => void
    enabled?: boolean
  }
) => {
  const { enabled = true } = options || {}
  
  const query = useQuery({
    queryKey: QUERY_KEYS.JOBS.GET(jobId),
    queryFn: () => jobsService.getJobStatus(jobId),
    enabled: enabled && !!jobId,
    refetchInterval: (query) => {
      // Stop polling if job is finished
      const data = query.state.data
      if (data?.status === 'completed' || data?.status === 'failed' || data?.status === 'cancelled') {
        options?.onComplete?.(data)
        return false
      }
      return JOB_CONFIG.POLLING_INTERVAL
    },
  })

  // Handle errors through query.error
  if (query.error && options?.onError) {
    options.onError(query.error)
  }

  return query
}
