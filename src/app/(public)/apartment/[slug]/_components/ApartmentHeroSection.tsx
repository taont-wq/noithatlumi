import Image from 'next/image';
import Link from 'next/link';

interface Props {
  apartment: {
    images: Array<{
      url: string;
      alt: string | null;
      isPrimary: boolean;
    }>;
    status: string;
    projectName?: string;
    projectSlug?: string;
    towerName?: string;
    towerSlug?: string;
    code: string;
    estimate?: { totalMin: number; totalMax: number } | null;
  };
}

const STATUS_COLORS: Record<string, string> = {
  AVAILABLE: 'bg-emerald-500',
  RESERVED: 'bg-amber-500',
  SOLD: 'bg-rose-500',
  DESIGNING: 'bg-blue-500',
  CONSTRUCTING: 'bg-violet-500',
  COMPLETED: 'bg-teal-500',
};

const STATUS_LABELS: Record<string, string> = {
  AVAILABLE: 'Còn hàng',
  RESERVED: 'Đã cọc',
  SOLD: 'Đã bán',
  DESIGNING: 'Đang thiết kế',
  CONSTRUCTING: 'Đang xây',
  COMPLETED: 'Hoàn thiện',
};

export function ApartmentHeroSection({ apartment }: Props) {
  const heroImage = apartment.images.find((img) => img.isPrimary) ?? apartment.images[0];

  return (
    <section className="relative mb-10 h-[50vh] min-h-[400px] w-full overflow-hidden">
      {heroImage && (
        <Image
          src={heroImage.url}
          alt={heroImage.alt ?? `Căn hộ ${apartment.code}`}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Breadcrumb */}
      <div className="absolute left-4 top-4 right-4 z-10">
        <nav className="flex items-center gap-2 text-sm text-white/80">
          <Link href="/" className="hover:text-white transition-colors">
            Trang chủ
          </Link>
          <span>/</span>
          {apartment.projectSlug && (
            <>
              <Link
                href={`/du-an/${apartment.projectSlug}`}
                className="hover:text-white transition-colors"
              >
                {apartment.projectName}
              </Link>
              <span>/</span>
            </>
          )}
          {apartment.towerSlug && (
            <>
              <Link
                href={`/du-an/${apartment.projectSlug}/toa/${apartment.towerSlug}`}
                className="hover:text-white transition-colors"
              >
                {apartment.towerName}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-white/60">{apartment.code}</span>
        </nav>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-6 sm:p-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3">
          <div className="flex items-center gap-3">
            <span
              className={`inline-block rounded-full px-3 py-1 text-xs font-semibold text-white ${
                STATUS_COLORS[apartment.status] ?? 'bg-gray-500'
              }`}
            >
              {STATUS_LABELS[apartment.status] ?? apartment.status}
            </span>
            {apartment.estimate && (
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                {(apartment.estimate.totalMin / 1_000_000).toFixed(0)} -{' '}
                {(apartment.estimate.totalMax / 1_000_000).toFixed(0)} triệu
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            {apartment.projectName && `${apartment.projectName} - `}
            {apartment.towerName && `${apartment.towerName} - `}
            {apartment.code}
          </h1>
        </div>
      </div>
    </section>
  );
}
