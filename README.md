# Desk Clock React

A Vite, React, and Tailwind CSS desk clock with:

- a large live clock
- date, weekday, and month
- Open-Meteo weather refresh every 15 minutes
- cached weather fallback when offline
- a service worker for offline app shell support
- double-tap anywhere to switch layouts, including your own

## Run

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:5173/`.

## Build

```bash
npm run build
```

## Add Your Own Layout

Define layout components in `src/userLayoutComponents.jsx`, then register them in `src/userLayouts.js`.

```jsx
// src/userLayoutComponents.jsx
export function MyLayout({ now, weather }) {
  return (
    <section className="grid min-h-[100svh] place-items-center bg-zinc-950 text-white">
      <div className="text-center">
        <h1 className="text-8xl font-black">{now.toLocaleTimeString()}</h1>
        <p className="mt-4 text-2xl">{weather?.temperature ?? '--'} C</p>
      </div>
    </section>
  );
}
```

```js
// src/userLayouts.js
import { MyLayout } from './userLayoutComponents.jsx';

export const userLayouts = [
  {
    id: 'my-layout',
    name: 'My Layout',
    Component: MyLayout,
  },
];
```

Your layout will appear automatically in the layout switcher.
Double-tap anywhere on the page to move to the next layout.

## Weather Location

Edit `src/config.js` to change the Open-Meteo location.
