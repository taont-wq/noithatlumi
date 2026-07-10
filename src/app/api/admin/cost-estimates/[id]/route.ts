import { NextResponse } from 'next/server';
import { prisma } from '@/lib/api/prisma';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const estimate = await prisma.costEstimate.findUnique({
      where: { id },
      include: {
        apartment: { include: { tower: { include: { project: true } } } },
        template: true,
      },
    });
    if (!estimate) return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });

    const data = {
      ...estimate,
      breakdown: safeParse(estimate.breakdown, {}),
    };
    return NextResponse.json({ data });
  } catch (error) {
    console.error('GET /api/admin/cost-estimates/[id] error:', error);
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
    const estimate = await prisma.costEstimate.update({
      where: { id },
      data: {
        status: body.status,
        notes: body.notes ?? null,
        totalMin: body.totalMin ?? undefined,
        totalMax: body.totalMax ?? undefined,
        breakdown: body.breakdown ? JSON.stringify(body.breakdown) : undefined,
        validUntil: body.validUntil ? new Date(body.validUntil) : undefined,
      },
    });
    return NextResponse.json({ data: estimate });
  } catch (error) {
    console.error('PUT /api/admin/cost-estimates/[id] error:', error);
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.costEstimate.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/admin/cost-estimates/[id] error:', error);
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}

function safeParse(json: string, fallback: unknown) {
  try { return JSON.parse(json); } catch { return fallback; }
}
