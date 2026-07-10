// ═══════════════════════════════════════════════════════════════
// Test DB helpers — seed data & cleanup for integration tests
// ═══════════════════════════════════════════════════════════════

import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

let _db: PrismaClient | null = null;

const TEST_DB_URL = process.env.DATABASE_URL || 'file:./prisma/test.db';

export async function getDb(): Promise<PrismaClient> {
  if (!_db) {
    const adapter = new PrismaLibSql({ url: TEST_DB_URL });
    _db = new PrismaClient({ adapter });
    await _db.$connect();
  }
  return _db;
}

export async function closeDb(): Promise<void> {
  if (_db) {
    await _db.$disconnect();
    _db = null;
  }
}

// ═══════════════════════════════════════════════════════════════
// Seed factory data for API route tests
// ═══════════════════════════════════════════════════════════════

export interface TestSeed {
  projectId: string;
  projectSlug: string;
  towerId: string;
  apartmentId: string;
}

export async function seedBasic(): Promise<TestSeed> {
  const db = await getDb();

  // Clean slate
  await db.$executeRawUnsafe('DELETE FROM ApartmentImage');
  await db.$executeRawUnsafe('DELETE FROM ApartmentVideo');
  await db.$executeRawUnsafe('DELETE FROM CostEstimate');
  await db.$executeRawUnsafe('DELETE FROM Apartment');
  await db.$executeRawUnsafe('DELETE FROM Tower');
  await db.$executeRawUnsafe('DELETE FROM ProjectImage');
  await db.$executeRawUnsafe('DELETE FROM Project');
  await db.$executeRawUnsafe('DELETE FROM User');
  await db.$executeRawUnsafe('DELETE FROM Session');
  await db.$executeRawUnsafe('DELETE FROM ActivityLog');

  // User (for auth tests)
  await db.user.create({
    data: {
      id: 'user-test-admin',
      email: 'admin@test.lumi',
      name: 'Test Admin',
      passwordHash: '$2a$10$dummy',
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });

  // User (SALES role for role-gate tests)
  await db.user.create({
    data: {
      id: 'user-test-sales',
      email: 'sales@test.lumi',
      name: 'Test Sales',
      passwordHash: '$2a$10$dummy',
      role: 'SALES',
      isActive: true,
    },
  });

  // Project
  const project = await db.project.create({
    data: {
      id: 'proj-test-1',
      slug: 'vinhome-grand-park',
      name: 'Vinhome Grand Park',
      shortDesc: 'Khu đô thị hiện đại',
      location: 'Quận 9, TP. Hồ Chí Minh',
      status: 'ACTIVE',
      order: 1,
    },
  });

  // Tower
  const tower = await db.tower.create({
    data: {
      id: 'tower-test-1',
      slug: 'r1-riviera',
      projectId: project.id,
      name: 'R1 - Riviera',
      floors: 25,
      status: 'ACTIVE',
      order: 1,
    },
  });

  // Apartment
  const apt = await db.apartment.create({
    data: {
      id: 'apt-test-1',
      slug: 'r1-15a-01',
      towerId: tower.id,
      code: 'R1-15A.01',
      floor: 15,
      unitNumber: '01',
      bedroomCount: 3,
      bathroomCount: 2,
      area: 85.5,
      direction: 'NAM',
      status: 'AVAILABLE',
      priceEstimate: 4_500_000_000,
    },
  });

  return {
    projectId: project.id,
    projectSlug: project.slug,
    towerId: tower.id,
    apartmentId: apt.id,
  };
}
