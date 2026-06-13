export const HERO_STATS = [
  { label: 'Pipeline', value: 'Automated', hint: 'Inference preprocessing' },
  { label: 'Formats', value: 'NIfTI', hint: '.nii / .nii.gz' },
  { label: 'Output', value: 'MNI-ready', hint: 'Normalized & registered' },
] as const

export const PIPELINE_STEPS = [
  {
    title: 'Upload LR Scan',
    desc: 'Submit a low-resolution NIfTI volume for processing.',
    badge: 'Step 01',
  },
  {
    title: 'Inference Preprocessing',
    desc: 'Brain extraction, bias correction, normalization, and MNI registration.',
    badge: 'Step 02',
  },
  {
    title: '3D Inspection',
    desc: 'Review the preprocessed volume in an interactive viewer.',
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
