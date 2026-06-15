export type ViewMode = 'single' | 'side-by-side' | 'overlay' | 'lr-only' | 'hr-only'

export type ViewerVariant = 'user' | 'admin'

export const VIEWER_COPY = {
  user: {
    headerWithSr: 'Compare input (law resolution) with output (super resolution)',
    headerPreprocessOnly: 'Inspect your inference-ready preprocessed scan.',
    inputTitle: 'Input (Low Resolution)',
    outputTitle: 'Output (Super Resolution)',
    singleTitle: 'Preprocessed Scan',
    inputOnly: 'Input Only',
    outputOnly: 'Output Only',
    downloadInput: '↓ Input',
    downloadOutput: '↓ Output',
    downloadInputLong: '↓ Download Input NIfTI',
    downloadInputTitle: 'Download super-resolution input NIfTI file',
    downloadOutputTitle: 'Download low-resolution output NIfTI file',
    pendingHint: 'Viewing the preprocessed scan prepared for downstream inference.',
  },
  admin: {
    header: 'Compare input (high-resolution checkerboard) with output (low resolution).',
    inputTitle: 'Input (High Resolution + Checkerboard)',
    outputTitle: 'Output (Low Resolution)',
    overlayTitle: 'Overlay View',
    downloadInput: '↓ Input',
    downloadOutput: '↓ Output',
    downloadInputTitle: 'Download HR input NIfTI file (with checkerboard artifact)',
    downloadOutputTitle: 'Download LR output NIfTI file',
    variantLabel: 'LR Variant:',
  },
} as const

export const VIEW_MODE_BUTTONS = [
  { mode: 'side-by-side' as ViewMode, label: 'Side by Side', requiresBoth: true },
  { mode: 'overlay' as ViewMode, label: 'Overlay', requiresBoth: true },
  { mode: 'lr-only' as ViewMode, label: 'Output Only', requiresBoth: true },
  { mode: 'hr-only' as ViewMode, label: 'Input Only', requiresBoth: false },
] as const

export type Layout = 'mpr' | 'axial' | 'coronal' | 'sagittal'

export const LAYOUT_BUTTONS: { layout: Layout; label: string }[] = [
  { layout: 'mpr',      label: 'MPR (3-plane)' },
  { layout: 'axial',    label: 'Axial' },
  { layout: 'coronal',  label: 'Coronal' },
  { layout: 'sagittal', label: 'Sagittal' },
]
