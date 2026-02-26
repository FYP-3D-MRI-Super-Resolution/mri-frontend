/**
 * Application constants
 * Single source of truth for configuration values
 */

// ==================== API Configuration ====================
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const

// ==================== API Endpoints ====================
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
  },
  
  // Jobs endpoints
  JOBS: {
    LIST: '/jobs',
    GET: (id: string) => `/jobs/${id}`,
    RETRY: (id: string) => `/jobs/${id}/retry`,
    CANCEL: (id: string) => `/jobs/${id}/cancel`,
    STATUS: (id: string) => `/jobs/${id}/status`,
  },
  
  // Preprocess endpoints
  PREPROCESS: {
    UPLOAD: '/preprocess/upload',
  },
  
  // Inference endpoints
  INFERENCE: {
    RUN: '/infer',
  },
  
  // Files endpoints
  FILES: {
    LIST: '/files',
    DOWNLOAD: (id: string) => `/files/${id}/download`,
  },
} as const

// ==================== Storage Keys ====================
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const

// ==================== Query Keys ====================
export const QUERY_KEYS = {
  AUTH: {
    ME: ['auth', 'me'] as const,
  },
  JOBS: {
    LIST: (filters?: Record<string, unknown>) => ['jobs', 'list', filters] as const,
    GET: (id: string) => ['jobs', 'get', id] as const,
    ALL: ['jobs'] as const,
  },
  FILES: {
    LIST: (jobId?: string) => ['files', 'list', jobId] as const,
  },
} as const

// ==================== Job Configuration ====================
export const JOB_CONFIG = {
  POLLING_INTERVAL: 5000, // 5 seconds
  MAX_FILE_SIZE: 524288000, // 500MB
  ALLOWED_FILE_TYPES: ['.nii', '.nii.gz', '.dcm'],
  MAX_FILES_PER_UPLOAD: 10,
} as const

// ==================== UI Constants ====================
export const UI_CONFIG = {
  TOAST_DURATION: 3000,
  DEBOUNCE_DELAY: 300,
  ITEMS_PER_PAGE: 20,
} as const

// ==================== Status Colors ====================
export const STATUS_COLORS = {
  pending: 'text-yellow-600 bg-yellow-50',
  processing: 'text-blue-600 bg-blue-50',
  completed: 'text-green-600 bg-green-50',
  failed: 'text-red-600 bg-red-50',
  cancelled: 'text-gray-600 bg-gray-50',
} as const

// ==================== Error Messages ====================
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized. Please login.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  FILE_TOO_LARGE: 'File size exceeds the maximum allowed size.',
  INVALID_FILE_TYPE: 'Invalid file type. Please upload a valid MRI file.',
  UPLOAD_FAILED: 'File upload failed. Please try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
} as const

// ==================== Success Messages ====================
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  REGISTER_SUCCESS: 'Registration successful!',
  LOGOUT_SUCCESS: 'Logout successful!',
  UPLOAD_SUCCESS: 'Files uploaded successfully!',
  JOB_CANCELLED: 'Job cancelled successfully!',
  JOB_RETRIED: 'Job restarted successfully!',
} as const
