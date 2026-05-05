interface DashboardHeaderProps {
  username?: string
}

const DashboardHeader = ({ username }: DashboardHeaderProps) => {
  return (
    <div>
      <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
      <p className="text-slate-400">
        Welcome, {username}! This is the administrator panel.
      </p>
    </div>
  )
}

export default DashboardHeader
