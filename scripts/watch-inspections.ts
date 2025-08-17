import chokidar from 'chokidar';
import { exec } from 'child_process';

console.log('[watch] build started');
const watcher = chokidar.watch([
  'common/src/grammar/regex.ts',
  'common/src/scoping.ts',
  'test/fixtures/',
  'scripts/build-inspections.ts',
], { ignoreInitial: true });

watcher.on('all', (event, path) => {
  console.log(`[watch] ${event}: ${path}`);
  exec('pnpm run build:inspections', (err, stdout, stderr) => {
    if (err) {
      console.error(stderr);
    } else {
      console.log(stdout);
    }
  });
});

console.log('[watch] build finished');
