import { Link, useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowRight, Users, Timer, Zap, Shield, Globe, ChevronDown,
  BookOpen, Smartphone, Clock, CheckCircle2, XCircle, Gamepad2,
  Languages, Wifi, WifiOff, Sparkles, Play, Star,
  UserCog, MonitorSmartphone
} from 'lucide-react'
import { useI18n, LANGUAGES, LangCode } from '../i18n'
import { getGames } from '../games/registry'
import { useState, useRef } from 'react'
import clsx from 'clsx'

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
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
  const games = getGames(lang)
  const navigate = useNavigate()
  const L = (ru: string, en: string) => lang === 'ru' ? ru : en

  const howRef = useRef<HTMLDivElement>(null)
  const scrollToHow = () => howRef.current?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div className="min-h-screen">
      {/* ═══ Floating nav ═══ */}
      <header className="fixed top-0 inset-x-0 z-50 bg-bg/60 glass">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <span className="text-accent font-display text-xl font-bold tracking-wide">GameStol</span>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-text-secondary hover:text-text transition-colors">
                <Globe size={14} />
                <span className="hidden sm:inline">{LANGUAGES.find(l => l.code === lang)?.flag} {LANGUAGES.find(l => l.code === lang)?.name}</span>
              </button>
              {langOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 z-50 w-48 bg-bg-card border border-border rounded-xl p-1 shadow-xl max-h-80 overflow-y-auto">
                    {LANGUAGES.map(l => (
                      <button key={l.code} onClick={() => { setLang(l.code as LangCode); setLangOpen(false) }}
                        className={clsx(
                          'w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors',
                          lang === l.code ? 'bg-accent/10 text-accent' : 'text-text-secondary hover:bg-bg-hover hover:text-text'
                        )}>
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

      {/* ═══════════════════════════════════════════ */}
      {/* HERO */}
      {/* ═══════════════════════════════════════════ */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,169,110,0.08)_0%,transparent_70%)]" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px]" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10 pt-20">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            {/* Badge */}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm mb-8">
              <Sparkles size={14} />
              {L('10 игр · 12 языков · Бесплатно', '10 games · 12 languages · Free')}
            </motion.div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-6">
              {t.landing.hero_title}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-text-secondary max-w-2xl mx-auto mb-12 text-balance leading-relaxed">
              {t.landing.hero_subtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/catalog" className="btn-primary text-lg px-10 py-5 shadow-lg shadow-accent/20">
                <Play size={20} />
                {t.landing.hero_cta}
              </Link>
              <button onClick={scrollToHow} className="btn-secondary text-lg px-10 py-5">
                {t.landing.hero_secondary}
                <ChevronDown size={18} />
              </button>
            </div>
          </motion.div>

          {/* Floating game emojis */}
          <div className="hidden md:block">
            {['🎭', '💬', '🐊', '🕵️', '🧠', '🏚️', '🎩', '🎨', '🎯', '🔮'].map((emoji, i) => (
              <motion.span key={i}
                className="absolute text-2xl opacity-20"
                style={{
                  left: `${10 + (i % 5) * 20}%`,
                  top: `${20 + Math.floor(i / 5) * 50}%`,
                }}
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 4 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}>
                {emoji}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-border flex items-start justify-center p-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-text-muted" />
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* STATS BAR */}
      {/* ═══════════════════════════════════════════ */}
      <section className="py-8 border-y border-border/50 bg-bg-surface/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { value: '10', label: L('игр', 'games'), icon: Gamepad2 },
              { value: '12', label: L('языков', 'languages'), icon: Languages },
              { value: '0', label: L('страниц правил', 'rulebook pages'), icon: BookOpen },
              { value: '30', label: L('секунд до старта', 'seconds to start'), icon: Clock },
            ].map((stat, i) => (
              <motion.div key={i} {...stagger} transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex flex-col items-center gap-1">
                <stat.icon size={18} className="text-accent mb-1" />
                <span className="text-2xl sm:text-3xl font-bold font-mono text-text">{stat.value}</span>
                <span className="text-text-muted text-xs">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* PROBLEM — emotional storytelling */}
      {/* ═══════════════════════════════════════════ */}
      <section className="py-24 sm:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="text-accent text-sm font-medium uppercase tracking-widest mb-4">
              {L('Знакомая ситуация?', 'Sound familiar?')}
            </p>
            <h2 className="section-title mb-4">{t.landing.problem_title}</h2>
          </motion.div>

          <div className="space-y-4">
            {t.landing.problem_items.map((item, i) => (
              <motion.div key={i} {...stagger} transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex items-start gap-4 p-5 rounded-2xl bg-bg-surface border border-border/50 group hover:border-red-500/20 transition-colors">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/10 text-red-400
                  flex items-center justify-center">
                  <XCircle size={16} />
                </span>
                <p className="text-text-secondary text-[15px] leading-relaxed pt-1">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* HOW IT WORKS — 3-step visual flow */}
      {/* ═══════════════════════════════════════════ */}
      <section ref={howRef} className="py-24 sm:py-32 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,169,110,0.05)_0%,transparent_60%)]" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="text-accent text-sm font-medium uppercase tracking-widest mb-4">
              {L('Как это работает', 'How it works')}
            </p>
            <h2 className="section-title mb-4">{t.landing.solution_title}</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">{t.landing.solution_subtitle}</p>
          </motion.div>

          {/* Steps */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                step: '01',
                icon: Gamepad2,
                title: L('Выберите игру', 'Pick a game'),
                desc: L(
                  '10 популярных настолок. Выберите из каталога — Мафия, Alias, Codenames и другие.',
                  '10 popular board games. Choose from the catalog — Mafia, Alias, Codenames, and more.'
                ),
              },
              {
                step: '02',
                icon: Users,
                title: L('Добавьте игроков', 'Add players'),
                desc: L(
                  'Введите имена. Приложение автоматически настроит правила под количество игроков.',
                  'Enter names. The app auto-adjusts rules based on player count.'
                ),
              },
              {
                step: '03',
                icon: Play,
                title: L('Играйте!', 'Play!'),
                desc: L(
                  'Поставьте телефон в центр стола. Приложение ведёт игру — фаза за фазой, ход за ходом.',
                  'Put the phone in the center. The app runs the game — phase by phase, turn by turn.'
                ),
              },
            ].map((step, i) => (
              <motion.div key={i} {...stagger} transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative">
                {/* Connector line */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-12 left-[calc(100%+4px)] w-[calc(100%-8px)] h-px bg-border/50 -translate-x-1/2" />
                )}
                <div className="card p-6 h-full hover:border-accent/20 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-accent font-mono text-xs tracking-wider">{step.step}</span>
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                      <step.icon size={20} className="text-accent" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Feature grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {t.landing.features.map((feature, i) => {
              const icons = [Zap, UserCog, Timer, Shield]
              const Icon = icons[i]
              return (
                <motion.div key={i} {...stagger} transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-bg-card border border-border hover:border-accent/20 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={20} className="text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-text-secondary text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* BEFORE / AFTER comparison */}
      {/* ═══════════════════════════════════════════ */}
      <section className="py-24 sm:py-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="section-title">{L('Без GameStol vs С GameStol', 'Without GameStol vs With GameStol')}</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Without */}
            <motion.div {...stagger} transition={{ duration: 0.5 }}
              className="card p-6 border-red-500/20">
              <div className="flex items-center gap-2 mb-5">
                <XCircle size={20} className="text-red-400" />
                <h3 className="font-semibold text-red-400">{L('Без GameStol', 'Without GameStol')}</h3>
              </div>
              <div className="space-y-3 text-sm text-text-secondary">
                {[
                  L('20 минут читаете правила', '20 minutes reading rules'),
                  L('Спорите, кто прав', 'Arguing who\'s right'),
                  L('Забыли таймер — ход длится вечность', 'Forgot timer — turns take forever'),
                  L('Кто-то считает очки неправильно', 'Someone counts points wrong'),
                  L('«А мы всегда так играли!»', '"But we always played this way!"'),
                  L('Половина вечера потрачена на разборки', 'Half the evening wasted on disputes'),
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <XCircle size={14} className="text-red-400/60 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* With */}
            <motion.div {...stagger} transition={{ duration: 0.5, delay: 0.15 }}
              className="card p-6 border-emerald-500/20">
              <div className="flex items-center gap-2 mb-5">
                <CheckCircle2 size={20} className="text-emerald-400" />
                <h3 className="font-semibold text-emerald-400">{L('С GameStol', 'With GameStol')}</h3>
              </div>
              <div className="space-y-3 text-sm text-text-secondary">
                {[
                  L('30 секунд — и вы играете', '30 seconds — and you\'re playing'),
                  L('Правила встроены в каждый шаг', 'Rules built into every step'),
                  L('Таймеры работают автоматически', 'Timers run automatically'),
                  L('Очки считаются по правилам', 'Scores follow the rules'),
                  L('Роли раздаются честно', 'Roles dealt fairly'),
                  L('Весь вечер — чистое удовольствие', 'The whole evening — pure fun'),
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-emerald-400/60 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* GAMES — showcase */}
      {/* ═══════════════════════════════════════════ */}
      <section className="py-24 sm:py-32 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(201,169,110,0.05)_0%,transparent_60%)]" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          <motion.div {...fadeUp} className="text-center mb-12">
            <p className="text-accent text-sm font-medium uppercase tracking-widest mb-4">
              {L('Каталог', 'Catalog')}
            </p>
            <h2 className="section-title mb-4">{t.landing.games_title}</h2>
            <p className="text-text-secondary text-lg">{t.landing.games_subtitle}</p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {games.map((game, i) => (
              <motion.div key={game.id} {...stagger} transition={{ duration: 0.3, delay: i * 0.04 }}>
                <Link to={`/game/${game.id}`}
                  className="card-hover flex flex-col items-center p-4 sm:p-5 text-center group relative overflow-hidden">
                  <span className="text-3xl sm:text-4xl mb-3 group-hover:scale-110 transition-transform">{game.emoji}</span>
                  <span className="text-sm font-semibold group-hover:text-accent transition-colors leading-tight">
                    {game.name}
                  </span>
                  <span className="text-[10px] text-text-muted mt-1.5">
                    {game.minPlayers}-{game.maxPlayers} {t.catalog.players}
                  </span>
                  {game.hostMode === 'required' && (
                    <span className="absolute top-2 right-2">
                      <UserCog size={10} className="text-amber-400" />
                    </span>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp} className="text-center mt-8">
            <Link to="/catalog" className="btn-secondary">
              {L('Все игры', 'All games')} <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* MOBILE — how to use */}
      {/* ═══════════════════════════════════════════ */}
      <section className="py-24 sm:py-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeUp}>
              <p className="text-accent text-sm font-medium uppercase tracking-widest mb-4">
                {L('Мобильный формат', 'Mobile first')}
              </p>
              <h2 className="section-title mb-6">
                {L('Телефон в центр стола — и играете', 'Phone in the center — and play')}
              </h2>
              <div className="space-y-4">
                {[
                  { icon: MonitorSmartphone, text: L('Работает на любом телефоне — просто откройте в браузере', 'Works on any phone — just open in browser') },
                  { icon: WifiOff, text: L('Работает без интернета после первой загрузки', 'Works offline after first load') },
                  { icon: Users, text: L('Один телефон на всю компанию — передавайте по кругу', 'One phone for everyone — pass it around') },
                  { icon: Star, text: L('Большие кнопки для удобного нажатия', 'Big buttons for easy tapping') },
                ].map((item, i) => (
                  <motion.div key={i} {...stagger} transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <item.icon size={16} className="text-accent" />
                    </div>
                    <p className="text-text-secondary text-sm leading-relaxed pt-1">{item.text}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Phone mockup */}
            <motion.div {...fadeUp} className="flex justify-center">
              <div className="relative w-64 sm:w-72">
                <div className="rounded-[2.5rem] border-2 border-border bg-bg-card p-3 shadow-2xl">
                  <div className="rounded-[2rem] overflow-hidden bg-bg">
                    {/* Status bar */}
                    <div className="flex items-center justify-between px-5 py-2 text-[10px] text-text-muted">
                      <span>9:41</span>
                      <div className="flex items-center gap-1">
                        <Wifi size={10} />
                        <span>100%</span>
                      </div>
                    </div>
                    {/* App header */}
                    <div className="px-4 py-2 border-b border-border">
                      <span className="text-accent font-display text-sm font-bold">GameStol</span>
                    </div>
                    {/* Mock game content */}
                    <div className="px-4 py-4 space-y-3">
                      <div className="text-center">
                        <span className="text-2xl">🎭</span>
                        <p className="text-xs font-semibold mt-1">{L('Мафия', 'Mafia')}</p>
                      </div>
                      <div className="bg-bg-surface rounded-xl p-3 text-center">
                        <p className="text-[10px] text-text-muted">{L('Ночь 2', 'Night 2')}</p>
                        <p className="text-xs font-medium mt-1">{L('Мафия выбирает жертву', 'Mafia chooses victim')}</p>
                      </div>
                      <div className="space-y-1.5">
                        {['Anna', 'Max', 'Kate'].map(name => (
                          <div key={name} className="bg-bg-surface rounded-lg px-3 py-2 text-xs text-text-secondary">{name}</div>
                        ))}
                      </div>
                      <div className="bg-accent text-bg rounded-xl py-2.5 text-center text-xs font-semibold">
                        {L('Подтвердить', 'Confirm')}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Glow */}
                <div className="absolute -inset-4 bg-accent/10 rounded-[3rem] blur-2xl -z-10" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* LANGUAGES */}
      {/* ═══════════════════════════════════════════ */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp} className="text-center mb-10">
            <p className="text-accent text-sm font-medium uppercase tracking-widest mb-3">
              {L('Доступные языки', 'Available Languages')}
            </p>
            <h2 className="section-title">12 {L('языков', 'languages')}</h2>
          </motion.div>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {LANGUAGES.map((l, i) => (
              <motion.button key={l.code} {...stagger} transition={{ duration: 0.3, delay: i * 0.04 }}
                onClick={() => setLang(l.code as LangCode)}
                className={clsx(
                  'card p-4 flex flex-col items-center gap-2 transition-all active:scale-95',
                  lang === l.code
                    ? 'border-accent/40 bg-accent/5'
                    : 'hover:border-border-light hover:bg-bg-hover'
                )}>
                <span className="text-2xl">{l.flag}</span>
                <span className={clsx('text-xs font-medium',
                  lang === l.code ? 'text-accent' : 'text-text-secondary'
                )}>{l.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* CTA — final push */}
      {/* ═══════════════════════════════════════════ */}
      <section className="py-24 sm:py-32 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,169,110,0.08)_0%,transparent_60%)]" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.div {...fadeUp}>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">{t.landing.cta_title}</h2>
            <p className="text-text-secondary text-lg mb-10">{t.landing.cta_subtitle}</p>
            <Link to="/catalog" className="btn-primary text-lg px-12 py-5 shadow-lg shadow-accent/20">
              {t.landing.cta_button}
              <ArrowRight size={20} />
            </Link>
            <div className="flex items-center justify-center gap-6 mt-8 text-text-muted text-sm">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-400" />
                {L('Бесплатно', 'Free')}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-400" />
                {L('Без регистрации', 'No signup')}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-400" />
                {L('Мобильный', 'Mobile')}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* FOOTER */}
      {/* ═══════════════════════════════════════════ */}
      <footer className="py-10 border-t border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <span className="text-accent font-display text-lg font-bold">GameStol</span>
              <span className="text-text-muted text-sm">—</span>
              <span className="text-text-muted text-sm">{t.landing.footer}</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="https://github.com/egorfedorov/gamestol" target="_blank" rel="noopener"
                className="text-text-muted hover:text-text text-sm transition-colors">
                GitHub
              </a>
              <Link to="/catalog" className="text-text-muted hover:text-accent text-sm transition-colors">
                {t.nav.catalog}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
