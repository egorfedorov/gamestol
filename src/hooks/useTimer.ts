import { useState, useRef, useCallback, useEffect } from 'react'

export function useTimer(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds)
  const [isRunning, setIsRunning] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const intervalRef = useRef<number | null>(null)

  const start = useCallback(() => {
    setIsRunning(true)
    setIsFinished(false)
  }, [])

  const pause = useCallback(() => {
    setIsRunning(false)
  }, [])

  const reset = useCallback((newSeconds?: number) => {
    setSeconds(newSeconds ?? initialSeconds)
    setIsRunning(false)
    setIsFinished(false)
  }, [initialSeconds])

  useEffect(() => {
    if (isRunning && seconds > 0) {
      intervalRef.current = window.setInterval(() => {
        setSeconds(prev => {
          if (prev <= 1) {
            setIsRunning(false)
            setIsFinished(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning, seconds])

  const formatTime = useCallback((s: number) => {
    const mins = Math.floor(s / 60)
    const secs = s % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }, [])

  return {
    seconds,
    isRunning,
    isFinished,
    formatted: formatTime(seconds),
    start,
    pause,
    reset,
    progress: 1 - seconds / initialSeconds,
  }
}
