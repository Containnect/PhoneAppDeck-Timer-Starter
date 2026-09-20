export type TimerDisplayProps = {
  /** Remaining time in seconds. */
  seconds?: number
  /** Configured duration, shown in the editable inputs before a session starts. */
  minutes?: number
  configuredSeconds?: number
  isEditable?: boolean
  /** Short label shown above the time. */
  label?: string
  onMinutesChange?: (minutes: number) => void
  onSecondsChange?: (seconds: number) => void
}

export function TimerDisplay({
  seconds = 25 * 60,
  minutes = 25,
  configuredSeconds = 0,
  isEditable = false,
  label = 'Focus session',
  onMinutesChange = () => undefined,
  onSecondsChange = () => undefined,
}: TimerDisplayProps) {
  const safeSeconds = Math.max(0, seconds)
  const displayMinutes = Math.floor(safeSeconds / 60)
  const remainder = safeSeconds % 60

  return (
    <div className="timer-display">
      <span className="timer-label">{label}</span>
      {isEditable ? (
        <div className="timer-inputs" aria-label="タイマー時間の設定">
          <label>
            <input
              type="number"
              min="0"
              max="999"
              inputMode="numeric"
              value={minutes}
              onChange={(event) => onMinutesChange(Number(event.target.value))}
              aria-label="分"
            />
            <span>分</span>
          </label>
          <span className="timer-separator" aria-hidden="true">:</span>
          <label>
            <input
              type="number"
              min="0"
              max="59"
              inputMode="numeric"
              value={String(configuredSeconds).padStart(2, '0')}
              onChange={(event) => onSecondsChange(Number(event.target.value))}
              aria-label="秒"
            />
            <span>秒</span>
          </label>
        </div>
      ) : (
        <time className="timer-time" dateTime={`PT${safeSeconds}S`} aria-live="polite" aria-atomic="true">
          {String(displayMinutes).padStart(2, '0')}:{String(remainder).padStart(2, '0')}
        </time>
      )}
    </div>
  )
}
