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

Define each layout component in its own file under `src/layouts/custom/`, then register it in `src/layouts/userLayouts.js`.

```jsx
// src/layouts/custom/MyLayout.jsx
import dayjs from 'dayjs';
import { ClockDisplay } from '../../components/clock/ClockDisplay.jsx';

export function MyLayout({ now, weather, animateClock }) {
  const time = dayjs(now).format('hh:mm:ss');

  return (
    <section className="grid min-h-[100svh] place-items-center bg-zinc-950 text-white">
      <div className="text-center">
        <ClockDisplay value={time} animate={animateClock} className="text-8xl" />
        <p className="mt-4 text-2xl">{weather?.temperature ?? '--'} C</p>
      </div>
    </section>
  );
}
```

```js
// src/layouts/userLayouts.js
import { MyLayout } from './custom/MyLayout.jsx';

export const userLayouts = [
  {
    id: 'my-layout',
    name: 'My Layout',
    Component: MyLayout,
    animateClock: true,
    theme: {
      accent: '#2f7de1',
      backgroundStart: '#0b1424',
      background: '#080f1d',
      backgroundDeep: '#040913',
    },
  },
];
```

Your layout will be included automatically in the double-tap layout rotation.
Double-tap anywhere on the page to move to the next layout.
Set `animateClock` to `false` for layouts that should not animate clock digits.

## Weather Location

Edit `src/config.js` to change the Open-Meteo location.
