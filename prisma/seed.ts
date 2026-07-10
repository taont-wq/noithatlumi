import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { hash } from 'bcryptjs';

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // ─── USERS ──────────────────────────────────────────
  const adminPassword = await hash('admin123', 12);
  const salePassword = await hash('sale123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@lumi.design' },
    update: {},
    create: {
      email: 'admin@lumi.design',
      name: 'Admin Lumi',
      passwordHash: adminPassword,
      role: 'SUPER_ADMIN',
      phone: '058 929 4444',
    },
  });

  await prisma.user.upsert({
    where: { email: 'sale@lumi.design' },
    update: {},
    create: {
      email: 'sale@lumi.design',
      name: 'Sale Lumi',
      passwordHash: salePassword,
      role: 'SALES',
      phone: '083 555 7878',
    },
  });

  // ─── PROJECTS ───────────────────────────────────────
  const oceanPark = await prisma.project.upsert({
    where: { slug: 'vinhomes-ocean-park' },
    update: {},
    create: {
      slug: 'vinhomes-ocean-park',
      name: 'Vinhomes Ocean Park',
      shortDesc: 'Khu đô thị ven biển đẳng cấp tại Gia Lâm, Hà Nội',
      location: 'Gia Lâm, Hà Nội',
      developer: 'Vingroup',
      status: 'ACTIVE',
      order: 1,
    },
  });

  const smartCity = await prisma.project.upsert({
    where: { slug: 'vinhomes-smart-city' },
    update: {},
    create: {
      slug: 'vinhomes-smart-city',
      name: 'Vinhomes Smart City',
      shortDesc: 'Khu đô thị thông minh tại Tây Mỗ, Nam Từ Liêm',
      location: 'Nam Từ Liêm, Hà Nội',
      developer: 'Vingroup',
      status: 'ACTIVE',
      order: 2,
    },
  });

  const ecopark = await prisma.project.upsert({
    where: { slug: 'ecopark' },
    update: {},
    create: {
      slug: 'ecopark',
      name: 'Ecopark',
      shortDesc: 'Khu đô thị sinh thái xanh tại Hưng Yên',
      location: 'Văn Giang, Hưng Yên',
      developer: 'Ecopark Group',
      status: 'ACTIVE',
      order: 3,
    },
  });

  // ─── TOWERS ─────────────────────────────────────────
  const towers = await Promise.all([
    prisma.tower.upsert({
      where: { slug: 'a3-pavilion' },
      update: {},
      create: {
        slug: 'a3-pavilion',
        projectId: oceanPark.id,
        name: 'Tòa A3 - Phân khu Pavilion',
        floors: 25,
        unitsPerFloor: 8,
        status: 'ACTIVE',
        order: 1,
      },
    }),
    prisma.tower.upsert({
      where: { slug: 'zr1-zurich' },
      update: {},
      create: {
        slug: 'zr1-zurich',
        projectId: oceanPark.id,
        name: 'Tòa ZR1 - Phân khu Zurich',
        address: 'Shop chân đế Zurich 1',
        floors: 20,
        unitsPerFloor: 6,
        status: 'ACTIVE',
        order: 2,
      },
    }),
    prisma.tower.upsert({
      where: { slug: 'sa5-sakura' },
      update: {},
      create: {
        slug: 'sa5-sakura',
        projectId: smartCity.id,
        name: 'Tòa SA5 - The Sakura',
        floors: 30,
        unitsPerFloor: 10,
        status: 'ACTIVE',
        order: 1,
      },
    }),
    prisma.tower.upsert({
      where: { slug: 'a3-smart-city' },
      update: {},
      create: {
        slug: 'a3-smart-city',
        projectId: smartCity.id,
        name: 'Tòa A3 - Smart City',
        floors: 25,
        unitsPerFloor: 8,
        status: 'ACTIVE',
        order: 2,
      },
    }),
    prisma.tower.upsert({
      where: { slug: 'sf3-skyforest' },
      update: {},
      create: {
        slug: 'sf3-skyforest',
        projectId: ecopark.id,
        name: 'Tòa SF3 - Skyforest',
        floors: 22,
        unitsPerFloor: 6,
        status: 'ACTIVE',
        order: 1,
      },
    }),
    prisma.tower.upsert({
      where: { slug: 'l1-ecopark' },
      update: {},
      create: {
        slug: 'l1-ecopark',
        projectId: ecopark.id,
        name: 'Tòa L1 - Ecopark',
        floors: 18,
        unitsPerFloor: 4,
        status: 'ACTIVE',
        order: 2,
      },
    }),
  ]);

  // ─── APARTMENTS ─────────────────────────────────────
  const apartmentsData = [
    // Ocean Park - A3 Pavilion
    { code: 'A3 0703', floor: 7, unitNumber: '0703', bedroomCount: 2, bathroomCount: 2, area: 72, direction: 'EAST', layoutType: '2PN', status: 'AVAILABLE', towerIdx: 0 },
    { code: 'A3 0806', floor: 8, unitNumber: '0806', bedroomCount: 2, bathroomCount: 1, area: 68, direction: 'SOUTHWEST', layoutType: '2PN', status: 'DESIGNING', towerIdx: 0 },
    { code: 'A3 1205', floor: 12, unitNumber: '1205', bedroomCount: 3, bathroomCount: 2, area: 95, direction: 'SOUTH', layoutType: '3PN', status: 'AVAILABLE', towerIdx: 0 },
    { code: 'A3 1502', floor: 15, unitNumber: '1502', bedroomCount: 1, bathroomCount: 1, area: 52, direction: 'NORTHEAST', layoutType: '1PN+', status: 'COMPLETED', towerIdx: 0 },
    // Ocean Park - ZR1 Zurich
    { code: 'ZR1 0311', floor: 3, unitNumber: '0311', bedroomCount: 2, bathroomCount: 1, area: 65, direction: 'WEST', layoutType: '2PN', status: 'AVAILABLE', towerIdx: 1 },
    { code: 'ZR1 0705', floor: 7, unitNumber: '0705', bedroomCount: 2, bathroomCount: 2, area: 78, direction: 'SOUTHEAST', layoutType: '2PN', status: 'RESERVED', towerIdx: 1 },
    { code: 'ZR1 1624', floor: 16, unitNumber: '1624', bedroomCount: 3, bathroomCount: 2, area: 110, direction: 'SOUTH', layoutType: '3PN', status: 'AVAILABLE', towerIdx: 1 },
    // Smart City - SA5 Sakura
    { code: 'SA5 0801', floor: 8, unitNumber: '0801', bedroomCount: 2, bathroomCount: 1, area: 70, direction: 'EAST', layoutType: '2PN', status: 'AVAILABLE', towerIdx: 2 },
    { code: 'SA5 1203', floor: 12, unitNumber: '1203', bedroomCount: 1, bathroomCount: 1, area: 48, direction: 'WEST', layoutType: 'Studio', status: 'AVAILABLE', towerIdx: 2 },
    // Smart City - A3
    { code: 'SC-A3 0703', floor: 7, unitNumber: '0703', bedroomCount: 2, bathroomCount: 2, area: 75, direction: 'EAST', layoutType: '2PN', status: 'AVAILABLE', towerIdx: 3 },
    { code: 'SC-A3 1001', floor: 10, unitNumber: '1001', bedroomCount: 3, bathroomCount: 2, area: 98, direction: 'SOUTH', layoutType: '3PN', status: 'DESIGNING', towerIdx: 3 },
    // Ecopark - SF3 Skyforest
    { code: 'SF3 0502', floor: 5, unitNumber: '0502', bedroomCount: 2, bathroomCount: 2, area: 82, direction: 'SOUTHEAST', layoutType: '2PN', status: 'AVAILABLE', towerIdx: 4 },
    { code: 'SF3 1008', floor: 10, unitNumber: '1008', bedroomCount: 3, bathroomCount: 2, area: 105, direction: 'SOUTH', layoutType: '3PN', status: 'COMPLETED', towerIdx: 4 },
    // Ecopark - L1
    { code: 'L1 0604', floor: 6, unitNumber: '0604', bedroomCount: 2, bathroomCount: 1, area: 68, direction: 'NORTHWEST', layoutType: '2PN+', status: 'AVAILABLE', towerIdx: 5 },
    { code: 'L1 0901', floor: 9, unitNumber: '0901', bedroomCount: 3, bathroomCount: 2, area: 92, direction: 'EAST', layoutType: '3PN', status: 'SOLD', towerIdx: 5 },
  ];

  for (const apt of apartmentsData) {
    const slug = `${towers[apt.towerIdx].slug}-${apt.unitNumber}`;
    const towerId = towers[apt.towerIdx].id;
    
    await prisma.apartment.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        towerId,
        code: apt.code,
        floor: apt.floor,
        unitNumber: apt.unitNumber,
        bedroomCount: apt.bedroomCount,
        bathroomCount: apt.bathroomCount,
        area: apt.area,
        direction: apt.direction,
        layoutType: apt.layoutType,
        status: apt.status,
        highlights: JSON.stringify(['Bespoke', 'Smart Home', 'Ánh sáng tự nhiên']),
        styleTags: JSON.stringify(['Modern', 'Luxury']),
      },
    });
  }

  // ─── COST CATEGORIES & ITEMS ────────────────────────
  const costCategories = ['Thiết kế', 'Thi công cơ bản', 'Nội thất Bespoke', 'Vật liệu hoàn thiện', 'Phụ kiện & Trang trí'];
  const costItems = [
    { categoryIdx: 0, name: 'Bản vẽ thi công 2D', unit: 'bộ', priceMin: 15000000, priceMax: 25000000 },
    { categoryIdx: 0, name: 'Render phối cảnh 3D', unit: 'cảnh', priceMin: 2000000, priceMax: 3500000 },
    { categoryIdx: 1, name: 'Gạch men sàn 60x60', unit: 'm²', priceMin: 350000, priceMax: 550000 },
    { categoryIdx: 1, name: 'Sơn tường cao cấp', unit: 'm²', priceMin: 180000, priceMax: 280000 },
    { categoryIdx: 1, name: 'Trần gypsum decor', unit: 'm²', priceMin: 450000, priceMax: 650000 },
    { categoryIdx: 2, name: 'Tủ bếp acrylic cao cấp', unit: 'm', priceMin: 8000000, priceMax: 12000000 },
    { categoryIdx: 2, name: 'Tủ quần áo kịch trần', unit: 'm²', priceMin: 6500000, priceMax: 9000000 },
    { categoryIdx: 2, name: 'Bàn ghế sofa da nhập', unit: 'bộ', priceMin: 45000000, priceMax: 65000000 },
    { categoryIdx: 2, name: 'Giường ngủ bọc da', unit: 'bộ', priceMin: 12000000, priceMax: 20000000 },
    { categoryIdx: 2, name: 'Bàn ăn - ghế mặt đá', unit: 'bộ', priceMin: 15000000, priceMax: 25000000 },
    { categoryIdx: 3, name: 'Đá marble ốp tường', unit: 'm²', priceMin: 1800000, priceMax: 3500000 },
    { categoryIdx: 3, name: 'Gỗ óc chó nhập khẩu', unit: 'm²', priceMin: 2500000, priceMax: 4500000 },
    { categoryIdx: 4, name: 'Đèn trang trí LED', unit: 'bộ', priceMin: 3000000, priceMax: 8000000 },
    { categoryIdx: 4, name: 'Rèm vải cao cấp', unit: 'bộ', priceMin: 5000000, priceMax: 10000000 },
  ];

  for (let ci = 0; ci < costCategories.length; ci++) {
    const cat = await prisma.costCategory.upsert({
      where: { id: `seed-cat-${ci}` },
      update: {
        name: costCategories[ci],
        order: ci + 1,
        icon: ['PenTool', 'Wrench', 'Armchair', 'Box', 'Sparkles'][ci],
      },
      create: {
        id: `seed-cat-${ci}`,
        name: costCategories[ci],
        order: ci + 1,
        icon: ['PenTool', 'Wrench', 'Armchair', 'Box', 'Sparkles'][ci],
      },
    });

    for (const item of costItems.filter(i => i.categoryIdx === ci)) {
      const itemIdx = costItems.indexOf(item);
      await prisma.costItem.upsert({
        where: { id: `seed-item-${ci}-${itemIdx}` },
        update: {
          name: item.name,
          unit: item.unit,
          unitPriceMin: item.priceMin,
          unitPriceMax: item.priceMax,
        },
        create: {
          id: `seed-item-${ci}-${itemIdx}`,
          categoryId: cat.id,
          name: item.name,
          unit: item.unit,
          unitPriceMin: item.priceMin,
          unitPriceMax: item.priceMax,
          order: ci * 10 + itemIdx,
        },
      });
    }
  }

  // ─── COST TEMPLATE ──────────────────────────────────
  const designCat = await prisma.costCategory.findFirst({ where: { name: 'Thiết kế' } });
  const constCat = await prisma.costCategory.findFirst({ where: { name: 'Thi công cơ bản' } });
  const furnCat = await prisma.costCategory.findFirst({ where: { name: 'Nội thất Bespoke' } });
  const matCat = await prisma.costCategory.findFirst({ where: { name: 'Vật liệu hoàn thiện' } });
  const decorCat = await prisma.costCategory.findFirst({ where: { name: 'Phụ kiện & Trang trí' } });

  if (designCat && furnCat) {
    const designItems = await prisma.costItem.findMany({ where: { categoryId: designCat.id } });
    const furnItems = await prisma.costItem.findMany({ where: { categoryId: furnCat.id } });
    const constItems = await prisma.costItem.findMany({ where: { categoryId: constCat?.id } });
    const matItems = await prisma.costItem.findMany({ where: { categoryId: matCat?.id } });
    const decorItems = await prisma.costItem.findMany({ where: { categoryId: decorCat?.id } });

    const template = await prisma.costTemplate.create({
      data: {
        name: 'Căn 2PN Modern Luxury',
        description: 'Gói tiêu chuẩn cho căn hộ 2PN phong cách hiện đại, sang trọng',
        bedroomCount: 2,
        style: 'Modern Luxury',
        baseArea: 75,
        isDefault: true,
      },
    });

    const allItems = [...designItems, ...constItems, ...furnItems, ...matItems, ...decorItems];
    for (const item of allItems) {
      let qty = 1;
      if (item.name.includes('sàn')) qty = 75;
      else if (item.name.includes('Sơn tường')) qty = 280;
      else if (item.name.includes('Trần')) qty = 75;
      else if (item.name.includes('Tủ bếp')) qty = 4.5;
      else if (item.name.includes('Tủ quần áo')) qty = 12;
      else if (item.name.includes('giường')) qty = 2;

      await prisma.costTemplateItem.create({
        data: {
          templateId: template.id,
          costItemId: item.id,
          quantity: qty,
          quantityFormula: qty > 1 ? undefined : '1',
        },
      });
    }
  }

  console.log('✅ Seed completed successfully');
  console.log('   👤 Admin: admin@lumi.design / admin123');
  console.log('   👤 Sale:  sale@lumi.design / sale123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
