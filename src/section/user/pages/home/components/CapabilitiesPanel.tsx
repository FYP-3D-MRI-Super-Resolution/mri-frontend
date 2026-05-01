import { PIPELINE_STEPS } from '../constants'

const CapabilitiesPanel = () => (
  <div className="glass rounded-2xl p-6">
    <h2 className="text-xl font-semibold text-white mb-3">Core Capabilities</h2>
    <div className="space-y-4">
      {PIPELINE_STEPS.map((item) => (
        <div key={item.title} className="flex items-start gap-4">
          <div className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-400/10 text-cyan-200 border border-cyan-400/30 shrink-0">
            {item.badge}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{item.title}</p>
            <p className="text-sm text-dim">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
)

export default CapabilitiesPanel
