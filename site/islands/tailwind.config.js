/** Tailwind for the islands only.
 *  - important: '.tw' scopes every utility under an element with class "tw" (each island root),
 *    so Tailwind can never restyle the rest of the site (site.css stays in charge there).
 *  - preflight off: no global reset.
 *  - Intigris brand tokens (Brandbook 2023) as colours and font. */
export default {
  content: ['./src/**/*.{ts,tsx}'],
  important: '.tw',
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        coral: { DEFAULT: '#ff5f36', 700: '#d9451f', 100: '#ffe3da' },
        brown: { DEFAULT: '#402301', 700: '#2b1700', chocolate: '#6c2a05' },
        cream: { DEFAULT: '#fcf7eb' },
        sky: { soft: '#9ab8e2' },
        moss: { DEFAULT: '#4c693a' },
        sf: { DEFAULT: '#0176d3', light: '#1b96ff' },
      },
      fontFamily: { sans: ['"Inter Tight"', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};
