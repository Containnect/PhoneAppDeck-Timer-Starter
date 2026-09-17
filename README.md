# PhoneAppDeck Timer Starter

A small, mobile-first study timer for trying PhoneAppDeck. It uses only React, TypeScript, and Vite, with no backend or native APIs required for the browser preview.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The web build is written to `dist`.

## Main components

- `Timer` owns the countdown state and interval lifecycle, and accepts an optional session length.
- `TimerDisplay` formats a number of seconds for display.
- `TimerControls` contains touch-friendly Start, Pause, and Reset actions.
- `HomePage` arranges the components into the starter screen.

Each component has small, typed props and useful defaults, so it can be opened and modified independently in Component Preview. In particular, `Timer.tsx` can render on its own without a router, provider, backend, or native runtime.
