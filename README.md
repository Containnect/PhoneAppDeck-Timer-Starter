# PhoneAppDeck Timer Starter

A small, mobile-first study timer for trying PhoneAppDeck. It uses React, TypeScript, Vite, and Capacitor, with no native APIs required for the web preview.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The web build is written to `dist`. To create a native project later, install the platform package and let Capacitor generate it:

```bash
npm install @capacitor/android # or @capacitor/ios
npx cap add android            # or npx cap add ios
```

Generated `android` and `ios` folders are intentionally ignored.

## Main components

- `Timer` owns the simple countdown state and accepts an optional session length.
- `TimerDisplay` formats a number of seconds for display.
- `TimerControls` contains touch-friendly Start, Pause, and Reset actions.
- `HomePage` arranges the components into the starter screen.

Each component has small, typed props and useful defaults, so it can be opened and modified independently in Component Preview.
