import { Link } from 'react-router-dom'

import { useAuth } from '@/shared/hooks/useAuth'
import { HERO_STATS } from '../constants'

const HeroSection = () => {
  const { user } = useAuth()

  return (
    <div className="space-y-8">
      {user && (
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">
          Welcome back, {user.name}
        </p>
      )}

      <div className="space-y-4">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-tight">
          MRI Inference
          <span className="text-cyan-300"> Preprocessing</span>
        </h1>
        <p className="text-lg text-dim max-w-xl">
          Upload low-resolution MRI scans, run inference-ready preprocessing, and
          inspect normalized volumes in an interactive 3D viewer.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to="/app/upload" className="btn btn-primary text-base px-6 py-3 inline-flex">
          Start a New Upload
        </Link>
        <Link to="/app/jobs" className="btn btn-secondary text-base px-6 py-3 inline-flex">
          View Jobs
        </Link>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {HERO_STATS.map((stat) => (
          <div key={stat.label} className="glass rounded-2xl p-4">
            <p className="text-xs uppercase tracking-widest text-dim">{stat.label}</p>
            <p className="text-lg font-semibold text-white mt-1">{stat.value}</p>
            <p className="text-xs text-dim mt-1">{stat.hint}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HeroSection
