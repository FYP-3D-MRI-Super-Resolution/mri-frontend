import type { ViewMode } from '../constants'
import { VIEW_MODE_BUTTONS } from '../constants'

interface ViewerControlsProps {
  viewMode: ViewMode
  opacity: number
  selectedIndex: number
  lrUrl?: string
  hrUrl?: string
  outputFiles: Array<string | { hr: string; lr: string }>
  onViewModeChange: (mode: ViewMode) => void
  onOpacityChange: (value: number) => void
  onFileSelect: (index: number) => void
}

const ViewerControls = ({
  viewMode,
  opacity,
  selectedIndex,
  lrUrl,
  hrUrl,
  outputFiles,
  onViewModeChange,
  onOpacityChange,
  onFileSelect,
}: ViewerControlsProps) => (
  <div className="card">
    <div className="flex items-center justify-between flex-wrap gap-4">
      <div className="flex flex-wrap gap-2">
        {VIEW_MODE_BUTTONS.map(({ mode, label, requiresBoth }) => {
          const isVisible = requiresBoth ? !!(lrUrl && hrUrl) : !!hrUrl
          if (!isVisible) return null
          return (
            <button
              key={mode}
              onClick={() => onViewModeChange(mode)}
              className={`btn text-sm ${viewMode === mode ? 'btn-primary' : 'btn-secondary'}`}
            >
              {label}
            </button>
          )
        })}
      </div>

      {viewMode === 'overlay' && (
        <div className="flex items-center space-x-3">
          <label className="text-sm text-dim">Opacity:</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={opacity}
            onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
            className="w-32 accent-cyan-400"
          />
          <span className="text-sm font-medium text-white">{Math.round(opacity * 100)}%</span>
        </div>
      )}
    </div>

    {outputFiles.length > 1 && (
      <div className="mt-4 flex items-center space-x-3">
        <label className="text-sm text-dim">Select file:</label>
        <select
          value={selectedIndex}
          onChange={(e) => onFileSelect(Number(e.target.value))}
          className="rounded-lg border border-slate-600 bg-slate-800 text-white text-sm px-3 py-1 focus:outline-none focus:border-cyan-400"
        >
          {outputFiles.map((file, index) => {
            const filePath =
              typeof file === 'string' ? file : (file as { hr: string; lr: string }).hr
            const parts = filePath.split(/[/\\]/)
            const label = parts[parts.length - 1] || `File ${index + 1}`
            return (
              <option key={label} value={index}>
                {label}
              </option>
            )
          })}
        </select>
      </div>
    )}
  </div>
)

export default ViewerControls
