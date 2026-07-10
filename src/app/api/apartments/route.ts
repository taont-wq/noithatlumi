import { NextResponse } from 'next/server';
import { prisma } from '@/lib/api/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const towerId = searchParams.get('towerId');
    const projectId = searchParams.get('projectId');
    const q = searchParams.get('q');
    const bedroomCount = searchParams.get('bedroomCount');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    const where: any = {};

    if (towerId) where.towerId = towerId;
    if (status) where.status = status;
    if (bedroomCount) where.bedroomCount = parseInt(bedroomCount);

    // Filter by project via tower
    if (projectId) {
      where.tower = { projectId };
    }

    // Text search on apartment code
    if (q) {
      where.code = { contains: q };
    }

    const [apartments, total] = await Promise.all([
      prisma.apartment.findMany({
        where,
        include: {
          images: {
            where: { isPrimary: true },
            take: 1,
          },
          tower: {
            select: {
              name: true,
              project: { select: { name: true } },
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.apartment.count({ where }),
    ]);

    const data = apartments.map((apt) => ({
      id: apt.id,
      slug: apt.slug,
      code: apt.code,
      floor: apt.floor,
      unitNumber: apt.unitNumber,
      bedroomCount: apt.bedroomCount,
      bathroomCount: apt.bathroomCount,
      area: apt.area,
      direction: apt.direction,
      layoutType: apt.layoutType,
      status: apt.status,
      priceEstimate: apt.priceEstimate,
      highlights: safeParse(apt.highlights, []),
      styleTags: safeParse(apt.styleTags, []),
      thumbnailUrl: apt.images[0]?.url || null,
      projectName: apt.tower?.project?.name,
      towerName: apt.tower?.name,
    }));

    return NextResponse.json({
      data,
      total,
      page,
      pageSize,
    });
  } catch (error) {
    console.error('GET /api/apartments error:', error);
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Failed to fetch apartments' },
      { status: 500 }
    );
  }
}

function safeParse(json: string | null | undefined, fallback: any) {
  if (!json) return fallback;
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}
