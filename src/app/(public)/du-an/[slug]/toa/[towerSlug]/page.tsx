import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Building2, ChevronRight, Maximize2, BedDouble, Bath } from 'lucide-react';
import { STATUS_LABELS } from '@/lib/constants';

interface Apartment {
  id: string;
  slug: string;
  code: string;
  floor: number | null;
  bedroomCount: number;
  bathroomCount: number;
  area: number | null;
  layoutType: string | null;
  status: string;
  priceEstimate: number | null;
  floorPlanImg: string | null;
  images?: Array<{ url: string }>;
}

interface Tower {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  address: string | null;
  floors: number | null;
  unitsPerFloor: number | null;
  status: string;
  project: { name: string; slug: string };
  apartments: Apartment[];
}

async function getTower(towerSlug: string): Promise<Tower | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/towers?slug=${towerSlug}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data?.[0] ?? null;
  } catch {
    return null;
  }
}

interface Props {
  params: Promise<{ slug: string; towerSlug: string }>;
}

const LAYOUT_LABELS: Record<string, string> = {
  '1PN+': '1PN+', '2PN': '2PN', '3PN': '3PN',
  Studio: 'Studio', Duplex: 'Duplex', Penhouse: 'Penthouse',
};

export default async function TowerDetailPage({ params }: Props) {
  const { slug, towerSlug } = await params;
  const tower = await getTower(towerSlug);

  if (!tower) notFound();

  const visible = tower.apartments?.filter((a) => a.status !== 'HIDDEN') ?? [];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[30vh] min-h-[280px] overflow-hidden bg-luxury">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
        <div className="absolute bottom-0 left-0 right-0 z-20 p-6 sm:p-10">
          <div className="mx-auto max-w-7xl">
            <nav className="flex items-center gap-2 text-sm text-white/60 mb-3 flex-wrap">
              <Link href="/" className="hover:text-white transition-colors">Trang chủ</Link>
              <ChevronRight className="h-3 w-3 shrink-0" />
              <Link href={`/du-an/${slug}`} className="hover:text-white transition-colors">
                {tower.project.name}
              </Link>
              <ChevronRight className="h-3 w-3 shrink-0" />
              <span className="text-white/80">{tower.name}</span>
            </nav>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white font-heading">
              {tower.name}
            </h1>
            {tower.address && (
              <p className="mt-1 text-sm text-white/70">{tower.address}</p>
            )}
          </div>
        </div>
      </section>

      {/* Info */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-wrap gap-6 text-sm"
        >
          {tower.floors && (
            <div><span className="font-medium text-foreground">Số tầng:</span> {tower.floors}</div>
          )}
          {tower.unitsPerFloor && (
            <div><span className="font-medium text-foreground">Căn/tầng:</span> {tower.unitsPerFloor}</div>
          )}
          <div><span className="font-medium text-foreground">Tổng căn:</span> {visible.length}</div>
        </motion.div>

        {tower.description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-10 max-w-3xl text-muted-foreground"
          >
            {tower.description}
          </motion.p>
        )}

        {/* Apartment grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="mb-6 text-2xl font-semibold font-heading">
            Danh sách căn hộ ({visible.length})
          </h2>

          {visible.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center">
              <Building2 className="mb-3 h-12 w-12 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">Chưa có căn hộ nào</p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((apt, i) => (
                <motion.div
                  key={apt.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <Link
                    href={`/apartment/${apt.slug}`}
                    className="group block overflow-hidden rounded-xl border bg-card transition-all hover:shadow-lg hover:-translate-y-1"
                  >
                    {apt.floorPlanImg || apt.images?.[0]?.url ? (
                      <div className="relative h-44 w-full">
                        <Image
                          src={apt.floorPlanImg ?? apt.images![0].url}
                          alt={apt.code}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                    ) : (
                      <div className="flex h-44 items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
                        <Building2 className="h-16 w-16 text-primary/20" />
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                          {apt.code}
                        </h3>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_LABELS[apt.status]?.color ?? 'bg-gray-100 text-gray-700'}`}
                        >
                          {STATUS_LABELS[apt.status]?.label ?? apt.status}
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BedDouble className="h-3.5 w-3.5" /> {apt.bedroomCount} PN
                        </span>
                        <span className="flex items-center gap-1">
                          <Bath className="h-3.5 w-3.5" /> {apt.bathroomCount} VS
                        </span>
                        <span className="flex items-center gap-1">
                          <Maximize2 className="h-3.5 w-3.5" />
                          {apt.area ? `${apt.area}m²` : '—'}
                        </span>
                      </div>
                      {apt.layoutType && (
                        <span className="mt-2 inline-block rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                          {LAYOUT_LABELS[apt.layoutType] ?? apt.layoutType}
                        </span>
                      )}
                      {apt.priceEstimate && (
                        <p className="mt-3 text-sm font-semibold text-primary">
                          {(apt.priceEstimate / 1_000_000).toFixed(0)} triệu
                        </p>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
