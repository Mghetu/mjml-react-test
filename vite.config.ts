// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/mjml-react-test/',        // must match your repo name
  build: { outDir: 'dist', target: 'esnext' },
  server: {
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
});
