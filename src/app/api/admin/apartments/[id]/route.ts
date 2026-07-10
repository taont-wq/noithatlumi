import { NextResponse } from 'next/server';
import { prisma } from '@/lib/api/prisma';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const apartment = await prisma.apartment.findUnique({
      where: { id },
      include: {
        tower: { include: { project: true } },
        images: { orderBy: { order: 'asc' } },
        videos: { orderBy: { order: 'asc' } },
        estimate: true,
      },
    });
    if (!apartment) {
      return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
    }
    return NextResponse.json({ data: apartment });
  } catch (error) {
    console.error('GET /api/admin/apartments/[id] error:', error);
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

    const apartment = await prisma.apartment.update({
      where: { id },
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
      },
    });
    return NextResponse.json({ data: apartment });
  } catch (error) {
    console.error('PUT /api/admin/apartments/[id] error:', error);
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.apartment.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/admin/apartments/[id] error:', error);
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
