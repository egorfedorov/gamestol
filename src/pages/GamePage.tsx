import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { ChevronLeft, Play, BookOpen, AlertTriangle, Users, Clock, ChevronDown, ChevronUp, UserCog, Smartphone } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useI18n } from '../i18n'
import { getGames } from '../games/registry'
import clsx from 'clsx'

const hostBadge = {
  required: { ru: 'Нужен ведущий', en: 'Host required', color: 'text-amber-400 bg-amber-400/10', icon: UserCog },
  optional: { ru: 'Ведущий опционален', en: 'Host optional', color: 'text-blue-400 bg-blue-400/10', icon: UserCog },
  none: { ru: 'Без ведущего', en: 'No host needed', color: 'text-emerald-400 bg-emerald-400/10', icon: Smartphone },
}

export default function GamePage() {
  const { id } = useParams()
  const { t, lang } = useI18n()
  const [playing, setPlaying] = useState(false)
  const [showRules, setShowRules] = useState(false)
  const [showMistakes, setShowMistakes] = useState(false)

  const games = getGames(lang)
  const game = games.find(g => g.id === id)
  if (!game) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-text-muted text-lg">Game not found</p>
        <Link to="/catalog" className="btn-secondary mt-4">{t.game.back_to_catalog}</Link>
      </div>
    )
  }

  if (playing) {
    const GameComponent = game.component
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-8">
        <button onClick={() => setPlaying(false)}
          className="btn-ghost text-sm -ml-2 mb-4">
          <ChevronLeft size={18} />
          {t.catalog.back}
        </button>
        <GameComponent />
      </div>
    )
  }

  const hb = hostBadge[game.hostMode]
  const HBIcon = hb.icon

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-8">
      <Link to="/catalog" className="btn-ghost text-sm -ml-2 mb-6">
        <ChevronLeft size={18} />
        {t.catalog.back}
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-5xl">{game.emoji}</span>
          <div>
            <h1 className="text-3xl font-bold">{game.name}</h1>
            <p className="text-text-muted text-sm">{game.nameAlt}</p>
          </div>
        </div>
        <p className="text-text-secondary text-lg leading-relaxed mb-6">{game.description}</p>

        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-bg-surface rounded-lg text-sm text-text-secondary">
            <Users size={14} />
            {game.minPlayers}-{game.maxPlayers} {t.catalog.players}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-bg-surface rounded-lg text-sm text-text-secondary">
            <Clock size={14} />
            {game.duration}
          </div>
          <div className={clsx('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm', hb.color)}>
            <HBIcon size={14} />
            {lang === 'ru' ? hb.ru : hb.en}
          </div>
        </div>

        <button onClick={() => setPlaying(true)} className="btn-primary text-base px-8 py-4 w-full sm:w-auto">
          <Play size={18} />
          {t.catalog.start}
        </button>
      </div>

      {/* Rules accordion */}
      <div className="space-y-3">
        <button onClick={() => setShowRules(!showRules)}
          className="w-full card-hover p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen size={18} className="text-accent" />
            <span className="font-medium">{t.catalog.how_to_play}</span>
          </div>
          {showRules ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        <AnimatePresence>
          {showRules && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="card p-5 space-y-3">
                {game.howToPlay.map((step, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 text-accent
                      flex items-center justify-center text-xs font-mono">{i + 1}</span>
                    <p className="text-text-secondary text-sm leading-relaxed pt-0.5">{step}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button onClick={() => setShowMistakes(!showMistakes)}
          className="w-full card-hover p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle size={18} className="text-amber-400" />
            <span className="font-medium">{t.catalog.common_mistakes}</span>
          </div>
          {showMistakes ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        <AnimatePresence>
          {showMistakes && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="card p-5 space-y-3">
                {game.commonMistakes.map((mistake, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-400/10 text-amber-400
                      flex items-center justify-center text-[10px]">!</span>
                    <p className="text-text-secondary text-sm leading-relaxed pt-0.5">{mistake}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
