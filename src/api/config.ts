/**
 * Axios HTTP client configuration
 * Centralized API client with interceptors
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { API_CONFIG, STORAGE_KEYS, ERROR_MESSAGES } from '@/constants'
import type { APIError } from '@/types'

/**
 * Create axios instance with base configuration
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Request interceptor - Add auth token to all requests
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

/**
 * Error response handler - shared across clients
 */
const handleResponseError = async (error: AxiosError<APIError>) => {
  // Handle network errors
  if (!error.response) {
    return Promise.reject({
      message: ERROR_MESSAGES.NETWORK_ERROR,
      status_code: 0,
    } as APIError)
  }

  const { status } = error.response

  // Handle different HTTP status codes
  switch (status) {
    case 401: // Unauthorized
      // Clear auth data
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER)
      
      // Redirect to login only if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
      
      return Promise.reject({
        message: ERROR_MESSAGES.UNAUTHORIZED,
        status_code: 401,
      } as APIError)

    case 403: // Forbidden
      return Promise.reject({
        message: ERROR_MESSAGES.FORBIDDEN,
        status_code: 403,
      } as APIError)

    case 404: // Not Found
      return Promise.reject({
        message: ERROR_MESSAGES.NOT_FOUND,
        status_code: 404,
      } as APIError)

    case 422: // Validation Error
      return Promise.reject({
        message: error.response.data?.message || ERROR_MESSAGES.VALIDATION_ERROR,
        detail: error.response.data?.detail,
        errors: error.response.data?.errors,
        status_code: 422,
      } as APIError)

    case 500: // Internal Server Error
      return Promise.reject({
        message: ERROR_MESSAGES.SERVER_ERROR,
        status_code: 500,
      } as APIError)

    default:
      return Promise.reject({
        message: error.response.data?.message || ERROR_MESSAGES.UNKNOWN_ERROR,
        detail: error.response.data?.detail,
        status_code: status,
      } as APIError)
  }
}

/**
 * Response interceptor - Handle errors globally
 */
apiClient.interceptors.response.use(
  (response) => response,
  handleResponseError
)

/**
 * Create a new axios instance for file uploads
 * with different timeout and content-type
 */
export const fileUploadClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 300000, // 5 minutes for large file uploads
  headers: {
    'Content-Type': 'multipart/form-data',
  },
})

// Add same interceptors to file upload client
fileUploadClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  }
)

fileUploadClient.interceptors.response.use(
  (response) => response,
  handleResponseError // Use same error handler
)

export default apiClient
