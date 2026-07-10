import { NextResponse } from 'next/server';
import { prisma } from '@/lib/api/prisma';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        towers: { orderBy: { order: 'asc' } },
        images: { orderBy: { order: 'asc' } },
        _count: { select: { towers: true } },
      },
    });
    if (!project) {
      return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
    }
    return NextResponse.json({ data: project });
  } catch (error) {
    console.error('GET /api/admin/projects/[id] error:', error);
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const project = await prisma.project.update({
      where: { id },
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
    return NextResponse.json({ data: project });
  } catch (error) {
    console.error('PUT /api/admin/projects/[id] error:', error);
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/admin/projects/[id] error:', error);
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
