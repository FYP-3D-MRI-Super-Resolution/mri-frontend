/**
 * useMRIViewer Hook
 * Encapsulates all Cornerstone rendering-engine lifecycle:
 *   initialisation → volume loading → tool setup → cleanup.
 * Components receive only refs + derived state — no library details leak out.
 */

import { useRef, useState, useCallback, useEffect, useId } from 'react'
import {
  RenderingEngine,
  Enums as csEnums,
  volumeLoader,
  setVolumesForViewports,
  cache,
  imageLoader,
  utilities as csUtils,
  type Types,
} from '@cornerstonejs/core'
import {
  WindowLevelTool,
  PanTool,
  ZoomTool,
  StackScrollTool,
  CrosshairsTool,
  ToolGroupManager,
  Enums as toolEnums,
} from '@cornerstonejs/tools'
import { filesService } from '@/section/user/services'
import { ensureCornerstoneInitialized, toDicomBase, toWadoUriImageIds } from '@/shared/utils'
import type { Layout } from '@/section/user/pages/jobs/view/constants'

const { ViewportType, OrientationAxis } = csEnums
const { MouseBindings } = toolEnums

/**
 * Reject after `ms` milliseconds with a descriptive error.
 * Wraps any long-running promise so stalls are surfaced instead of hanging forever.
 */
function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error(`Timed out after ${ms / 1000}s: ${label}`)),
        ms,
      ),
    ),
  ])
}

/**
 * Module-level semaphore that allows only ONE viewer to run createAndCacheVolume
 * at a time.  Concurrent hits can race on Cornerstone3D's internal task queue
 * and deadlock the codec workers.
 */
let _volumeCreateLock: Promise<void> = Promise.resolve()

type ActiveTool = 'windowLevel' | 'navigate'
interface SlicePos { index: number; total: number }

interface UseMRIViewerReturn {
  /** Attach these refs to the three viewport <div> elements */
  axialRef: React.RefObject<HTMLDivElement>
  coronalRef: React.RefObject<HTMLDivElement>
  sagittalRef: React.RefObject<HTMLDivElement>
  loading: boolean
  /** Current debug step shown in the loading overlay */
  step: string
  error: string | null
  layout: Layout
  setLayout: (layout: Layout) => void
  /** Returns true when the given plane should be visible for the current layout */
  isPlaneVisible: (plane: 'axial' | 'coronal' | 'sagittal') => boolean
  /** Per-plane slice position: index (0-based) and total slice count */
  slices: { axial: SlicePos; coronal: SlicePos; sagittal: SlicePos }
  /** Jump to a specific slice in one plane */
  setSliceIndex: (plane: 'axial' | 'coronal' | 'sagittal', index: number) => void
  /** Active left-mouse tool: 'windowLevel' or 'navigate' (crosshair) */
  activeTool: ActiveTool
  setActiveTool: (tool: ActiveTool) => void
}

export const useMRIViewer = (fileUrl: string): UseMRIViewerReturn => {
  const uid = useId().replace(/:/g, '-')
  const viewportIdAxial    = `${uid}-axial`
  const viewportIdCoronal  = `${uid}-coronal`
  const viewportIdSagittal = `${uid}-sagittal`
  const toolGroupId        = `${uid}-tools`
  const renderingEngineId  = `${uid}-engine`

  const axialRef    = useRef<HTMLDivElement>(null)
  const coronalRef  = useRef<HTMLDivElement>(null)
  const sagittalRef = useRef<HTMLDivElement>(null)

  const engineRef   = useRef<RenderingEngine | null>(null)
  const volumeIdRef = useRef<string | null>(null)
  /**
   * Monotonically-increasing run counter.
   * Incremented by the effect cleanup whenever it fires (StrictMode, hot-reload, etc.).
   * Every initViewer captures its own runId; if the counter has moved on by the time
   * an await resumes, the run is considered stale and exits without touching state.
   */
  const runIdRef = useRef(0)
  /** Unsubscribes the CAMERA_MODIFIED listeners attached after volume loads */
  const cameraCleanupRef = useRef<(() => void) | null>(null)

  const [loading, setLoading] = useState(true)
  const [step,    setStep]    = useState('Initialising…')
  const [error,   setError]   = useState<string | null>(null)
  const [layout,  setLayout]  = useState<Layout>('mpr')
  const [activeTool, setActiveToolState] = useState<ActiveTool>('windowLevel')
  const [slices, setSlices] = useState<{ axial: SlicePos; coronal: SlicePos; sagittal: SlicePos }>({
    axial:    { index: 0, total: 1 },
    coronal:  { index: 0, total: 1 },
    sagittal: { index: 0, total: 1 },
  })

  const log = (msg: string) => setStep(msg)

  const initViewer = useCallback(async () => {
    if (!axialRef.current || !coronalRef.current || !sagittalRef.current) return

    // Claim a unique run slot. If cleanup fires mid-flight it increments runIdRef,
    // making every subsequent stale() check true so this run exits quietly.
    const runId = ++runIdRef.current
    const stale = () => runId !== runIdRef.current

    setLoading(true)
    setError(null)

    try {
      // ── Step 1: Cornerstone init ──────────────────────────────────────────
      log('Step 1/7 — Initialising Cornerstone3D…')
      await ensureCornerstoneInitialized()
      if (stale()) return

      // ── Step 2: DICOM info (triggers NIfTI→DICOM conversion on backend) ──
      const dicomBase = toDicomBase(fileUrl)
      const dicomPath = dicomBase.replace(/^\/api/, '')
      log(`Step 2/7 — Fetching DICOM info… (${dicomPath}/info)`)

      const dicomInfo = await filesService.getDicomInfo(dicomBase)
      if (stale()) return

      if (!dicomInfo.slice_urls?.length) {
        throw new Error('No DICOM slices returned from server')
      }

      // ── Step 3: Build imageIds (absolute URLs via VITE_API_URL origin) ───
      log(`Step 3/7 — Building ${dicomInfo.slice_urls.length} imageIds…`)
      const imageIds = toWadoUriImageIds(dicomInfo.slice_urls)

      // ── Step 4: Teardown previous engine ─────────────────────────────────
      log('Step 4/7 — Tearing down previous engine…')
      cameraCleanupRef.current?.()
      cameraCleanupRef.current = null
      engineRef.current?.destroy()
      engineRef.current = null
      ToolGroupManager.destroyToolGroup(toolGroupId)
      if (volumeIdRef.current) {
        try { cache.removeVolumeLoadObject(volumeIdRef.current) } catch { /* intentional */ }
        volumeIdRef.current = null
      }

      // ── Step 5: Create volume + rendering engine ──────────────────────────
      log('Step 5/7 — Creating volume + rendering engine…')
      const volumeId = `cornerstoneStreamingImageVolume:${fileUrl}`
      volumeIdRef.current = volumeId

      // Serialise volume creation: only one viewer may call createAndCacheVolume
      // at a time.  CS3D's codec-worker task queue can silently deadlock when two
      // volumes start probing images simultaneously.
      let releaseLock!: () => void
      const myTurn = new Promise<void>(res => { releaseLock = res })
      const prevLock = _volumeCreateLock
      _volumeCreateLock = myTurn
      await prevLock               // wait for the previous viewer to finish
      if (stale()) { releaseLock(); return }

      let volume: Awaited<ReturnType<typeof volumeLoader.createAndCacheVolume>>
      try {
        volume = await withTimeout(
          volumeLoader.createAndCacheVolume(volumeId, { imageIds }),
          90_000, // 90 s — convert + decode timeout
          'createAndCacheVolume',
        )
      } finally {
        releaseLock()  // always release the lock so the next viewer can proceed
      }

      if (stale()) {
        try { cache.removeVolumeLoadObject(volumeId) } catch { /* intentional */ }
        return
      }

      const engine = new RenderingEngine(renderingEngineId)
      engineRef.current = engine

      engine.setViewports([
        {
          viewportId: viewportIdAxial,
          type: ViewportType.ORTHOGRAPHIC,
          element: axialRef.current,
          defaultOptions: { orientation: OrientationAxis.AXIAL,    background: [0,0,0] as [number,number,number] },
        },
        {
          viewportId: viewportIdCoronal,
          type: ViewportType.ORTHOGRAPHIC,
          element: coronalRef.current,
          defaultOptions: { orientation: OrientationAxis.CORONAL,  background: [0,0,0] as [number,number,number] },
        },
        {
          viewportId: viewportIdSagittal,
          type: ViewportType.ORTHOGRAPHIC,
          element: sagittalRef.current,
          defaultOptions: { orientation: OrientationAxis.SAGITTAL, background: [0,0,0] as [number,number,number] },
        },
      ])

      // ── Step 6: Tool setup ────────────────────────────────────────────────
      log('Step 6/7 — Setting up interaction tools…')
      const toolGroup = ToolGroupManager.createToolGroup(toolGroupId)!
      toolGroup.addTool(WindowLevelTool.toolName)
      toolGroup.addTool(PanTool.toolName)
      toolGroup.addTool(ZoomTool.toolName)
      toolGroup.addTool(StackScrollTool.toolName)
      // CrosshairsTool: color-coded reference lines matching the plane labels
      toolGroup.addTool(CrosshairsTool.toolName, {
        getReferenceLineColor: (vpId: string) => {
          if (vpId === viewportIdAxial)    return 'rgb(200, 200, 25)'  // yellow
          if (vpId === viewportIdCoronal)  return 'rgb(25, 200, 25)'   // green
          if (vpId === viewportIdSagittal) return 'rgb(25, 100, 200)'  // blue
          return 'rgb(200, 200, 200)'
        },
        getReferenceLineControllable: () => true,
        getReferenceLineDraggableRotatable: () => false,
        getReferenceLineSlabThicknessControlsOn: () => false,
      })
      toolGroup.addViewport(viewportIdAxial,    engine.id)
      toolGroup.addViewport(viewportIdCoronal,  engine.id)
      toolGroup.addViewport(viewportIdSagittal, engine.id)
      // Permanent bindings (never change with mode switch):
      //   wheel  = scroll through slices (Slicer default)
      //   right  = zoom
      //   middle = pan
      toolGroup.setToolActive(StackScrollTool.toolName, { bindings: [{ mouseButton: MouseBindings.Wheel }] })
      toolGroup.setToolActive(ZoomTool.toolName,         { bindings: [{ mouseButton: MouseBindings.Secondary }] })
      toolGroup.setToolActive(PanTool.toolName,          { bindings: [{ mouseButton: MouseBindings.Auxiliary }] })
      // Primary (left) mouse default = Window/Level; crosshair shows reference lines only
      toolGroup.setToolActive(WindowLevelTool.toolName, { bindings: [{ mouseButton: MouseBindings.Primary }] })
      toolGroup.setToolEnabled(CrosshairsTool.toolName)

      // ── Step 7: setVolumesForViewports then load ──────────────────────────
      log('Step 7/7 — Associating volume with viewports…')
      await withTimeout(
        setVolumesForViewports(
          engine,
          [{ volumeId }],
          [viewportIdAxial, viewportIdCoronal, viewportIdSagittal],
        ),
        30_000,
        'setVolumesForViewports',
      )
      if (stale()) {
        engine.destroy()
        return
      }
      volume.load()
      engine.renderViewports([viewportIdAxial, viewportIdCoronal, viewportIdSagittal])

      // ── Read initial slice positions ──────────────────────────────────────
      const readSlicePos = (vpId: string): SlicePos => {
        try {
          const vp = engine.getViewport(vpId) as Types.IVolumeViewport
          const info = csUtils.getVolumeViewportScrollInfo(vp, volumeId)
          return { index: info.currentStepIndex, total: info.numScrollSteps + 1 }
        } catch { return { index: 0, total: 1 } }
      }
      setSlices({
        axial:    readSlicePos(viewportIdAxial),
        coronal:  readSlicePos(viewportIdCoronal),
        sagittal: readSlicePos(viewportIdSagittal),
      })

      // ── Attach CAMERA_MODIFIED listeners for live slice tracking ──────────
      //    Fires on scroll (StackScrollTool) AND crosshair click (CrosshairsTool)
      //    so the slice sliders stay in sync in both modes.
      const makeHandler = (
        plane: 'axial' | 'coronal' | 'sagittal',
        vpId: string,
      ) => () => {
        const eng   = engineRef.current
        const volId = volumeIdRef.current
        if (!eng || !volId) return
        try {
          const vp   = eng.getViewport(vpId) as Types.IVolumeViewport
          const info = csUtils.getVolumeViewportScrollInfo(vp, volId)
          setSlices(prev => ({
            ...prev,
            [plane]: { index: info.currentStepIndex, total: info.numScrollSteps + 1 },
          }))
        } catch { /* volume/viewport not ready */ }
      }

      const hAxial    = makeHandler('axial',    viewportIdAxial)
      const hCoronal  = makeHandler('coronal',  viewportIdCoronal)
      const hSagittal = makeHandler('sagittal', viewportIdSagittal)

      axialRef.current!.addEventListener(csEnums.Events.CAMERA_MODIFIED,    hAxial)
      coronalRef.current!.addEventListener(csEnums.Events.CAMERA_MODIFIED,  hCoronal)
      sagittalRef.current!.addEventListener(csEnums.Events.CAMERA_MODIFIED, hSagittal)

      cameraCleanupRef.current = () => {
        axialRef.current?.removeEventListener(csEnums.Events.CAMERA_MODIFIED,    hAxial)
        coronalRef.current?.removeEventListener(csEnums.Events.CAMERA_MODIFIED,  hCoronal)
        sagittalRef.current?.removeEventListener(csEnums.Events.CAMERA_MODIFIED, hSagittal)
      }

      setLoading(false)
    } catch (err) {
      if (stale()) return
      setError(err instanceof Error ? err.message : String(err))
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileUrl, renderingEngineId, toolGroupId, viewportIdAxial, viewportIdCoronal, viewportIdSagittal])

  useEffect(() => {
    initViewer()
    return () => {
      // Increment runId FIRST so any in-flight initViewer sees itself as stale
      // and exits without further touching shared Cornerstone state.
      runIdRef.current++
      cameraCleanupRef.current?.()
      cameraCleanupRef.current = null
      engineRef.current?.destroy()
      engineRef.current = null
      ToolGroupManager.destroyToolGroup(toolGroupId)
      if (volumeIdRef.current) {
        try { cache.removeVolumeLoadObject(volumeIdRef.current) } catch { /* intentional */ }
        // Also evict any probe images that were cached for this volume so they
        // don’t occupy memory or confuse subsequent createAndCacheVolume calls.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        try { (imageLoader as any).cancelLoadAndCacheImage?.(volumeIdRef.current) } catch { /* intentional */ }
        volumeIdRef.current = null
      }
    }
  }, [initViewer, toolGroupId])

  // Force Cornerstone to re-measure viewports one frame after layout changes.
  // When a panel switches from hidden → visible, the ResizeObserver fires but
  // engine.resize() ensures the GL canvas matches the restored dimensions.
  useEffect(() => {
    const engine = engineRef.current
    if (!engine) return
    const raf = requestAnimationFrame(() => {
      try { engine.resize(true) } catch { /* engine may not be ready */ }
    })
    return () => cancelAnimationFrame(raf)
  }, [layout])

  // ResizeObserver: re-measure canvases whenever a viewport element changes size
  // for ANY reason — fullscreen toggle, window resize, layout switch, etc.
  // This prevents the brain from stretching when the container aspect-ratio changes.
  useEffect(() => {
    const elements = [axialRef.current, coronalRef.current, sagittalRef.current]
      .filter((el): el is HTMLDivElement => el !== null)
    if (!elements.length) return
    let raf = 0
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        try { engineRef.current?.resize(true) } catch { /* engine may not be ready */ }
      })
    })
    elements.forEach(el => ro.observe(el))
    return () => { ro.disconnect(); cancelAnimationFrame(raf) }
  }, []) // refs are stable after mount; no deps needed

  const isPlaneVisible = useCallback(
    (plane: 'axial' | 'coronal' | 'sagittal') => layout === 'mpr' || layout === plane,
    [layout],
  )

  /**
   * Switch the active left-mouse tool:
   *   'navigate'    → CrosshairsTool (click to reposition crosshair, all planes update)
   *   'windowLevel' → WindowLevelTool (drag to adjust brightness/contrast)
   * Scroll/middle/right bindings are unaffected.
   */
  const setActiveTool = useCallback((tool: ActiveTool) => {
    const tg = ToolGroupManager.getToolGroup(toolGroupId)
    if (!tg) return
    if (tool === 'navigate') {
      tg.setToolPassive(WindowLevelTool.toolName)
      tg.setToolActive(CrosshairsTool.toolName, { bindings: [{ mouseButton: MouseBindings.Primary }] })
    } else {
      tg.setToolEnabled(CrosshairsTool.toolName)
      tg.setToolActive(WindowLevelTool.toolName, { bindings: [{ mouseButton: MouseBindings.Primary }] })
    }
    setActiveToolState(tool)
  }, [toolGroupId])

  /**
   * Programmatically jump to a specific slice index in one plane.
   * Called by the per-plane slice sliders in MRIViewer.tsx.
   */
  const setSliceIndex = useCallback((
    plane: 'axial' | 'coronal' | 'sagittal',
    targetIndex: number,
  ) => {
    const eng   = engineRef.current
    const volId = volumeIdRef.current
    if (!eng || !volId) return
    const vpId = plane === 'axial'
      ? viewportIdAxial
      : plane === 'coronal'
        ? viewportIdCoronal
        : viewportIdSagittal
    try {
      const vp   = eng.getViewport(vpId) as Types.IVolumeViewport
      const info = csUtils.getVolumeViewportScrollInfo(vp, volId)
      const delta = targetIndex - info.currentStepIndex
      if (delta !== 0) csUtils.scroll(vp, { delta, volumeId: volId })
    } catch { /* viewport not ready */ }
  }, [viewportIdAxial, viewportIdCoronal, viewportIdSagittal])

  return {
    axialRef,
    coronalRef,
    sagittalRef,
    loading,
    step,
    error,
    layout,
    setLayout,
    isPlaneVisible,
    slices,
    setSliceIndex,
    activeTool,
    setActiveTool,
  }
}
