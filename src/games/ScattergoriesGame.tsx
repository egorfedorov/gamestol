import { useState, useMemo } from 'react'
import { Play, RotateCcw, Plus, Minus, Check, X, Users } from 'lucide-react'
import { useI18n } from '../i18n'
import { useGameText } from '../hooks/useGameText'
import { useTimer } from '../hooks/useTimer'
import { scatterCategories, scatterCategoriesEn } from '../data/scattergories'
import clsx from 'clsx'

type Phase = 'setup' | 'playing' | 'reveal' | 'scoring' | 'end'

interface SPlayer {
  name: string
  totalScore: number
}

const ALPHABET_RU = 'АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЭЮЯ'
const ALPHABET_EN = 'ABCDEFGHIJKLMNOPRSTW'

export default function ScattergoriesGame() {
  const { t, lang } = useI18n()
  const L = (ru: string, en: string) => lang === 'ru' ? ru : en
  const G = useGameText()

  const [phase, setPhase] = useState<Phase>('setup')
  const [playerNames, setPlayerNames] = useState<string[]>(['', ''])
  const [players, setPlayers] = useState<SPlayer[]>([])
  const [totalRounds, setTotalRounds] = useState(3)
  const [currentRound, setCurrentRound] = useState(1)
  const [timerSeconds, setTimerSeconds] = useState(120)
  const [currentLetter, setCurrentLetter] = useState('')
  const [currentCategories, setCurrentCategories] = useState<string[]>([])
  const [roundScores, setRoundScores] = useState<Record<string, number>>({})
  const [usedLetters, setUsedLetters] = useState<Set<string>>(new Set())

  const timer = useTimer(timerSeconds)

  const allCategories = useMemo(() => {
    return lang === 'ru' ? scatterCategories : scatterCategoriesEn
  }, [lang])

  const alphabet = lang === 'ru' ? ALPHABET_RU : ALPHABET_EN

  const addPlayerName = () => {
    if (playerNames.length < 8) {
      setPlayerNames(prev => [...prev, ''])
    }
  }

  const removePlayerName = (index: number) => {
    if (playerNames.length > 2) {
      setPlayerNames(prev => prev.filter((_, i) => i !== index))
    }
  }

  const updatePlayerName = (index: number, value: string) => {
    setPlayerNames(prev => prev.map((n, i) => i === index ? value : n))
  }

  const getRandomLetter = (): string => {
    const available = alphabet.split('').filter(l => !usedLetters.has(l))
    if (available.length === 0) {
      setUsedLetters(new Set())
      return alphabet[Math.floor(Math.random() * alphabet.length)]
    }
    return available[Math.floor(Math.random() * available.length)]
  }

  const getRandomCategories = (count: number): string[] => {
    const shuffled = [...allCategories].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
  }

  const startGame = () => {
    const validNames = playerNames.filter(n => n.trim())
    if (validNames.length < 2) return
    setPlayers(validNames.map(n => ({ name: n.trim(), totalScore: 0 })))
    setCurrentRound(1)
    startRound()
  }

  const startRound = () => {
    const letter = getRandomLetter()
    setCurrentLetter(letter)
    setUsedLetters(prev => new Set(prev).add(letter))
    setCurrentCategories(getRandomCategories(5))
    setRoundScores({})
    setPhase('playing')
    timer.reset(timerSeconds)
    timer.start()
  }

  if (timer.isFinished && phase === 'playing') {
    setPhase('reveal')
  }

  const goToScoring = () => {
    if (phase === 'playing') {
      timer.pause()
    }
    setPhase('scoring')
    // Initialize scores to 0
    const initial: Record<string, number> = {}
    players.forEach(p => { initial[p.name] = 0 })
    setRoundScores(initial)
  }

  const adjustScore = (playerName: string, delta: number) => {
    setRoundScores(prev => ({
      ...prev,
      [playerName]: Math.max(0, (prev[playerName] || 0) + delta),
    }))
  }

  const finishRound = () => {
    setPlayers(prev => prev.map(p => ({
      ...p,
      totalScore: p.totalScore + (roundScores[p.name] || 0),
    })))

    if (currentRound >= totalRounds) {
      setPhase('end')
    } else {
      setCurrentRound(prev => prev + 1)
      startRound()
    }
  }

  const resetGame = () => {
    setPhase('setup')
    setPlayers([])
    setCurrentRound(1)
    setUsedLetters(new Set())
    timer.reset(timerSeconds)
  }

  // ═══════════════════════════════════════════
  // SETUP
  // ═══════════════════════════════════════════
  if (phase === 'setup') {
    const validCount = playerNames.filter(n => n.trim()).length
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">📝 {L('Эрудит (Скаттергории)', 'Scattergories')}</h2>

        <div className="card p-4 text-sm text-text-secondary space-y-1">
          <p className="font-medium text-text mb-2">{G('how_to_play')}</p>
          <p>1. {L('Появляется случайная буква и 5 категорий', 'A random letter and 5 categories appear')}</p>
          <p>2. {L('За 2 минуты придумайте слова на эту букву для каждой категории', 'In 2 minutes, think of words starting with that letter for each category')}</p>
          <p>3. {L('Одинаковые ответы не считаются!', 'Duplicate answers don\'t count!')}</p>
          <p>4. {L('Уникальный ответ = 1 очко', 'Unique answer = 1 point')}</p>
        </div>

        {/* Player names */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Users size={16} />
              <span>{t.game.players}: {validCount}</span>
            </div>
            {playerNames.length < 8 && (
              <button onClick={addPlayerName} className="btn-ghost text-xs">
                <Plus size={14} /> {t.game.add_player}
              </button>
            )}
          </div>
          {playerNames.map((name, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-6 h-6 flex items-center justify-center bg-bg-surface rounded-full text-xs text-text-muted">
                {i + 1}
              </span>
              <input type="text" value={name}
                onChange={e => updatePlayerName(i, e.target.value)}
                placeholder={`${t.game.player_name} ${i + 1}`}
                className="input flex-1 text-sm" maxLength={20} />
              {playerNames.length > 2 && (
                <button onClick={() => removePlayerName(i)}
                  className="btn-ghost text-red-400 p-2 text-lg">&times;</button>
              )}
            </div>
          ))}
        </div>

        {/* Settings */}
        <div className="card p-4 space-y-4">
          <div>
            <label className="text-sm text-text-secondary block mb-2">
              {L('Раундов:', 'Rounds:')} <span className="text-text font-mono">{totalRounds}</span>
            </label>
            <input type="range" min={1} max={5} step={1} value={totalRounds}
              onChange={e => setTotalRounds(Number(e.target.value))}
              className="w-full accent-accent" />
          </div>
          <div>
            <label className="text-sm text-text-secondary block mb-2">
              {G('turn_time')}: <span className="text-text font-mono">{timerSeconds}</span> {G('sec')}
            </label>
            <input type="range" min={60} max={180} step={30} value={timerSeconds}
              onChange={e => setTimerSeconds(Number(e.target.value))}
              className="w-full accent-accent" />
          </div>
        </div>

        <button onClick={startGame} disabled={validCount < 2}
          className="btn-primary w-full disabled:opacity-40">
          <Play size={18} /> {t.game.start_game}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // PLAYING — letter + categories + timer
  // ═══════════════════════════════════════════
  if (phase === 'playing') {
    const circumference = 2 * Math.PI * 45
    const isLow = timer.seconds <= 15

    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-muted">
            {t.game.round} {currentRound}/{totalRounds}
          </span>
        </div>

        {/* Timer */}
        <div className="relative w-28 h-28 mx-auto">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-border" strokeWidth="3" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor"
              className={isLow ? 'text-red-500' : 'text-accent'}
              strokeWidth="3" strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * timer.progress} />
          </svg>
          <span className={clsx('absolute inset-0 flex items-center justify-center text-3xl font-mono font-bold',
            isLow && 'text-red-500')}>
            {timer.formatted}
          </span>
        </div>

        {/* Letter */}
        <div className="card p-6 text-center">
          <p className="text-text-muted text-sm mb-2">{L('Буква:', 'Letter:')}</p>
          <p className="text-6xl font-bold text-accent">{currentLetter}</p>
        </div>

        {/* Categories */}
        <div className="card p-4 space-y-3">
          <p className="text-xs text-text-muted uppercase tracking-wider font-medium">
            {L('Категории:', 'Categories:')}
          </p>
          {currentCategories.map((cat, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2 bg-bg-surface rounded-lg">
              <span className="w-6 h-6 flex items-center justify-center bg-accent/10 text-accent rounded-full text-xs font-bold">
                {i + 1}
              </span>
              <span className="text-sm font-medium">{cat}</span>
            </div>
          ))}
        </div>

        <p className="text-text-muted text-center text-sm">
          {L('Все пишут ответы на бумаге!', 'Everyone writes answers on paper!')}
        </p>

        <button onClick={goToScoring} className="btn-secondary w-full">
          {L('Завершить досрочно', 'Finish early')}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // REVEAL — time's up, go to scoring
  // ═══════════════════════════════════════════
  if (phase === 'reveal') {
    return (
      <div className="space-y-6 text-center">
        <h3 className="text-xl font-bold">{t.game.time_up}</h3>

        <div className="card p-6">
          <p className="text-text-muted text-sm mb-2">{L('Буква была:', 'The letter was:')}</p>
          <p className="text-5xl font-bold text-accent">{currentLetter}</p>
        </div>

        <div className="card p-4 text-sm text-text-secondary">
          <p>{L('Зачитайте ответы по очереди. Одинаковые ответы вычёркиваются!',
            'Read answers out loud. Duplicate answers are crossed out!')}</p>
        </div>

        <button onClick={goToScoring} className="btn-primary w-full">
          {L('Подсчёт очков', 'Score round')}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // SCORING — assign points
  // ═══════════════════════════════════════════
  if (phase === 'scoring') {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-center">
          {G('scoring_rules')} {t.game.round} {currentRound}
        </h3>

        <div className="card p-4 text-sm text-text-secondary">
          <p>{L('Уникальный ответ = 1 очко. Одинаковые = 0.', 'Unique answer = 1 point. Duplicates = 0.')}</p>
          <p className="mt-1">{L('Буква:', 'Letter:')} <span className="text-accent font-bold">{currentLetter}</span></p>
        </div>

        {/* Categories reminder */}
        <div className="card p-3 space-y-1">
          <p className="text-xs text-text-muted">{L('Категории:', 'Categories:')}</p>
          {currentCategories.map((cat, i) => (
            <p key={i} className="text-sm text-text-secondary">{i + 1}. {cat}</p>
          ))}
        </div>

        {/* Score per player */}
        <div className="space-y-3">
          {players.map(p => (
            <div key={p.name} className="card p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{p.name}</p>
                <p className="text-xs text-text-muted">
                  {G('total')}: {p.totalScore + (roundScores[p.name] || 0)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => adjustScore(p.name, -1)}
                  className="w-8 h-8 rounded-full bg-bg-surface flex items-center justify-center hover:bg-border transition-colors active:scale-95">
                  <Minus size={14} />
                </button>
                <span className="font-mono text-xl font-bold w-8 text-center text-accent">
                  {roundScores[p.name] || 0}
                </span>
                <button onClick={() => adjustScore(p.name, 1)}
                  className="w-8 h-8 rounded-full bg-bg-surface flex items-center justify-center hover:bg-border transition-colors active:scale-95">
                  <Plus size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button onClick={finishRound} className="btn-primary w-full">
          {currentRound >= totalRounds
            ? G('results')
            : G('next_round')}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // END — final scores
  // ═══════════════════════════════════════════
  if (phase === 'end') {
    // Add final round scores
    const finalPlayers = players.map(p => ({
      ...p,
      totalScore: p.totalScore + (roundScores[p.name] || 0),
    }))
    const sorted = [...finalPlayers].sort((a, b) => b.totalScore - a.totalScore)

    return (
      <div className="space-y-6 text-center">
        <h2 className="text-3xl font-bold">{t.game.congratulations}</h2>
        <div className="card p-8">
          <p className="text-lg text-text-muted mb-2">{t.game.winner}</p>
          <p className="text-3xl font-bold text-accent">{sorted[0].name}</p>
          <p className="text-text-muted mt-1">{sorted[0].totalScore} {t.game.points}</p>
        </div>
        <div className="card p-4 space-y-2">
          {sorted.map((p, i) => (
            <div key={p.name} className="flex items-center justify-between text-sm">
              <span className={clsx('flex items-center gap-2', i === 0 && 'text-accent')}>
                <span className="w-5 text-text-muted">{i + 1}.</span>
                {p.name}
              </span>
              <span className="font-mono">{p.totalScore}</span>
            </div>
          ))}
        </div>
        <button onClick={resetGame} className="btn-primary w-full">
          <RotateCcw size={18} /> {t.game.play_again}
        </button>
      </div>
    )
  }

  return null
}
