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
  const [hasStarted, setHasStarted] = useState(false)

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
    setHasStarted(false)
  }

  function startTimer() {
    if (secondsLeft > 0) {
      setHasStarted(true)
      setIsRunning(true)
    }
  }

  return (
    <section className="timer-card" aria-label="学習タイマー">
      <header className="timer-header">
        <p className="timer-kicker">学習タイマー</p>
        <span className="more-button" aria-hidden="true">•••</span>
      </header>

      <h1 className="timer-heading">集中しよう</h1>

      <TimerDisplay seconds={secondsLeft} label={secondsLeft === 0 ? '完了しました' : '集中タイム'} />
      <TimerControls
        isRunning={isRunning}
        hasStarted={hasStarted}
        onStart={startTimer}
        onPause={() => setIsRunning(false)}
        onReset={resetTimer}
      />

      <section className="session-history" aria-labelledby="history-title">
        <h2 id="history-title">今日</h2>
        <ul>
          <li><span>デザイン調査</span><span>25 分</span></li>
          <li><span>読書</span><span>25 分</span></li>
        </ul>
      </section>
    </section>
  )
}
