import { NextResponse } from 'next/server';
import { prisma } from '@/lib/api/prisma';

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { order: 'asc' },
      include: { _count: { select: { towers: true } } },
    });
    return NextResponse.json({ data: projects });
  } catch (error) {
    console.error('GET /api/admin/projects error:', error);
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const project = await prisma.project.create({
      data: {
        slug: body.slug,
        name: body.name,
        shortDesc: body.shortDesc ?? null,
        description: body.description ?? null,
        location: body.location ?? null,
        developer: body.developer ?? null,
        status: body.status ?? 'ACTIVE',
        order: body.order ?? 0,
        thumbnail: body.thumbnail ?? null,
      },
    });
    return NextResponse.json({ data: project }, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/projects error:', error);
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
