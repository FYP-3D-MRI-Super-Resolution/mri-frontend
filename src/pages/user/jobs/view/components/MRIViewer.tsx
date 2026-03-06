import { useMRIViewer } from '@/hooks'
import { LAYOUT_BUTTONS } from '../constants'

interface MRIViewerProps {
  fileUrl: string
  title?: string
}

// ── small helper: slice control strip below each viewport ────────────────────
interface SliceControlsProps {
  plane: 'axial' | 'coronal' | 'sagittal'
  index: number
  total: number
  onChange: (i: number) => void
}
const SliceControls = ({ plane, index, total, onChange }: SliceControlsProps) => {
  const max = Math.max(0, total - 1)
  const label = plane === 'axial' ? 'AX' : plane === 'coronal' ? 'CO' : 'SA'
  const accent =
    plane === 'axial' ? 'accent-yellow-400' : plane === 'coronal' ? 'accent-green-400' : 'accent-blue-400'
  return (
    <div className="flex items-center gap-2 bg-gray-950 bg-opacity-80 px-3 py-1.5 rounded-b-lg">
      <span className="text-xs font-bold text-gray-500 w-5">{label}</span>
      <button
        className="text-gray-400 hover:text-white disabled:opacity-30 text-sm leading-none select-none"
        onClick={() => onChange(Math.max(0, index - 1))}
        disabled={index <= 0}
        title="Previous slice"
      >◄</button>
      <input
        type="range"
        min={0}
        max={max}
        value={index}
        onChange={e => onChange(Number(e.target.value))}
        className={`flex-1 h-1 cursor-pointer ${accent}`}
      />
      <button
        className="text-gray-400 hover:text-white disabled:opacity-30 text-sm leading-none select-none"
        onClick={() => onChange(Math.min(max, index + 1))}
        disabled={index >= max}
        title="Next slice"
      >►</button>
      <span className="text-xs text-gray-400 tabular-nums w-[72px] text-right">
        {index + 1}&thinsp;/&thinsp;{total}
      </span>
    </div>
  )
}

const MRIViewer = ({ fileUrl, title }: MRIViewerProps) => {
  const {
    axialRef, coronalRef, sagittalRef,
    loading, step, error,
    layout, setLayout, isPlaneVisible,
    slices, setSliceIndex,
    activeTool, setActiveTool,
  } = useMRIViewer(fileUrl)

  return (
    <div className="flex flex-col space-y-3">

      {/* ── Toolbar: tool-mode buttons + layout buttons ───────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          {title && (
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mr-2">{title}</h3>
          )}
          {/* Tool mode */}
          <div className="flex rounded-lg overflow-hidden border border-slate-700 text-sm">
            <button
              onClick={() => setActiveTool('windowLevel')}
              title="Left-drag: adjust brightness / contrast"
              className={`px-3 py-1 ${activeTool === 'windowLevel' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-gray-300 hover:bg-slate-700'}`}
            >
              W / L
            </button>
            <button
              onClick={() => setActiveTool('navigate')}
              title="Left-click: reposition crosshair — all planes update"
              className={`px-3 py-1 border-l border-slate-700 ${activeTool === 'navigate' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-gray-300 hover:bg-slate-700'}`}
            >
              ✛ Navigate
            </button>
          </div>
        </div>

        {/* Layout */}
        <div className="flex gap-1">
          {LAYOUT_BUTTONS.map(({ layout: l, label }) => (
            <button
              key={l}
              onClick={() => setLayout(l)}
              className={`btn text-sm capitalize ${layout === l ? 'btn-primary' : 'btn-secondary'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Loading overlay ───────────────────────────────────────────────── */}
      {loading && (
        <div className="flex items-center justify-center py-10 bg-black rounded-lg">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-white text-sm font-mono">{step}</p>
            <p className="text-gray-400 text-xs">First load may take 10–30 s while slices are cached</p>
          </div>
        </div>
      )}

      {/* ── Error ─────────────────────────────────────────────────────────── */}
      {error && (
        <div className="flex items-center justify-center py-4 bg-red-900 bg-opacity-30 rounded-lg border border-red-700">
          <p className="text-red-400 text-sm">⚠ {error}</p>
        </div>
      )}

      {/*
       * MPR viewport grid.
       * The three <div ref={...}> elements MUST stay in the DOM at all times so
       * Cornerstone3D / WebGL can attach to them.  We hide containing panels with
       * CSS 'hidden' (display:none) only after init completes (loading=false).
       */}
      <div className={`grid gap-2 ${layout === 'mpr' ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>

        {/* Axial */}
        <div className={`flex flex-col rounded-lg overflow-hidden ${!isPlaneVisible('axial') ? 'hidden' : ''}`}>
          <div className="relative bg-black">
            <span className="absolute top-2 left-2 z-10 text-xs font-bold text-yellow-400 pointer-events-none select-none">
              AXIAL
            </span>
            <div ref={axialRef} className="w-full h-[380px]" />
          </div>
          {!loading && !error && (
            <SliceControls
              plane="axial"
              index={slices.axial.index}
              total={slices.axial.total}
              onChange={i => setSliceIndex('axial', i)}
            />
          )}
        </div>

        {/* Coronal */}
        <div className={`flex flex-col rounded-lg overflow-hidden ${!isPlaneVisible('coronal') ? 'hidden' : ''}`}>
          <div className="relative bg-black">
            <span className="absolute top-2 left-2 z-10 text-xs font-bold text-green-400 pointer-events-none select-none">
              CORONAL
            </span>
            <div ref={coronalRef} className="w-full h-[380px]" />
          </div>
          {!loading && !error && (
            <SliceControls
              plane="coronal"
              index={slices.coronal.index}
              total={slices.coronal.total}
              onChange={i => setSliceIndex('coronal', i)}
            />
          )}
        </div>

        {/* Sagittal */}
        <div className={`flex flex-col rounded-lg overflow-hidden ${!isPlaneVisible('sagittal') ? 'hidden' : ''}`}>
          <div className="relative bg-black">
            <span className="absolute top-2 left-2 z-10 text-xs font-bold text-blue-400 pointer-events-none select-none">
              SAGITTAL
            </span>
            <div ref={sagittalRef} className="w-full h-[380px]" />
          </div>
          {!loading && !error && (
            <SliceControls
              plane="sagittal"
              index={slices.sagittal.index}
              total={slices.sagittal.total}
              onChange={i => setSliceIndex('sagittal', i)}
            />
          )}
        </div>

      </div>

      {/* ── Interaction hint ──────────────────────────────────────────────── */}
      {!loading && !error && (
        <p className="text-xs text-gray-500">
          <span className="text-cyan-400">■</span> Scroll: navigate slices &nbsp;
          <span className="text-cyan-400">■</span> Right-drag: zoom &nbsp;
          <span className="text-cyan-400">■</span> Middle-drag: pan &nbsp;
          <span className="text-cyan-400">■</span>{' '}
          {activeTool === 'navigate'
            ? 'Left-click: reposition crosshair (all planes update)'
            : 'Left-drag: Window / Level'}
        </p>
      )}

    </div>
  )
}

export default MRIViewer

