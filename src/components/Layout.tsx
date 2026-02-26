import { ReactNode, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth, useLogout } from '@/hooks/useAuth'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const logoutMutation = useLogout()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/upload', label: 'Upload' },
    { path: '/jobs', label: 'Jobs' },
  ]

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate('/login', { replace: true })
      },
      onError: (error) => {
        console.error('Logout failed:', error)
        // Navigate to login anyway to clear the UI state
        navigate('/login', { replace: true })
      },
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      {/* Navigation */}
      <nav className="border-b border-slate-700/50 bg-slate-900/60 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-md text-slate-200 hover:bg-slate-800"
                aria-label="Open navigation"
              >
                ☰
              </button>
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-cyan-300">
                  MRI Super-Resolution
                </h1>
              </div>
              <span className="hidden sm:inline-flex px-2 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700">
                Research Portal
              </span>
            </div>
            
            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  {user && (
                    <span className="text-sm text-slate-200">
                      {user.name}
                    </span>
                  )}
                  <button
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50"
                  >
                    {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-cyan-300 hover:text-cyan-200"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-slate-900 bg-cyan-300 hover:bg-cyan-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - Grows to fill available space */}
      <div className="flex-1 w-full">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="relative lg:flex lg:gap-8">
            {/* Mobile Overlay */}
            {sidebarOpen && (
              <button
                className="fixed inset-0 bg-black/50 lg:hidden z-30"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close navigation"
              />
            )}

            {/* Sidebar */}
            <aside
              className={`fixed lg:static top-16 left-0 z-40 h-[calc(100vh-4rem)] lg:h-auto w-72 lg:w-64 transform transition-transform duration-200 ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
              }`}
            >
              <div className="h-full lg:h-auto bg-slate-900/90 lg:bg-transparent p-4 lg:py-6">
                <div className="glass rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xs font-semibold text-dim uppercase tracking-wider">
                      Navigation
                    </h2>
                    <button
                      className="lg:hidden text-slate-300"
                      onClick={() => setSidebarOpen(false)}
                      aria-label="Close navigation"
                    >
                      ✕
                    </button>
                  </div>
                  <nav className="space-y-1">
                    {navItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                          location.pathname === item.path
                            ? 'bg-cyan-400/10 text-cyan-200 border border-cyan-400/30'
                            : 'text-slate-200 hover:bg-slate-800'
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                </div>
              </div>
            </aside>

            {/* Page Content */}
            <main className="flex-1 py-8 lg:py-10">
              {children}
            </main>
          </div>
        </div>
      </div>

      {/* Footer - Always at bottom */}
      <footer className="border-t border-slate-700/50 bg-slate-900/60 backdrop-blur mt-auto">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-slate-400">
            © 2026 MRI Super-Resolution Pipeline - Final Year Project
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
