import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Enable Vitest globals
    environment: 'jsdom', // Use jsdom environment for browser-like testing
    setupFiles: './test/setup.js', // Optional setup file
  },
});