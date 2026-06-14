/**
 * API URL helpers for building absolute resource URLs (e.g. Cornerstone wadouri imageIds).
 * Slice paths from the backend are relative (/api/files/...); combine with VITE_API_URL origin.
 */

import { API_CONFIG } from '@/shared/constants'

/** e.g. "https://host.trycloudflare.com/api" → "https://host.trycloudflare.com" */
export function getApiOrigin(): string {
  return API_CONFIG.BASE_URL.replace(/\/api\/?$/, '')
}

/** Build Cornerstone wadouri imageIds from backend slice_urls using the configured API origin. */
export function toWadoUriImageIds(sliceUrls: string[]): string[] {
  const origin = getApiOrigin()
  return sliceUrls.map((path) => `wadouri:${origin}${path}`)
}
