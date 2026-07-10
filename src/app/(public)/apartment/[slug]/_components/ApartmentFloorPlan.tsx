import Image from 'next/image';

interface Props {
  pdfUrl: string | null;
  imgUrl: string | null;
}

export function ApartmentFloorPlan({ pdfUrl, imgUrl }: Props) {
  if (!pdfUrl && !imgUrl) return null;

  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold">Mặt bằng</h2>
      <div className="overflow-hidden rounded-lg border bg-card">
        {imgUrl ? (
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={imgUrl}
              alt="Mặt bằng căn hộ"
              fill
              className="object-contain p-4"
              sizes="(max-width: 1024px) 100vw, 66vw"
            />
          </div>
        ) : (
          <div className="flex aspect-[4/3] items-center justify-center bg-muted">
            <p className="text-sm text-muted-foreground">
              {pdfUrl ? 'Xem file PDF bên dưới' : 'Chưa có mặt bằng'}
            </p>
          </div>
        )}

        {pdfUrl && (
          <div className="border-t p-4">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              Tải file PDF mặt bằng
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
