import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Building2, MapPin, ChevronRight } from 'lucide-react';
import { SITE, STATUS_LABELS } from '@/lib/constants';
interface Tower {
  id: string;
  slug: string;
  name: string;
  floors: number | null;
  unitsPerFloor: number | null;
  status: string;
  thumbnail: string | null;
  _count: { apartments: number };
}

interface Project {
  id: string;
  name: string;
  slug: string;
  shortDesc: string | null;
  description: string | null;
  location: string | null;
  developer: string | null;
  status: string;
  thumbnail: string | null;
  towers: Tower[];
}

async function getProject(slug: string): Promise<Project | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/projects?slug=${slug}`, {
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
  params: Promise<{ slug: string }>;
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) notFound();

  const activeTowers = project.towers?.filter((t) => t.status === 'ACTIVE') ?? [];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[40vh] min-h-[350px] overflow-hidden bg-luxury">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
        {project.thumbnail && (
          <Image
            src={project.thumbnail}
            alt={project.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        )}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-6 sm:p-10">
          <div className="mx-auto max-w-7xl">
            <nav className="flex items-center gap-2 text-sm text-white/60 mb-4">
              <Link href="/" className="hover:text-white transition-colors">Trang chủ</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-white/80">{project.name}</span>
            </nav>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-heading">
              {project.name}
            </h1>
            {project.location && (
              <p className="mt-2 flex items-center gap-1.5 text-sm text-white/70">
                <MapPin className="h-4 w-4" />
                {project.location}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Description */}
        {(project.shortDesc || project.description) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 max-w-3xl"
          >
            <p className="text-lg text-muted-foreground leading-relaxed">
              {project.description ?? project.shortDesc}
            </p>
            {project.developer && (
              <p className="mt-4 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Chủ đầu tư:</span> {project.developer}
              </p>
            )}
          </motion.div>
        )}

        {/* Towers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="mb-6 text-2xl font-semibold font-heading">
            Tòa nhà ({activeTowers.length})
          </h2>

          {activeTowers.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center">
              <Building2 className="mb-3 h-12 w-12 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">Chưa có tòa nhà nào</p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {activeTowers.map((tower, i) => (
                <motion.div
                  key={tower.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                >
                  <Link
                    href={`/du-an/${slug}/toa/${tower.slug}`}
                    className="group block overflow-hidden rounded-xl border bg-card transition-all hover:shadow-lg hover:-translate-y-1"
                  >
                    {tower.thumbnail ? (
                      <div className="relative h-44 w-full">
                        <Image
                          src={tower.thumbnail}
                          alt={tower.name}
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
                      <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                        {tower.name}
                      </h3>
                      {tower.floors && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {tower.floors} tầng · {tower.unitsPerFloor ?? '?'} căn/tầng
                        </p>
                      )}
                      <p className="mt-2 text-xs font-medium text-primary">
                        {tower._count?.apartments ?? 0} căn hộ
                      </p>
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
