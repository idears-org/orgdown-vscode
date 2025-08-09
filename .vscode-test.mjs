import { defineConfig } from '@vscode/test-cli';

export default defineConfig({
	files: 'test/integration/**/*.test.ts',
	version: 'insiders',
	mocha: {
		ui: 'tdd',
		timeout: 600000, // 10 minutes to allow for debugging
		require: ['ts-node/register'],
	},
});
