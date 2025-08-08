import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    include: ['test/unit/**/*.test.ts'],
    alias: {
      '@common': path.resolve(__dirname, './common/src'),
    },
  },
});
