import { NextResponse } from 'next/server';
import { prisma } from '@/lib/api/prisma';

export async function GET() {
  try {
    const templates = await prisma.costTemplate.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { items: true } } },
    });
    return NextResponse.json({ data: templates });
  } catch (error) {
    console.error('GET /api/admin/cost-templates error:', error);
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const template = await prisma.costTemplate.create({
      data: {
        name: body.name,
        description: body.description ?? null,
        bedroomCount: body.bedroomCount ?? null,
        style: body.style ?? null,
        baseArea: body.baseArea ?? null,
        isDefault: body.isDefault ?? false,
      },
    });
    return NextResponse.json({ data: template }, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/cost-templates error:', error);
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
