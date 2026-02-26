export type ViewMode = 'side-by-side' | 'overlay' | 'lr-only' | 'hr-only'

export const VIEW_MODE_BUTTONS = [
  { mode: 'side-by-side' as ViewMode, label: 'Side by Side', requiresBoth: true },
  { mode: 'overlay' as ViewMode, label: 'Overlay', requiresBoth: true },
  { mode: 'lr-only' as ViewMode, label: 'LR Only', requiresBoth: true },
  { mode: 'hr-only' as ViewMode, label: 'HR Only', requiresBoth: false },
] as const
