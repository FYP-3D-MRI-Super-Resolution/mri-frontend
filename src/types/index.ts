/**
 * Central type definitions for the application
 * Following DRY principle - single source of truth for types
 */

// ==================== User Types ====================
export interface User {
  id: string
  email: string
  name: string
  created_at: string
  updated_at: string
}

export interface UserCreate {
  email: string
  password: string
  name: string
}

export interface UserLogin {
  email: string
  password: string
}

// ==================== Auth Types ====================
export interface AuthTokens {
  access_token: string
  token_type: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}

// ==================== Job Types ====================
export enum JobStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export interface Job {
  id: string
  user_id: string
  status: JobStatus
  type: 'preprocessing' | 'inference'
  progress: number
  error_message?: string
  lr_file_url?: string
  hr_file_url?: string
  output_files?: Array<string | { hr: string; lr: string }>
  metrics?: Record<string, number>
  created_at: string
  updated_at: string
  started_at?: string
  completed_at?: string
}

export interface JobCreate {
  type: 'preprocessing' | 'inference'
  input_files?: string[]
}

// ==================== File Types ====================
export interface FileMetadata {
  id: string
  filename: string
  file_path: string
  file_size: number
  file_type: string
  user_id: string
  job_id?: string
  created_at: string
}

export interface UploadResponse {
  job_id: string
  message: string
  files: FileMetadata[]
}

// ==================== Inference Types ====================
export interface InferenceRequest {
  lr_file_id: string
  model_config?: {
    model_name?: string
    scale_factor?: number
  }
}

export interface InferenceResponse {
  inference_job_id: string
  message: string
}

// ==================== API Response Types ====================
export interface APIResponse<T = unknown> {
  data: T
  message?: string
  status: number
}

export interface APIError {
  message: string
  detail?: string
  status_code: number
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  size: number
  pages: number
}

// ==================== Metrics Types ====================
export interface ImageMetrics {
  psnr?: number
  ssim?: number
  mse?: number
  dimensions?: {
    width: number
    height: number
    depth: number
  }
}

// ==================== Query Types ====================
export interface JobFilters {
  status?: JobStatus
  type?: 'preprocessing' | 'inference'
  limit?: number
  offset?: number
}

// ==================== Common Types ====================
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: string | null
}
