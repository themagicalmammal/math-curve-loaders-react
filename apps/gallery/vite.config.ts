import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readdirSync } from 'fs';
import { join } from 'path';

// Auto-discover capture-{name}.html files
const captureFiles = readdirSync(join(process.cwd(), '.')).filter(
  (f) => f.startsWith('capture-') && f.endsWith('.html'),
);

export default defineConfig({
  plugins: [react()],
  resolve: {
    conditions: ['import', 'require', 'default'],
  },
  build: {
    rollupOptions: {
      input: [
        'index.html',
        ...captureFiles,
      ],
    },
  },
});
