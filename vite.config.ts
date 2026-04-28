// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Netlify serves from site root, while GitHub Pages needs the repo base path.
  base: process.env.NETLIFY === 'true' ? '/' : '/mjml-react-test/',
  build: { outDir: 'dist', target: 'esnext' },
});
