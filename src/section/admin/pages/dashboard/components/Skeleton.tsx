/**
 * Loading Skeleton Components
 * Provides smooth loading experiences with skeleton UI patterns
 */

interface SkeletonProps {
  className?: string
}

export const CardSkeleton = ({ className = '' }: SkeletonProps) => {
  return (
    <div className={`rounded-2xl border border-slate-700/40 bg-slate-900/50 p-6 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="h-4 w-24 rounded bg-slate-700/50 animate-pulse" />
          <div className="mt-4 h-10 w-16 rounded bg-slate-700/50 animate-pulse" />
        </div>
        <div className="h-12 w-12 rounded-lg bg-slate-700/50 animate-pulse" />
      </div>
    </div>
  )
}

export const HeaderSkeleton = () => {
  return (
    <div className="space-y-2">
      <div className="h-10 w-48 rounded bg-slate-700/50 animate-pulse" />
      <div className="h-4 w-96 rounded bg-slate-700/50 animate-pulse" />
    </div>
  )
}

export const InfoSkeleton = () => {
  return (
    <div className="rounded-2xl border border-slate-700/40 bg-slate-900/50 p-6">
      <div className="h-6 w-32 rounded bg-slate-700/50 animate-pulse mb-4" />
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex justify-between items-center">
            <div className="h-4 w-20 rounded bg-slate-700/50 animate-pulse" />
            <div className="h-4 w-32 rounded bg-slate-700/50 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}
