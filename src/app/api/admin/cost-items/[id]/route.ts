import { NextResponse } from 'next/server';
import { prisma } from '@/lib/api/prisma';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await prisma.costItem.findUnique({ where: { id }, include: { category: true } });
    if (!item) return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
    return NextResponse.json({ data: item });
  } catch (error) {
    console.error('GET /api/admin/cost-items/[id] error:', error);
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
    const item = await prisma.costItem.update({
      where: { id },
      data: {
        categoryId: body.categoryId,
        name: body.name,
        unit: body.unit,
        unitPriceMin: body.unitPriceMin ?? 0,
        unitPriceMax: body.unitPriceMax ?? 0,
        description: body.description ?? null,
        specs: body.specs ? JSON.stringify(body.specs) : undefined,
        isActive: body.isActive ?? true,
        order: body.order ?? 0,
      },
    });
    return NextResponse.json({ data: item });
  } catch (error) {
    console.error('PUT /api/admin/cost-items/[id] error:', error);
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.costItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/admin/cost-items/[id] error:', error);
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
