// ═══════════════════════════════════════════════════════════════
// Unit tests: Rate limiter (src/lib/api/rate-limit.ts)
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { rateLimit } from '@/lib/api/rate-limit';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('rateLimit', () => {
  it('allows first request', async () => {
    const result = await rateLimit('ip-1', { max: 5, windowMs: 60_000 });
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it('allows requests within limit', async () => {
    for (let i = 0; i < 4; i++) {
      const r = await rateLimit('ip-2', { max: 5, windowMs: 60_000 });
      expect(r.success).toBe(true);
    }
    const last = await rateLimit('ip-2', { max: 5, windowMs: 60_000 });
    expect(last.success).toBe(true);
    expect(last.remaining).toBe(0);
  });

  it('blocks request exceeding limit', async () => {
    for (let i = 0; i < 5; i++) {
      await rateLimit('ip-3', { max: 5, windowMs: 60_000 });
    }
    const blocked = await rateLimit('ip-3', { max: 5, windowMs: 60_000 });
    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it('resets after window expires', async () => {
    await rateLimit('ip-4', { max: 2, windowMs: 60_000 });
    await rateLimit('ip-4', { max: 2, windowMs: 60_000 });

    const blocked = await rateLimit('ip-4', { max: 2, windowMs: 60_000 });
    expect(blocked.success).toBe(false);

    // Advance time past window
    vi.advanceTimersByTime(60_001);

    const reset = await rateLimit('ip-4', { max: 2, windowMs: 60_000 });
    expect(reset.success).toBe(true);
    expect(reset.remaining).toBe(1);
  });

  it('tracks different identifiers independently', async () => {
    for (let i = 0; i < 3; i++) {
      await rateLimit('ip-heavy', { max: 3, windowMs: 60_000 });
    }

    // Different IP should still be allowed
    const result = await rateLimit('ip-light', { max: 3, windowMs: 60_000 });
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(2);
  });

  it('uses defaults when no options given', async () => {
    // Default max is 100
    for (let i = 0; i < 100; i++) {
      await rateLimit('default-ip');
    }
    const result = await rateLimit('default-ip');
    expect(result.success).toBe(false);
  });
});
