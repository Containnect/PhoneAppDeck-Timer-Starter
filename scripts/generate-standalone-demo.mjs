import { mkdir, readFile, writeFile } from 'node:fs/promises';

const css = await readFile('src/styles.css', 'utf8');
await mkdir('artifact', { recursive: true });

const html = `<!doctype html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <meta name="theme-color" content="#f4f1e8" />
  <title>Study Timer</title>
  <style>${css.replaceAll('</style', '<\\/style')}</style>
</head>
<body>
  <main class="app-shell">
    <section class="timer-card" aria-label="学習タイマー">
      <header class="timer-header">
        <p class="timer-kicker">学習タイマー</p>
        <span class="more-button" aria-hidden="true">•••</span>
      </header>

      <h1 class="timer-heading">集中しよう</h1>

      <div class="timer-display">
        <span class="timer-label" id="timer-label">集中タイム</span>
        <div class="timer-inputs" id="timer-inputs" aria-label="タイマー時間の設定">
          <label>
            <input id="minutes" type="number" min="0" max="999" inputmode="numeric" value="25" aria-label="分" />
            <span>分</span>
          </label>
          <span class="timer-separator" aria-hidden="true">:</span>
          <label>
            <input id="seconds" type="number" min="0" max="59" inputmode="numeric" value="00" aria-label="秒" />
            <span>秒</span>
          </label>
        </div>
        <time class="timer-time" id="timer-time" hidden aria-live="polite" aria-atomic="true">25:00</time>
      </div>

      <div class="timer-controls">
        <button class="primary-button" id="primary-button" type="button">▶ 集中を始める</button>
        <button class="reset-button" id="reset-button" type="button">↻ リセット</button>
      </div>

      <section class="session-history" aria-labelledby="history-title">
        <div class="history-header">
          <h2 id="history-title">今日</h2>
          <button type="button" class="add-session-button" id="show-add-session">＋ 追加</button>
        </div>
        <form class="add-session-form" id="add-session-form" hidden>
          <label class="sr-only" for="session-title">新しい項目名</label>
          <input id="session-title" placeholder="項目名を入力" />
          <button type="submit">追加</button>
        </form>
        <ul id="session-list">
          <li data-title="デザイン調査"><span>デザイン調査</span><span class="session-duration">25分</span><button type="button" class="delete-session-button" aria-label="デザイン調査を削除">×</button></li>
          <li data-title="読書"><span>読書</span><span class="session-duration">25分</span><button type="button" class="delete-session-button" aria-label="読書を削除">×</button></li>
        </ul>
      </section>

      <p id="viewer-note" style="margin:18px 0 0;color:#888;font-size:11px;line-height:1.5">
        ボタンが反応しない場合は、このHTMLをJavaScript対応のブラウザまたはHTMLビューアで開いてください。
      </p>
    </section>
  </main>

  <script>
  (() => {
    const minuteInput = document.getElementById('minutes');
    const secondInput = document.getElementById('seconds');
    const inputs = document.getElementById('timer-inputs');
    const time = document.getElementById('timer-time');
    const label = document.getElementById('timer-label');
    const primary = document.getElementById('primary-button');
    const reset = document.getElementById('reset-button');
    const addButton = document.getElementById('show-add-session');
    const addForm = document.getElementById('add-session-form');
    const sessionTitle = document.getElementById('session-title');
    const sessionList = document.getElementById('session-list');
    const viewerNote = document.getElementById('viewer-note');

    let minutes = 25;
    let configuredSeconds = 0;
    let secondsLeft = 1500;
    let running = false;
    let started = false;
    let timerId;

    const clamp = (value, max) => Math.min(max, Math.max(0, Number.isFinite(value) ? Math.floor(value) : 0));
    const configuredTotal = () => minutes * 60 + configuredSeconds;
    const formatClock = value => String(Math.floor(value / 60)).padStart(2, '0') + ':' + String(value % 60).padStart(2, '0');
    const formatDuration = value => {
      const mins = Math.floor(value / 60), secs = value % 60;
      if (!mins) return secs + '秒';
      if (!secs) return mins + '分';
      return mins + '分' + secs + '秒';
    };

    function render() {
      minuteInput.value = String(minutes);
      secondInput.value = String(configuredSeconds).padStart(2, '0');
      inputs.hidden = started;
      time.hidden = !started;
      time.textContent = formatClock(secondsLeft);
      label.textContent = started && secondsLeft === 0 ? '完了しました' : '集中タイム';
      primary.disabled = !running && secondsLeft <= 0;
      primary.textContent = running ? 'Ⅱ 一時停止' : started ? '▶ 再開する' : '▶ 集中を始める';
    }

    function stopInterval() {
      if (timerId) clearInterval(timerId);
      timerId = undefined;
    }

    function startTimer() {
      if (secondsLeft <= 0) return;
      started = true;
      running = true;
      stopInterval();
      timerId = setInterval(() => {
        secondsLeft = Math.max(0, secondsLeft - 1);
        if (secondsLeft === 0) {
          running = false;
          stopInterval();
        }
        render();
      }, 1000);
      render();
    }

    primary.addEventListener('click', () => {
      if (running) {
        running = false;
        stopInterval();
        render();
      } else {
        startTimer();
      }
    });

    reset.addEventListener('click', () => {
      running = false;
      started = false;
      stopInterval();
      secondsLeft = configuredTotal();
      render();
    });

    minuteInput.addEventListener('input', () => {
      minutes = clamp(Number(minuteInput.value), 999);
      secondsLeft = configuredTotal();
      render();
    });

    secondInput.addEventListener('input', () => {
      configuredSeconds = clamp(Number(secondInput.value), 59);
      secondsLeft = configuredTotal();
      render();
    });

    addButton.addEventListener('click', () => {
      addForm.hidden = false;
      sessionTitle.focus();
    });

    addForm.addEventListener('submit', event => {
      event.preventDefault();
      const title = sessionTitle.value.trim();
      if (!title) return;
      const li = document.createElement('li');
      li.dataset.title = title;
      const titleSpan = document.createElement('span');
      titleSpan.textContent = title;
      const durationSpan = document.createElement('span');
      durationSpan.className = 'session-duration';
      durationSpan.textContent = formatDuration(configuredTotal());
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'delete-session-button';
      remove.textContent = '×';
      remove.setAttribute('aria-label', title + 'を削除');
      li.append(titleSpan, durationSpan, remove);
      sessionList.append(li);
      sessionTitle.value = '';
      addForm.hidden = true;
    });

    sessionList.addEventListener('click', event => {
      const button = event.target.closest('.delete-session-button');
      if (button) button.closest('li')?.remove();
    });

    viewerNote.hidden = true;
    render();
  })();
  </script>
</body>
</html>
`;

await writeFile('artifact/timer-starter.html', html, 'utf8');
console.log('Generated artifact/timer-starter.html');
