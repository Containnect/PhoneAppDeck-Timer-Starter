import { useEffect, useState } from 'react'
import { TimerControls } from './TimerControls'
import { TimerDisplay } from './TimerDisplay'

export type TimerProps = {
  /** Length of a focus session. Change this prop to try another duration. */
  initialMinutes?: number
}

export function Timer({ initialMinutes = 25 }: TimerProps) {
  const initialSeconds = Math.max(0, Math.round(initialMinutes * 60))
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (!isRunning) return

    const intervalId = window.setInterval(() => {
      setSecondsLeft((current: number) => {
        if (current <= 1) {
          setIsRunning(false)
          return 0
        }
        return current - 1
      })
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [isRunning])

  function resetTimer() {
    setIsRunning(false)
    setSecondsLeft(initialSeconds)
  }

  return (
    <section className="timer-card" aria-label="Study timer">
      <TimerDisplay seconds={secondsLeft} label={secondsLeft === 0 ? 'Session complete!' : 'Focus session'} />
      <TimerControls
        isRunning={isRunning}
        onStart={() => secondsLeft > 0 && setIsRunning(true)}
        onPause={() => setIsRunning(false)}
        onReset={resetTimer}
      />
    </section>
  )
}
