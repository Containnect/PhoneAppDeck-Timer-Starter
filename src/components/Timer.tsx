import { useEffect, useState } from 'react'
import { TimerControls } from './TimerControls'
import { TimerDisplay } from './TimerDisplay'

export type TimerProps = {
  /** Initial length of a focus session. */
  initialMinutes?: number
  initialSeconds?: number
}

export type SessionItem = {
  id: string
  title: string
  durationSeconds: number
}

const clamp = (value: number, maximum: number) =>
  Math.min(maximum, Math.max(0, Number.isFinite(value) ? Math.floor(value) : 0))

const initialSessions: SessionItem[] = [
  { id: 'design-research', title: 'デザイン調査', durationSeconds: 25 * 60 },
  { id: 'reading', title: '読書', durationSeconds: 25 * 60 },
]

function formatDuration(durationSeconds: number) {
  const minutes = Math.floor(durationSeconds / 60)
  const seconds = durationSeconds % 60
  if (minutes === 0) return `${seconds}秒`
  if (seconds === 0) return `${minutes}分`
  return `${minutes}分${seconds}秒`
}

export function Timer({ initialMinutes = 25, initialSeconds = 0 }: TimerProps) {
  const [minutes, setMinutes] = useState(() => clamp(initialMinutes, 999))
  const [configuredSeconds, setConfiguredSeconds] = useState(() => clamp(initialSeconds, 59))
  const configuredTotalSeconds = minutes * 60 + configuredSeconds
  const [secondsLeft, setSecondsLeft] = useState(configuredTotalSeconds)
  const [isRunning, setIsRunning] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [sessions, setSessions] = useState<SessionItem[]>(initialSessions)
  const [isAddingSession, setIsAddingSession] = useState(false)
  const [newSessionTitle, setNewSessionTitle] = useState('')

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
    setSecondsLeft(configuredTotalSeconds)
    setHasStarted(false)
  }

  function changeMinutes(value: number) {
    const nextMinutes = clamp(value, 999)
    setMinutes(nextMinutes)
    setSecondsLeft(nextMinutes * 60 + configuredSeconds)
  }

  function changeSeconds(value: number) {
    const nextSeconds = clamp(value, 59)
    setConfiguredSeconds(nextSeconds)
    setSecondsLeft(minutes * 60 + nextSeconds)
  }

  function addSession() {
    const title = newSessionTitle.trim()
    if (!title) return
    setSessions((current) => [
      ...current,
      { id: `${Date.now()}-${current.length}`, title, durationSeconds: configuredTotalSeconds },
    ])
    setNewSessionTitle('')
    setIsAddingSession(false)
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

      <TimerDisplay
        seconds={secondsLeft}
        minutes={minutes}
        configuredSeconds={configuredSeconds}
        isEditable={!hasStarted}
        label={secondsLeft === 0 && hasStarted ? '完了しました' : '集中タイム'}
        onMinutesChange={changeMinutes}
        onSecondsChange={changeSeconds}
      />
      <TimerControls
        isRunning={isRunning}
        hasStarted={hasStarted}
        canStart={secondsLeft > 0}
        onStart={startTimer}
        onPause={() => setIsRunning(false)}
        onReset={resetTimer}
      />

      <section className="session-history" aria-labelledby="history-title">
        <div className="history-header">
          <h2 id="history-title">今日</h2>
          <button type="button" className="add-session-button" onClick={() => setIsAddingSession(true)}>
            ＋ 追加
          </button>
        </div>
        {isAddingSession && (
          <form className="add-session-form" onSubmit={(event) => { event.preventDefault(); addSession() }}>
            <label className="sr-only" htmlFor="session-title">新しい項目名</label>
            <input
              id="session-title"
              autoFocus
              value={newSessionTitle}
              onChange={(event) => setNewSessionTitle(event.target.value)}
              placeholder="項目名を入力"
            />
            <button type="submit" disabled={!newSessionTitle.trim()}>追加</button>
          </form>
        )}
        <ul>
          {sessions.map((session) => (
            <li key={session.id}>
              <span>{session.title}</span>
              <span className="session-duration">{formatDuration(session.durationSeconds)}</span>
              <button
                type="button"
                className="delete-session-button"
                onClick={() => setSessions((current) => current.filter((item) => item.id !== session.id))}
                aria-label={`${session.title}を削除`}
              >×</button>
            </li>
          ))}
        </ul>
      </section>
    </section>
  )
}
