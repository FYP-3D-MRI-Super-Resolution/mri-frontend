import { ReactNode, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth, useLogout } from '@/section/user/hooks/useAuth'
import Navbar from './components/Navbar'
import AdminSidebar from './components/AdminSidebar'
import AppFooter from './components/AppFooter'

interface AdminLayoutProps {
  children: ReactNode
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const logoutMutation = useLogout()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => navigate('/auth/login', { replace: true }),
      onError: (error) => {
        console.error('Logout failed:', error)
        navigate('/auth/login', { replace: true })
      },
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <Navbar
        userName={user?.name}
        isPendingLogout={logoutMutation.isPending}
        onOpenSidebar={() => setSidebarOpen(true)}
        onLogout={handleLogout}
      />

      <div className="flex-1 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="relative lg:flex lg:gap-4">
            <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className="flex-1 py-8 lg:py-10">
              {children}
            </main>
          </div>
        </div>
      </div>

      <AppFooter />
    </div>
  )
}

export default AdminLayout
