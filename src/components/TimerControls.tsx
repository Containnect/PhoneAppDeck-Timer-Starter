import { Pause, Play, RotateCcw } from 'lucide-react'

export type TimerControlsProps = {
  isRunning?: boolean
  hasStarted?: boolean
  canStart?: boolean
  onStart?: () => void
  onPause?: () => void
  onReset?: () => void
}

export function TimerControls({
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
        {isRunning ? '一時停止' : hasStarted ? '再開する' : '集中を始める'}
      </button>
      <button className="reset-button" type="button" onClick={onReset}>
        <RotateCcw aria-hidden="true" />
        リセット
      </button>
    </div>
  )
}
