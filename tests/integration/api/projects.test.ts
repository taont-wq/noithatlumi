// ═══════════════════════════════════════════════════════════════
// Integration tests: GET /api/projects
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { seedBasic, closeDb, type TestSeed } from '../../helpers/db';
import { GET } from '@/app/api/projects/route';

let seed: TestSeed;

beforeAll(async () => {
  seed = await seedBasic();
});

afterAll(async () => {
  await closeDb();
});

describe('GET /api/projects', () => {
  it('returns all active projects with tower count', async () => {
    const request = new Request('http://localhost:3000/api/projects');
    const response = await GET(request);
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.data).toBeInstanceOf(Array);
    expect(body.data.length).toBeGreaterThanOrEqual(1);

    const project = body.data.find((p: any) => p.id === seed.projectId);
    expect(project).toBeDefined();
    expect(project.name).toBe('Vinhome Grand Park');
    expect(project.slug).toBe('vinhome-grand-park');
    expect(project.towerCount).toBe(1);
  });

  it('filters by status parameter', async () => {
    // Request with non-existent status filter
    const request = new Request('http://localhost:3000/api/projects?status=ARCHIVED');
    const response = await GET(request);
    expect(response.status).toBe(200);

    const body = await response.json();
    // Our test project is ACTIVE, so should not appear
    const found = body.data.find((p: any) => p.id === seed.projectId);
    expect(found).toBeUndefined();
  });

  it('returns correct response shape', async () => {
    const request = new Request('http://localhost:3000/api/projects');
    const response = await GET(request);
    const body = await response.json();

    for (const project of body.data) {
      expect(project).toHaveProperty('id');
      expect(project).toHaveProperty('slug');
      expect(project).toHaveProperty('name');
      expect(project).toHaveProperty('shortDesc');
      expect(project).toHaveProperty('location');
      expect(project).toHaveProperty('thumbnail');
      expect(project).toHaveProperty('towerCount');
    }
  });
});
