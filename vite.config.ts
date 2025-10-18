import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // IMPORTANT: match your repo name
  base: '/mjml-react-test/',
  build: { outDir: 'dist', target: 'esnext' }
});
