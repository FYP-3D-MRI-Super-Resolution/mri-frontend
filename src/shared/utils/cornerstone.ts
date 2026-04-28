/**
 * Cornerstone Utilities
 * One-time global initialisation helpers for @cornerstonejs/core and related loaders.
 * Kept here (utils) so components and hooks never contain library bootstrap code.
 */

import {
  init as csInit,
  volumeLoader,
  cornerstoneStreamingImageVolumeLoader,
} from '@cornerstonejs/core'
import {
  WindowLevelTool,
  PanTool,
  ZoomTool,
  StackScrollTool,
  CrosshairsTool,
  addTool,
  init as csToolsInit,
} from '@cornerstonejs/tools'
import cornerstoneDICOMImageLoader from '@cornerstonejs/dicom-image-loader'
import { STORAGE_KEYS } from '@/shared/constants'

/**
 * Module-level promise — null until the first call, then shared by all callers.
 * Guarantees Cornerstone is FULLY ready before any caller's await resolves,
 * even when many components mount simultaneously (e.g. React StrictMode).
 */
let _csReadyPromise: Promise<void> | null = null

async function _doInit(): Promise<void> {
  await csInit()
  csToolsInit()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const streamingLoader = cornerstoneStreamingImageVolumeLoader as any
  volumeLoader.registerUnknownVolumeLoader(streamingLoader)
  volumeLoader.registerVolumeLoader('cornerstoneStreamingImageVolume', streamingLoader)

  // DICOM image loader — initialise with explicit worker count so the codec
  // workers are ready before any createAndCacheVolume call needs them.
  // The beforeSend hook always reads the latest token from localStorage so
  // the Authorization header is never stale across token refreshes.
  cornerstoneDICOMImageLoader.init({
    maxWebWorkers: Math.max(1, Math.min(navigator.hardwareConcurrency ?? 1, 4)),
    beforeSend: (xhr: XMLHttpRequest) => {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`)
      }
    },
  })

  addTool(WindowLevelTool)
  addTool(PanTool)
  addTool(ZoomTool)
  addTool(StackScrollTool)
  addTool(CrosshairsTool)
}

/**
 * Idempotent initialiser — safe to call from many components simultaneously.
 * All concurrent callers share the same Promise so init runs exactly once.
 */
export async function ensureCornerstoneInitialized(): Promise<void> {
  if (!_csReadyPromise) _csReadyPromise = _doInit()
  return _csReadyPromise
}

/**
 * Convert a /api/files/… URL to the matching /api/dicom/… base path.
 * e.g. /api/files/{job_id}/{variant}/{file} → /api/dicom/{job_id}/{variant}/{file}
 */
export function toDicomBase(fileUrl: string): string {
  return fileUrl.replace(/^\/api\/files\//, '/api/dicom/')
}
