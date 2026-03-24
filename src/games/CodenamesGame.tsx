import { useState, useMemo } from 'react'
import { Eye, EyeOff, RotateCcw } from 'lucide-react'
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
  red: 'bg-red-600/90 border-red-500',
  blue: 'bg-blue-600/90 border-blue-500',
  neutral: 'bg-zinc-600/90 border-zinc-500',
  assassin: 'bg-zinc-950 border-zinc-700',
}

const colorLabels = {
  red: { ru: 'Красные', en: 'Red' },
  blue: { ru: 'Синие', en: 'Blue' },
}

export default function CodenamesGame() {
  const { t, lang } = useI18n()
  const [phase, setPhase] = useState<Phase>('setup')
  const [board, setBoard] = useState<Card[]>([])
  const [isSpymaster, setIsSpymaster] = useState(false)
  const [currentTeam, setCurrentTeam] = useState<'red' | 'blue'>('red')
  const [winner, setWinner] = useState<'red' | 'blue' | null>(null)

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
      setWinner(currentTeam === 'red' ? 'blue' : 'red')
      setPhase('end')
      return
    }

    const newRedLeft = newBoard.filter(c => c.color === 'red' && !c.revealed).length
    const newBlueLeft = newBoard.filter(c => c.color === 'blue' && !c.revealed).length

    if (newRedLeft === 0) { setWinner('red'); setPhase('end'); return }
    if (newBlueLeft === 0) { setWinner('blue'); setPhase('end'); return }

    if (card.color !== currentTeam) {
      setCurrentTeam(currentTeam === 'red' ? 'blue' : 'red')
    }
  }

  const endTurn = () => {
    setCurrentTeam(currentTeam === 'red' ? 'blue' : 'red')
  }

  const resetGame = () => {
    setPhase('setup')
    setBoard([])
    setWinner(null)
  }

  if (phase === 'setup') {
    return (
      <div className="space-y-6 text-center">
        <h2 className="text-2xl font-bold">🕵️ {lang === 'ru' ? 'Кодовые имена' : 'Codenames'}</h2>
        <p className="text-text-secondary text-sm">
          {lang === 'ru'
            ? 'Разделитесь на две команды. В каждой выберите капитана. Капитан видит карту цветов и даёт подсказки.'
            : 'Split into two teams. Each team picks a spymaster who sees the color map and gives clues.'}
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="card p-4 border-red-500/30">
            <div className="w-3 h-3 rounded-full bg-red-500 mx-auto mb-2" />
            <p className="font-medium text-sm">{colorLabels.red[lang === 'ru' ? 'ru' : 'en']}</p>
            <p className="text-text-muted text-xs">{lang === 'ru' ? '9 слов (ходят первыми)' : '9 words (goes first)'}</p>
          </div>
          <div className="card p-4 border-blue-500/30">
            <div className="w-3 h-3 rounded-full bg-blue-500 mx-auto mb-2" />
            <p className="font-medium text-sm">{colorLabels.blue[lang === 'ru' ? 'ru' : 'en']}</p>
            <p className="text-text-muted text-xs">{lang === 'ru' ? '8 слов' : '8 words'}</p>
          </div>
        </div>
        <button onClick={startGame} className="btn-primary w-full">{t.game.start_game}</button>
      </div>
    )
  }

  if (phase === 'end') {
    return (
      <div className="space-y-6 text-center">
        <h2 className="text-3xl font-bold">{t.game.game_over}</h2>
        <div className={clsx('card p-8', winner === 'red' ? 'border-red-500/30' : 'border-blue-500/30')}>
          <p className="text-xl font-bold">
            {winner === 'red'
              ? `🔴 ${colorLabels.red[lang === 'ru' ? 'ru' : 'en']} ${lang === 'ru' ? 'победили!' : 'win!'}`
              : `🔵 ${colorLabels.blue[lang === 'ru' ? 'ru' : 'en']} ${lang === 'ru' ? 'победили!' : 'win!'}`}
          </p>
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {board.map((card, i) => (
            <div key={i} className={clsx('p-2 rounded-lg text-[10px] sm:text-xs text-center font-medium border',
              colorStyles[card.color])}>
              {card.word}
            </div>
          ))}
        </div>
        <button onClick={resetGame} className="btn-primary w-full">
          <RotateCcw size={18} /> {t.game.play_again}
        </button>
      </div>
    )
  }

  // PLAYING
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className={clsx('game-phase-indicator',
          currentTeam === 'red' ? 'border-red-500/30 text-red-400 bg-red-500/10' : 'border-blue-500/30 text-blue-400 bg-blue-500/10')}>
          <div className={clsx('w-2.5 h-2.5 rounded-full', currentTeam === 'red' ? 'bg-red-500' : 'bg-blue-500')} />
          {lang === 'ru' ? 'Ход' : 'Turn'}: {colorLabels[currentTeam][lang === 'ru' ? 'ru' : 'en']}
        </div>
        <button onClick={() => setIsSpymaster(!isSpymaster)}
          className={clsx('btn-ghost text-xs', isSpymaster && 'text-accent')}>
          {isSpymaster ? <EyeOff size={14} /> : <Eye size={14} />}
          {isSpymaster ? (lang === 'ru' ? 'Скрыть' : 'Hide') : t.game.spymaster}
        </button>
      </div>

      <div className="flex items-center justify-center gap-6 text-sm">
        <span className="text-red-400">🔴 {redLeft}</span>
        <span className="text-blue-400">🔵 {blueLeft}</span>
      </div>

      {/* Board */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {board.map((card, i) => {
          const showColor = card.revealed || isSpymaster
          return (
            <button key={i} onClick={() => revealCard(i)}
              disabled={card.revealed || isSpymaster}
              className={clsx(
                'aspect-[4/3] sm:aspect-[3/2] rounded-lg sm:rounded-xl text-[9px] sm:text-xs font-medium border transition-all p-1',
                'flex items-center justify-center text-center leading-tight',
                showColor ? colorStyles[card.color] : 'bg-bg-card border-border hover:border-border-light active:scale-95',
                card.revealed && 'opacity-70',
                card.color === 'assassin' && showColor && 'text-red-300',
              )}>
              {card.word}
            </button>
          )
        })}
      </div>

      <button onClick={endTurn} className="btn-secondary w-full text-sm">
        {lang === 'ru' ? 'Завершить ход' : 'End Turn'}
      </button>
    </div>
  )
}
