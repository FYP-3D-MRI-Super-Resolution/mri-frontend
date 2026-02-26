/**
 * Files Hooks
 * Custom hooks for file operations
 */

import { useQuery, useMutation } from '@tanstack/react-query'
import { filesService } from '@/api/services'
import { QUERY_KEYS } from '@/constants'
import type { FilesListRequest } from '@/types/api.types'

/**
 * Hook to get list of files
 */
export const useFiles = (params?: FilesListRequest) => {
  return useQuery({
    queryKey: QUERY_KEYS.FILES.LIST(params?.job_id),
    queryFn: () => filesService.getFiles(params),
    enabled: true,
  })
}

/**
 * Hook to download file
 */
export const useDownloadFile = () => {
  return useMutation({
    mutationFn: ({ fileId, filename }: { fileId: string; filename: string }) =>
      filesService.downloadAndSave(fileId, filename),
  })
}

/**
 * Hook to download file from URL
 */
export const useDownloadFileFromUrl = () => {
  return useMutation({
    mutationFn: ({ url, filename }: { url: string; filename: string }) =>
      filesService.downloadFromUrlAndSave(url, filename),
  })
}
