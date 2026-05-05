import StatsCard from './StatsCard'

interface StatItem {
  title: string
  value: string | number
  icon: React.ReactNode
  iconBgColor?: string
  iconColor?: string
  valueColor?: string
}

interface StatsGridProps {
  stats: StatItem[]
}

const StatsGrid = ({ stats }: StatsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          iconBgColor={stat.iconBgColor}
          iconColor={stat.iconColor}
          valueColor={stat.valueColor}
        />
      ))}
    </div>
  )
}

export default StatsGrid
