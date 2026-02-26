import { UPLOAD_GUIDELINES } from '../constants'

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
