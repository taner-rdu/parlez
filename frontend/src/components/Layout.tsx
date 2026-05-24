import { NavLink, Outlet } from 'react-router-dom'
import logo from '../assets/parlez.png'

const NAV_LINKS = [
  { to: '/', label: 'Tableau de bord' },
  { to: '/translate', label: 'Traduction' },
  { to: '/vocabulary', label: 'Vocabulaire' },
  { to: '/conjugation', label: 'Conjugaison' },
  { to: '/sentences', label: 'Phrases' },
]

export default function Layout() {
  return (
    <div className="flex h-screen bg-cream-100" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Sidebar */}
      <aside className="w-72 shrink-0 bg-navy-900 flex flex-col">
        {/* Brand */}
        <div className="flex flex-col items-center pt-10 pb-8 px-6 border-b border-navy-700">
          <img src={logo} alt="parlez logo" className="h-16 mb-4 opacity-90" />
          <span
            className="text-cream-200 text-2xl tracking-widest"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            ~parlez~
          </span>
        </div>

        {/* Nav */}
        <nav className="flex flex-col pt-6 px-4 gap-1">
          <span className="px-3 mb-2 text-xs font-semibold tracking-widest text-cream-200/30 uppercase">
            Navigation
          </span>
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `px-4 py-3.5 text-base rounded-lg transition-colors ${
                  isActive
                    ? 'bg-navy-800 text-gold-400 font-semibold border-l-2 border-gold-500'
                    : 'text-cream-200/70 hover:bg-navy-800 hover:text-cream-200'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto px-5 pb-8">
          <button className="w-full px-4 py-3 bg-navy-800 border border-navy-700 rounded-xl text-sm font-medium text-cream-200/80 hover:text-cream-200 hover:bg-navy-700 hover:border-navy-600 transition-colors">
            Se connecter
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="px-12 py-10">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
