/**
 * Files Service
 * Single Responsibility: Handle all file-related operations
 */

import { apiClient } from '../config'
import { API_ENDPOINTS } from '@/constants'
import type { FilesListRequest } from '@/types/api.types'
import type { FileMetadata } from '@/types'

/**
 * Files Service Class  
 * Manages file operations (download, list, etc.)
 */
class FilesService {
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
    const response = await apiClient.get(url, {
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
    const blob = await this.downloadFileFromUrl(url)
    this.triggerDownload(blob, name)
  }

  /**
   * Fetch DICOM series metadata for a given DICOM base URL.
   * Triggers NIfTI → DICOM conversion on the backend and returns slice count.
   *
   * `dicomBase` is a browser-relative path like `/api/dicom/...`.
   * The leading `/api` is stripped before passing to apiClient because
   * apiClient.baseURL already ends with `/api` — avoids `/api/api/dicom/...`.
   * We strip the leading `/api` before handing it to `apiClient` because
   * the client's `baseURL` already includes `/api` — without this the path
   * becomes `/api/api/dicom/...`.
   */
  async getDicomInfo(dicomBase: string): Promise<{ num_slices: number }> {
    const path = dicomBase.replace(/^\/api/, '')
    const response = await apiClient.get<{ num_slices: number }>(`${path}/info`)
    return response.data
  }
}

// Export singleton instance
export const filesService = new FilesService()
export default filesService
