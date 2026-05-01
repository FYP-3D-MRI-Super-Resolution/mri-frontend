/**
 * Admin Jobs Hooks
 * Custom hooks for dataset job operations using React Query
 */

import { useQuery } from '@tanstack/react-query'
import { adminJobsService } from '@/section/admin/services'
import { QUERY_KEYS } from '@/shared/constants'
import type { JobsListRequest, JobsListResponse } from '@/shared/types/api.types'

/**
 * Hook to get list of dataset preprocessing jobs
 */
export const useJobs = (
  params?: JobsListRequest,
  options?: { refetchInterval?: number | false }
) => {
  return useQuery<JobsListResponse>({
    queryKey: QUERY_KEYS.JOBS.LIST({ ...params, scope: 'dataset' } as Record<string, unknown>),
    queryFn: () => adminJobsService.getJobs(params),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: options?.refetchInterval,
  })
}
