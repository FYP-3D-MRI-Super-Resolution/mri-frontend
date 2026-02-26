/**
 * Authentication Hooks
 * Custom hooks for auth operations using React Query
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authService } from '@/api/services'
import { QUERY_KEYS } from '@/constants'
import type { AuthLoginRequest, AuthRegisterRequest } from '@/types/api.types'

/**
 * Hook to get current user
 */
export const useCurrentUser = () => {
  return useQuery({
    queryKey: QUERY_KEYS.AUTH.ME,
    queryFn: () => authService.getCurrentUser(),
    enabled: authService.isAuthenticated(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  })
}

/**
 * Hook to login
 */
export const useLogin = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (credentials: AuthLoginRequest) => 
      authService.login(credentials),
    onSuccess: async () => {
      // Fetch user data after login
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.ME })
    },
  })
}

/**
 * Hook to register
 */
export const useRegister = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (userData: AuthRegisterRequest) => 
      authService.register(userData),
    onSuccess: async () => {
      // Fetch user data after registration
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.ME })
    },
  })
}

/**
 * Hook to logout
 */
export const useLogout = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear all queries on logout
      queryClient.clear()
    },
  })
}

/**
 * Hook to check authentication status
 */
export const useAuth = () => {
  const { data: user, isLoading, error } = useCurrentUser()
  
  return {
    user,
    isAuthenticated: authService.isAuthenticated(),
    isLoading,
    error,
  }
}
