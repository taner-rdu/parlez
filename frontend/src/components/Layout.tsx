import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import logo from '../assets/Asterix.webp'
import { getApiKey, setApiKey, clearApiKey } from '../auth'

const NAV_LINKS = [
  { to: '/', label: 'Tableau de bord' },
  { to: '/translate', label: 'Traduction' },
  { to: '/vocabulary', label: 'Vocabulaire' },
  { to: '/conjugation', label: 'Conjugaison' },
  { to: '/sentences', label: 'Phrases' },
]

function LoginForm({ onLoggedIn }: { onLoggedIn: () => void }) {
  const [input, setInput] = useState('')

  const handleSubmit = () => {
    if (!input.trim()) return
    setApiKey(input.trim())
    onLoggedIn()
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        type="password"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        placeholder="Clé API"
        className="w-full px-3 py-2 rounded-lg text-sm bg-white/10 text-white placeholder-white/40 border border-[#2E4760] focus:outline-none focus:border-gold-400"
      />
      <button
        onClick={handleSubmit}
        className="w-full px-4 py-2.5 bg-gold-500 rounded-lg text-sm font-medium text-navy-900 hover:bg-gold-400 transition-colors"
      >
        Se connecter
      </button>
    </div>
  )
}

export default function Layout() {
  const [loggedIn, setLoggedIn] = useState(() => !!getApiKey())

  return (
    <div className="flex h-screen bg-cream-100" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Sidebar */}
      <aside className="w-72 shrink-0 bg-[#3D5A7A] flex flex-col">
        {/* Brand */}
        <div className="flex flex-col items-center pt-10 pb-8 px-6 border-b border-[#2E4760]">
          <img src={logo} alt="Asterix" className="h-48 mb-4 rounded-2xl" />
          <span
            className="text-white text-3xl tracking-widest"
            style={{ fontFamily: "system-ui, sans-serif", fontWeight: 700, letterSpacing: '0.2em' }}
          >
            ~parlez~
          </span>
        </div>

        {/* Nav */}
        <nav className="flex flex-col pt-6 px-4 gap-1">
          <span className="px-3 mb-2 text-xs font-semibold tracking-widest text-white/50 uppercase">
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
                    ? 'bg-[#4A6D8C] text-gold-400 font-semibold border-l-2 border-[#B84030]'
                    : 'text-white/80 hover:bg-[#4A6D8C] hover:text-white'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto px-5 pb-8">
          {loggedIn ? (
            <button
              onClick={() => { clearApiKey(); setLoggedIn(false) }}
              className="w-full px-4 py-3 bg-[#4A6D8C] border border-[#2E4760] rounded-xl text-sm font-medium text-white/80 hover:text-white hover:bg-[#6A8FAA] hover:border-[#4A6D8C] transition-colors"
            >
              Se déconnecter
            </button>
          ) : (
            <LoginForm onLoggedIn={() => setLoggedIn(true)} />
          )}
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
