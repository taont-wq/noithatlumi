import { NextResponse } from 'next/server';
import { prisma } from '@/lib/api/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json({ data: [] });
    }

    const towers = await prisma.tower.findMany({
      where: {
        projectId,
        status: { not: 'SOLD_OUT' },
      },
      include: {
        _count: { select: { apartments: true } },
      },
      orderBy: { order: 'asc' },
    });

    const data = towers.map((t: typeof towers[number]) => ({
      id: t.id,
      slug: t.slug,
      name: t.name,
      floor: t.floors,
      apartmentCount: t._count.apartments,
    }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error('GET /api/towers error:', error);
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Failed to fetch towers' },
      { status: 500 }
    );
  }
}
