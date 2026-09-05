import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const repoRoot = process.cwd();
const deployLockFile = path.join(repoRoot, '.autodeploy.lock');

function cleanupLock() {
  try {
    const currentPid = fs.readFileSync(deployLockFile, 'utf8').trim();
    if (currentPid === String(process.pid)) {
      fs.rmSync(deployLockFile, { force: true });
    }
  } catch (error) {
    // Lock is already absent or stale.
  }
}

function isProcessRunning(pid) {
  try {
    process.kill(Number(pid), 0);
    return true;
  } catch (error) {
    return false;
  }
}

function ensureNotAlreadyRunning() {
  if (fs.existsSync(deployLockFile)) {
    const pidText = fs.readFileSync(deployLockFile, 'utf8').trim();
    if (pidText) {
      if (isProcessRunning(pidText)) {
        console.error(`[auto-deploy] Another deployment is already running under PID ${pidText}.`);
        process.exit(1);
      }
      fs.rmSync(deployLockFile, { force: true });
    }
  }

  fs.writeFileSync(deployLockFile, String(process.pid));
  process.on('exit', cleanupLock);
  process.on('SIGINT', () => {
    cleanupLock();
    process.exit(130);
  });
  process.on('SIGTERM', () => {
    cleanupLock();
    process.exit(143);
  });
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    stdio: options.stdio || 'inherit',
    env: process.env,
    shell: false,
  });

  if (result.error) {
    console.error(`[auto-deploy] ${result.error.message}`);
    process.exit(1);
  }

  return result.status === 0;
}

function getGitStatus() {
  const result = spawnSync('git', ['status', '--porcelain'], {
    cwd: repoRoot,
    encoding: 'utf8',
    env: process.env,
  });

  if (result.status !== 0) {
    console.error('[auto-deploy] Unable to read git status.');
    process.exit(1);
  }

  return result.stdout.trim();
}

function ensureNoSensitiveChanges() {
  const status = getGitStatus();
  if (!status) {
    return;
  }

  const blocked = status
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => {
      const normalized = line.toLowerCase();
      return (
        normalized.includes('.env') ||
        normalized.includes('secret') ||
        normalized.includes('jwt') ||
        normalized.includes('database_url') ||
        normalized.includes('api_key') ||
        normalized.includes('password') ||
        normalized.includes('private_key') ||
        normalized.includes('token') ||
        normalized.includes('.pem') ||
        normalized.includes('.key') ||
        normalized.includes('.crt')
      );
    });

  if (blocked.length > 0) {
    console.error('[auto-deploy] Secret-like files are present in the working tree. Refusing to deploy.');
    console.error(blocked.join('\n'));
    process.exit(1);
  }
}

function gitAddAll() {
  const result = spawnSync('git', ['add', '-A'], {
    cwd: repoRoot,
    stdio: 'inherit',
    env: process.env,
  });

  if (result.status !== 0) {
    console.error('[auto-deploy] git add -A failed.');
    process.exit(1);
  }
}

function hasStagedChanges() {
  const result = spawnSync('git', ['diff', '--cached', '--quiet'], {
    cwd: repoRoot,
    stdio: 'ignore',
    env: process.env,
  });

  return result.status === 1;
}

function main() {
  ensureNotAlreadyRunning();

  const statusBefore = getGitStatus();
  if (!statusBefore) {
    console.log('[auto-deploy] No repository changes detected. Nothing to deploy.');
    return;
  }

  ensureNoSensitiveChanges();

  console.log('[auto-deploy] Running build validation...');
  if (!run('npm', ['run', 'build'])) {
    console.error('[auto-deploy] Build failed. Deployment cancelled.');
    process.exit(1);
  }

  gitAddAll();

  if (!hasStagedChanges()) {
    console.log('[auto-deploy] No staged changes after git add -A. Nothing to deploy.');
    return;
  }

  const timestamp = new Date().toISOString();
  const commitMessage = `chore: auto-deploy ${timestamp}`;

  console.log('[auto-deploy] Creating commit...');
  const commitResult = spawnSync('git', ['commit', '-m', commitMessage], {
    cwd: repoRoot,
    stdio: 'inherit',
    env: process.env,
  });

  if (commitResult.status !== 0) {
    console.log('[auto-deploy] Commit not created because there were no staged changes or git identity is missing.');
    return;
  }

  console.log('[auto-deploy] Pushing to GitHub main...');
  if (!run('git', ['push', 'origin', 'main'])) {
    console.error('[auto-deploy] git push origin main failed. GitHub was not updated.');
    process.exit(1);
  }

  console.log('[auto-deploy] Deployment push completed successfully. Vercel will build from GitHub main.');
}

main();
