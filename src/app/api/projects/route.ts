import { NextResponse } from 'next/server';
import { prisma } from '@/lib/api/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'ACTIVE';

    const projects = await prisma.project.findMany({
      where: { status },
      include: {
        _count: { select: { towers: true } },
      },
      orderBy: { order: 'asc' },
    });

    const data = projects.map((p: typeof projects[number]) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      shortDesc: p.shortDesc,
      location: p.location,
      thumbnail: p.thumbnail,
      towerCount: p._count.towers,
    }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error('GET /api/projects error:', error);
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}
