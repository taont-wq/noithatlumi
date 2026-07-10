import { NextResponse } from 'next/server';
import { prisma } from '@/lib/api/prisma';

export async function GET() {
  try {
    const logs = await prisma.zaloSyncLog.findMany({
      orderBy: { startedAt: 'desc' },
      take: 50,
    });
    return NextResponse.json({ data: logs });
  } catch (error) {
    console.error('GET /api/admin/zalo-sync-logs error:', error);
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const log = await prisma.zaloSyncLog.create({
      data: {
        triggerType: 'MANUAL',
        status: 'PENDING',
        startedAt: new Date(),
      },
    });
    return NextResponse.json({ data: log }, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/zalo-sync-logs error:', error);
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
