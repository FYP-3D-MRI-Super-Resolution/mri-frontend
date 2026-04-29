import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/section/user/hooks/useAuth'
import Layout from './shared/components/layout/Layout'
import ProtectedRoute from './shared/components/ProtectedRoute'
import Home from './section/user/pages/home/Home'
import Login from './section/auth/login/Login'
import Register from './section/auth/register/Register'
import Upload from './section/user/pages/upload/Upload'
import Jobs from './section/user/pages/jobs/Jobs'
import Viewer from './section/user/pages/jobs/view/Viewer'

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes - redirect to home if already authenticated */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        
        {/* Protected routes with layout */}
        <Route path="/" element={<ProtectedRoute><Layout><Home /></Layout></ProtectedRoute>} />
        
        {/* User routes */}
        <Route path="/upload" element={<ProtectedRoute><Layout><Upload /></Layout></ProtectedRoute>} />
        
        {/* User routes */}
        <Route path="/jobs" element={<ProtectedRoute><Layout><Jobs /></Layout></ProtectedRoute>} />
        <Route path="/viewer/:jobId" element={<ProtectedRoute><Layout><Viewer /></Layout></ProtectedRoute>} />
        
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
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
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default App
