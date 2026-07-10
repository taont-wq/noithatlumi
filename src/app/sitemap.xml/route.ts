import { NextResponse } from 'next/server';
import { prisma } from '@/lib/api/prisma';
import { SITE } from '@/lib/constants';

// Force dynamic — this route queries the DB and cannot be statically pre-rendered
export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || SITE.url || 'https://noithatlumi.vn';

  // Static pages
  const staticPages = [
    { path: '', priority: '1.0', changefreq: 'weekly' },
    { path: '/login', priority: '0.3', changefreq: 'monthly' },
  ];

  // Dynamic pages from DB — gracefully fall back to static-only if DB isn't available
  let projects: { slug: string; updatedAt: Date }[] = [];
  let towers: { slug: string; updatedAt: Date }[] = [];
  let apartments: { slug: string; updatedAt: Date }[] = [];

  try {
    [projects, towers, apartments] = await Promise.all([
      prisma.project.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.tower.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.apartment.findMany({ select: { slug: true, updatedAt: true } }),
    ]);
  } catch {
    // DB not available (e.g., during build or migration), serve static-only sitemap
    console.warn('DB not available for sitemap generation, serving static-only sitemap');
  }

  const projectUrls = projects.map((p: { slug: string; updatedAt: Date }) => ({
    path: `/du-an/${p.slug}`,
    priority: '0.8',
    changefreq: 'weekly' as const,
    lastmod: p.updatedAt.toISOString(),
  }));

  const towerUrls = towers.map((t: { slug: string; updatedAt: Date }) => ({
    path: `/du-an/toa/${t.slug}`,
    priority: '0.6',
    changefreq: 'weekly' as const,
    lastmod: t.updatedAt.toISOString(),
  }));

  const apartmentUrls = apartments.map((a: { slug: string; updatedAt: Date }) => ({
    path: `/apartment/${a.slug}`,
    priority: '0.9',
    changefreq: 'daily' as const,
    lastmod: a.updatedAt.toISOString(),
  }));

  const allUrls = [...staticPages, ...projectUrls, ...towerUrls, ...apartmentUrls];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (url: { path: string; priority: string; changefreq: string; lastmod?: string }) =>
      `  <url>
    <loc>${baseUrl}${url.path}</loc>
    <priority>${url.priority}</priority>
    <changefreq>${url.changefreq}</changefreq>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
