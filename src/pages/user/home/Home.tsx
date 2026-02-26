import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

const Home = () => {
  const { user } = useAuth()

  return (
    <div className="relative py-4 sm:py-6">
      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
        <div className="space-y-8">
          {user && (
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">
              Welcome back, {user.name}
            </p>
          )}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-tight">
              MRI Super-Resolution
              <span className="text-cyan-300"> Pipeline</span>
            </h1>
            <p className="text-lg text-dim max-w-xl">
              A research-grade workflow to upscale MRI volumes with robust preprocessing,
              GPU-accelerated inference, and interactive visualization.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/upload" className="btn btn-primary text-base px-6 py-3 inline-flex">
              Start a New Upload
            </Link>
            <Link
              to="/jobs"
              className="btn btn-secondary text-base px-6 py-3 inline-flex"
            >
              View Jobs
            </Link>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: 'Pipeline', value: 'Automated', hint: 'Preprocess + SR' },
              { label: 'Formats', value: 'NIfTI', hint: '.nii / .nii.gz' },
              { label: 'Compute', value: 'GPU-Ready', hint: 'Inference optimized' },
            ].map((stat) => (
              <div key={stat.label} className="glass rounded-2xl p-4">
                <p className="text-xs uppercase tracking-widest text-dim">{stat.label}</p>
                <p className="text-lg font-semibold text-white mt-1">{stat.value}</p>
                <p className="text-xs text-dim mt-1">{stat.hint}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-3">Core Capabilities</h2>
            <div className="space-y-4">
              {[
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
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-400/10 text-cyan-200 border border-cyan-400/30">
                    {item.badge}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="text-sm text-dim">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="card">
              <p className="text-xs uppercase tracking-widest text-dim">Data Privacy</p>
              <p className="text-lg font-semibold text-white mt-2">Secure by default</p>
              <p className="text-sm text-dim mt-2">
                Processed files remain within your workspace and can be deleted
                automatically after review.
              </p>
            </div>
            <div className="card">
              <p className="text-xs uppercase tracking-widest text-dim">Monitoring</p>
              <p className="text-lg font-semibold text-white mt-2">Track every job</p>
              <p className="text-sm text-dim mt-2">
                View progress, processing time, and output files per job.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
