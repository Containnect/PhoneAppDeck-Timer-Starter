import { Pause, Play, RotateCcw } from 'lucide-react'

export type TimerControlsProps = {
  labels?: { start: string; resume: string; pause: string; reset: string }
  isRunning?: boolean
  hasStarted?: boolean
  canStart?: boolean
  onStart?: () => void
  onPause?: () => void
  onReset?: () => void
}

export function TimerControls({
  labels = { start: 'Start', resume: 'Resume', pause: 'Pause', reset: 'Reset' },
  isRunning = false,
  hasStarted = false,
  canStart = true,
  onStart = () => undefined,
  onPause = () => undefined,
  onReset = () => undefined,
}: TimerControlsProps) {
  return (
    <div className="timer-controls">
      <button
        className="primary-button"
        type="button"
        onClick={isRunning ? onPause : onStart}
        disabled={!isRunning && !canStart}
        aria-label={isRunning ? 'Pause timer' : 'Start timer'}
      >
        {isRunning ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
        {isRunning ? labels.pause : hasStarted ? labels.resume : labels.start}
      </button>
      <button className="reset-button" type="button" onClick={onReset}>
        <RotateCcw aria-hidden="true" />
        {labels.reset}
      </button>
    </div>
  )
}
