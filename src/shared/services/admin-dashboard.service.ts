/**
 * Admin Dashboard Service
 * Handles all admin dashboard API operations
 *
 * Responsibilities:
 * - Fetch dashboard statistics
 * - Fetch system metrics
 * - Handle API errors gracefully
 */

import { apiClient } from '@/api/config'
import type { DashboardHealthResponse, DashboardStats } from '@/shared/types/dashboard.types'

class AdminDashboardService {
  private readonly baseURL = '/admin'

  /**
   * Fetch dashboard statistics
   * Includes user count, active jobs, and system status
   *
   * @throws {AxiosError} If the request fails
   */
  async getStats(): Promise<DashboardStats> {
    try {
      const response = await apiClient.get<DashboardStats>(
        `${this.baseURL}/stats`
      )
      return response.data
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error)
      throw error
    }
  }

  /**
   * Fetch detailed system metrics
   * @throws {AxiosError} If the request fails
   */
  async getSystemMetrics() {
    try {
      const response = await apiClient.get(
        `${this.baseURL}/metrics`
      )
      return response.data
    } catch (error) {
      console.error('Failed to fetch system metrics:', error)
      throw error
    }
  }

  /**
   * Fetch active jobs count
   * @throws {AxiosError} If the request fails
   */
  async getActiveJobsCount(): Promise<number> {
    try {
      const response = await apiClient.get<{ count: number }>(
        `${this.baseURL}/jobs/active/count`
      )
      return response.data.count
    } catch (error) {
      console.error('Failed to fetch active jobs count:', error)
      throw error
    }
  }

  /**
   * Fetch total users count
   * @throws {AxiosError} If the request fails
   */
  async getTotalUsersCount(): Promise<number> {
    try {
      const response = await apiClient.get<{ count: number }>(
        `${this.baseURL}/users/count`
      )
      return response.data.count
    } catch (error) {
      console.error('Failed to fetch users count:', error)
      throw error
    }
  }

  /**
   * Check system health status
   * @throws {AxiosError} If the request fails
   */
  async checkSystemHealth(): Promise<DashboardHealthResponse> {
    try {
      const response = await apiClient.get<DashboardHealthResponse>(
        `${this.baseURL}/health`
      )
      return response.data
    } catch (error) {
      console.error('Failed to check system health:', error)
      return {
        status: 'offline',
        db_connected: false,
        timestamp: new Date().toISOString(),
        metrics: {
          cpu_usage: 0,
          memory_usage: 0,
          processing_jobs: 0,
        },
        health_checks: {
          database: false,
          cpu: false,
          memory: false,
          jobs: false,
        },
      }
    }
  }
}

// Export singleton instance
export const adminDashboardService = new AdminDashboardService()
export default adminDashboardService
