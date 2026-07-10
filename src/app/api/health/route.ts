import { NextResponse } from 'next/server';
import { prisma } from '@/lib/api/prisma';

export async function GET() {
  try {
    const [projects, towers, apartments, estimates] = await Promise.all([
      prisma.project.count(),
      prisma.tower.count(),
      prisma.apartment.count(),
      prisma.costEstimate.count(),
    ]);

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      stats: {
        projects,
        towers,
        apartments,
        estimates,
      },
    });
  } catch {
    return NextResponse.json(
      {
        status: 'degraded',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        stats: { projects: 0, towers: 0, apartments: 0, estimates: 0 },
      },
      { status: 200 }
    );
  }
}
