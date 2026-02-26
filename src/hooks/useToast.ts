/**
 * Toast Hook
 * Custom hook for showing toast notifications
 */

import { useState, useCallback } from 'react'
import type { ToastType } from '@/components/Toast'

interface ToastState {
  message: string
  type: ToastType
  show: boolean
}

export const useToast = () => {
  const [toast, setToast] = useState<ToastState>({
    message: '',
    type: 'info',
    show: false,
  })

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    setToast({
      message,
      type,
      show: true,
    })
  }, [])

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, show: false }))
  }, [])

  const success = useCallback((message: string) => showToast(message, 'success'), [showToast])
  const error = useCallback((message: string) => showToast(message, 'error'), [showToast])
  const warning = useCallback((message: string) => showToast(message, 'warning'), [showToast])
  const info = useCallback((message: string) => showToast(message, 'info'), [showToast])

  return {
    toast,
    showToast,
    hideToast,
    success,
    error,
    warning,
    info,
  }
}

export default useToast
