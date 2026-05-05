interface StatsCardProps {
  title: string
  value: string | number | null | undefined
  icon: React.ReactNode
  iconBgColor?: string
  iconColor?: string
  valueColor?: string
  isLoading?: boolean
  trend?: {
    direction: 'up' | 'down' | 'neutral'
    percentage: number
  }
  details?: Array<{
    label: string
    value: React.ReactNode
    tone?: 'normal' | 'success' | 'warning' | 'danger'
  }>
  'aria-label'?: string
}

const StatsCard = ({
  title,
  value,
  icon,
  iconBgColor = 'bg-cyan-400/10',
  iconColor = 'text-cyan-400',
  valueColor = 'text-white',
  isLoading = false,
  trend,
  details,
  'aria-label': ariaLabel,
}: StatsCardProps) => {
  const hasDetails = Boolean(details && details.length > 0)

  const getDetailToneClass = (tone: 'normal' | 'success' | 'warning' | 'danger' = 'normal') => {
    switch (tone) {
      case 'success':
        return 'text-emerald-300'
      case 'warning':
        return 'text-yellow-300'
      case 'danger':
        return 'text-red-300'
      default:
        return 'text-slate-200'
    }
  }

  return (
    <div
      className="group relative z-0 rounded-2xl border border-slate-700/40 bg-slate-900/50 backdrop-blur-sm p-6 transition-all hover:-translate-y-0.5 hover:border-slate-600/60 hover:z-50 focus-within:border-slate-600/60 focus-within:z-50 cursor-pointer"
      role="status"
      aria-busy={isLoading}
      aria-label={ariaLabel}
      tabIndex={hasDetails ? 0 : undefined}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-400">{title}</p>
          {isLoading ? (
            <div className="mt-4 h-10 w-16 rounded bg-slate-700/50 animate-pulse" />
          ) : (
            <>
              <p className={`text-3xl font-bold ${valueColor} mt-2`}>
                {value === null || value === undefined ? '--' : value}
              </p>
              {trend && (
                <div className="mt-2 flex items-center text-sm">
                  <svg
                    className={`w-4 h-4 mr-1 ${
                      trend.direction === 'up'
                        ? 'text-emerald-400'
                        : trend.direction === 'down'
                          ? 'text-red-400'
                          : 'text-slate-400'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    {trend.direction === 'up' && (
                      <path
                        fillRule="evenodd"
                        d="M12 7a1 1 0 110-2h.01a1 1 0 110 2H12zm-2 2a1 1 0 100 2h.01a1 1 0 100-2H10zm-2 2a1 1 0 100 2h.01a1 1 0 100-2H8z"
                      />
                    )}
                    {trend.direction === 'down' && (
                      <path
                        fillRule="evenodd"
                        d="M12 7a1 1 0 110-2h.01a1 1 0 110 2H12zm-2 2a1 1 0 100 2h.01a1 1 0 100-2H10zm-2 2a1 1 0 100 2h.01a1 1 0 100-2H8z"
                      />
                    )}
                  </svg>
                  <span className="text-slate-400">
                    {trend.direction === 'up' ? '+' : trend.direction === 'down' ? '-' : ''}
                    {trend.percentage}%
                  </span>
                </div>
              )}
            </>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-lg ${iconBgColor} flex items-center justify-center flex-shrink-0`}
          aria-hidden="true"
        >
          <div className={iconColor}>{icon}</div>
        </div>
      </div>

      {hasDetails && !isLoading && (
        <div className="pointer-events-none absolute left-0 top-full z-30 mt-3 w-[min(32rem,calc(100vw-2rem))] rounded-2xl border border-slate-700/60 bg-slate-950/95 p-4 shadow-2xl shadow-slate-950/40 opacity-0 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
              System Health Details
            </span>
            <span className="text-xs text-slate-500">Hover or focus</span>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {details?.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between gap-3 rounded-lg bg-slate-950/40 px-3 py-2 ring-1 ring-inset ring-slate-700/30"
              >
                <span className="text-xs text-slate-400">{item.label}</span>
                <span className={`text-xs font-semibold ${getDetailToneClass(item.tone)}`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default StatsCard
