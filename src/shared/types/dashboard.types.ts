/**
 * Dashboard API Types
 * Type definitions for admin dashboard data
 */

export interface DashboardStats {
  total_users: number
  active_jobs: number
  system_status: 'online' | 'offline' | 'degraded'
  last_updated: string
}

export interface DashboardHealthMetrics {
  cpu_usage: number
  memory_usage: number
  processing_jobs: number
}

export interface DashboardHealthChecks {
  database: boolean
  cpu: boolean
  memory: boolean
  jobs: boolean
}

export interface DashboardHealthResponse {
  status: 'online' | 'offline' | 'degraded'
  db_connected: boolean
  timestamp: string
  metrics: DashboardHealthMetrics
  health_checks: DashboardHealthChecks
}

export interface DashboardMetrics {
  users: {
    total: number
    active: number
    inactive: number
  }
  jobs: {
    total: number
    active: number
    completed: number
    failed: number
  }
  system: {
    status: 'online' | 'offline' | 'degraded'
    uptime_hours: number
    cpu_usage: number
    memory_usage: number
  }
}
