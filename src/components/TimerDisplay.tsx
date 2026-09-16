export type TimerDisplayProps = {
  /** Remaining time in seconds. */
  seconds?: number
  /** Short label shown above the time. */
  label?: string
}

export function TimerDisplay({ seconds = 25 * 60, label = 'Focus session' }: TimerDisplayProps) {
  const safeSeconds = Math.max(0, seconds)
  const minutes = Math.floor(safeSeconds / 60)
  const remainder = safeSeconds % 60
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`

  return (
    <div className="timer-display" aria-live="polite" aria-atomic="true">
      <span className="timer-label">{label}</span>
      <time className="timer-time" dateTime={`PT${safeSeconds}S`}>
        {formattedTime}
      </time>
    </div>
  )
}
