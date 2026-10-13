import { useEffect, useState } from 'react'

export type TimerLanguage = 'ja' | 'en'
const STORAGE_KEY = 'timer-starter-language'
function detectLanguage(): TimerLanguage {
  if (typeof window === 'undefined') return 'en'
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === 'ja' || saved === 'en') return saved
  } catch { /* Storage may be unavailable in preview */ }
  return window.navigator.language?.toLowerCase().startsWith('ja') ? 'ja' : 'en'
}

export function useTimerLanguage(): [TimerLanguage, (next: TimerLanguage) => void] {
  const [language, setLanguage] = useState<TimerLanguage>(detectLanguage)
  useEffect(() => { if (typeof document !== 'undefined') document.documentElement.lang = language }, [language])
  const changeLanguage = (next: TimerLanguage) => {
    setLanguage(next)
    try { window.localStorage.setItem(STORAGE_KEY, next) } catch { /* Optional preference */ }
  }
  return [language, changeLanguage]
}

export const timerStrings = {
  ja: {
    timer: '学習タイマー', heading: '集中しよう', switchLanguage: 'Switch to English',
    completed: '完了しました', focusTime: '集中タイム',
    start: '集中を始める', resume: '再開する', pause: '一時停止', reset: 'リセット',
    today: '今日', add: '追加', newItem: '新しい項目名', itemPlaceholder: '項目名を入力',
    deleteItem: '削除', units: { minutes: '分', seconds: '秒' },
    sampleSessions: { 'design-research': 'デザイン調査', reading: '読書' },
  },
  en: {
    timer: 'Study Timer', heading: 'Time to Focus', switchLanguage: '日本語に切り替え',
    completed: 'Completed', focusTime: 'Focus Time',
    start: 'Start Focus', resume: 'Resume', pause: 'Pause', reset: 'Reset',
    today: 'Today', add: 'Add', newItem: 'New item', itemPlaceholder: 'Enter item name',
    deleteItem: 'Delete', units: { minutes: 'min', seconds: 'sec' },
    sampleSessions: { 'design-research': 'Design research', reading: 'Reading' },
  },
} as const
