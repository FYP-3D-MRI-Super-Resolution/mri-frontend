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
}

// Export singleton instance
export const filesService = new FilesService()
export default filesService
