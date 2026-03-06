import { useState } from 'react'
import { useMRIViewer } from '@/hooks'

interface MRIViewerProps {
  fileUrl: string
  title?: string
}

// Slicer-style colored plane config
type Plane = 'axial' | 'coronal' | 'sagittal'
const PC: Record<Plane, { label: string; bar: string }> = {
  axial:    { label: 'AX', bar: '#8B1A1A' },
  coronal:  { label: 'CO', bar: '#1A5C1A' },
  sagittal: { label: 'SA', bar: '#7A5200' },
}

// Slicer-style header: colored bar with plane label + inline slice slider
// Defined OUTSIDE MRIViewer so React never remounts the ref divs
interface PHProps {
  plane: Plane; index: number; total: number
  onChange: (i: number) => void; onMaximize: () => void
}
const PlaneHeader = ({ plane, index, total, onChange, onMaximize }: PHProps) => (
  <div
    className="flex items-center gap-1.5 px-2 py-[4px] shrink-0 select-none"
    style={{ backgroundColor: PC[plane].bar }}
  >
    <span className="text-white/90 text-[10px] font-bold tracking-wider shrink-0 w-5">
      {PC[plane].label}
    </span>
    <input
      type="range"
      min={0} max={Math.max(0, total - 1)} value={index}
      onChange={e => onChange(Number(e.target.value))}
      className="flex-1 min-w-0 cursor-pointer accent-white"
      style={{ height: 3 }}
      title={`${PC[plane].label} slice ${index + 1} of ${total}`}
    />
    <span className="text-white/80 text-[10px] tabular-nums shrink-0 w-[54px] text-right">
      {index + 1}&thinsp;/&thinsp;{total}
    </span>
    <button
      onClick={onMaximize}
      className="text-white/60 hover:text-white/90 shrink-0 px-0.5 text-xs leading-none"
      title="Toggle maximize"
    >⛶</button>
  </div>
)

const MRIViewer = ({ fileUrl, title }: MRIViewerProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const {
    axialRef, coronalRef, sagittalRef,
    loading, step, error,
    layout, setLayout, isPlaneVisible,
    slices, setSliceIndex,
    activeTool, setActiveTool,
  } = useMRIViewer(fileUrl)

  const isMPR = layout === 'mpr'

  // Viewport heights scale with fullscreen state and single/multi-plane mode
  const mprH    = isFullscreen ? 'h-[calc(50vh-58px)]' : 'h-[265px]'
  const singleH = isFullscreen ? 'h-[calc(100vh-130px)]' : 'h-[420px]'
  const vpH     = isMPR ? mprH : singleH

  const toolBtn = (tool: typeof activeTool, label: string) => (
    <button
      onClick={() => setActiveTool(tool)}
      className={`px-2 py-0.5 text-xs ${activeTool === tool ? 'bg-cyan-700 text-white' : 'bg-slate-800 text-gray-300 hover:bg-slate-700'}`}
    >{label}</button>
  )

  return (
    // outer wrapper — fixed fullscreen OR normal inline block
    <div className={
      isFullscreen
        ? 'fixed inset-0 z-50 bg-[#090912] flex flex-col'
        : 'flex flex-col rounded-xl overflow-hidden border border-slate-700/60'
    }>

      {/* ── Single-plane top bar (hidden in MPR mode) ────────────────────── */}
      {!isMPR && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0d1117] border-b border-slate-800 shrink-0">
          <span className="text-white font-semibold text-sm truncate">{title ?? 'MRI'}</span>
          {!loading && !error && (
            <div className="flex rounded overflow-hidden border border-slate-700 ml-2">
              {toolBtn('windowLevel', 'W / L')}
              <div className="w-px bg-slate-700" />
              {toolBtn('navigate', '✛ Nav')}
            </div>
          )}
          <button
            onClick={() => setLayout('mpr')}
            className="ml-auto text-xs text-gray-400 hover:text-white border border-slate-700 px-2 py-0.5 rounded"
          >← MPR</button>
          <button
            onClick={() => setIsFullscreen(f => !f)}
            className="text-gray-400 hover:text-white text-base leading-none ml-1"
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >{isFullscreen ? '✕' : '⛶'}</button>
        </div>
      )}

      {/* ── Loading ───────────────────────────────────────────────────────── */}
      {loading && (
        <div className="flex-1 flex items-center justify-center bg-black">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-white text-sm font-mono">{step}</p>
            <p className="text-gray-400 text-xs">First load may take 10–30 s</p>
          </div>
        </div>
      )}

      {/* ── Error ─────────────────────────────────────────────────────────── */}
      {error && (
        <div className="flex items-center justify-center py-4 bg-red-900/30 border border-red-700">
          <p className="text-red-400 text-sm">⚠ {error}</p>
        </div>
      )}

      {/*
       * ── Viewport grid ─────────────────────────────────────────────────────
       * ALL FOUR CELLS ARE ALWAYS IN THE DOM.
       * Cornerstone attaches to the ref divs at init; they must never remount.
       * In MPR mode: 2×2 grid (Slicer-style).
       * In single-plane mode: flex-col, non-active cells hidden via CSS.
       * Cells are only hidden AFTER loading completes (via isPlaneVisible).
       */}
      <div className={`flex-1 min-h-0 ${isMPR ? 'grid grid-cols-2 gap-[1px] bg-slate-800/40' : 'flex flex-col'}`}>

        {/* ╔══ TOP-LEFT / full-width: Axial ═════════════════════════════════ */}
        <div className={`flex flex-col bg-black ${!isPlaneVisible('axial') ? 'hidden' : ''}`}>
          {!loading && !error && (
            <PlaneHeader
              plane="axial"
              index={slices.axial.index} total={slices.axial.total}
              onChange={i => setSliceIndex('axial', i)}
              onMaximize={() => setLayout(isMPR ? 'axial' : 'mpr')}
            />
          )}
          <div ref={axialRef} className={`w-full ${vpH}`} />
        </div>

        {/* ╔══ TOP-RIGHT: Controls panel (MPR only) ═════════════════════════ */}
        <div className={`flex-col bg-[#0d1117] p-3 gap-3 ${isMPR ? 'flex' : 'hidden'}`}>

          {/* Title + fullscreen btn */}
          <div className="flex items-start justify-between gap-2 shrink-0">
            <span className="text-white font-semibold text-sm leading-snug truncate">
              {title ?? 'MRI'}
            </span>
            <button
              onClick={() => setIsFullscreen(f => !f)}
              className="shrink-0 text-gray-400 hover:text-white text-lg leading-none"
              title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >{isFullscreen ? '✕' : '⛶'}</button>
          </div>

          {!loading && !error && (
            <>
              {/* Tool toggle */}
              <div className="space-y-1 shrink-0">
                <p className="text-gray-500 text-[10px] uppercase tracking-widest">Tool</p>
                <div className="flex rounded overflow-hidden border border-slate-700">
                  {toolBtn('windowLevel', 'W / L')}
                  <div className="w-px bg-slate-700" />
                  {toolBtn('navigate', '✛ Navigate')}
                </div>
              </div>

              {/* Plane maximize shortcuts */}
              <div className="space-y-1 shrink-0">
                <p className="text-gray-500 text-[10px] uppercase tracking-widest">Maximize plane</p>
                <div className="grid grid-cols-3 gap-1">
                  {(['axial', 'coronal', 'sagittal'] as Plane[]).map(p => (
                    <button
                      key={p}
                      onClick={() => setLayout(p)}
                      className="py-1 rounded text-white/80 hover:text-white text-xs transition-colors"
                      style={{ backgroundColor: PC[p].bar + 'bb' }}
                    >{PC[p].label}</button>
                  ))}
                </div>
              </div>

              {/* Mouse hint */}
              <div className="mt-auto pt-1 text-[10px] text-gray-600 leading-relaxed space-y-0.5">
                <p>🖱 Scroll → slices</p>
                <p>🖱 Right-drag → zoom</p>
                <p>🖱 Middle-drag → pan</p>
                <p>🖱 Left → {activeTool === 'navigate' ? 'reposition crosshair' : 'window / level'}</p>
              </div>
            </>
          )}
        </div>

        {/* ╔══ BOTTOM-LEFT: Coronal ══════════════════════════════════════════ */}
        <div className={`flex flex-col bg-black ${!isPlaneVisible('coronal') ? 'hidden' : ''}`}>
          {!loading && !error && (
            <PlaneHeader
              plane="coronal"
              index={slices.coronal.index} total={slices.coronal.total}
              onChange={i => setSliceIndex('coronal', i)}
              onMaximize={() => setLayout(isMPR ? 'coronal' : 'mpr')}
            />
          )}
          <div ref={coronalRef} className={`w-full ${vpH}`} />
        </div>

        {/* ╔══ BOTTOM-RIGHT: Sagittal ════════════════════════════════════════ */}
        <div className={`flex flex-col bg-black ${!isPlaneVisible('sagittal') ? 'hidden' : ''}`}>
          {!loading && !error && (
            <PlaneHeader
              plane="sagittal"
              index={slices.sagittal.index} total={slices.sagittal.total}
              onChange={i => setSliceIndex('sagittal', i)}
              onMaximize={() => setLayout(isMPR ? 'sagittal' : 'mpr')}
            />
          )}
          <div ref={sagittalRef} className={`w-full ${vpH}`} />
        </div>

      </div>
    </div>
  )
}

export default MRIViewer


