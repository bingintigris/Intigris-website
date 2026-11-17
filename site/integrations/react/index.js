/* Minimal React 18 renderer for Astro (stand-in for @astrojs/react, which could not be
   installed offline on 2026-11-17). Renders React components to HTML at build time and
   hydrates them in the browser for client:* directives. Swap for @astrojs/react any time:
   `npm i @astrojs/react` and replace intigrisReact() in astro.config.mjs. */
import { fileURLToPath } from 'node:url';

export default function intigrisReact() {
  return {
    name: 'intigris-react',
    hooks: {
      'astro:config:setup': ({ addRenderer, updateConfig }) => {
        addRenderer({
          name: 'intigris-react',
          serverEntrypoint: fileURLToPath(new URL('./server.js', import.meta.url)),
          clientEntrypoint: fileURLToPath(new URL('./client.js', import.meta.url)),
        });
        updateConfig({
          vite: {
            esbuild: { jsx: 'automatic', jsxImportSource: 'react' },
            optimizeDeps: { include: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime', 'react/jsx-dev-runtime'] },
            ssr: { noExternal: [] },
          },
        });
      },
    },
  };
}
