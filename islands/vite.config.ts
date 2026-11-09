import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/* Builds all islands into one classic script + one stylesheet in ../islands-dist/.
   React and ReactDOM are NOT bundled: the site pages already load React 18 (UMD)
   as window.React / window.ReactDOM, so the islands reuse that single copy. */
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': new URL('./src', import.meta.url).pathname } },
  define: { 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production') },
  build: {
    outDir: '../islands-dist',
    emptyOutDir: true,
    cssCodeSplit: false,
    lib: {
      entry: 'src/main.tsx',
      name: 'IntigrisIslands',
      formats: ['iife'],
      fileName: () => 'islands.js',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react-dom/client'],
      output: {
        globals: { react: 'React', 'react-dom': 'ReactDOM', 'react-dom/client': 'ReactDOM' },
        assetFileNames: (a) => (a.name && a.name.endsWith('.css') ? 'islands.css' : 'assets/[name][extname]'),
      },
    },
  },
});
