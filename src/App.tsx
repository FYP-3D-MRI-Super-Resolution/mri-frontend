import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/shared/hooks/useAuth'
import { USER_ROLES } from '@/shared/constants'

// Layouts
import UserLayout from './shared/components/layout/UserLayout'
import AdminLayout from './shared/components/layout/AdminLayout'

// Route Guards
import ProtectedRoute from './shared/components/ProtectedRoute'
import RoleBasedRoute from './shared/components/RoleBasedRoute'

// Auth Pages
import Login from './section/auth/login/Login'
import Register from './section/auth/register/Register'

// User Pages
import UserDashboard from './section/user/pages/dashboard/Dashboard'
import Upload from './section/user/pages/upload/Upload'
import Jobs from './section/user/pages/jobs/Jobs'
import Viewer from './section/user/pages/jobs/view/Viewer'

// Admin Pages
import AdminDashboard from './section/admin/pages/dashboard/Dashboard'
import DatasetPreprocessing from './section/admin/pages/dataset-preprocessing/DatasetPreprocessing.tsx'
import AdminJobs from './section/admin/pages/jobs/Jobs'

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes - redirect to appropriate dashboard if already authenticated */}
        <Route path="/auth/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/auth/register" element={<PublicRoute><Register /></PublicRoute>} />
        
        {/* Root redirect - directs to appropriate dashboard based on role */}
        <Route path="/" element={<RootRedirect />} />
        
        {/* User Routes - /app/* */}
        <Route 
          path="/app/dashboard" 
          element={
            <ProtectedRoute>
              <RoleBasedRoute isAdminRoute={false}>
                <UserLayout><UserDashboard /></UserLayout>
              </RoleBasedRoute>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/app/upload" 
          element={
            <ProtectedRoute>
              <RoleBasedRoute isAdminRoute={false}>
                <UserLayout><Upload /></UserLayout>
              </RoleBasedRoute>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/app/jobs" 
          element={
            <ProtectedRoute>
              <RoleBasedRoute isAdminRoute={false}>
                <UserLayout><Jobs /></UserLayout>
              </RoleBasedRoute>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/app/viewer/:jobId" 
          element={
            <ProtectedRoute>
              <RoleBasedRoute isAdminRoute={false}>
                <UserLayout><Viewer variant="user" /></UserLayout>
              </RoleBasedRoute>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/viewer/:jobId" 
          element={
            <ProtectedRoute>
              <RoleBasedRoute isAdminRoute={true}>
                <AdminLayout><Viewer variant="admin" /></AdminLayout>
              </RoleBasedRoute>
            </ProtectedRoute>
          } 
        />
        
        {/* Admin Routes - /admin/* */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute>
              <RoleBasedRoute isAdminRoute={true}>
                <AdminLayout><AdminDashboard /></AdminLayout>
              </RoleBasedRoute>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/dataset-preprocessing" 
          element={
            <ProtectedRoute>
              <RoleBasedRoute isAdminRoute={true}>
                <AdminLayout><DatasetPreprocessing /></AdminLayout>
              </RoleBasedRoute>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/jobs" 
          element={
            <ProtectedRoute>
              <RoleBasedRoute isAdminRoute={true}>
                <AdminLayout><AdminJobs /></AdminLayout>
              </RoleBasedRoute>
            </ProtectedRoute>
          } 
        />
        
        {/* Catch all - redirect to root (which will redirect based on role) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

// Component to redirect authenticated users to appropriate dashboard
function RootRedirect() {
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />
  }

  // Redirect based on role
  if (user.role === USER_ROLES.SUPER_ADMIN) {
    return <Navigate to="/admin/dashboard" replace />
  } else {
    return <Navigate to="/app/dashboard" replace />
  }
}

// Component to redirect authenticated users away from login/register
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return <RootRedirect />
  }

  return <>{children}</>
}

export default App
