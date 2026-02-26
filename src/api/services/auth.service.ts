/**
 * Authentication Service
 * Single Responsibility: Handle all authentication-related API calls
 */

import { apiClient } from '../config'
import { API_ENDPOINTS, STORAGE_KEYS } from '@/constants'
import type { AuthLoginRequest, AuthLoginResponse, AuthRegisterRequest, AuthRegisterResponse } from '@/types/api.types'
import type { User } from '@/types'

/**
 * Authentication Service Class
 * Follows SOLID principles - Single Responsibility
 */
class AuthService {
  /**
   * Login user
   */
  async login(credentials: AuthLoginRequest): Promise<AuthLoginResponse> {
    const response = await apiClient.post<AuthLoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    )
    
    // Store token
    if (response.data.access_token) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.access_token)
    }
    
    return response.data
  }

  /**
   * Register new user
   */
  async register(userData: AuthRegisterRequest): Promise<AuthRegisterResponse> {
    const response = await apiClient.post<AuthRegisterResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      userData
    )
    
    // Store token
    if (response.data.access_token) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.access_token)
    }
    
    return response.data
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT)
    } finally {
      // Always clear local storage even if API call fails
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER)
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>(API_ENDPOINTS.AUTH.ME)
    
    // Cache user data
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data))
    
    return response.data
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
  }

  /**
   * Get cached user
   */
  getCachedUser(): User | null {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER)
    return userStr ? JSON.parse(userStr) : null
  }
}

// Export singleton instance
export const authService = new AuthService()
export default authService
