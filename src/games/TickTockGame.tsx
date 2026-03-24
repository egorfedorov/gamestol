import { useState, useRef, useEffect, useCallback } from 'react'
import { Play, RotateCcw, Bomb, ChevronRight, Skull, Trophy, Volume2, VolumeX } from 'lucide-react'
import { useI18n } from '../i18n'
import { useGameText } from '../hooks/useGameText'
import PlayerSetup from '../components/PlayerSetup'
import { Player } from '../types'
import clsx from 'clsx'

type Phase = 'setup' | 'playing' | 'boom' | 'end'
type CategoryMode = 'any' | 'starts_with' | 'contains'

const syllablesRu = [
  'БА', 'БЕ', 'БО', 'ВА', 'ВЕ', 'ВО', 'ГА', 'ГО', 'ДА', 'ДЕ',
  'ДО', 'ЖА', 'ЗА', 'КА', 'КО', 'КИ', 'ЛА', 'ЛЕ', 'ЛО', 'ЛИ',
  'МА', 'МЕ', 'МО', 'МИ', 'НА', 'НЕ', 'НО', 'НИ', 'ПА', 'ПЕ',
  'ПО', 'ПИ', 'РА', 'РЕ', 'РО', 'РИ', 'СА', 'СЕ', 'СО', 'СИ',
  'ТА', 'ТЕ', 'ТО', 'ТИ', 'ФА', 'ФО', 'ХА', 'ХО', 'ЦА', 'ЧА',
  'ША', 'ШО', 'ЩА',
]

const syllablesEn = [
  'BA', 'BE', 'BO', 'CA', 'CO', 'DA', 'DE', 'DO', 'FA', 'FI',
  'GA', 'GE', 'GO', 'HA', 'HE', 'HO', 'IN', 'JA', 'KA', 'KI',
  'LA', 'LE', 'LO', 'LI', 'MA', 'ME', 'MO', 'MI', 'NA', 'NE',
  'NO', 'NI', 'PA', 'PE', 'PO', 'PI', 'RA', 'RE', 'RO', 'RI',
  'SA', 'SE', 'SO', 'SI', 'TA', 'TE', 'TO', 'TI', 'WA', 'WI',
]

export default function TickTockGame() {
  const { t, lang } = useI18n()
  const L = (ru: string, en: string) => lang === 'ru' ? ru : en
  const G = useGameText()

  const [phase, setPhase] = useState<Phase>('setup')
  const [players, setPlayers] = useState<Player[]>([])
  const [alivePlayers, setAlivePlayers] = useState<Player[]>([])
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [categoryMode, setCategoryMode] = useState<CategoryMode>('any')
  const [currentSyllable, setCurrentSyllable] = useState('')
  const [bombExploded, setBombExploded] = useState(false)
  const [tickCount, setTickCount] = useState(0)
  const [soundOn, setSoundOn] = useState(true)

  // Hidden bomb timer
  const bombTimerRef = useRef<number | null>(null)
  const bombDeadline = useRef(0)
  const tickRef = useRef<number | null>(null)

  const syllables = lang === 'ru' ? syllablesRu : syllablesEn

  const getRandomSyllable = useCallback(() => {
    return syllables[Math.floor(Math.random() * syllables.length)]
  }, [syllables])

  const getModeLabel = (mode: CategoryMode) => {
    switch (mode) {
      case 'any': return L('Любое слово с этим слогом', 'Any word with this syllable')
      case 'starts_with': return L('Слово начинается на...', 'Word starts with...')
      case 'contains': return L('Слово содержит...', 'Word contains...')
    }
  }

  const getModeShort = (mode: CategoryMode) => {
    switch (mode) {
      case 'any': return L('Любое', 'Any')
      case 'starts_with': return L('Начинается', 'Starts')
      case 'contains': return L('Содержит', 'Contains')
    }
  }

  // ═══════════════════════════════════════════
  // BOMB LOGIC
  // ═══════════════════════════════════════════

  const startBomb = useCallback(() => {
    // Random time between 10-60 seconds
    const bombTime = (Math.floor(Math.random() * 51) + 10) * 1000
    bombDeadline.current = Date.now() + bombTime
    setBombExploded(false)
    setTickCount(0)

    if (bombTimerRef.current) clearTimeout(bombTimerRef.current)
    bombTimerRef.current = window.setTimeout(() => {
      setBombExploded(true)
    }, bombTime)

    // Ticking effect — gets faster as bomb approaches
    if (tickRef.current) clearInterval(tickRef.current)
    tickRef.current = window.setInterval(() => {
      const remaining = bombDeadline.current - Date.now()
      if (remaining <= 0) {
        if (tickRef.current) clearInterval(tickRef.current)
        return
      }
      setTickCount(prev => prev + 1)
    }, 1000)
  }, [])

  const stopBomb = useCallback(() => {
    if (bombTimerRef.current) clearTimeout(bombTimerRef.current)
    if (tickRef.current) clearInterval(tickRef.current)
  }, [])

  useEffect(() => {
    return () => {
      stopBomb()
    }
  }, [stopBomb])

  // Handle explosion
  useEffect(() => {
    if (bombExploded && phase === 'playing') {
      stopBomb()
      setPhase('boom')
    }
  }, [bombExploded, phase, stopBomb])

  // ═══════════════════════════════════════════
  // ACTIONS
  // ═══════════════════════════════════════════

  const startGame = () => {
    if (players.length < 2) return
    const alive = players.map(p => ({ ...p, isAlive: true }))
    setAlivePlayers(alive)
    setCurrentPlayerIndex(0)
    setCurrentSyllable(getRandomSyllable())
    startBomb()
    setPhase('playing')
  }

  const passBomb = () => {
    // Current player said a valid word, pass to next
    const nextIndex = (currentPlayerIndex + 1) % alivePlayers.length
    setCurrentPlayerIndex(nextIndex)
    // Optionally change syllable
    if (Math.random() > 0.5) {
      setCurrentSyllable(getRandomSyllable())
    }
  }

  const eliminateAndContinue = () => {
    const eliminated = alivePlayers[currentPlayerIndex]
    const remaining = alivePlayers.filter((_, i) => i !== currentPlayerIndex)
    setAlivePlayers(remaining)

    if (remaining.length <= 1) {
      // Winner!
      setPlayers(prev => prev.map(p =>
        p.id === remaining[0]?.id ? { ...p, score: (p.score || 0) + 1 } : p
      ))
      setPhase('end')
      return
    }

    // Continue game
    const nextIndex = currentPlayerIndex >= remaining.length ? 0 : currentPlayerIndex
    setCurrentPlayerIndex(nextIndex)
    setCurrentSyllable(getRandomSyllable())
    setBombExploded(false)
    startBomb()
    setPhase('playing')
  }

  const resetGame = () => {
    stopBomb()
    setPhase('setup')
    setPlayers(prev => prev.map(p => ({ ...p, score: 0 })))
    setAlivePlayers([])
    setCurrentPlayerIndex(0)
    setBombExploded(false)
  }

  // ═══════════════════════════════════════════
  // SETUP
  // ═══════════════════════════════════════════
  if (phase === 'setup') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">{L('Тик-Так Бум', 'Tick Tock Boom')}</h2>

        <div className="card p-4 text-sm text-text-secondary space-y-1">
          <p className="font-medium text-text mb-2">{G('how_to_play')}</p>
          <p>1. {L('Показывается слог или буквы', 'A syllable or letters are shown')}</p>
          <p>2. {L('Назовите слово, подходящее под критерий', 'Say a word that fits the criteria')}</p>
          <p>3. {L('Передайте «бомбу» следующему игроку', 'Pass the "bomb" to the next player')}</p>
          <p>4. {L('Таймер скрыт — бомба взрывается случайно (10-60 сек)', 'Timer is hidden — bomb explodes randomly (10-60 sec)')}</p>
          <p>5. {L('Кто держит бомбу при взрыве — выбывает!', 'Whoever holds the bomb when it explodes — is eliminated!')}</p>
        </div>

        <PlayerSetup players={players} onChange={setPlayers} min={2} max={12} />

        {/* Category mode */}
        <div className="card p-4 space-y-3">
          <p className="text-sm text-text-secondary">{L('Режим', 'Mode')}</p>
          <div className="space-y-2">
            {(['any', 'starts_with', 'contains'] as CategoryMode[]).map(mode => (
              <button key={mode} onClick={() => setCategoryMode(mode)}
                className={clsx(
                  'w-full text-left px-4 py-3 rounded-xl transition-all text-sm',
                  categoryMode === mode
                    ? 'bg-accent/15 border border-accent/30 text-accent'
                    : 'bg-bg-surface border border-transparent hover:border-border'
                )}>
                <span className="font-medium">{getModeShort(mode)}</span>
                <span className="text-text-muted ml-2">{getModeLabel(mode)}</span>
              </button>
            ))}
          </div>
        </div>

        <button onClick={startGame} disabled={players.length < 2}
          className="btn-primary w-full disabled:opacity-40">
          <Play size={18} /> {t.game.start_game}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // PLAYING — bomb is ticking
  // ═══════════════════════════════════════════
  if (phase === 'playing') {
    const currentPlayer = alivePlayers[currentPlayerIndex]
    // Visual pulse speed based on elapsed time
    const elapsed = tickCount
    const pulseClass = elapsed > 30 ? 'animate-pulse' : elapsed > 20 ? 'animate-pulse' : ''

    return (
      <div className="space-y-5 text-center">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-muted">
            {L('Осталось', 'Remaining')}: {alivePlayers.length}
          </span>
          <button onClick={() => setSoundOn(!soundOn)} className="text-text-muted p-1">
            {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
        </div>

        {/* Current player */}
        <div className="card p-4">
          <p className="text-text-muted text-sm mb-1">{L('Ходит', 'Playing')}</p>
          <p className="text-2xl font-bold text-accent">{currentPlayer.name}</p>
        </div>

        {/* Bomb */}
        <div className={clsx('card p-8 border-red-500/20', pulseClass)}>
          <Bomb size={48} className="mx-auto mb-3 text-red-400" />
          <p className="text-sm text-text-muted mb-2">{getModeLabel(categoryMode)}</p>
          <p className="text-4xl sm:text-5xl font-bold text-red-400 tracking-wider">{currentSyllable}</p>
          <p className="text-xs text-text-muted mt-3">
            {L('тик-так...', 'tick-tock...')} <span className="font-mono">{tickCount}s</span>
          </p>
        </div>

        {/* Players list */}
        <div className="flex flex-wrap justify-center gap-2">
          {alivePlayers.map((p, i) => (
            <span key={p.id} className={clsx(
              'px-3 py-1.5 rounded-full text-sm',
              i === currentPlayerIndex
                ? 'bg-red-500/15 text-red-400 font-medium border border-red-500/30'
                : 'bg-bg-surface text-text-muted'
            )}>
              {p.name}
            </span>
          ))}
        </div>

        {/* Pass bomb */}
        <button onClick={passBomb}
          className="w-full py-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-lg font-semibold
            active:scale-95 transition-transform touch-manipulation">
          <ChevronRight size={28} className="mx-auto mb-1" />
          {L('Передать бомбу', 'Pass the bomb')}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // BOOM — bomb exploded
  // ═══════════════════════════════════════════
  if (phase === 'boom') {
    const eliminated = alivePlayers[currentPlayerIndex]
    return (
      <div className="space-y-6 text-center">
        <div className="card p-8 border-red-500/30">
          <p className="text-6xl mb-4">💥</p>
          <p className="text-2xl font-bold text-red-400 mb-2">
            {L('БУМ!', 'BOOM!')}
          </p>
          <p className="text-lg">
            <span className="text-red-400 font-medium">{eliminated.name}</span>
            {L(' выбывает!', ' is eliminated!')}
          </p>
        </div>

        {/* Remaining players */}
        <div className="card p-4">
          <p className="text-sm text-text-muted mb-3">
            {L('Оставшиеся игроки', 'Remaining players')}: {alivePlayers.length - 1}
          </p>
          <div className="space-y-1.5">
            {alivePlayers.map((p, i) => (
              <div key={p.id} className={clsx(
                'flex items-center justify-between px-3 py-1.5 rounded-lg text-sm',
                i === currentPlayerIndex
                  ? 'bg-red-500/10 line-through text-text-muted'
                  : 'bg-bg-surface'
              )}>
                <span>{p.name}</span>
                {i === currentPlayerIndex && <Skull size={14} className="text-red-400" />}
              </div>
            ))}
          </div>
        </div>

        <button onClick={eliminateAndContinue}
          className="btn-primary w-full py-4 text-lg touch-manipulation">
          {alivePlayers.length <= 2
            ? t.game.results
            : L('Продолжить', 'Continue')}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // END — winner
  // ═══════════════════════════════════════════
  if (phase === 'end') {
    const winner = alivePlayers.length === 1 ? alivePlayers[0] : null
    return (
      <div className="space-y-6 text-center">
        <h2 className="text-3xl font-bold">{t.game.congratulations}</h2>

        <div className="card p-8">
          <Trophy size={32} className="mx-auto mb-3 text-accent" />
          <p className="text-lg text-text-muted mb-2">{t.game.winner}</p>
          {winner && (
            <>
              <p className="text-3xl font-bold text-accent">{winner.name}</p>
              <p className="text-text-muted mt-1">{L('Последний выживший!', 'Last one standing!')}</p>
            </>
          )}
        </div>

        {/* All players */}
        <div className="card p-4 space-y-2">
          {players.map((p, i) => {
            const isWinner = winner && p.id === winner.id
            return (
              <div key={p.id} className="flex items-center justify-between text-sm px-2">
                <span className={isWinner ? 'text-accent font-medium' : 'text-text-muted'}>
                  {p.name}
                </span>
                {isWinner && <Trophy size={14} className="text-accent" />}
              </div>
            )
          })}
        </div>

        <button onClick={resetGame} className="btn-primary w-full py-4 text-lg touch-manipulation">
          <RotateCcw size={18} /> {t.game.play_again}
        </button>
      </div>
    )
  }

  return null
}
