import { Pause, Play, RotateCcw } from 'lucide-react'

export type TimerControlsProps = {
  isRunning?: boolean
  onStart?: () => void
  onPause?: () => void
  onReset?: () => void
}

export function TimerControls({
  isRunning = false,
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
        aria-label={isRunning ? 'Pause timer' : 'Start timer'}
      >
        {isRunning ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
        {isRunning ? 'Pause' : 'Start'}
      </button>
      <button className="reset-button" type="button" onClick={onReset}>
        <RotateCcw aria-hidden="true" />
        Reset
      </button>
    </div>
  )
}
