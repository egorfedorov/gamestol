import { useState, useMemo } from 'react'
import { Play, Eye, EyeOff, RotateCcw, HelpCircle, Check, X } from 'lucide-react'
import { useI18n } from '../i18n'
import { useGameText } from '../hooks/useGameText'
import PlayerSetup from '../components/PlayerSetup'
import { Player } from '../types'
import { whoAmICards, whoAmICardsEn } from '../data/who-am-i'
import clsx from 'clsx'

type Phase = 'setup' | 'assign' | 'playing' | 'end'

interface WhoAmIPlayer extends Player {
  character: string
  guessedCorrectly: boolean
}

export default function WhoAmIGame() {
  const { t, lang } = useI18n()
  const L = (ru: string, en: string) => lang === 'ru' ? ru : en
  const G = useGameText()

  const [phase, setPhase] = useState<Phase>('setup')
  const [players, setPlayers] = useState<Player[]>([])
  const [gamePlayers, setGamePlayers] = useState<WhoAmIPlayer[]>([])
  const [categoryId, setCategoryId] = useState('celebrities')
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [assignIndex, setAssignIndex] = useState(0)
  const [characterRevealed, setCharacterRevealed] = useState(false)
  const [questionCount, setQuestionCount] = useState(0)

  const categories: { id: string; ru: string; en: string }[] = [
    { id: 'celebrities', ru: 'Знаменитости', en: 'Celebrities' },
    { id: 'animals', ru: 'Животные', en: 'Animals' },
    { id: 'professions', ru: 'Профессии', en: 'Professions' },
    { id: 'fictional', ru: 'Вымышленные персонажи', en: 'Fictional Characters' },
    { id: 'food', ru: 'Еда', en: 'Food' },
  ]

  const getCards = useMemo(() => {
    const source = lang === 'ru' ? whoAmICards : whoAmICardsEn
    return source[categoryId] || []
  }, [lang, categoryId])

  const startGame = () => {
    if (players.length < 2) return
    const cards = [...getCards].sort(() => Math.random() - 0.5)
    const gp: WhoAmIPlayer[] = players.map((p, i) => ({
      ...p,
      character: cards[i % cards.length],
      guessedCorrectly: false,
    }))
    setGamePlayers(gp)
    setAssignIndex(0)
    setCharacterRevealed(false)
    setPhase('assign')
  }

  const nextAssign = () => {
    setCharacterRevealed(false)
    if (assignIndex < gamePlayers.length - 1) {
      setAssignIndex(prev => prev + 1)
    } else {
      setCurrentPlayerIndex(0)
      setQuestionCount(0)
      setPhase('playing')
    }
  }

  const handleGuessCorrect = () => {
    setGamePlayers(prev => prev.map((p, i) =>
      i === currentPlayerIndex ? { ...p, guessedCorrectly: true, score: p.score + 1 } : p
    ))
    goToNextPlayer()
  }

  const handleGuessWrong = () => {
    goToNextPlayer()
  }

  const goToNextPlayer = () => {
    const remaining = gamePlayers.filter((p, i) =>
      !p.guessedCorrectly || i === currentPlayerIndex
    )
    // Find next un-guessed player
    let next = (currentPlayerIndex + 1) % gamePlayers.length
    let attempts = 0
    while (attempts < gamePlayers.length) {
      if (!gamePlayers[next]?.guessedCorrectly) break
      next = (next + 1) % gamePlayers.length
      attempts++
    }
    const activeCount = gamePlayers.filter(p => !p.guessedCorrectly).length
    // After the update, count remaining
    const updatedPlayers = gamePlayers.map((p, i) =>
      i === currentPlayerIndex && phase === 'playing' ? p : p
    )
    const stillPlaying = gamePlayers.filter((p, i) => {
      if (i === currentPlayerIndex) return false // just guessed
      return !p.guessedCorrectly
    })
    if (stillPlaying.length <= 0) {
      setPhase('end')
      return
    }
    setCurrentPlayerIndex(next)
    setQuestionCount(0)
  }

  const skipTurn = () => {
    let next = (currentPlayerIndex + 1) % gamePlayers.length
    let attempts = 0
    while (attempts < gamePlayers.length) {
      if (!gamePlayers[next]?.guessedCorrectly) break
      next = (next + 1) % gamePlayers.length
      attempts++
    }
    setCurrentPlayerIndex(next)
    setQuestionCount(0)
  }

  const resetGame = () => {
    setPhase('setup')
    setGamePlayers([])
    setCurrentPlayerIndex(0)
    setQuestionCount(0)
  }

  const activePlayers = gamePlayers.filter(p => !p.guessedCorrectly)

  // ═══════════════════════════════════════════
  // SETUP — add players + pick category
  // ═══════════════════════════════════════════
  if (phase === 'setup') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">🤔 {L('Кто я?', 'Who Am I?')}</h2>

        <div className="card p-4 text-sm text-text-secondary space-y-1">
          <p className="font-medium text-text mb-2">{G('how_to_play')}</p>
          <p>1. {L('Каждый игрок получает персонажа (виден только другим)', 'Each player gets a character (only others can see it)')}</p>
          <p>2. {L('На своём ходу задавайте вопросы «да/нет»', 'On your turn, ask yes/no questions')}</p>
          <p>3. {L('Попробуйте угадать, кто вы!', 'Try to guess who you are!')}</p>
        </div>

        <PlayerSetup players={players} onChange={setPlayers} min={2} max={10} />

        {/* Category selection */}
        <div className="space-y-3">
          <p className="text-sm text-text-secondary">{L('Категория:', 'Category:')}</p>
          <div className="grid grid-cols-2 gap-2">
            {categories.map(cat => (
              <button key={cat.id}
                onClick={() => setCategoryId(cat.id)}
                className={clsx(
                  'px-4 py-3 rounded-xl text-sm font-medium transition-all',
                  categoryId === cat.id
                    ? 'bg-accent/15 border border-accent/30 text-accent'
                    : 'bg-bg-surface border border-transparent hover:border-border text-text-secondary'
                )}>
                {lang === 'ru' ? cat.ru : cat.en}
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
  // ASSIGN — show characters to other players
  // ═══════════════════════════════════════════
  if (phase === 'assign') {
    const currentPlayer = gamePlayers[assignIndex]
    // Show the character to everyone EXCEPT the current player
    // The instruction is: pass the phone to everyone EXCEPT this player
    return (
      <div className="space-y-6 text-center">
        <p className="text-text-muted text-sm">
          {L('Персонаж', 'Character')} {assignIndex + 1}/{gamePlayers.length}
        </p>

        <div className="card p-8 space-y-4">
          <p className="text-lg text-text-secondary">
            {L('Покажите это всем, КРОМЕ:', 'Show this to everyone EXCEPT:')}
          </p>
          <p className="text-2xl font-bold text-red-400">{currentPlayer.name}</p>

          {!characterRevealed ? (
            <button onClick={() => setCharacterRevealed(true)}
              className="btn-primary mx-auto px-8 py-3">
              <Eye size={18} /> {L('Показать персонажа', 'Reveal character')}
            </button>
          ) : (
            <div className="space-y-4">
              <div className="bg-accent/10 border border-accent/30 rounded-2xl p-6">
                <p className="text-accent text-sm mb-2">
                  {currentPlayer.name} — {L('это:', 'is:')}
                </p>
                <p className="text-accent text-3xl font-bold">{currentPlayer.character}</p>
              </div>

              <p className="text-text-muted text-xs">
                {L('Убедитесь, что ' + currentPlayer.name + ' НЕ видит экран!',
                  'Make sure ' + currentPlayer.name + ' does NOT see the screen!')}
              </p>

              <button onClick={nextAssign}
                className="btn-ghost text-sm flex items-center gap-2 mx-auto">
                <EyeOff size={16} />
                {assignIndex < gamePlayers.length - 1
                  ? t.game.next_player
                  : L('Начать игру', 'Start game')}
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // PLAYING — ask yes/no questions
  // ═══════════════════════════════════════════
  if (phase === 'playing') {
    const currentPlayer = gamePlayers[currentPlayerIndex]
    if (!currentPlayer || currentPlayer.guessedCorrectly) {
      // Skip to next active player or end
      const nextActive = gamePlayers.findIndex((p, i) => i > currentPlayerIndex && !p.guessedCorrectly)
      if (nextActive >= 0) {
        setCurrentPlayerIndex(nextActive)
      } else {
        const wrapActive = gamePlayers.findIndex(p => !p.guessedCorrectly)
        if (wrapActive >= 0) {
          setCurrentPlayerIndex(wrapActive)
        } else {
          setPhase('end')
        }
      }
      return null
    }

    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-muted">
            {L('Осталось:', 'Remaining:')} {activePlayers.length}
          </span>
          <span className="text-text-muted">
            {L('Вопросов задано:', 'Questions asked:')} {questionCount}
          </span>
        </div>

        {/* Current player's turn */}
        <div className="card p-6 text-center space-y-3">
          <p className="text-text-muted text-sm">{L('Сейчас угадывает:', 'Now guessing:')}</p>
          <p className="text-3xl font-bold text-accent">{currentPlayer.name}</p>
          <div className="flex items-center justify-center gap-2 text-text-secondary text-sm">
            <HelpCircle size={14} />
            <span>{L('Задайте вопрос «да» или «нет»', 'Ask a yes or no question')}</span>
          </div>
        </div>

        {/* For other players: the character */}
        <div className="card p-4 bg-accent/5 border-accent/20">
          <p className="text-xs text-text-muted mb-1 text-center">
            {L('Остальные игроки видят (не показывайте ' + currentPlayer.name + '):',
              'Other players see (don\'t show ' + currentPlayer.name + '):')}
          </p>
          <p className="text-xl font-bold text-accent text-center">{currentPlayer.character}</p>
        </div>

        {/* Answer buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setQuestionCount(prev => prev + 1)}
            className="py-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-lg font-semibold
              active:scale-95 transition-transform touch-manipulation">
            {t.game.yes}
          </button>
          <button onClick={() => setQuestionCount(prev => prev + 1)}
            className="py-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-lg font-semibold
              active:scale-95 transition-transform touch-manipulation">
            {t.game.no}
          </button>
        </div>

        {/* Guess / Skip */}
        <div className="flex gap-3">
          <button onClick={handleGuessCorrect}
            className="btn-primary flex-1">
            <Check size={18} /> {L('Угадал!', 'Guessed it!')}
          </button>
          <button onClick={skipTurn}
            className="btn-secondary flex-1">
            {L('Пас', 'Pass')}
          </button>
        </div>

        {/* Players status */}
        <div className="card p-3 space-y-1.5">
          {gamePlayers.map((p, i) => (
            <div key={p.id} className={clsx(
              'flex items-center justify-between px-3 py-1.5 rounded-lg text-sm',
              p.guessedCorrectly ? 'bg-emerald-500/5' : 'bg-bg-surface'
            )}>
              <span className={clsx(
                i === currentPlayerIndex && 'text-accent font-medium',
                p.guessedCorrectly && 'text-emerald-400'
              )}>
                {i === currentPlayerIndex && '> '}{p.name}
              </span>
              {p.guessedCorrectly && (
                <span className="text-emerald-400 text-xs">{p.character}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // END — results
  // ═══════════════════════════════════════════
  if (phase === 'end') {
    const sorted = [...gamePlayers].sort((a, b) => {
      if (a.guessedCorrectly && !b.guessedCorrectly) return -1
      if (!a.guessedCorrectly && b.guessedCorrectly) return 1
      return 0
    })

    return (
      <div className="space-y-6 text-center">
        <h2 className="text-3xl font-bold">{t.game.game_over}</h2>

        <div className="card p-6">
          <p className="text-lg text-text-muted mb-4">{G('results')}</p>
          <div className="space-y-2">
            {sorted.map((p, i) => (
              <div key={p.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-bg-surface text-sm">
                <span className={clsx(p.guessedCorrectly && 'text-emerald-400')}>
                  {p.name}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-text-muted">{p.character}</span>
                  {p.guessedCorrectly ? (
                    <Check size={14} className="text-emerald-400" />
                  ) : (
                    <X size={14} className="text-red-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button onClick={resetGame} className="btn-primary w-full">
          <RotateCcw size={18} /> {t.game.play_again}
        </button>
      </div>
    )
  }

  return null
}
