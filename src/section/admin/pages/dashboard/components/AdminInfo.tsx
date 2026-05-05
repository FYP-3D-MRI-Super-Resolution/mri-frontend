interface AdminInfoProps {
  name?: string
  email?: string
  role?: string
  isLoading?: boolean
}

const AdminInfo = ({ name, email, role = 'user', isLoading = false }: AdminInfoProps) => {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-700/40 bg-slate-900/50 backdrop-blur-sm p-6">
        <div className="h-6 w-32 rounded bg-slate-700/50 animate-pulse mb-4" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="h-4 w-20 rounded bg-slate-700/50 animate-pulse" />
              <div className="h-4 w-32 rounded bg-slate-700/50 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-700/40 bg-slate-900/50 backdrop-blur-sm p-6">
      <h2 className="text-xl font-bold text-white mb-4">Admin Information</h2>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Username:</span>
          <span className="text-white font-medium">{name || '--'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Email:</span>
          <span className="text-white font-medium break-all">{email || '--'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Role:</span>
          <span className="inline-block px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-300 text-sm font-medium">
            {role}
          </span>
        </div>
      </div>
    </div>
  )
}

export default AdminInfo
