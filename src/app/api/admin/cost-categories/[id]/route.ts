import { NextResponse } from 'next/server';
import { prisma } from '@/lib/api/prisma';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cat = await prisma.costCategory.findUnique({
      where: { id },
      include: { items: { orderBy: { order: 'asc' } } },
    });
    if (!cat) return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
    return NextResponse.json({ data: cat });
  } catch (error) {
    console.error('GET /api/admin/cost-categories/[id] error:', error);
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
    const cat = await prisma.costCategory.update({
      where: { id },
      data: {
        name: body.name,
        icon: body.icon ?? null,
        order: body.order ?? 0,
        isActive: body.isActive ?? true,
      },
    });
    return NextResponse.json({ data: cat });
  } catch (error) {
    console.error('PUT /api/admin/cost-categories/[id] error:', error);
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.costCategory.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/admin/cost-categories/[id] error:', error);
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
