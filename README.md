# Jua Exchange — Homepage Redesign

A redesign of the [Jua Exchange](https://www.jua.exchange) homepage: an African prediction market for elections, sports, crypto and more.

The goal was a homepage that takes people straight into live markets while staying approachable for someone who has never traded: every probability is explained in plain language, and every market shows what a stake would pay out.

## Highlights

- **Hero stage.** One featured market at a time, with the chance as a large rolling number, a plain-English reading ("Traders lean towards yes, but it is close"), and a payout calculator (stake → what you get back). A picture carousel cycles five markets and pauses on hover or focus.
- **Custom chart engine** (SVG + `requestAnimationFrame`, no chart library):
  - draw-in led by a glowing head, with the area fill sweeping in behind it;
  - timeframe changes *morph* lines into their new shape instead of redrawing;
  - spring-smoothed scrubbing: the past stays lit and the future dims, with values rolling to the hovered point;
  - y-axis fitted to the data, pulsing live endpoints, and an end-of-line value tag on the selected outcome.
- **Multi-outcome markets.** Candidates are listed with photos and animated bars; selecting one re-targets the headline number, trend, payout and chart line.
- **Illustrated covers.** Every market has SVG cover art (flags, skylines, coins, pitches) as a base layer, with the market photo on top when it loads.
- **Market grid** with animated chance rings, sparklines, payout hints, working search (`/` to focus) and category filters.
- **Light and dark themes**, a KES / USDC currency switch and saved markets, all persisted in `localStorage`.
- **Responsive.** Dedicated mobile layout with a floating tab bar. Respects `prefers-reduced-motion`.

## Tech

- [React 18](https://react.dev) + TypeScript
- [Vite](https://vitejs.dev) for dev server and build
- Plain CSS with design tokens (custom properties) for theming; no UI framework
- Fonts: Poppins (display) and Geist (text) from Google Fonts

## Getting started

```sh
npm install
npm run dev       # start the dev server
npm run build     # type-check and build to dist/
npm run preview   # serve the production build
```

## Project structure

```
src/
  App.tsx              Page composition, filters, search, persisted settings
  data.ts              Markets, categories, topics, FAQ, candidate photos
  chart.ts             Price-history simulation, path building, axis maths
  art.tsx              Illustrated market covers and avatars
  format.ts            KES / USDC price and volume formatting
  hooks.ts             Persistent state, media query, element size
  styles.css           Design tokens, themes and all component styles
  components/
    Hero.tsx           Featured-market stage, payout calculator, carousel
    Chart.tsx          Animated, scrubbable probability chart and sparkline
    Header.tsx         Promo banner, navigation, category bar
    Sections.tsx       Market cards, how it works, hot topics, FAQ, footer
    RollingNumber.tsx  Odometer-style animated numbers
    icons.tsx          Logo and icon set
```

## Notes

- Market data and price history are static sample data shaped like the live site; the history is generated deterministically so each market always draws the same line.
- Candidate photos are loaded from Wikimedia Commons (credits shown on hover); avatars fall back to initials if a photo is unavailable.
- Market cover photos load from Jua's public image storage and fall back to the illustrated covers.
