import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/shared/hooks/useAuth'
import { USER_ROLES } from '@/shared/constants'
import type { UserRole } from '@/shared/types'

interface RoleProtectedRouteProps {
  children: ReactNode
  requiredRole?: UserRole | UserRole[]
  fallbackPath?: string
}

/**
 * Route guard component that enforces role-based access control
 * 
 * Usage:
 * <RoleProtectedRoute requiredRole="super_admin">
 *   <AdminPanel />
 * </RoleProtectedRoute>
 */
const RoleProtectedRoute = ({ 
  children, 
  requiredRole = USER_ROLES.USER,
  fallbackPath = '/'
}: RoleProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth()
  
  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Checking authorization...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  // Check if user has required role
  if (!roles.includes(user.role)) {
    console.warn(`Access denied: User role "${user.role}" does not match required roles: ${roles.join(', ')}`)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">You do not have permission to access this page.</p>
          <Navigate to={fallbackPath} replace />
        </div>
      </div>
    )
  }

  // Render protected content if user has required role
  return <>{children}</>
}

export default RoleProtectedRoute
