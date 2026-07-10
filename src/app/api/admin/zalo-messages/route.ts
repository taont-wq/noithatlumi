import { NextResponse } from 'next/server';
import { prisma } from '@/lib/api/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '20')));
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      prisma.zaloMessage.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.zaloMessage.count(),
    ]);

    return NextResponse.json({ data: messages, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('GET /api/admin/zalo-messages error:', error);
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
