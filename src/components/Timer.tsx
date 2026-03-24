import { Play, Pause, RotateCcw } from 'lucide-react'
import { useTimer } from '../hooks/useTimer'
import clsx from 'clsx'

interface TimerProps {
  seconds: number
  onFinish?: () => void
  size?: 'sm' | 'md' | 'lg'
  autoStart?: boolean
}

export default function Timer({ seconds: initialSeconds, onFinish, size = 'md', autoStart }: TimerProps) {
  const timer = useTimer(initialSeconds)

  if (timer.isFinished && onFinish) {
    onFinish()
  }

  if (autoStart && !timer.isRunning && timer.seconds === initialSeconds && !timer.isFinished) {
    timer.start()
  }

  const isLow = timer.seconds <= 10 && timer.seconds > 0
  const circumference = 2 * Math.PI * 45

  const sizes = {
    sm: { container: 'w-24 h-24', text: 'text-xl', svg: 64 },
    md: { container: 'w-36 h-36', text: 'text-3xl', svg: 100 },
    lg: { container: 'w-48 h-48', text: 'text-5xl', svg: 140 },
  }

  const s = sizes[size]

  return (
    <div className="flex flex-col items-center gap-4">
      <div className={clsx('relative flex items-center justify-center', s.container)}>
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor"
            className="text-border" strokeWidth="3" />
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor"
            className={clsx(
              'transition-all duration-1000',
              isLow ? 'text-red-500' : timer.isFinished ? 'text-text-muted' : 'text-accent'
            )}
            strokeWidth="3" strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * timer.progress} />
        </svg>
        <span className={clsx(
          s.text, 'font-mono font-bold tabular-nums',
          isLow && 'text-red-500 animate-pulse',
          timer.isFinished && 'text-text-muted',
        )}>
          {timer.formatted}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {!timer.isFinished && (
          <button onClick={timer.isRunning ? timer.pause : timer.start}
            className="btn-secondary py-2 px-4">
            {timer.isRunning ? <Pause size={18} /> : <Play size={18} />}
          </button>
        )}
        <button onClick={() => timer.reset()} className="btn-ghost py-2 px-3">
          <RotateCcw size={18} />
        </button>
      </div>
    </div>
  )
}
