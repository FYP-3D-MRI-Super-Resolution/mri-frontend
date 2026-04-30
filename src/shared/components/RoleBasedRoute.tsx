import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/section/user/hooks/useAuth'
import { USER_ROLES } from '@/shared/constants'

interface RoleBasedRouteProps {
  children: ReactNode
  isAdminRoute?: boolean
}

/**
 * Route guard that redirects users based on their role
 * - Admin users trying to access user routes → redirect to /admin/dashboard
 * - Regular users trying to access admin routes → redirect to /app/dashboard
 */
const RoleBasedRoute = ({ 
  children, 
  isAdminRoute = false
}: RoleBasedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />
  }

  const isAdmin = user.role === USER_ROLES.SUPER_ADMIN

  // Admin route guards
  if (isAdminRoute && !isAdmin) {
    // Regular user trying to access admin route
    return <Navigate to="/app/dashboard" replace />
  }

  // User route guards
  if (!isAdminRoute && isAdmin) {
    // Admin trying to access user route
    return <Navigate to="/admin/dashboard" replace />
  }

  return <>{children}</>
}

export default RoleBasedRoute
