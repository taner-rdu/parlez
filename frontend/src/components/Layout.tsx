import { NavLink, Outlet } from 'react-router-dom'
import logo from '../assets/parlez.png'

const NAV_LINKS = [
  { to: '/', label: 'Dashboard' },
  { to: '/translate', label: 'Translate' },
  { to: '/vocabulary', label: 'Vocabulary' },
  { to: '/conjugation', label: 'Practice Conjugation' },
  { to: '/sentences', label: 'Practice Sentences' },
]

export default function Layout() {
  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 h-28 border-b border-gray-200 bg-white shrink-0">
        <img src={logo} alt="parlez logo" className="h-24" />
        <span className="text-gray-700 text-2xl tracking-widest" style={{ fontFamily: "'Playfair Display', serif" }}>~parlez~</span>
        <button className="px-4 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
          Log in
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <nav className="w-44 shrink-0 border-r border-gray-200 bg-gray-50 flex flex-col pt-4">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `px-4 py-2.5 text-sm rounded-lg mx-2 mb-0.5 ${
                  isActive
                    ? 'bg-gray-200 text-gray-900 font-medium'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
