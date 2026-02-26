interface NavbarProps {
  userName?: string
  isPendingLogout: boolean
  onOpenSidebar: () => void
  onLogout: () => void
}

const UserAvatar = ({ name }: { name: string }) => (
  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-slate-900 text-xs font-bold shrink-0 ring-2 ring-cyan-400/30">
    {name.charAt(0).toUpperCase()}
  </div>
)

const Navbar = ({
  userName,
  isPendingLogout,
  onOpenSidebar,
  onLogout,
}: NavbarProps) => (
  <nav className="sticky top-0 z-50 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-md shadow-lg shadow-black/20">
    <div className="w-full px-4 sm:px-6 lg:px-9">
      <div className="flex justify-between h-16 items-center">

        {/* Left: hamburger + brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSidebar}
            className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            aria-label="Open navigation"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-md shadow-cyan-500/30">
              <svg className="w-4.5 h-4.5 text-slate-900" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21a48.309 48.309 0 01-8.135-.687c-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
              </svg>
            </div>
            <div className="flex flex-col leading-tight">
              <h1 className="text-base font-bold text-white tracking-tight">MRI Super-Resolution</h1>
              <span className="hidden sm:block text-[10px] font-medium text-cyan-400/80 tracking-widest uppercase">
                Research Portal
              </span>
            </div>
          </div>
        </div>

        {/* Right: user menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {userName && (
            <div className="hidden sm:flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
              <UserAvatar name={userName} />
              <span className="text-sm font-medium text-slate-200">{userName}</span>
            </div>
          )}
          {/* Mobile avatar only */}
          {userName && (
            <div className="sm:hidden">
              <UserAvatar name={userName} />
            </div>
          )}
          <button
            onClick={onLogout}
            disabled={isPendingLogout}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg text-rose-300 border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 hover:border-rose-500/60 hover:text-rose-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isPendingLogout ? (
              <>
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Signing out
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
                Sign out
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  </nav>
)

export default Navbar
