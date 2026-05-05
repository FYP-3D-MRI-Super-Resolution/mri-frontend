import { useMemo } from 'react'
import { useAuth } from '@/shared/hooks/useAuth'
import {
  DashboardHeader,
  StatsGrid,
  AdminInfo,
  QuickActions,
} from './components'

const AdminDashboard = () => {
  const { user } = useAuth()

  // Icon components
  const UserIcon = () => (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.354a4 4 0 110 5.292M15 12H9m6 0a6 6 0 11-12 0 6 6 0 0112 0z"
      />
    </svg>
  )

  const JobIcon = () => (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  )

  const StatusIcon = () => (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )

  // Memoized stats data
  const stats = useMemo(
    () => [
      {
        title: 'Total Users',
        value: '--',
        icon: <UserIcon />,
        iconBgColor: 'bg-cyan-400/10',
        iconColor: 'text-cyan-400',
        valueColor: 'text-white',
      },
      {
        title: 'Active Jobs',
        value: '--',
        icon: <JobIcon />,
        iconBgColor: 'bg-cyan-400/10',
        iconColor: 'text-cyan-400',
        valueColor: 'text-white',
      },
      {
        title: 'System Status',
        value: 'Online',
        icon: <StatusIcon />,
        iconBgColor: 'bg-emerald-400/10',
        iconColor: 'text-emerald-400',
        valueColor: 'text-emerald-400',
      },
    ],
    []
  )

  // Action handlers
  const handleViewUsers = () => console.log('View all users')
  const handleViewJobs = () => console.log('View all jobs')
  const handleSystemLogs = () => console.log('Open system logs')
  const handleSettings = () => console.log('Open settings')

  // Memoized actions data
  const actions = useMemo(
    () => [
      { label: 'View All Users', onClick: handleViewUsers },
      { label: 'View All Jobs', onClick: handleViewJobs },
      { label: 'System Logs', onClick: handleSystemLogs },
      { label: 'Settings', onClick: handleSettings },
    ],
    []
  )

  return (
    <div className="space-y-8">
      <DashboardHeader username={user?.name} />
      <StatsGrid stats={stats} />
      <AdminInfo
        name={user?.name}
        email={user?.email}
        role={user?.role || 'user'}
      />
      <QuickActions actions={actions} />
    </div>
  )
}

export default AdminDashboard
