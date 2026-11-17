import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { fileURLToPath } from 'node:url';
import intigrisReact from './integrations/react/index.js';

/* Pages that exist but are switched off (not in the sitemap, noindex). See src/lib/drafts.js */
const DRAFT = ['/isa', '/nl/isa'];

export default defineConfig({
  site: 'https://www.intigris.nl',
  trailingSlash: 'ignore',
  build: { format: 'directory', concurrency: 1 },
  i18n: { defaultLocale: 'en', locales: ['en', 'nl'], routing: { prefixDefaultLocale: false } },
  integrations: [
    intigrisReact(),
    sitemap({
      filter: (page) => { const p = new URL(page).pathname.replace(/\/$/, ''); return !DRAFT.includes(p) && !/^(\/nl)?\/review(\/|$)/.test(p); },
      i18n: { defaultLocale: 'en', locales: { en: 'en', nl: 'nl' } },
    }),
  ],
  vite: {
    resolve: {
      /* island sources live in ./islands: always use this project's single copy of these */
      dedupe: ['react', 'react-dom', 'motion', 'framer-motion', 'clsx', 'tailwind-merge', 'gsap'],
      alias: { '@islands': fileURLToPath(new URL('./islands/src', import.meta.url)), '@': fileURLToPath(new URL('./islands/src', import.meta.url)) } },
  },
});
