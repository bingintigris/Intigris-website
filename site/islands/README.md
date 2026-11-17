# Islands: interactive sections with Vite + React + TypeScript + Tailwind

The public site is static HTML (React UMD + in-browser Babel, `components/*.jsx`).
This folder adds a small build step **only for new interactive sections** ("islands"),
so we can use Tailwind, TypeScript and npm packages (motion, GSAP plugins, Aceternity /
Magic UI / React Bits / 21st components) without rebuilding the whole site. Decided
by Bing on 2026-11-09 as a trial; if it doesn't work out, the site moves fully to Vite or Astro.

## How it works
- `npm run build` (here) → `../islands-dist/islands.js` + `islands.css`. **These built files are committed**,
  so Netlify serves them without a build step (Netlify settings are unchanged).
- React is not bundled: the islands reuse the page's React 18 (`window.React` / `window.ReactDOM`).
- Tailwind is scoped: every utility only works inside an element with class `tw` (each island root);
  no preflight/reset. Brand colours: `coral`, `brown`, `cream`, `sky-soft`, `moss`, `sf`.
- Use on a page:
  ```html
  <link rel="stylesheet" href="islands-dist/islands.css?v=…">
  <script src="islands-dist/islands.js?v=…"></script>
  <script type="text/babel" src="components/Island.jsx"></script>
  ```
  and in JSX: `<Island name="demo" props={{ title: '…' }} />`.

## Add an island
1. Create `src/islands/MyThing.tsx` (export a React component).
2. Register it in `src/main.tsx` (`ISLANDS = { …, myThing: MyThing }`).
3. `npm run build`, bump the `?v=` on the page, commit `islands-dist/` too.

`npm run dev` rebuilds on every save (watch mode); preview via the normal localhost server.
Test page: `IslandsTest.html`.
