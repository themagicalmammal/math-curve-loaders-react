import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    conditions: ['import', 'require', 'default'],
  },
  build: {
    rollupOptions: {
      input: [
        'index.html',
        'capture.html',
      ],
    },
  },
});
