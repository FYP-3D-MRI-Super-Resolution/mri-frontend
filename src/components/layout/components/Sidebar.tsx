import { Link, useLocation } from 'react-router-dom'

import { NAV_ITEMS } from '../constants'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <button
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={onClose}
          aria-label="Close navigation"
        />
      )}

      <aside
        className={`fixed lg:static top-16 left-0 z-40 h-[calc(100vh-4rem)] lg:h-auto w-72 lg:w-64 transform transition-transform duration-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-full lg:h-auto bg-slate-900/90 lg:bg-transparent p-4 lg:py-6">
          <div className="glass rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-semibold text-dim uppercase tracking-wider">
                Navigation
              </h2>
              <button
                className="lg:hidden text-slate-300"
                onClick={onClose}
                aria-label="Close navigation"
              >
                ✕
              </button>
            </div>
            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                    location.pathname === item.path
                      ? 'bg-cyan-400/10 text-cyan-200 border border-cyan-400/30'
                      : 'text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
