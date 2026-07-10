import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ApartmentHeroSection } from './_components/ApartmentHeroSection';
import { ApartmentInfoPanel } from './_components/ApartmentInfoPanel';
import { ApartmentGallery } from './_components/ApartmentGallery';
import { ApartmentVideos } from './_components/ApartmentVideos';
import { ApartmentFloorPlan } from './_components/ApartmentFloorPlan';
import { ApartmentEstimateCard } from './_components/ApartmentEstimateCard';
import { ApartmentJsonLd } from './_components/ApartmentJsonLd';
import { SITE } from '@/lib/constants';

interface Props {
  params: Promise<{ slug: string }>;
}

async function getApartment(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/apartments/${slug}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const apartment = await getApartment(slug);

  if (!apartment) {
    return { title: 'Không tìm thấy căn hộ' };
  }

  const heroImage = apartment.images?.find((i: any) => i.isPrimary)?.url ?? apartment.images?.[0]?.url;
  const title = apartment.seoTitle || `${apartment.projectName ?? ''} ${apartment.towerName ?? ''} ${apartment.code} - Nội thất căn hộ`;
  const description = apartment.seoDesc || apartment.description || `Khám phá nội thất căn hộ ${apartment.code} tại ${apartment.projectName ?? ''} - ${apartment.towerName ?? ''}. Xem mặt bằng, hình ảnh thiết kế và video nội thất.`;
  const keywords = apartment.seoKeywords?.length ? apartment.seoKeywords.join(', ') : `nội thất, căn hộ, ${apartment.code}, ${apartment.projectName ?? ''}, ${apartment.towerName ?? ''}`;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'vi_VN',
      siteName: SITE.name,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/apartment/${slug}`,
      ...(heroImage && { images: [{ url: heroImage, width: 1200, height: 630, alt: title }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(heroImage && { images: [heroImage] }),
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL}/apartment/${slug}`,
    },
  };
}

export default async function ApartmentPage({ params }: Props) {
  const { slug } = await params;
  const apartment = await getApartment(slug);

  if (!apartment) {
    notFound();
  }

  return (
    <>
      <ApartmentJsonLd apartment={apartment} />

      <div className="min-h-screen pb-16">
        <ApartmentHeroSection apartment={apartment} />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-10">
              <ApartmentInfoPanel apartment={apartment} />

              <Suspense fallback={<div className="h-64 animate-pulse rounded-lg bg-muted" />}>
                <ApartmentGallery images={apartment.images} />
              </Suspense>

              {apartment.videos.length > 0 && (
                <Suspense fallback={<div className="h-48 animate-pulse rounded-lg bg-muted" />}>
                  <ApartmentVideos videos={apartment.videos} />
                </Suspense>
              )}

              <ApartmentFloorPlan
                pdfUrl={apartment.floorPlanPdf}
                imgUrl={apartment.floorPlanImg}
              />
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {apartment.estimate && (
                <ApartmentEstimateCard estimate={apartment.estimate} />
              )}

              {/* Contact card */}
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold">
                  {apartment.towerName ?? 'Liên hệ tư vấn'}
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Để lại thông tin để được tư vấn miễn phí về căn hộ này.
                </p>
                <a
                  href={`tel:${process.env.NEXT_PUBLIC_HOTLINE ?? '1900xxxx'}`}
                  className="flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Gọi ngay: {process.env.NEXT_PUBLIC_HOTLINE ?? '1900 xxxx'}
                </a>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
