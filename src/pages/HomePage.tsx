import { Timer } from '../components/Timer'

export function HomePage() {
  return (
    <main className="app-shell">
      <section className="intro" aria-labelledby="page-title">
        <p className="eyebrow">FOCUS SPACE</p>
        <h1 id="page-title">Study Timer</h1>
        <p className="intro-copy">One task. One session. Make it count.</p>
      </section>

      <Timer />

      <p className="tip">Put your phone away and give this moment your full attention.</p>
    </main>
  )
}
