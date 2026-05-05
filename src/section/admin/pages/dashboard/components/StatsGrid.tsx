import StatsCard from './StatsCard'
import { CardSkeleton } from './Skeleton'

export interface StatItem {
  title: string
  value: string | number | null | undefined
  icon: React.ReactNode
  iconBgColor?: string
  iconColor?: string
  valueColor?: string
  trend?: {
    direction: 'up' | 'down' | 'neutral'
    percentage: number
  }
  details?: Array<{
    label: string
    value: React.ReactNode
    tone?: 'normal' | 'success' | 'warning' | 'danger'
  }>
}

interface StatsGridProps {
  stats: StatItem[]
  isLoading?: boolean
}

const StatsGrid = ({ stats, isLoading = false }: StatsGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    )
  }

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
          trend={stat.trend}
          details={stat.details}
          aria-label={`${stat.title}: ${stat.value}`}
        />
      ))}
    </div>
  )
}

export default StatsGrid
