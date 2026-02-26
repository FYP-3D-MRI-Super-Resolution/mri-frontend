/**
 * UI Store
 * Global state for UI-related state
 */

import { create } from 'zustand'

interface UIState {
  // Sidebar
  sidebarOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  
  // Loading
  isLoading: boolean
  setLoading: (loading: boolean) => void
  
  // Theme
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
  toggleTheme: () => void
}

export const useUIStore = create<UIState>((set) => ({
  // Sidebar state
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
  
  // Loading state
  isLoading: false,
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  
  // Theme state
  theme: 'light',
  setTheme: (theme: 'light' | 'dark') => set({ theme }),
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
}))

export default useUIStore
