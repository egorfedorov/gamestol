import { useState, useMemo } from 'react'
import { Plus, Play, RotateCcw, Zap, MessageCircle } from 'lucide-react'
import { useI18n } from '../i18n'
import { useGameText } from '../hooks/useGameText'
import PlayerSetup from '../components/PlayerSetup'
import { Player } from '../types'
import { truthQuestions, truthQuestionsEn, dareActions, dareActionsEn } from '../data/truth-dare'
import clsx from 'clsx'

type Phase = 'setup' | 'playing' | 'end'
type Choice = 'truth' | 'dare' | null

export default function TruthDareGame() {
  const { t, lang } = useI18n()
  const L = (ru: string, en: string) => lang === 'ru' ? ru : en
  const G = useGameText()

  const [phase, setPhase] = useState<Phase>('setup')
  const [players, setPlayers] = useState<Player[]>([])
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [choice, setChoice] = useState<Choice>(null)
  const [currentText, setCurrentText] = useState('')
  const [round, setRound] = useState(1)
  const [maxRounds, setMaxRounds] = useState(3)
  const [usedTruths, setUsedTruths] = useState<Set<number>>(new Set())
  const [usedDares, setUsedDares] = useState<Set<number>>(new Set())

  const truths = useMemo(() => lang === 'ru' ? truthQuestions : truthQuestionsEn, [lang])
  const dares = useMemo(() => lang === 'ru' ? dareActions : dareActionsEn, [lang])

  const getRandomItem = (items: string[], used: Set<number>): { text: string; index: number } => {
    const available = items.map((text, i) => ({ text, i })).filter(x => !used.has(x.i))
    if (available.length === 0) {
      const idx = Math.floor(Math.random() * items.length)
      return { text: items[idx], index: idx }
    }
    const pick = available[Math.floor(Math.random() * available.length)]
    return { text: pick.text, index: pick.i }
  }

  const startGame = () => {
    if (players.length < 2) return
    setPhase('playing')
    setCurrentPlayerIndex(0)
    setRound(1)
    setChoice(null)
    setUsedTruths(new Set())
    setUsedDares(new Set())
  }

  const handleChoice = (type: 'truth' | 'dare') => {
    setChoice(type)
    if (type === 'truth') {
      const result = getRandomItem(truths, usedTruths)
      setCurrentText(result.text)
      setUsedTruths(prev => new Set(prev).add(result.index))
    } else {
      const result = getRandomItem(dares, usedDares)
      setCurrentText(result.text)
      setUsedDares(prev => new Set(prev).add(result.index))
    }
  }

  const nextTurn = () => {
    const nextIndex = (currentPlayerIndex + 1) % players.length
    if (nextIndex === 0) {
      if (round >= maxRounds) {
        setPhase('end')
        return
      }
      setRound(prev => prev + 1)
    }
    setCurrentPlayerIndex(nextIndex)
    setChoice(null)
    setCurrentText('')
  }

  const resetGame = () => {
    setPhase('setup')
    setChoice(null)
    setCurrentText('')
    setRound(1)
    setUsedTruths(new Set())
    setUsedDares(new Set())
  }

  // ═══════════════════════════════════════════
  // SETUP
  // ═══════════════════════════════════════════
  if (phase === 'setup') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">{L('Правда или Действие', 'Truth or Dare')}</h2>

        <div className="card p-4 text-sm text-text-secondary space-y-1">
          <p className="font-medium text-text mb-2">{G('how_to_play')}</p>
          <p>1. {L('Случайный игрок выбирает: Правда или Действие', 'Random player chooses: Truth or Dare')}</p>
          <p>2. {L('Правда — ответь честно на вопрос', 'Truth — answer a question honestly')}</p>
          <p>3. {L('Действие — выполни задание', 'Dare — complete the challenge')}</p>
          <p>4. {L('Игра идёт по раундам — все играют по очереди', 'Game goes in rounds — everyone takes turns')}</p>
        </div>

        <PlayerSetup players={players} onChange={setPlayers} min={2} max={20} />

        <div className="card p-4">
          <label className="text-sm text-text-secondary block mb-2">
            {L('Раундов', 'Rounds')}: <span className="text-text font-mono">{maxRounds}</span>
          </label>
          <input type="range" min={1} max={10} value={maxRounds}
            onChange={e => setMaxRounds(Number(e.target.value))}
            className="w-full accent-accent" />
        </div>

        <button onClick={startGame} disabled={players.length < 2}
          className="btn-primary w-full disabled:opacity-40">
          <Play size={18} /> {t.game.start_game}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // PLAYING
  // ═══════════════════════════════════════════
  if (phase === 'playing') {
    return (
      <div className="space-y-6 text-center">
        {/* Round info */}
        <div className="flex items-center justify-between text-sm text-text-muted">
          <span>{t.game.round} {round}/{maxRounds}</span>
          <span>{currentPlayerIndex + 1}/{players.length}</span>
        </div>

        {/* Current player */}
        <div className="card p-6">
          <p className="text-text-muted text-sm mb-2">{G('current_turn')}</p>
          <p className="text-3xl font-bold text-accent">{players[currentPlayerIndex]?.name}</p>
        </div>

        {!choice ? (
          /* Choice buttons */
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => handleChoice('truth')}
              className="py-5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-lg font-semibold
                active:scale-95 transition-transform touch-manipulation">
              <MessageCircle size={28} className="mx-auto mb-2" />
              {L('Правда', 'Truth')}
            </button>
            <button onClick={() => handleChoice('dare')}
              className="py-5 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-lg font-semibold
                active:scale-95 transition-transform touch-manipulation">
              <Zap size={28} className="mx-auto mb-2" />
              {L('Действие', 'Dare')}
            </button>
          </div>
        ) : (
          /* Show truth/dare */
          <>
            <div className={clsx(
              'inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium',
              choice === 'truth'
                ? 'text-blue-400 bg-blue-400/10 border-blue-400/20'
                : 'text-orange-400 bg-orange-400/10 border-orange-400/20'
            )}>
              {choice === 'truth' ? <MessageCircle size={16} /> : <Zap size={16} />}
              {choice === 'truth' ? L('Правда', 'Truth') : L('Действие', 'Dare')}
            </div>

            <div className="card p-8 min-h-[120px] flex items-center justify-center">
              <p className="text-xl sm:text-2xl font-medium leading-relaxed">{currentText}</p>
            </div>

            <button onClick={nextTurn}
              className="btn-primary w-full text-lg py-5 touch-manipulation">
              {round >= maxRounds && currentPlayerIndex === players.length - 1
                ? G('results')
                : t.game.next_player}
            </button>
          </>
        )}

        {/* Player list */}
        <div className="card p-3 space-y-1">
          {players.map((p, i) => (
            <div key={p.id} className={clsx(
              'flex items-center justify-between text-sm px-2',
              i === currentPlayerIndex && 'text-accent font-medium'
            )}>
              <span>{p.name}</span>
              {i === currentPlayerIndex && <span className="text-xs text-accent">{L('сейчас', 'now')}</span>}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // END
  // ═══════════════════════════════════════════
  if (phase === 'end') {
    return (
      <div className="space-y-6 text-center">
        <h2 className="text-3xl font-bold">{t.game.game_over}</h2>
        <div className="card p-8">
          <p className="text-lg text-text-secondary mb-2">
            {L('Все раунды пройдены!', 'All rounds completed!')}
          </p>
          <p className="text-5xl font-bold font-mono text-accent">{maxRounds}</p>
          <p className="text-text-muted text-sm mt-2">
            {L('раундов с ' + players.length + ' игроками', 'rounds with ' + players.length + ' players')}
          </p>
        </div>
        <div className="card p-4 space-y-1">
          {players.map(p => (
            <div key={p.id} className="text-sm px-2 py-1">{p.name}</div>
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
