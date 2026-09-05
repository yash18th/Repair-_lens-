import fs from 'fs';
import path from 'path';
import chokidar from 'chokidar';
import { spawn } from 'child_process';

const repoRoot = process.cwd();
const debounceMs = 5000;
const watcherLockFile = path.join(repoRoot, '.watch-deploy.lock');
let debounceTimer = null;

function ensureSingleWatcher() {
  if (fs.existsSync(watcherLockFile)) {
    const existingPid = fs.readFileSync(watcherLockFile, 'utf8').trim();
    if (existingPid && Number.isInteger(Number(existingPid))) {
      try {
        process.kill(Number(existingPid), 0);
        console.log(`[watch-deploy] Watcher already running with PID ${existingPid}. Exiting.`);
        process.exit(0);
      } catch (error) {
        fs.rmSync(watcherLockFile, { force: true });
      }
    }
  }

  fs.writeFileSync(watcherLockFile, String(process.pid));
  process.on('exit', () => {
    fs.rmSync(watcherLockFile, { force: true });
  });
}

function isIgnored(filePath) {
  const normalized = filePath.split(path.sep).join('/');
  const patterns = [
    '/node_modules/',
    '/.git/',
    '/dist/',
    '/.vercel/',
    '/coverage/',
    '/secrets/',
    '/.env',
    '/.env.',
    'node_modules/',
    '.env',
    '.env.',
    '.log',
    '.tmp',
    '.temp',
    '.swp',
    '.bak',
    '.orig',
    '.rej',
    '.pem',
    '.key',
    '.crt',
  ];

  return patterns.some((pattern) => normalized.includes(pattern));
}

function scheduleDeploy() {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(() => {
    debounceTimer = null;
    console.log('[watch-deploy] Idle for 5s. Starting deployment check...');

    const deployProcess = spawn('bash', ['./auto-deploy.sh'], {
      cwd: repoRoot,
      stdio: 'inherit',
      env: process.env,
    });

    deployProcess.on('exit', (code) => {
      if (code === 0) {
        console.log('[watch-deploy] Deployment check completed.');
      } else {
        console.error('[watch-deploy] Deployment check failed with exit code', code);
      }
    });
  }, debounceMs);
}

function main() {
  ensureSingleWatcher();

  const watchedPaths = [
    path.join(repoRoot, 'src'),
    path.join(repoRoot, 'server'),
    path.join(repoRoot, 'prisma'),
    path.join(repoRoot, 'public'),
    path.join(repoRoot, 'package.json'),
    path.join(repoRoot, 'package-lock.json'),
    path.join(repoRoot, 'vite.config.js'),
    path.join(repoRoot, 'vite.config.mjs'),
    path.join(repoRoot, 'vite.config.ts'),
    path.join(repoRoot, 'index.html'),
    path.join(repoRoot, 'tailwind.config.js'),
    path.join(repoRoot, 'postcss.config.js'),
  ].filter((entry) => fs.existsSync(entry));

  if (watchedPaths.length === 0) {
    console.warn('[watch-deploy] No watched app files found. Watching repo root with ignores applied instead.');
  }

  const watcher = chokidar.watch(watchedPaths.length > 0 ? watchedPaths : repoRoot, {
    persistent: true,
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: 2000,
      pollInterval: 100,
    },
    ignored: (targetPath) => {
      if (!targetPath) {
        return true;
      }
      return isIgnored(targetPath);
    },
  });

  watcher.on('add', scheduleDeploy);
  watcher.on('change', scheduleDeploy);
  watcher.on('unlink', scheduleDeploy);
  watcher.on('error', (error) => {
    console.error('[watch-deploy] File watcher error:', error);
  });

  console.log('[watch-deploy] Watching RepairLens for source and config changes...');
  console.log('[watch-deploy] Debounce: 5 seconds');
  console.log('[watch-deploy] Ignoring: node_modules, dist, .git, .vercel, .env, secrets, generated files');

  process.on('SIGINT', () => {
    console.log('\n[watch-deploy] Stopping watcher...');
    watcher.close();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\n[watch-deploy] Stopping watcher...');
    watcher.close();
    process.exit(0);
  });
}

main();
