/**
 * Auth Store
 * Global state management for authentication
 * Using Zustand for lightweight state management
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { STORAGE_KEYS, USER_ROLES } from '@/shared/constants'
import type { User, UserRole } from '@/shared/types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  
  // Actions
  setAuth: (token: string, user: User) => void
  setUser: (user: User) => void
  clearAuth: () => void
  updateUser: (updates: Partial<User>) => void
  
  // Role-based helpers
  hasRole: (role: UserRole) => boolean
  hasAnyRole: (roles: UserRole[]) => boolean
  isSuperAdmin: () => boolean
}

/**
 * Auth Store with persistence
 * Automatically syncs with localStorage
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
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
      
      hasRole: (role: UserRole) => {
        const { user } = get()
        return user?.role === role
      },
      
      hasAnyRole: (roles: UserRole[]) => {
        const { user } = get()
        return user ? roles.includes(user.role) : false
      },
      
      isSuperAdmin: () => {
        const { user } = get()
        return user?.role === USER_ROLES.SUPER_ADMIN
      },
    }),
    {
      name: STORAGE_KEYS.AUTH_STORE,
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

export default useAuthStore
