/** Production seed script (runs with plain `node`).
 *  Creates admin user + sample project/tower/apartment.
 *  Idempotent — safe to run on every deploy.
 */

const { PrismaClient } = require('@prisma/client');
const { PrismaLibSql } = require('@prisma/adapter-libsql');
const bcrypt = require('bcryptjs');

const url = process.env.DATABASE_URL || 'file:./prisma/dev.db';
const adapter = new PrismaLibSql({ url });
const prisma = new PrismaClient({ adapter });

async function seed() {
  // Admin user
  const adminEmail = 'admin@lumi.design';
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existing) {
    const hash = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Admin',
        passwordHash: hash,
        role: 'SUPER_ADMIN',
        isActive: true,
      },
    });
    console.log('  ✓ Admin user created');
  } else {
    console.log('  - Admin user exists');
  }

  // Sample project (only if DB is completely empty)
  const projectCount = await prisma.project.count();
  if (projectCount === 0) {
    const project = await prisma.project.create({
      data: {
        slug: 'vinhome-grand-park',
        name: 'Vinhome Grand Park',
        shortDesc: 'Khu đô thị hiện đại tại Quận 9',
        location: 'Quận 9, TP. Hồ Chí Minh',
        status: 'ACTIVE',
        order: 1,
      },
    });
    console.log('  ✓ Sample project created');

    const tower = await prisma.tower.create({
      data: {
        slug: 'r1-riviera',
        projectId: project.id,
        name: 'R1 - Riviera',
        floors: 25,
        status: 'ACTIVE',
        order: 1,
      },
    });
    console.log('  ✓ Sample tower created');

    await prisma.apartment.create({
      data: {
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
    console.log('  ✓ Sample apartment created');
  } else {
    console.log(`  - ${projectCount} projects exist, skipping sample data`);
  }
}

seed()
  .then(() => {
    console.log('✅ Seed complete');
    process.exit(0);
  })
  .catch((e) => {
    console.error('❌ Seed failed:', e.message);
    process.exit(1);
  });
