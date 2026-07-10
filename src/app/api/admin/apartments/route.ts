import { NextResponse } from 'next/server';
import { prisma } from '@/lib/api/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const towerId = searchParams.get('towerId');
    const status = searchParams.get('status');

    const where: Record<string, unknown> = {};
    if (towerId) where.towerId = towerId;
    if (status) where.status = status;

    const apartments = await prisma.apartment.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: {
        tower: { select: { name: true, project: { select: { name: true } } } },
        images: { where: { isPrimary: true }, take: 1 },
      },
    });

    return NextResponse.json({ data: apartments });
  } catch (error) {
    console.error('GET /api/admin/apartments error:', error);
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const apartment = await prisma.apartment.create({
      data: {
        slug: body.slug,
        towerId: body.towerId,
        code: body.code,
        floor: body.floor ?? null,
        unitNumber: body.unitNumber ?? null,
        bedroomCount: body.bedroomCount ?? 2,
        bathroomCount: body.bathroomCount ?? 1,
        area: body.area ?? null,
        direction: body.direction ?? null,
        layoutType: body.layoutType ?? null,
        status: body.status ?? 'AVAILABLE',
        priceEstimate: body.priceEstimate ?? null,
        description: body.description ?? null,
        highlights: JSON.stringify(body.highlights ?? []),
        styleTags: JSON.stringify(body.styleTags ?? []),
        floorPlanPdf: body.floorPlanPdf ?? null,
        floorPlanImg: body.floorPlanImg ?? null,
        seoTitle: body.seoTitle ?? null,
        seoDesc: body.seoDesc ?? null,
        seoKeywords: JSON.stringify(body.seoKeywords ?? []),
        sourceType: body.sourceType ?? 'MANUAL',
      },
    });
    return NextResponse.json({ data: apartment }, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/apartments error:', error);
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
