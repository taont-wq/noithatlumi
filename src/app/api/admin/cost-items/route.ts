import { NextResponse } from 'next/server';
import { prisma } from '@/lib/api/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const where: Record<string, unknown> = {};
    if (categoryId) where.categoryId = categoryId;

    const items = await prisma.costItem.findMany({
      where,
      orderBy: { order: 'asc' },
      include: { category: { select: { name: true, icon: true } } },
    });
    return NextResponse.json({ data: items });
  } catch (error) {
    console.error('GET /api/admin/cost-items error:', error);
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const item = await prisma.costItem.create({
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
    return NextResponse.json({ data: item }, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/cost-items error:', error);
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
