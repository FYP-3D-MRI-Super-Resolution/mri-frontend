export const HERO_STATS = [
  { label: 'Pipeline', value: 'Automated', hint: 'Preprocess + Res-SRDiff SR' },
  { label: 'Formats', value: 'NIfTI', hint: '.nii / .nii.gz' },
  { label: 'Output', value: 'LR + SR', hint: 'Preprocessed & enhanced' },
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
    title: 'Res-SRDiff SR',
    desc: 'Run super-resolution on the preprocessed volume automatically.',
    badge: 'Step 03',
  },
  {
    title: 'Compare Results',
    desc: 'Review preprocessed input vs SR output in the 3D viewer.',
    badge: 'Step 04',
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
