interface Action {
  label: string
  onClick?: () => void
}

interface QuickActionsProps {
  actions: Action[]
}

const QuickActions = ({ actions }: QuickActionsProps) => {
  return (
    <div className="rounded-2xl border border-slate-700/40 bg-slate-900/50 backdrop-blur-sm p-6">
      <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="px-4 py-2 rounded-lg bg-cyan-400/20 text-cyan-300 hover:bg-cyan-400/30 transition-colors font-medium"
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default QuickActions
