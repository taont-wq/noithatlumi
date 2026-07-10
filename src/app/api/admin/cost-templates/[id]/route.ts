import { NextResponse } from 'next/server';
import { prisma } from '@/lib/api/prisma';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const template = await prisma.costTemplate.findUnique({
      where: { id },
      include: {
        items: {
          include: { costItem: { include: { category: true } } },
          orderBy: { costItem: { order: 'asc' } },
        },
      },
    });
    if (!template) return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
    return NextResponse.json({ data: template });
  } catch (error) {
    console.error('GET /api/admin/cost-templates/[id] error:', error);
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
    const template = await prisma.costTemplate.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description ?? null,
        bedroomCount: body.bedroomCount ?? null,
        style: body.style ?? null,
        baseArea: body.baseArea ?? null,
        isDefault: body.isDefault ?? false,
      },
    });
    return NextResponse.json({ data: template });
  } catch (error) {
    console.error('PUT /api/admin/cost-templates/[id] error:', error);
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.costTemplate.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/admin/cost-templates/[id] error:', error);
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
