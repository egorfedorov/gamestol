import { useState } from 'react'
import { Eye, EyeOff, RotateCcw, SkipForward } from 'lucide-react'
import { useI18n } from '../i18n'
import { codenamesWords } from '../data/words'
import clsx from 'clsx'

type CardColor = 'red' | 'blue' | 'neutral' | 'assassin'
type Phase = 'setup' | 'playing' | 'end'

interface Card {
  word: string
  color: CardColor
  revealed: boolean
}

function generateBoard(): Card[] {
  const shuffled = [...codenamesWords].sort(() => Math.random() - 0.5).slice(0, 25)
  const colors: CardColor[] = [
    ...Array(9).fill('red'),
    ...Array(8).fill('blue'),
    ...Array(7).fill('neutral'),
    'assassin',
  ].sort(() => Math.random() - 0.5) as CardColor[]
  return shuffled.map((word, i) => ({ word, color: colors[i], revealed: false }))
}

const colorStyles = {
  red: 'bg-red-600/90 border-red-500 text-white',
  blue: 'bg-blue-600/90 border-blue-500 text-white',
  neutral: 'bg-zinc-600/90 border-zinc-500 text-zinc-200',
  assassin: 'bg-zinc-950 border-zinc-600 text-red-300',
}

export default function CodenamesGame() {
  const { t, lang } = useI18n()
  const L = (ru: string, en: string) => lang === 'ru' ? ru : en

  const [phase, setPhase] = useState<Phase>('setup')
  const [board, setBoard] = useState<Card[]>([])
  const [isSpymaster, setIsSpymaster] = useState(false)
  const [currentTeam, setCurrentTeam] = useState<'red' | 'blue'>('red')
  const [winner, setWinner] = useState<'red' | 'blue' | null>(null)
  const [winReason, setWinReason] = useState('')

  const startGame = () => {
    setBoard(generateBoard())
    setPhase('playing')
    setCurrentTeam('red')
    setIsSpymaster(false)
    setWinner(null)
  }

  const redLeft = board.filter(c => c.color === 'red' && !c.revealed).length
  const blueLeft = board.filter(c => c.color === 'blue' && !c.revealed).length

  const revealCard = (index: number) => {
    if (isSpymaster || board[index].revealed) return
    const card = board[index]
    const newBoard = board.map((c, i) => i === index ? { ...c, revealed: true } : c)
    setBoard(newBoard)

    if (card.color === 'assassin') {
      const w = currentTeam === 'red' ? 'blue' : 'red'
      setWinner(w)
      setWinReason(L('Выбран убийца!', 'Assassin was chosen!'))
      setPhase('end')
      return
    }

    const newRedLeft = newBoard.filter(c => c.color === 'red' && !c.revealed).length
    const newBlueLeft = newBoard.filter(c => c.color === 'blue' && !c.revealed).length

    if (newRedLeft === 0) { setWinner('red'); setWinReason(L('Все слова найдены!', 'All words found!')); setPhase('end'); return }
    if (newBlueLeft === 0) { setWinner('blue'); setWinReason(L('Все слова найдены!', 'All words found!')); setPhase('end'); return }

    if (card.color !== currentTeam) {
      setCurrentTeam(currentTeam === 'red' ? 'blue' : 'red')
    }
  }

  const endTurn = () => setCurrentTeam(currentTeam === 'red' ? 'blue' : 'red')

  const resetGame = () => { setPhase('setup'); setBoard([]); setWinner(null) }

  // ═══════════════════════════════════════════
  // SETUP
  // ═══════════════════════════════════════════
  if (phase === 'setup') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">🕵️ {L('Кодовые имена', 'Codenames')}</h2>

        <div className="card p-4 text-sm text-text-secondary space-y-1">
          <p className="font-medium text-text mb-2">{L('Как играть:', 'How to play:')}</p>
          <p>1. {L('Разделитесь на 2 команды. В каждой выберите капитана.', 'Split into 2 teams. Each picks a spymaster.')}</p>
          <p>2. {L('Капитан нажимает 👁 чтобы видеть цвета слов.', 'Spymaster taps 👁 to see the color map.')}</p>
          <p>3. {L('Капитан даёт подсказку: ОДНО слово + количество.', 'Spymaster gives a clue: ONE word + count.')}</p>
          <p>4. {L('Команда нажимает на слова. Угадали — продолжают.', 'Team taps words. Correct — keep going.')}</p>
          <p>5. {L('Убийца (чёрная) = мгновенный проигрыш!', 'Assassin (black) = instant loss!')}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="card p-4 border-red-500/30 text-center">
            <div className="w-4 h-4 rounded-full bg-red-500 mx-auto mb-2" />
            <p className="font-medium text-sm text-red-400">{L('Красные', 'Red Team')}</p>
            <p className="text-text-muted text-xs">{L('9 слов • ходят первыми', '9 words • goes first')}</p>
          </div>
          <div className="card p-4 border-blue-500/30 text-center">
            <div className="w-4 h-4 rounded-full bg-blue-500 mx-auto mb-2" />
            <p className="font-medium text-sm text-blue-400">{L('Синие', 'Blue Team')}</p>
            <p className="text-text-muted text-xs">{L('8 слов', '8 words')}</p>
          </div>
        </div>

        <button onClick={startGame} className="btn-primary w-full">
          {t.game.start_game}
        </button>
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
        <div className={clsx('card p-6', winner === 'red' ? 'border-red-500/30' : 'border-blue-500/30')}>
          <p className="text-xl font-bold mb-1">
            {winner === 'red'
              ? `🔴 ${L('Красные победили!', 'Red wins!')}`
              : `🔵 ${L('Синие победили!', 'Blue wins!')}`}
          </p>
          <p className="text-text-muted text-sm">{winReason}</p>
        </div>

        {/* Full board revealed */}
        <div className="grid grid-cols-5 gap-1">
          {board.map((card, i) => (
            <div key={i} className={clsx(
              'p-1.5 rounded text-[9px] sm:text-xs text-center font-medium border leading-tight',
              colorStyles[card.color]
            )}>{card.word}</div>
          ))}
        </div>

        <button onClick={resetGame} className="btn-primary w-full">
          <RotateCcw size={18} /> {t.game.play_again}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // PLAYING
  // ═══════════════════════════════════════════
  const teamLabel = currentTeam === 'red' ? L('Красные', 'Red') : L('Синие', 'Blue')

  return (
    <div className="space-y-3">
      {/* Turn indicator + spymaster toggle */}
      <div className="flex items-center justify-between">
        <div className={clsx('game-phase-indicator',
          currentTeam === 'red'
            ? 'border-red-500/30 text-red-400 bg-red-500/10'
            : 'border-blue-500/30 text-blue-400 bg-blue-500/10')}>
          <div className={clsx('w-2.5 h-2.5 rounded-full', currentTeam === 'red' ? 'bg-red-500' : 'bg-blue-500')} />
          {L('Ход', 'Turn')}: {teamLabel}
        </div>
        <button onClick={() => setIsSpymaster(!isSpymaster)}
          className={clsx('btn-ghost text-xs gap-1', isSpymaster && 'text-accent bg-accent/10')}>
          {isSpymaster ? <EyeOff size={14} /> : <Eye size={14} />}
          {isSpymaster ? L('Скрыть карту', 'Hide map') : L('Капитан 👁', 'Spymaster 👁')}
        </button>
      </div>

      {/* Remaining words */}
      <div className="flex items-center justify-center gap-6 text-sm font-mono">
        <span className="flex items-center gap-1.5 text-red-400">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> {redLeft}
        </span>
        <span className="flex items-center gap-1.5 text-blue-400">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> {blueLeft}
        </span>
      </div>

      {/* Instructions for spymaster */}
      {isSpymaster && (
        <div className="card p-3 border-accent/20 text-xs text-text-secondary text-center">
          {L(
            'Вы видите карту цветов. Дайте подсказку: ОДНО слово + число связанных.',
            'You see the color map. Give a clue: ONE word + number of related.'
          )}
        </div>
      )}

      {/* Board - 5×5 grid */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {board.map((card, i) => {
          const showColor = card.revealed || isSpymaster
          return (
            <button key={i} onClick={() => revealCard(i)}
              disabled={card.revealed || isSpymaster}
              className={clsx(
                'aspect-[4/3] sm:aspect-[3/2] rounded-lg sm:rounded-xl text-[9px] sm:text-xs font-medium border transition-all',
                'flex items-center justify-center text-center leading-tight p-1',
                'touch-manipulation',
                showColor
                  ? colorStyles[card.color]
                  : 'bg-bg-card border-border hover:border-border-light active:scale-95',
                card.revealed && 'opacity-60',
              )}>
              {card.word}
            </button>
          )
        })}
      </div>

      {/* End turn button */}
      <button onClick={endTurn} className="btn-secondary w-full text-sm">
        <SkipForward size={16} />
        {L('Завершить ход', 'End Turn')}
      </button>
    </div>
  )
}
