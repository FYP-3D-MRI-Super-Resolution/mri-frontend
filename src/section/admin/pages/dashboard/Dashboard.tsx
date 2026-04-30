import { useAuth } from '@/section/user/hooks/useAuth'

const AdminDashboard = () => {
  const { user } = useAuth()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-slate-400">Welcome, {user?.name}! This is the administrator panel.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="rounded-2xl border border-slate-700/40 bg-slate-900/50 backdrop-blur-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Total Users</p>
              <p className="text-3xl font-bold text-white mt-2">--</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-cyan-400/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 12H9m6 0a6 6 0 11-12 0 6 6 0 0112 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="rounded-2xl border border-slate-700/40 bg-slate-900/50 backdrop-blur-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Active Jobs</p>
              <p className="text-3xl font-bold text-white mt-2">--</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-cyan-400/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="rounded-2xl border border-slate-700/40 bg-slate-900/50 backdrop-blur-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">System Status</p>
              <p className="text-3xl font-bold text-emerald-400 mt-2">Online</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-emerald-400/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Info */}
      <div className="rounded-2xl border border-slate-700/40 bg-slate-900/50 backdrop-blur-sm p-6">
        <h2 className="text-xl font-bold text-white mb-4">Admin Information</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Username:</span>
            <span className="text-white font-medium">{user?.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Email:</span>
            <span className="text-white font-medium">{user?.email}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Role:</span>
            <span className="inline-block px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-300 text-sm font-medium">
              {user?.role || 'user'}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl border border-slate-700/40 bg-slate-900/50 backdrop-blur-sm p-6">
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button className="px-4 py-2 rounded-lg bg-cyan-400/20 text-cyan-300 hover:bg-cyan-400/30 transition-colors font-medium">
            View All Users
          </button>
          <button className="px-4 py-2 rounded-lg bg-cyan-400/20 text-cyan-300 hover:bg-cyan-400/30 transition-colors font-medium">
            View All Jobs
          </button>
          <button className="px-4 py-2 rounded-lg bg-cyan-400/20 text-cyan-300 hover:bg-cyan-400/30 transition-colors font-medium">
            System Logs
          </button>
          <button className="px-4 py-2 rounded-lg bg-cyan-400/20 text-cyan-300 hover:bg-cyan-400/30 transition-colors font-medium">
            Settings
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
