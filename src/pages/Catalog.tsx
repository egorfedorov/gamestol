import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Users, Clock, Star, UserCog, Smartphone } from 'lucide-react'
import { motion } from 'framer-motion'
import { useI18n } from '../i18n'
import { getGames } from '../games/registry'
import clsx from 'clsx'

const categories = ['all', 'party', 'word', 'strategy', 'detective', 'creative']
const categoryLabels: Record<string, Record<string, string>> = {
  ru: { all: 'Все', party: 'Вечеринка', word: 'Слова', strategy: 'Стратегия', detective: 'Детектив', creative: 'Творчество' },
  en: { all: 'All', party: 'Party', word: 'Words', strategy: 'Strategy', detective: 'Detective', creative: 'Creative' },
}

const difficultyColors = {
  easy: 'text-emerald-400 bg-emerald-400/10',
  medium: 'text-amber-400 bg-amber-400/10',
  hard: 'text-red-400 bg-red-400/10',
}

export default function Catalog() {
  const { t, lang } = useI18n()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')

  const labels = categoryLabels[lang] || categoryLabels.en
  const games = getGames(lang)

  const filtered = games.filter(game => {
    const matchSearch = game.name.toLowerCase().includes(search.toLowerCase()) ||
      game.nameEn.toLowerCase().includes(search.toLowerCase())
    const matchCategory = category === 'all' || game.categories.includes(category)
    return matchSearch && matchCategory
  })

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-8">
      <div className="mb-8">
        <h1 className="section-title mb-2">{t.catalog.title}</h1>
        <p className="text-text-secondary">{t.catalog.subtitle}</p>
      </div>

      {/* Search & filters */}
      <div className="space-y-4 mb-8">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder={t.catalog.search}
            className="input pl-11" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={clsx(
                'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
                category === cat
                  ? 'bg-accent text-bg'
                  : 'bg-bg-surface text-text-secondary hover:text-text border border-border'
              )}>
              {labels[cat] || cat}
            </button>
          ))}
        </div>
      </div>

      {/* Game grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((game, i) => (
          <motion.div key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}>
            <Link to={`/game/${game.id}`} className="card-hover p-5 flex flex-col h-full group">
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{game.emoji}</span>
                <span className={clsx('badge', difficultyColors[game.difficulty])}>
                  {t.catalog.difficulty[game.difficulty]}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-1 group-hover:text-accent transition-colors">
                {game.name}
              </h3>
              <p className="text-text-muted text-xs mb-3">{game.nameAlt}</p>
              <p className="text-text-secondary text-sm leading-relaxed flex-1 mb-4">
                {game.tagline}
              </p>
              <div className="flex items-center gap-3 text-text-muted text-xs flex-wrap">
                <span className="flex items-center gap-1">
                  <Users size={13} />
                  {game.minPlayers}-{game.maxPlayers}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={13} />
                  {game.duration}
                </span>
                {game.hostMode === 'required' && (
                  <span className="flex items-center gap-1 text-amber-400">
                    <UserCog size={11} />
                    {lang === 'ru' ? 'Ведущий' : 'Host'}
                  </span>
                )}
                {game.hostMode === 'none' && (
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Smartphone size={11} />
                    {lang === 'ru' ? 'Сами' : 'Self'}
                  </span>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-text-muted">
          <Search size={48} className="mx-auto mb-4 opacity-30" />
          <p>Ничего не найдено</p>
        </div>
      )}
    </div>
  )
}
