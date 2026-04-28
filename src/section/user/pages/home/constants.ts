export const HERO_STATS = [
  { label: 'Pipeline', value: 'Automated', hint: 'Preprocess + SR' },
  { label: 'Formats', value: 'NIfTI', hint: '.nii / .nii.gz' },
  { label: 'Compute', value: 'GPU-Ready', hint: 'Inference optimized' },
] as const

export const PIPELINE_STEPS = [
  {
    title: 'Upload + Preprocess',
    desc: 'Brain extraction, bias correction, and normalization.',
    badge: 'Step 01',
  },
  {
    title: 'Super-Resolution',
    desc: 'Model inference with quality metrics.',
    badge: 'Step 02',
  },
  {
    title: '3D Comparison',
    desc: 'Side-by-side viewer for LR vs HR volumes.',
    badge: 'Step 03',
  },
] as const

export const INFO_CARDS = [
  {
    label: 'Data Privacy',
    title: 'Secure by default',
    desc: 'Processed files remain within your workspace and can be deleted automatically after review.',
  },
  {
    label: 'Monitoring',
    title: 'Track every job',
    desc: 'View progress, processing time, and output files per job.',
  },
] as const
