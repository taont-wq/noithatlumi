import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
    exclude: ['tests/e2e/**', 'node_modules/**'],
    testTimeout: 30_000,
    hookTimeout: 30_000,
    // Serial test files to avoid DB concurrency issues
    fileParallelism: false,
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
});
