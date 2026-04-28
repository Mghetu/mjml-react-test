// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Default to root for Netlify/static hosts. Override with VITE_PUBLIC_BASE when needed.
  base: process.env.VITE_PUBLIC_BASE || '/',
  build: { outDir: 'dist', target: 'esnext' },
});
