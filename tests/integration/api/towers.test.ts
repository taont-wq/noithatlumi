// ═══════════════════════════════════════════════════════════════
// Integration tests: GET /api/towers
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { seedBasic, closeDb, type TestSeed } from '../../helpers/db';
import { GET } from '@/app/api/towers/route';

let seed: TestSeed;

beforeAll(async () => {
  seed = await seedBasic();
});

afterAll(async () => {
  await closeDb();
});

describe('GET /api/towers', () => {
  it('returns towers filtered by projectId', async () => {
    const url = `http://localhost:3000/api/towers?projectId=${seed.projectId}`;
    const request = new Request(url);
    const response = await GET(request);
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.data).toBeInstanceOf(Array);
    expect(body.data.length).toBe(1);

    const tower = body.data[0];
    expect(tower.id).toBe(seed.towerId);
    expect(tower.name).toBe('R1 - Riviera');
    expect(tower.apartmentCount).toBe(1);
  });

  it('returns empty array when no projectId given', async () => {
    const request = new Request('http://localhost:3000/api/towers');
    const response = await GET(request);
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.data).toEqual([]);
  });

  it('returns empty array for non-existent project', async () => {
    const url = 'http://localhost:3000/api/towers?projectId=nonexistent';
    const request = new Request(url);
    const response = await GET(request);
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.data).toEqual([]);
  });

  it('returns correct response shape', async () => {
    const url = `http://localhost:3000/api/towers?projectId=${seed.projectId}`;
    const request = new Request(url);
    const response = await GET(request);
    const body = await response.json();

    for (const tower of body.data) {
      expect(tower).toHaveProperty('id');
      expect(tower).toHaveProperty('slug');
      expect(tower).toHaveProperty('name');
      expect(tower).toHaveProperty('floor');
      expect(tower).toHaveProperty('apartmentCount');
    }
  });
});
