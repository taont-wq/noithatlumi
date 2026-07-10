// ═══════════════════════════════════════════════════════════════
// Test DB bootstrap
// ═══════════════════════════════════════════════════════════════

import { execSync } from 'child_process';
import path from 'path';

const TEST_DB_PATH = path.resolve(__dirname, '../prisma/test.db');
const TEST_DB_URL = `file:${TEST_DB_PATH}`;

// Point app Prisma client to test DB (before any module imports it)
process.env.DATABASE_URL = TEST_DB_URL;

// Try to delete stale test DB; ignore if locked or missing
try {
  execSync(`del /f "${TEST_DB_PATH}" 2>nul`, { stdio: 'pipe' });
  execSync(`del /f "${TEST_DB_PATH}-wal" 2>nul`, { stdio: 'pipe' });
  execSync(`del /f "${TEST_DB_PATH}-shm" 2>nul`, { stdio: 'pipe' });
} catch { /* ignore */ }

// Push schema to test DB (creates fresh DB)
execSync('npx prisma db push --force-reset --accept-data-loss', {
  stdio: 'pipe',
  timeout: 30_000,
  env: { ...process.env, DATABASE_URL: TEST_DB_URL },
});
