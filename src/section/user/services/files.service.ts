/**
 * Files Service
 * Single Responsibility: Handle all file-related operations
 */

import { apiClient } from '../../../api/config'
import { API_ENDPOINTS } from '@/shared/constants'
import type { DicomInfoResponse, FilesListRequest } from '@/shared/types/api.types'
import type { FileMetadata } from '@/shared/types'

/**
 * Files Service Class  
 * Manages file operations (download, list, etc.)
 */
class FilesService {
  /**
   * Normalize a file URL/path for apiClient requests.
   * apiClient.baseURL already ends with `/api`, so strip a leading `/api`
   * to avoid `/api/api/files/...` requests.
   */
  private normalizeApiPath(url: string): string {
    let path = url

    if (path.startsWith('http://') || path.startsWith('https://')) {
      try {
        path = new URL(path).pathname
      } catch {
        return path
      }
    }

    return path.replace(/^\/api(?=\/)/, '')
  }

  /**
   * Get list of files
   */
  async getFiles(params?: FilesListRequest): Promise<FileMetadata[]> {
    const response = await apiClient.get<FileMetadata[]>(
      API_ENDPOINTS.FILES.LIST,
      { params }
    )
    return response.data
  }

  /**
   * Download file by ID
   */
  async downloadFile(fileId: string): Promise<Blob> {
    const response = await apiClient.get(
      API_ENDPOINTS.FILES.DOWNLOAD(fileId),
      {
        responseType: 'blob',
      }
    )
    return response.data
  }

  /**
   * Download file from URL
   */
  async downloadFileFromUrl(url: string): Promise<Blob> {
    const response = await apiClient.get(this.normalizeApiPath(url), {
      responseType: 'blob',
    })
    return response.data
  }

  /**
   * Trigger browser download
   */
  triggerDownload(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  /**
   * Download file and save to disk
   */
  async downloadAndSave(fileId: string, filename: string): Promise<void> {
    const blob = await this.downloadFile(fileId)
    this.triggerDownload(blob, filename)
  }

  /**
   * Download file from URL and save to disk
   */
  async downloadFromUrlAndSave(url: string, filename: string): Promise<void> {
    const blob = await this.downloadFileFromUrl(url)
    this.triggerDownload(blob, filename)
  }

  /**
   * Convenience: download a NIfTI output file (HR or LR variant) by its API URL.
   * If no filename is provided, it is inferred from the URL path.
   */
  async downloadNifti(url: string, filename?: string): Promise<void> {
    const name = filename ?? url.split('/').pop() ?? 'output.nii.gz'
    try {
      const blob = await this.downloadFileFromUrl(url)
      this.triggerDownload(blob, name)
    } catch (error) {
      console.error('Failed to download NIfTI file:', error)
      throw error
    }
  }

  /**
   * Fetch DICOM series metadata for a given DICOM base URL.
   * Triggers NIfTI → DICOM conversion on the backend and returns slice URLs
   * for Cornerstone (combine with VITE_API_URL origin via toWadoUriImageIds).
   *
   * `dicomBase` is a browser-relative path like `/api/dicom/...`.
   * The leading `/api` is stripped before passing to apiClient because
   * apiClient.baseURL already ends with `/api`.
   */
  async getDicomInfo(dicomBase: string): Promise<DicomInfoResponse> {
    const path = dicomBase.replace(/^\/api/, '')
    const response = await apiClient.get<DicomInfoResponse>(`${path}/info`)
    return response.data
  }
}

// Export singleton instance
export const filesService = new FilesService()
export default filesService
