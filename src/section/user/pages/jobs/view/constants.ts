export type ViewMode = 'single' | 'side-by-side' | 'overlay' | 'lr-only' | 'hr-only'

export type ViewerVariant = 'user' | 'admin'

export const VIEW_MODE_BUTTONS = [
  { mode: 'side-by-side' as ViewMode, label: 'Side by Side', requiresBoth: true },
  { mode: 'overlay' as ViewMode, label: 'Overlay', requiresBoth: true },
  { mode: 'lr-only' as ViewMode, label: 'LR Only', requiresBoth: true },
  { mode: 'hr-only' as ViewMode, label: 'HR Only', requiresBoth: false },
] as const

export type Layout = 'mpr' | 'axial' | 'coronal' | 'sagittal'

export const LAYOUT_BUTTONS: { layout: Layout; label: string }[] = [
  { layout: 'mpr',      label: 'MPR (3-plane)' },
  { layout: 'axial',    label: 'Axial' },
  { layout: 'coronal',  label: 'Coronal' },
  { layout: 'sagittal', label: 'Sagittal' },
]
