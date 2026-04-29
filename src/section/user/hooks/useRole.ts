/**
 * useRole Hook
 * Provides role-based access control helpers
 */

import { USER_ROLES } from '@/shared/constants'
import { useAuth } from './useAuth'
import type { UserRole } from '@/shared/types'

/**
 * Hook for checking user roles and permissions
 * 
 * Usage:
 * const { isSuperAdmin, hasRole } = useRole()
 * 
 * if (isSuperAdmin()) {
 *   // Show admin panel
 * }
 */
export const useRole = () => {
  const { user } = useAuth()

  const hasRole = (role: UserRole) => user?.role === role
  const hasAnyRole = (roles: UserRole[]) => (user ? roles.includes(user.role) : false)
  const isSuperAdmin = () => user?.role === USER_ROLES.SUPER_ADMIN

  return {
    user,
    hasRole: (role: UserRole) => hasRole(role),
    hasAnyRole: (roles: UserRole[]) => hasAnyRole(roles),
    isSuperAdmin: () => isSuperAdmin(),
    canAccessAdmin: () => isSuperAdmin(),
    canAccessPreprocess: () => isSuperAdmin(),
  }
}
