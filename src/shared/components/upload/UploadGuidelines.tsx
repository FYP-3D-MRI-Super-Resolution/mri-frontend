const UPLOAD_GUIDELINES = [
  'Supported formats: .nii, .nii.gz',
  'Maximum file size: 500 MB per file',
  'Preprocessing typically takes 5-15 minutes per scan',
  'Files are automatically deleted after 7 days',
] as const

const UploadGuidelines = () => (
  <div className="mt-8 card border border-cyan-400/20 bg-cyan-400/5">
    <h3 className="text-lg font-semibold mb-3 text-cyan-200">📋 Upload Guidelines</h3>
    <ul className="space-y-2 text-sm text-dim">
      {UPLOAD_GUIDELINES.map((item) => (
        <li key={item}>• {item}</li>
      ))}
    </ul>
  </div>
)

export default UploadGuidelines
