import { Link, useLocation } from 'react-router-dom'

const ADMIN_NAV_ITEMS = [
  { path: '/admin/dashboard', label: 'Dashboard' },
] as const

const NAV_ICONS: Record<string, JSX.Element> = {
  '/admin/dashboard': (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
}

interface AdminSidebarProps {
  isOpen: boolean
  onClose: () => void
}

const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {
  const location = useLocation()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden z-30"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed lg:static top-16 left-0 z-40 h-[calc(100vh-4rem)] lg:h-auto w-64 lg:w-52 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-full lg:h-auto bg-slate-950/95 lg:bg-transparent p-3 lg:py-6 lg:pr-5 lg:pl-0">
          <div className="rounded-2xl border border-slate-700/40 bg-slate-900/50 backdrop-blur-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/40">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Admin Menu</span>
              <button
                className="lg:hidden w-6 h-6 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
                onClick={onClose}
                aria-label="Close navigation"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Nav links */}
            <nav className="p-2">
              {ADMIN_NAV_ITEMS.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                      isActive
                        ? 'bg-cyan-400/10 text-cyan-300'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                    }`}
                  >
                    {/* Active indicator bar */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-cyan-400" />
                    )}
                    <span className={isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300 transition-colors'}>
                      {NAV_ICONS[item.path]}
                    </span>
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </aside>
    </>
  )
}

export default AdminSidebar
