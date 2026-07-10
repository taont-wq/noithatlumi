import { NextResponse } from 'next/server';
import { prisma } from '@/lib/api/prisma';

export async function GET() {
  try {
    const categories = await prisma.costCategory.findMany({
      orderBy: { order: 'asc' },
      include: { _count: { select: { items: true } } },
    });
    return NextResponse.json({ data: categories });
  } catch (error) {
    console.error('GET /api/admin/cost-categories error:', error);
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const cat = await prisma.costCategory.create({
      data: {
        name: body.name,
        icon: body.icon ?? null,
        order: body.order ?? 0,
        isActive: body.isActive ?? true,
      },
    });
    return NextResponse.json({ data: cat }, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/cost-categories error:', error);
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
