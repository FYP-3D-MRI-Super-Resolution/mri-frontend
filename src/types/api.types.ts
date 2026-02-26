/**
 * API-specific type definitions
 * Request/Response contracts for API endpoints
 */

import { User, Job, FileMetadata } from './index'

// ==================== Auth API ====================
export interface AuthLoginRequest {
  email: string
  password: string
}

export interface AuthLoginResponse {
  access_token: string
  token_type: string
}

export interface AuthRegisterRequest {
  email: string
  password: string
  name: string
}

export interface AuthRegisterResponse {
  access_token: string
  token_type: string
}

export interface AuthMeResponse extends User {}

// ==================== Jobs API ====================
export interface JobsListRequest {
  status?: string
  type?: string
  limit?: number
  offset?: number
  [key: string]: string | number | undefined
}

export interface JobsListResponse {
  jobs: Job[]
  total: number
}

export interface JobsGetResponse extends Job {}

export interface JobsRetryRequest {
  job_id: string
}

export interface JobsRetryResponse {
  job_id: string
  message: string
}

export interface JobsCancelRequest {
  job_id: string
}

export interface JobsCancelResponse {
  message: string
}

// ==================== Preprocess API ====================
export interface PreprocessUploadRequest {
  files: File[]
}

export interface PreprocessUploadResponse {
  job_id: string
  message: string
  uploaded_files: FileMetadata[]
}

// ==================== Inference API ====================
export interface InferenceRunRequest {
  lr_file_id: string
  model_config?: {
    model_name?: string
    scale_factor?: number
  }
}

export interface InferenceRunResponse {
  inference_job_id: string
  message: string
}

// ==================== Files API ====================
export interface FilesListRequest {
  job_id?: string
  limit?: number
}

export interface FilesListResponse {
  files: FileMetadata[]
}

export interface FilesDownloadRequest {
  file_id: string
}
