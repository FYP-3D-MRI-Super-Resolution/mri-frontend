/**
 * Services Index
 * Central export for all services (Facade Pattern)
 */

export { authService } from './auth.service'
export { jobsService } from './jobs.service'
export { preprocessService } from './preprocess.service'
export { inferenceService } from './inference.service'
export { filesService } from './files.service'

// Re-export types for convenience
export type {
  AuthLoginRequest,
  AuthLoginResponse,
  AuthRegisterRequest,
  AuthRegisterResponse,
  JobsListRequest,
  JobsListResponse,
  PreprocessUploadRequest,
  PreprocessUploadResponse,
  InferenceRunRequest,
  InferenceRunResponse,
  FilesListRequest,
  FilesListResponse,
} from '@/types/api.types'
