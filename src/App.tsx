import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/user/home/Home'
import Login from './pages/auth/login/Login'
import Register from './pages/auth/register/Register'
import Upload from './pages/user/upload/Upload'
import Jobs from './pages/user/jobs/Jobs'
import Viewer from './pages/user/jobs/view/Viewer'

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes - redirect to home if already authenticated */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        
        {/* Protected routes with layout */}
        <Route path="/" element={<ProtectedRoute><Layout><Home /></Layout></ProtectedRoute>} />
        <Route path="/upload" element={<ProtectedRoute><Layout><Upload /></Layout></ProtectedRoute>} />
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
