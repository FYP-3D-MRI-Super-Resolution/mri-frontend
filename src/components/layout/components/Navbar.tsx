import { Link } from 'react-router-dom'

interface NavbarProps {
  userName?: string
  isAuthenticated: boolean
  isPendingLogout: boolean
  onOpenSidebar: () => void
  onLogout: () => void
}

const Navbar = ({
  userName,
  isAuthenticated,
  isPendingLogout,
  onOpenSidebar,
  onLogout,
}: NavbarProps) => (
  <nav className="border-b border-slate-700/50 bg-slate-900/60 backdrop-blur">
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16">
        {/* Left: hamburger + brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSidebar}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-md text-slate-200 hover:bg-slate-800"
            aria-label="Open navigation"
          >
            ☰
          </button>
          <h1 className="text-xl font-bold text-cyan-300">MRI Super-Resolution</h1>
          <span className="hidden sm:inline-flex px-2 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700">
            Research Portal
          </span>
        </div>

        {/* Right: user menu */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              {userName && <span className="text-sm text-slate-200">{userName}</span>}
              <button
                onClick={onLogout}
                disabled={isPendingLogout}
                className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50"
              >
                {isPendingLogout ? 'Logging out...' : 'Logout'}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-cyan-300 hover:text-cyan-200"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-900 bg-cyan-300 hover:bg-cyan-200"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  </nav>
)

export default Navbar
