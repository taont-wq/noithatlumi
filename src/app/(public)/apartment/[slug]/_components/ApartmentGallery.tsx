'use client';

import { useState } from 'react';
import Image from 'next/image';

interface GalleryImage {
  id: string;
  url: string;
  alt: string | null;
  roomType: string;
  order: number;
  isPrimary: boolean;
}

interface Props {
  images: GalleryImage[];
}

const ROOM_LABELS: Record<string, string> = {
  LIVING_ROOM: 'Phòng khách',
  KITCHEN: 'Bếp',
  DINING: 'Phòng ăn',
  MASTER_BEDROOM: 'Phòng ngủ chính',
  BEDROOM_2: 'Phòng ngủ 2',
  BEDROOM_3: 'Phòng ngủ 3',
  BATHROOM: 'Phòng tắm',
  BALCONY: 'Ban công',
  HALLWAY: 'Hành lang',
  STORAGE: 'Kho',
  FLOORPLAN: 'Mặt bằng',
  EXTERIOR: 'Ngoại thất',
  DETAIL: 'Chi tiết',
  OTHER: 'Khác',
};

export function ApartmentGallery({ images }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  // Group by room type
  const groups = images.reduce<Record<string, GalleryImage[]>>((acc, img) => {
    const key = img.roomType || 'OTHER';
    if (!acc[key]) acc[key] = [];
    acc[key].push(img);
    return acc;
  }, {});

  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold">Hình ảnh</h2>

      <div className="space-y-4">
        {Object.entries(groups).map(([roomType, roomImages]) => (
          <div key={roomType}>
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">
              {ROOM_LABELS[roomType] ?? roomType}
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {roomImages.map((img, idx) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setSelectedIndex(images.indexOf(img))}
                  className="group relative aspect-4/3 overflow-hidden rounded-lg border bg-muted transition-shadow hover:shadow-md"
                >
                  <Image
                    src={img.url}
                    alt={img.alt ?? ''}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedIndex(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedIndex(null)}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Previous */}
          {selectedIndex > 0 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setSelectedIndex(selectedIndex - 1); }}
              className="absolute left-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
          )}

          <div className="relative h-full w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[selectedIndex].url}
              alt={images[selectedIndex].alt ?? ''}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
              {selectedIndex + 1} / {images.length}
              {images[selectedIndex].alt && ` — ${images[selectedIndex].alt}`}
            </p>
          </div>

          {/* Next */}
          {selectedIndex < images.length - 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setSelectedIndex(selectedIndex + 1); }}
              className="absolute right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          )}
        </div>
      )}
    </section>
  );
}
