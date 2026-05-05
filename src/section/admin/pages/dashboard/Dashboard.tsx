/**
 * Admin Dashboard
 * Main dashboard page with real-time stats, user info, and quick actions
 *
 * Features:
 * - Real-time data fetching with React Query
 * - Auto-refresh every 30 seconds
 * - Loading states with skeleton UI
 * - Error handling with retry functionality
 * - Accessibility support (WCAG 2.1)
 * - Responsive design
 * - Error boundary for crash recovery
 */

import { useMemo, useCallback } from 'react'
import { useAuth } from '@/shared/hooks/useAuth'
import { useDashboardData, useDashboardRefresh } from '@/shared/hooks/useDashboard'
import {
  DashboardHeader,
  StatsGrid,
  AdminInfo,
  QuickActions,
  ErrorDisplay,
  DashboardErrorBoundary,
  HeaderSkeleton,
  InfoSkeleton,
} from './components'
import type { StatItem } from './components/StatsGrid'
import type { Action } from './components/QuickActions'

const AdminDashboardContent = () => {
  const { user } = useAuth()
  const { jobsCount, usersCount, health, isLoading, isError, error, isFetching } =
    useDashboardData()
  const refreshDashboard = useDashboardRefresh()

  // Icon components - memoized to prevent recreation
  const UserIcon = useMemo(
    () => () => (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4.354a4 4 0 110 5.292M15 12H9m6 0a6 6 0 11-12 0 6 6 0 0112 0z"
        />
      </svg>
    ),
    []
  )

  const JobIcon = useMemo(
    () => () => (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    []
  )

  const StatusIcon = useMemo(
    () => () => (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    []
  )

  const RefreshIcon = useMemo(
    () => () => (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    ),
    []
  )

  // Determine status color based on health
  const getStatusColor = useCallback((status: string | undefined) => {
    switch (status) {
      case 'online':
        return 'text-emerald-400'
      case 'degraded':
        return 'text-yellow-400'
      case 'offline':
        return 'text-red-400'
      default:
        return 'text-slate-400'
    }
  }, [])

  const getCheckTone = useCallback((passed: boolean): 'success' | 'danger' => {
    return passed ? 'success' : 'danger'
  }, [])

  // Memoized stats data
  const statsData = useMemo<StatItem[]>(
    () => [
      {
        title: 'Total Users',
        value: usersCount ?? '--',
        icon: <UserIcon />,
        iconBgColor: 'bg-cyan-400/10',
        iconColor: 'text-cyan-400',
        valueColor: 'text-white',
        trend:
          usersCount !== undefined && usersCount > 0
            ? {
                direction: 'up' as const,
                percentage: 5,
              }
            : undefined,
      },
      {
        title: 'Active Jobs',
        value: jobsCount ?? '--',
        icon: <JobIcon />,
        iconBgColor: 'bg-cyan-400/10',
        iconColor: 'text-cyan-400',
        valueColor: 'text-white',
        trend:
          jobsCount !== undefined && jobsCount > 0
            ? {
                direction: 'down' as const,
                percentage: 2,
              }
            : undefined,
      },
      {
        title: 'System Status',
        value: health ? health.status.charAt(0).toUpperCase() + health.status.slice(1) : 'Unknown',
        icon: <StatusIcon />,
        iconBgColor: health?.status === 'online' ? 'bg-emerald-400/10' : 'bg-yellow-400/10',
        iconColor: getStatusColor(health?.status),
        valueColor: getStatusColor(health?.status),
        details: health
          ? [
              {
                label: 'Database',
                value: health.db_connected ? 'Connected' : 'Disconnected',
                tone: getCheckTone(health.health_checks.database),
              },
              {
                label: 'CPU Usage',
                value: `${health.metrics.cpu_usage.toFixed(1)}%`,
                tone: health.health_checks.cpu ? 'success' : 'warning',
              },
              {
                label: 'Memory Usage',
                value: `${health.metrics.memory_usage.toFixed(1)}%`,
                tone: health.health_checks.memory ? 'success' : 'warning',
              },
              {
                label: 'Processing Jobs',
                value: health.metrics.processing_jobs,
                tone: health.health_checks.jobs ? 'success' : 'danger',
              },
              {
                label: 'CPU Check',
                value: health.health_checks.cpu ? 'Passed' : 'High usage',
                tone: getCheckTone(health.health_checks.cpu),
              },
              {
                label: 'Memory Check',
                value: health.health_checks.memory ? 'Passed' : 'High usage',
                tone: getCheckTone(health.health_checks.memory),
              },
              {
                label: 'Jobs Check',
                value: health.health_checks.jobs ? 'Passed' : 'Too many active jobs',
                tone: getCheckTone(health.health_checks.jobs),
              },
              {
                label: 'Last Updated',
                value: new Date(health.timestamp).toLocaleString(),
                tone: 'normal',
              },
            ]
          : undefined,
      },
    ],
    [usersCount, jobsCount, health, getStatusColor, getCheckTone, UserIcon, JobIcon, StatusIcon]
  )

  // Action handlers
  const handleViewUsers = useCallback(() => {
    console.log('Navigating to users management')
    // TODO: Implement navigation to users page
  }, [])

  const handleViewJobs = useCallback(() => {
    console.log('Navigating to jobs management')
    // TODO: Implement navigation to jobs page
  }, [])

  const handleSystemLogs = useCallback(() => {
    console.log('Opening system logs')
    // TODO: Implement system logs modal
  }, [])

  const handleSettings = useCallback(() => {
    console.log('Opening settings')
    // TODO: Implement settings modal
  }, [])

  const handleRefresh = useCallback(async () => {
    console.log('Refreshing dashboard')
    await refreshDashboard()
  }, [refreshDashboard])

  // Memoized actions data
  const actions: Action[] = useMemo(
    () => [
      {
        label: 'View All Users',
        onClick: handleViewUsers,
      },
      {
        label: 'View All Jobs',
        onClick: handleViewJobs,
      },
      {
        label: 'System Logs',
        onClick: handleSystemLogs,
      },
      {
        label: 'Settings',
        onClick: handleSettings,
      },
    ],
    [handleViewUsers, handleViewJobs, handleSystemLogs, handleSettings]
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      {isLoading ? (
        <HeaderSkeleton />
      ) : (
        <div className="flex items-start justify-between">
          <DashboardHeader username={user?.name} />
          <button
            onClick={handleRefresh}
            disabled={isFetching}
            className="px-4 py-2 rounded-lg bg-slate-700/40 text-slate-300 hover:bg-slate-700/60 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Refresh dashboard"
            title="Refresh data"
          >
            <RefreshIcon />
            {isFetching ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      )}

      {/* Error State */}
      {isError && error && <ErrorDisplay error={error as Error} onRetry={refreshDashboard} />}

      {/* Stats Grid */}
      <StatsGrid stats={statsData} isLoading={isLoading} />

      {/* Admin Info */}
      {isLoading ? (
        <InfoSkeleton />
      ) : (
        <AdminInfo
          name={user?.name}
          email={user?.email}
          role={user?.role || 'user'}
        />
      )}

      {/* Quick Actions */}
      <QuickActions actions={actions} isLoading={isLoading} />
    </div>
  )
}

const AdminDashboard = () => {
  return (
    <DashboardErrorBoundary>
      <AdminDashboardContent />
    </DashboardErrorBoundary>
  )
}

export default AdminDashboard
