import { NextResponse } from 'next/server';
import { prisma } from '@/lib/api/prisma';
import type { ApartmentImage, ApartmentVideo, CostEstimate } from '@prisma/client';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const apartment = await prisma.apartment.findUnique({
      where: { slug },
      include: {
        tower: {
          include: {
            project: true,
          },
        },
        images: {
          orderBy: { order: 'asc' },
        },
        videos: {
          orderBy: { order: 'asc' },
        },
        estimate: {
          include: {
            template: true,
          },
        },
      },
    });

    if (!apartment) {
      return NextResponse.json(
        { error: 'NOT_FOUND', message: 'Apartment not found' },
        { status: 404 }
      );
    }

    const data = {
      id: apartment.id,
      slug: apartment.slug,
      code: apartment.code,
      floor: apartment.floor,
      unitNumber: apartment.unitNumber,
      bedroomCount: apartment.bedroomCount,
      bathroomCount: apartment.bathroomCount,
      area: apartment.area,
      direction: apartment.direction,
      layoutType: apartment.layoutType,
      status: apartment.status,
      priceEstimate: apartment.priceEstimate,
      description: apartment.description,
      highlights: safeParse<string[]>(apartment.highlights, []),
      styleTags: safeParse<string[]>(apartment.styleTags, []),
      floorPlanPdf: apartment.floorPlanPdf,
      floorPlanImg: apartment.floorPlanImg,
      seoTitle: apartment.seoTitle,
      seoDesc: apartment.seoDesc,
      seoKeywords: safeParse<string[]>(apartment.seoKeywords, []),
      projectName: apartment.tower?.project?.name,
      projectSlug: apartment.tower?.project?.slug,
      towerName: apartment.tower?.name,
      towerSlug: apartment.tower?.slug,
      images: apartment.images.map(transformImage),
      videos: apartment.videos.map(transformVideo),
      estimate: apartment.estimate
        ? transformEstimate(apartment.estimate as CostEstimate & { template?: { name: string } })
        : null,
    };

    return NextResponse.json({ data });
  } catch (error) {
    console.error('GET /api/apartments/[slug] error:', error);
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Failed to fetch apartment' },
      { status: 500 }
    );
  }
}

function transformImage(img: ApartmentImage) {
  return {
    id: img.id,
    url: img.url,
    alt: img.alt,
    roomType: img.roomType,
    order: img.order,
    isPrimary: img.isPrimary,
    width: img.width,
    height: img.height,
  };
}

function transformVideo(vid: ApartmentVideo) {
  return {
    id: vid.id,
    platform: vid.platform,
    videoId: vid.videoId,
    url: vid.url,
    title: vid.title,
    thumbnail: vid.thumbnail,
    duration: vid.duration,
  };
}

function transformEstimate(estimate: CostEstimate & { template?: { name: string } }) {
  return {
    id: estimate.id,
    status: estimate.status,
    totalMin: estimate.totalMin,
    totalMax: estimate.totalMax,
    breakdown: safeParse<Record<string, unknown>>(estimate.breakdown, {}),
    pdfUrl: estimate.pdfUrl,
    templateName: estimate.template?.name ?? null,
  };
}

function safeParse<T>(json: string | null | undefined, fallback: T): T {
  if (!json) return fallback;
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}
