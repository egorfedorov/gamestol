import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { Home, Grid3X3, ChevronLeft, Globe, Star } from 'lucide-react'
import { useState } from 'react'
import { useI18n, LANGUAGES, LangCode } from '../i18n'
import clsx from 'clsx'

export default function Layout() {
  const { t, lang, setLang } = useI18n()
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [langOpen, setLangOpen] = useState(false)

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Top bar - desktop & mobile */}
      {!isHome && (
        <header className="sticky top-0 z-50 bg-bg/80 glass border-b border-border">
          <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
            <NavLink to="/" className="flex items-center gap-2 text-accent font-display text-lg font-bold tracking-wide">
              GameStol
            </NavLink>
            <nav className="hidden md:flex items-center gap-1">
              <NavLink to="/" className={({ isActive }) =>
                clsx('btn-ghost text-sm', isActive && 'text-text bg-bg-hover')
              }>{t.nav.home}</NavLink>
              <NavLink to="/catalog" className={({ isActive }) =>
                clsx('btn-ghost text-sm', isActive && 'text-text bg-bg-hover')
              }>{t.nav.catalog}</NavLink>
              <a href="https://github.com/egorfedorov/gamestol" target="_blank" rel="noopener"
                className="btn-ghost text-sm gap-1 text-text-muted hover:text-amber-400">
                <Star size={14} className="text-amber-400" />
                GitHub
              </a>
            </nav>
            <div className="relative">
              <button onClick={() => setLangOpen(!langOpen)} className="btn-ghost text-sm gap-1.5">
                <Globe size={16} />
                <span className="hidden sm:inline">{LANGUAGES.find(l => l.code === lang)?.name}</span>
              </button>
              {langOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 z-50 w-48 card p-1 shadow-xl max-h-80 overflow-y-auto">
                    {LANGUAGES.map(l => (
                      <button key={l.code} onClick={() => { setLang(l.code as LangCode); setLangOpen(false) }}
                        className={clsx(
                          'w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors',
                          lang === l.code ? 'bg-accent-muted text-accent' : 'text-text-secondary hover:bg-bg-hover hover:text-text'
                        )}>
                        <span>{l.flag}</span>
                        <span>{l.name}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </header>
      )}

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Mobile bottom nav */}
      {!isHome && (
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-bg/90 glass border-t border-border safe-area-bottom">
          <div className="flex items-center justify-around h-16">
            <NavLink to="/" className={({ isActive }) =>
              clsx('flex flex-col items-center gap-0.5 px-4 py-1 rounded-lg transition-colors',
                isActive ? 'text-accent' : 'text-text-muted')
            }>
              <Home size={20} />
              <span className="text-[10px]">{t.nav.home}</span>
            </NavLink>
            <NavLink to="/catalog" className={({ isActive }) =>
              clsx('flex flex-col items-center gap-0.5 px-4 py-1 rounded-lg transition-colors',
                isActive ? 'text-accent' : 'text-text-muted')
            }>
              <Grid3X3 size={20} />
              <span className="text-[10px]">{t.nav.catalog}</span>
            </NavLink>
          </div>
        </nav>
      )}
    </div>
  )
}

export function BackButton({ to, label }: { to: string; label?: string }) {
  const { t } = useI18n()
  return (
    <NavLink to={to} className="btn-ghost text-sm mb-4 -ml-2">
      <ChevronLeft size={18} />
      {label || t.catalog.back}
    </NavLink>
  )
}
