import { useEffect } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AdminLayout() {
  const { user, loading, signOut } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      navigate('/admin/login', { replace: true })
    }
  }, [user, loading, navigate])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-sand-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-ember/30 border-t-ember" />
          <p className="text-small font-medium text-ink-700">Loading Nova Admin…</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const navItems = [
    { name: 'Overview', path: '/admin', end: true },
    { name: 'Messages', path: '/admin/messages', end: false },
    { name: 'Applications', path: '/admin/applications', end: false },
    { name: 'Projects', path: '/admin/projects', end: false },
  ]

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-graphite-900/10 bg-graphite-950 text-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link to="/admin" className="flex items-center gap-2">
              <span className="font-display text-lead font-bold tracking-wider text-white">
                NOVA <span className="text-ember">ADMIN</span>
              </span>
            </Link>

            <nav className="hidden space-x-1 sm:flex" aria-label="Admin Navigation">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `rounded-lg px-3.5 py-2 text-small font-semibold transition-colors ${
                      isActive
                        ? 'bg-white/15 text-white'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden text-small text-white/60 md:inline-block">
              {user.email}
            </span>
            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-white/20 px-3 py-1.5 text-small font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              Public Site &nearr;
            </Link>
            <button
              type="button"
              onClick={() => signOut()}
              className="rounded-lg bg-white/10 px-3 py-1.5 text-small font-medium text-white transition hover:bg-danger-600/80"
            >
              Log out
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex overflow-x-auto border-t border-white/10 px-4 py-2 sm:hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-lg px-3 py-1.5 text-small font-medium ${
                  isActive ? 'bg-white/20 text-white' : 'text-white/70'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}
