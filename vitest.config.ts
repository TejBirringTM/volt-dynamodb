import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        '**/*.config.ts',
        '**/*.test.ts',
        '**/*.spec.ts',
        'dist/**',
        '**/__tests__/**',
        '**/__mocks__/**',
        '**/node_modules/**',
      ],
    },
  },
});
