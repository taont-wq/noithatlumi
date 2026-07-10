interface Props {
  apartment: {
    code: string;
    floor: number | null;
    unitNumber: string | null;
    bedroomCount: number;
    bathroomCount: number;
    area: number | null;
    direction: string | null;
    layoutType: string | null;
    description: string | null;
    highlights: string[];
    styleTags: string[];
  };
}

const DIRECTION_LABELS: Record<string, string> = {
  EAST: 'Đông',
  WEST: 'Tây',
  SOUTH: 'Nam',
  NORTH: 'Bắc',
  NORTHEAST: 'Đông Bắc',
  NORTHWEST: 'Tây Bắc',
  SOUTHEAST: 'Đông Nam',
  SOUTHWEST: 'Tây Nam',
};

const LAYOUT_LABELS: Record<string, string> = {
  '1PN+': '1PN+',
  '2PN': '2PN',
  '3PN': '3PN',
  Studio: 'Studio',
  Duplex: 'Duplex',
  Penhouse: 'Penthouse',
};

const DIRECTION_COLORS: Record<string, string> = {
  EAST: 'bg-amber-100 text-amber-700',
  WEST: 'bg-orange-100 text-orange-700',
  SOUTH: 'bg-red-100 text-red-700',
  NORTH: 'bg-blue-100 text-blue-700',
  NORTHEAST: 'bg-yellow-100 text-yellow-700',
  NORTHWEST: 'bg-cyan-100 text-cyan-700',
  SOUTHEAST: 'bg-green-100 text-green-700',
  SOUTHWEST: 'bg-pink-100 text-pink-700',
};

export function ApartmentInfoPanel({ apartment }: Props) {
  const infoItems = [
    {
      label: 'Phòng ngủ',
      value: `${apartment.bedroomCount}`,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      ),
    },
    {
      label: 'Vệ sinh',
      value: `${apartment.bathroomCount}`,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
        </svg>
      ),
    },
    {
      label: 'Diện tích',
      value: apartment.area ? `${apartment.area} m²` : '—',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
        </svg>
      ),
    },
    {
      label: 'Tầng',
      value: apartment.floor ? `${apartment.floor}` : '—',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3l7.5 7.5m-15 0v9h15v-9" />
        </svg>
      ),
    },
    {
      label: 'Mã căn',
      value: apartment.unitNumber ?? apartment.code,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
        </svg>
      ),
    },
    {
      label: 'Loại',
      value: LAYOUT_LABELS[apartment.layoutType ?? ''] ?? apartment.layoutType ?? '—',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
        </svg>
      ),
    },
  ];

  return (
    <section>
      {/* Info badges */}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {infoItems.map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center gap-1.5 rounded-lg border bg-card p-3 text-center"
          >
            <div className="text-muted-foreground">{item.icon}</div>
            <span className="text-lg font-bold">{item.value}</span>
            <span className="text-xs text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Direction */}
      {apartment.direction && (
        <div className="mt-4 flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Hướng:</span>
          <span
            className={`inline-block rounded-full px-3 py-0.5 text-xs font-medium ${
              DIRECTION_COLORS[apartment.direction] ?? 'bg-gray-100 text-gray-700'
            }`}
          >
            {DIRECTION_LABELS[apartment.direction] ?? apartment.direction}
          </span>
        </div>
      )}

      {/* Description */}
      {apartment.description && (
        <div className="mt-6">
          <h2 className="mb-3 text-xl font-semibold">Mô tả</h2>
          <div className="prose prose-sm max-w-none text-muted-foreground">
            <p>{apartment.description}</p>
          </div>
        </div>
      )}

      {/* Highlights */}
      {apartment.highlights.length > 0 && (
        <div className="mt-6">
          <h2 className="mb-3 text-xl font-semibold">Điểm nổi bật</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {apartment.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                {h}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Style tags */}
      {apartment.styleTags.length > 0 && (
        <div className="mt-6">
          <h2 className="mb-3 text-xl font-semibold">Phong cách</h2>
          <div className="flex flex-wrap gap-2">
            {apartment.styleTags.map((tag) => (
              <span
                key={tag}
                className="inline-block rounded-full border bg-secondary/50 px-3 py-1 text-xs font-medium text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
