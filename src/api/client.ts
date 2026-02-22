import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API Functions

export interface Job {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  error?: string
  lr_file_url?: string
  hr_file_url?: string
  metrics?: Record<string, number>
  created_at: string
  updated_at: string
}

export const uploadFiles = async (files: File[]): Promise<{ job_id: string }> => {
  const formData = new FormData()
  files.forEach((file) => {
    formData.append('files', file)
  })

  const response = await apiClient.post('/preprocess/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}

export const fetchJobs = async (): Promise<Job[]> => {
  const response = await apiClient.get('/jobs')
  return response.data
}

export const fetchJobDetails = async (jobId: string): Promise<Job> => {
  const response = await apiClient.get(`/jobs/${jobId}`)
  return response.data
}

export const runInference = async (jobId: string): Promise<{ inference_job_id: string }> => {
  const response = await apiClient.post(`/infer`, { lr_file_id: jobId })
  return response.data
}

export const downloadFile = async (fileUrl: string): Promise<Blob> => {
  const response = await apiClient.get(fileUrl, {
    responseType: 'blob',
  })
  return response.data
}

export const login = async (email: string, password: string): Promise<{ token: string }> => {
  const response = await apiClient.post('/auth/login', { email, password })
  return response.data
}

export const register = async (
  email: string,
  password: string,
  name: string
): Promise<{ token: string }> => {
  const response = await apiClient.post('/auth/register', { email, password, name })
  return response.data
}
