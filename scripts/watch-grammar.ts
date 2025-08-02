import chokidar from 'chokidar';
import { exec } from 'child_process';

console.log('[watch] build started');
const watcher = chokidar.watch('syntaxes/org.tmLanguage.yaml', { ignoreInitial: true });

watcher.on('all', () => {
  exec('pnpm run build:grammar', (err, stdout, stderr) => {
    if (err) {
      console.error(stderr);
    } else {
      console.log(stdout);
    }
  });
});

console.log('[watch] build finished');
