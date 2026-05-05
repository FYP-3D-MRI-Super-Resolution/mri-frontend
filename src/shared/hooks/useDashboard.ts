/**
 * Admin Dashboard Hooks
 * Custom React Query hooks for dashboard operations
 *
 * Benefits:
 * - Automatic caching and deduplication
 * - Built-in error handling and retry logic
 * - Background refetching support
 * - Proper loading and error states
 * - TypeScript type safety
 */

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { adminDashboardService } from '@/shared/services/admin-dashboard.service'
import { QUERY_KEYS } from '@/shared/constants'
import type { DashboardHealthResponse } from '@/shared/types/dashboard.types'

/**
 * Hook to fetch dashboard statistics
 * Auto-refetches every 30 seconds for real-time updates
 */
export const useDashboardStats = (options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.ADMIN.STATS,
    queryFn: () => adminDashboardService.getStats(),
    staleTime: 20 * 1000, // 20 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
    refetchInterval: 30 * 1000, // 30 seconds
    refetchIntervalInBackground: true, // Continue fetching in background
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  })
}

/**
 * Hook to fetch active jobs count
 */
export const useActiveJobsCount = (options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.ADMIN.JOBS_COUNT,
    queryFn: () => adminDashboardService.getActiveJobsCount(),
    staleTime: 15 * 1000, // 15 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 20 * 1000, // 20 seconds
    retry: 2,
    ...options,
  })
}

/**
 * Hook to fetch total users count
 */
export const useTotalUsersCount = (options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.ADMIN.USERS_COUNT,
    queryFn: () => adminDashboardService.getTotalUsersCount(),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 60 * 1000, // 60 seconds (less frequent than jobs)
    retry: 2,
    ...options,
  })
}

/**
 * Hook to check system health
 */
export const useSystemHealth = (options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.ADMIN.HEALTH,
    queryFn: () => adminDashboardService.checkSystemHealth(),
    staleTime: 15 * 1000, // 15 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 25 * 1000, // 25 seconds
    retry: 1,
    ...options,
  })
}

/**
 * Hook to manually refresh dashboard data
 * Useful for action buttons to refetch data after user interactions
 */
export const useDashboardRefresh = () => {
  const queryClient = useQueryClient()

  return useCallback(() => {
    return Promise.all([
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.STATS }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.JOBS_COUNT }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.USERS_COUNT }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.HEALTH }),
    ])
  }, [queryClient])
}

/**
 * Hook to combine all dashboard data at once
 * Useful for fetching all dashboard data together
 */
export const useDashboardData = (options = {}) => {
  const stats = useDashboardStats(options)
  const jobsCount = useActiveJobsCount(options)
  const usersCount = useTotalUsersCount(options)
  const health = useSystemHealth(options)

  const isLoading = stats.isLoading || jobsCount.isLoading || usersCount.isLoading || health.isLoading
  const isError = stats.isError || jobsCount.isError || usersCount.isError || health.isError
  const error = stats.error || jobsCount.error || usersCount.error || health.error

  return {
    stats: stats.data,
    jobsCount: jobsCount.data,
    usersCount: usersCount.data,
    health: health.data as DashboardHealthResponse | undefined,
    isLoading,
    isError,
    error,
    isFetching: stats.isFetching || jobsCount.isFetching || usersCount.isFetching || health.isFetching,
  }
}
