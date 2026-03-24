import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Users, Timer, Zap, Shield, Globe, ChevronDown } from 'lucide-react'
import { useI18n, LANGUAGES, LangCode } from '../i18n'
import { games } from '../games/registry'
import { useState } from 'react'

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
}

const stagger = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
}

export default function Home() {
  const { t, lang, setLang } = useI18n()
  const [langOpen, setLangOpen] = useState(false)

  return (
    <div className="min-h-screen">
      {/* Floating nav */}
      <header className="fixed top-0 inset-x-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <span className="text-accent font-display text-xl font-bold tracking-wide">GameStol</span>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-text-secondary hover:text-text transition-colors">
                <Globe size={14} />
                <span className="hidden sm:inline">{LANGUAGES.find(l => l.code === lang)?.name}</span>
              </button>
              {langOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 z-50 w-48 bg-bg-card border border-border rounded-xl p-1 shadow-xl max-h-80 overflow-y-auto">
                    {LANGUAGES.map(l => (
                      <button key={l.code} onClick={() => { setLang(l.code as LangCode); setLangOpen(false) }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
                          lang === l.code ? 'bg-accent/10 text-accent' : 'text-text-secondary hover:bg-bg-hover hover:text-text'
                        }`}>
                        <span>{l.flag}</span>
                        <span>{l.name}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <Link to="/catalog" className="btn-primary text-sm py-2 px-4">
              {t.landing.hero_cta}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,169,110,0.08)_0%,transparent_70%)]" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
              {t.landing.hero_title}
            </h1>
            <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 text-balance">
              {t.landing.hero_subtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/catalog" className="btn-primary text-base px-8 py-4">
                {t.landing.hero_cta}
                <ArrowRight size={18} />
              </Link>
              <a href="#problem" className="btn-secondary text-base px-8 py-4">
                {t.landing.hero_secondary}
                <ChevronDown size={18} />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-border flex items-start justify-center p-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-text-muted" />
          </motion.div>
        </div>
      </section>

      {/* Problem */}
      <section id="problem" className="py-24 sm:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="section-title mb-4">{t.landing.problem_title}</h2>
          </motion.div>
          <div className="space-y-4">
            {t.landing.problem_items.map((item, i) => (
              <motion.div key={i} {...stagger} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex items-start gap-4 p-5 rounded-2xl bg-bg-surface border border-border/50">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/10 text-red-400
                  flex items-center justify-center text-sm font-mono">{i + 1}</span>
                <p className="text-text-secondary text-[15px] leading-relaxed pt-1">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-24 sm:py-32 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(201,169,110,0.05)_0%,transparent_60%)]" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="section-title mb-4">{t.landing.solution_title}</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">{t.landing.solution_subtitle}</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-6">
            {t.landing.features.map((feature, i) => {
              const icons = [Zap, Users, Timer, Shield]
              const Icon = icons[i]
              return (
                <motion.div key={i} {...stagger} transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="p-6 rounded-2xl bg-bg-card border border-border hover:border-border-light transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                    <Icon size={20} className="text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{feature.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Games */}
      <section className="py-24 sm:py-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="section-title mb-4">{t.landing.games_title}</h2>
            <p className="text-text-secondary text-lg">{t.landing.games_subtitle}</p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {games.map((game, i) => (
              <motion.div key={game.id} {...stagger} transition={{ duration: 0.4, delay: i * 0.05 }}>
                <Link to={`/game/${game.id}`}
                  className="card-hover flex flex-col items-center p-5 text-center group">
                  <span className="text-3xl mb-3">{game.emoji}</span>
                  <span className="text-sm font-medium group-hover:text-accent transition-colors">
                    {game.name}
                  </span>
                  <span className="text-[11px] text-text-muted mt-1">
                    {game.minPlayers}-{game.maxPlayers} {t.catalog.players}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 sm:py-32">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div {...fadeUp}>
            <h2 className="section-title mb-4">{t.landing.cta_title}</h2>
            <p className="text-text-secondary text-lg mb-8">{t.landing.cta_subtitle}</p>
            <Link to="/catalog" className="btn-primary text-base px-10 py-4">
              {t.landing.cta_button}
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-accent font-display font-bold">GameStol</span>
          <p className="text-text-muted text-sm">{t.landing.footer}</p>
        </div>
      </footer>
    </div>
  )
}
