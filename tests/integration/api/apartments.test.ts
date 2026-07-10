// ═══════════════════════════════════════════════════════════════
// Integration tests: GET /api/apartments
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { seedBasic, getDb, closeDb, type TestSeed } from '../../helpers/db';
import { GET } from '@/app/api/apartments/route';

let seed: TestSeed;

beforeAll(async () => {
  seed = await seedBasic();
});

afterAll(async () => {
  await closeDb();
});

describe('GET /api/apartments', () => {
  it('returns apartments filtered by towerId', async () => {
    const url = `http://localhost:3000/api/apartments?towerId=${seed.towerId}`;
    const request = new Request(url);
    const response = await GET(request);
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.data).toBeInstanceOf(Array);
    expect(body.data.length).toBe(1);

    const apt = body.data[0];
    expect(apt.id).toBe(seed.apartmentId);
    expect(apt.code).toBe('R1-15A.01');
    expect(apt.bedroomCount).toBe(3);
    expect(apt.priceEstimate).toBe(4_500_000_000);
  });

  it('returns all apartments when no towerId given', async () => {
    const request = new Request('http://localhost:3000/api/apartments');
    const response = await GET(request);
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.data).toBeInstanceOf(Array);
    expect(body.data.length).toBeGreaterThanOrEqual(1);
    expect(body).toHaveProperty('total');
    expect(body).toHaveProperty('page');
    expect(body).toHaveProperty('pageSize');
  });

  it('returns empty array for non-existent tower', async () => {
    const url = 'http://localhost:3000/api/apartments?towerId=nonexistent';
    const request = new Request(url);
    const response = await GET(request);
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.data).toEqual([]);
  });

  it('filters by status when provided', async () => {
    // Add an apartment with different status
    const db = await getDb();
    await db.apartment.create({
      data: {
        id: 'apt-test-sold',
        slug: 'r1-10b-02',
        towerId: seed.towerId,
        code: 'R1-10B.02',
        status: 'SOLD',
        bedroomCount: 2,
      },
    });

    // Filter by AVAILABLE status
    const url = `http://localhost:3000/api/apartments?towerId=${seed.towerId}&status=AVAILABLE`;
    const request = new Request(url);
    const response = await GET(request);
    const body = await response.json();
    expect(body.data.length).toBe(1);
    expect(body.data[0].status).toBe('AVAILABLE');
  });

  it('returns correct response shape', async () => {
    const url = `http://localhost:3000/api/apartments?towerId=${seed.towerId}`;
    const request = new Request(url);
    const response = await GET(request);
    const body = await response.json();

    for (const apt of body.data) {
      expect(apt).toHaveProperty('id');
      expect(apt).toHaveProperty('slug');
      expect(apt).toHaveProperty('code');
      expect(apt).toHaveProperty('floor');
      expect(apt).toHaveProperty('bedroomCount');
      expect(apt).toHaveProperty('bathroomCount');
      expect(apt).toHaveProperty('area');
      expect(apt).toHaveProperty('direction');
      expect(apt).toHaveProperty('status');
      expect(apt).toHaveProperty('priceEstimate');
    }
  });
});
