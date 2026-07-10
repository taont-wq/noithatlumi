// ═══════════════════════════════════════════════════════════════
// Unit tests: Error helpers (src/lib/api/error.ts)
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect } from 'vitest';

// We import via path alias (@/lib/api/error)
import { apiError, tryApi } from '@/lib/api/error';

describe('apiError', () => {
  it('returns 404 for NOT_FOUND', async () => {
    const res = apiError('NOT_FOUND');
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toBe('NOT_FOUND');
    expect(body.message).toContain('not found');
  });

  it('returns 500 for INTERNAL_ERROR', async () => {
    const res = apiError('INTERNAL_ERROR');
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe('INTERNAL_ERROR');
  });

  it('returns 429 for RATE_LIMITED', async () => {
    const res = apiError('RATE_LIMITED');
    expect(res.status).toBe(429);
  });

  it('returns 400 for VALIDATION_ERROR', async () => {
    const res = apiError('VALIDATION_ERROR');
    expect(res.status).toBe(400);
  });

  it('returns 401 for UNAUTHORIZED', async () => {
    const res = apiError('UNAUTHORIZED');
    expect(res.status).toBe(401);
  });

  it('returns 403 for FORBIDDEN', async () => {
    const res = apiError('FORBIDDEN');
    expect(res.status).toBe(403);
  });

  it('returns 409 for CONFLICT', async () => {
    const res = apiError('CONFLICT');
    expect(res.status).toBe(409);
  });

  it('accepts custom message', async () => {
    const res = apiError('NOT_FOUND', 'Project not found');
    const body = await res.json();
    expect(body.message).toBe('Project not found');
  });

  it('includes details when provided', async () => {
    const details = { field: 'slug', reason: 'already taken' };
    const res = apiError('VALIDATION_ERROR', undefined, details);
    const body = await res.json();
    expect(body.details).toEqual(details);
  });
});

describe('tryApi', () => {
  it('returns handler response on success', async () => {
    const handler = async () => new Response('ok', { status: 200 });
    const wrapped = tryApi(handler);
    const res = await wrapped(new Request('http://test.com'));
    expect(res.status).toBe(200);
    expect(await res.text()).toBe('ok');
  });

  it('returns 500 when handler throws', async () => {
    const handler = async () => { throw new Error('boom'); };
    const wrapped = tryApi(handler);
    const res = await wrapped(new Request('http://test.com'));
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe('INTERNAL_ERROR');
  });
});
