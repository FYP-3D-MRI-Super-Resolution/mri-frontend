interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  iconBgColor?: string
  iconColor?: string
  valueColor?: string
}

const StatsCard = ({
  title,
  value,
  icon,
  iconBgColor = 'bg-cyan-400/10',
  iconColor = 'text-cyan-400',
  valueColor = 'text-white',
}: StatsCardProps) => {
  return (
    <div className="rounded-2xl border border-slate-700/40 bg-slate-900/50 backdrop-blur-sm p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <p className={`text-3xl font-bold ${valueColor} mt-2`}>{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg ${iconBgColor} flex items-center justify-center`}>
          <div className={iconColor}>{icon}</div>
        </div>
      </div>
    </div>
  )
}

export default StatsCard
