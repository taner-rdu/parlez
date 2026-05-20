import { NavLink, Outlet } from 'react-router-dom'
import logo from '../assets/parlez.png'

const NAV_LINKS = [
  { to: '/', label: 'Dashboard' },
  { to: '/translate', label: 'Translate' },
  { to: '/vocabulary', label: 'Vocabulary' },
  { to: '/conjugation', label: 'Conjugation' },
  { to: '/sentences', label: 'Sentences' },
]

export default function Layout() {
  return (
    <div className="flex h-screen bg-cream-100" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Sidebar */}
      <aside className="w-52 shrink-0 bg-navy-900 flex flex-col">
        {/* Brand */}
        <div className="flex flex-col items-center pt-8 pb-6 px-4 border-b border-navy-700">
          <img src={logo} alt="parlez logo" className="h-14 mb-3 opacity-90" />
          <span
            className="text-cream-200 text-xl tracking-widest"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            ~parlez~
          </span>
        </div>

        {/* Nav */}
        <nav className="flex flex-col pt-4 px-3 gap-0.5">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `px-4 py-2.5 text-sm rounded-lg transition-colors ${
                  isActive
                    ? 'bg-navy-800 text-gold-400 font-medium border-l-2 border-gold-500'
                    : 'text-cream-200/70 hover:bg-navy-800 hover:text-cream-200'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto px-4 pb-6">
          <button className="w-full px-3 py-2 border border-navy-700 rounded-lg text-sm text-cream-200/60 hover:text-cream-200 hover:border-navy-600 transition-colors">
            Log in
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
