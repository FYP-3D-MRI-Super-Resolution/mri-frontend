import ReactSkeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

// Themed wrapper — dark slate to match app design
const SkeletonThemeWrapper = ({ children }: { children: React.ReactNode }) => (
  <SkeletonTheme baseColor="#1e293b" highlightColor="#334155">
    {children}
  </SkeletonTheme>
)

export const JobsTableSkeleton = () => (
  <SkeletonThemeWrapper>
    <div className="w-full space-y-4">
      {/* Header bar */}
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-2">
          <ReactSkeleton width={210} height={32} borderRadius={8} />
          <ReactSkeleton width={290} height={16} borderRadius={6} />
        </div>
        <ReactSkeleton width={96} height={40} borderRadius={10} />
      </div>

      {/* Table card */}
      <div className="card p-0 overflow-hidden">
        {/* Table header row */}
        <div className="flex gap-4 px-6 py-3 border-b border-slate-700/50 bg-slate-800/40">
          {[112, 80, 128, 64, 96, 80].map((w, i) => (
            <ReactSkeleton key={i} width={w} height={12} borderRadius={4} />
          ))}
        </div>

        {/* Table rows */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex gap-4 items-center px-6 py-4 border-b border-slate-700/30 last:border-0"
          >
            <ReactSkeleton width={112} height={16} borderRadius={4} />
            <ReactSkeleton width={80} height={22} borderRadius={999} />
            <div className="w-32 space-y-1">
              <ReactSkeleton width={128} height={8} borderRadius={999} />
              <ReactSkeleton width={32} height={12} borderRadius={4} />
            </div>
            <ReactSkeleton width={32} height={16} borderRadius={4} />
            <ReactSkeleton width={56} height={16} borderRadius={4} />
            <ReactSkeleton width={96} height={34} borderRadius={8} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center pt-2">
        <ReactSkeleton width={96} height={16} borderRadius={4} />
        <div className="flex gap-2">
          <ReactSkeleton width={80} height={36} borderRadius={8} />
          <ReactSkeleton width={64} height={36} borderRadius={8} />
        </div>
      </div>
    </div>
  </SkeletonThemeWrapper>
)

export const ViewerSkeleton = () => (
  <SkeletonThemeWrapper>
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <ReactSkeleton width={192} height={36} borderRadius={8} />
        <ReactSkeleton width={256} height={16} borderRadius={6} />
      </div>

      {/* Controls card */}
      <div className="card flex flex-wrap gap-3 items-center">
        {[90, 72, 80, 90].map((w, i) => (
          <ReactSkeleton key={i} width={w} height={36} borderRadius={8} />
        ))}
      </div>

      {/* Main viewer — two panels */}
      <div className="card">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {['Low Resolution', 'Super Resolution'].map((_, i) => (
            <div key={i} className="space-y-2">
              <ReactSkeleton width={128} height={20} borderRadius={6} />
              <ReactSkeleton height={288} borderRadius={12} />
            </div>
          ))}
        </div>
      </div>

      {/* Metrics card */}
      <div className="card space-y-4">
        <ReactSkeleton width={144} height={24} borderRadius={6} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-slate-800/40 rounded-xl p-4 space-y-2 text-center">
              <ReactSkeleton width={48} height={12} borderRadius={4} />
              <ReactSkeleton width={80} height={32} borderRadius={6} />
            </div>
          ))}
        </div>
      </div>
    </div>
  </SkeletonThemeWrapper>
)
