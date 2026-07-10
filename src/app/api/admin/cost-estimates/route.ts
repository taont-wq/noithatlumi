import { NextResponse } from 'next/server';
import { prisma } from '@/lib/api/prisma';

export async function GET() {
  try {
    const estimates = await prisma.costEstimate.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        apartment: { select: { code: true, slug: true } },
        template: { select: { name: true } },
      },
    });
    return NextResponse.json({ data: estimates });
  } catch (error) {
    console.error('GET /api/admin/cost-estimates error:', error);
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Calculate estimate from template
    let totalMin = 0;
    let totalMax = 0;
    const breakdown: Record<string, unknown> = {};

    if (body.templateId) {
      const templateItems = await prisma.costTemplateItem.findMany({
        where: { templateId: body.templateId },
        include: { costItem: true },
      });

      for (const ti of templateItems) {
        const qty = ti.quantity;
        const subMin = qty * ti.costItem.unitPriceMin;
        const subMax = qty * ti.costItem.unitPriceMax;
        totalMin += subMin;
        totalMax += subMax;
        breakdown[ti.costItem.name] = {
          categoryId: ti.costItem.categoryId,
          quantity: qty,
          unit: ti.costItem.unit,
          unitPriceMin: ti.costItem.unitPriceMin,
          unitPriceMax: ti.costItem.unitPriceMax,
          subtotalMin: subMin,
          subtotalMax: subMax,
        };
      }
    }

    const estimate = await prisma.costEstimate.create({
      data: {
        apartmentId: body.apartmentId,
        templateId: body.templateId ?? null,
        status: 'DRAFT',
        totalMin,
        totalMax,
        breakdown: JSON.stringify(breakdown),
        notes: body.notes ?? null,
        generatedBy: body.generatedBy ?? null,
        validUntil: body.validUntil ? new Date(body.validUntil) : null,
      },
    });

    return NextResponse.json({ data: estimate }, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/cost-estimates error:', error);
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
