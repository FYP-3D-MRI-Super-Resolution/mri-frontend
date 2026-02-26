/**
 * Auth Store
 * Global state management for authentication
 * Using Zustand for lightweight state management
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { STORAGE_KEYS } from '@/constants'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  
  // Actions
  setAuth: (token: string, user: User) => void
  setUser: (user: User) => void
  clearAuth: () => void
  updateUser: (updates: Partial<User>) => void
}

/**
 * Auth Store with persistence
 * Automatically syncs with localStorage
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      setAuth: (token: string, user: User) => {
        set({ token, user, isAuthenticated: true })
      },
      
      setUser: (user: User) => {
        set({ user, isAuthenticated: true })
      },
      
      clearAuth: () => {
        set({ token: null, user: null, isAuthenticated: false })
      },
      
      updateUser: (updates: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }))
      },
    }),
    {
      name: STORAGE_KEYS.AUTH_TOKEN,
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

export default useAuthStore
