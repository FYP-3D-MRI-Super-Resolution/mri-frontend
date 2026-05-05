export interface Action {
  label: string
  onClick?: () => void | Promise<void>
  icon?: React.ReactNode
  variant?: 'default' | 'danger' | 'success'
}

interface QuickActionsProps {
  actions: Action[]
  isLoading?: boolean
}

const QuickActions = ({ actions, isLoading = false }: QuickActionsProps) => {
  const getVariantClasses = (variant: string = 'default') => {
    switch (variant) {
      case 'danger':
        return 'bg-red-400/20 text-red-300 hover:bg-red-400/30'
      case 'success':
        return 'bg-emerald-400/20 text-emerald-300 hover:bg-emerald-400/30'
      default:
        return 'bg-cyan-400/20 text-cyan-300 hover:bg-cyan-400/30'
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-700/40 bg-slate-900/50 backdrop-blur-sm p-6">
        <div className="h-6 w-32 rounded bg-slate-700/50 animate-pulse mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 rounded-lg bg-slate-700/50 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-700/40 bg-slate-900/50 backdrop-blur-sm p-6">
      <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-3"
        role="toolbar"
        aria-label="Dashboard quick actions"
      >
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`px-4 py-2 rounded-lg transition-colors font-medium flex items-center justify-center gap-2 ${getVariantClasses(
              action.variant
            )} disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-label={action.label}
            type="button"
          >
            {action.icon && <span className="w-4 h-4">{action.icon}</span>}
            {action.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default QuickActions
