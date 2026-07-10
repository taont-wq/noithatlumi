interface ApartmentData {
  name?: string;
  code: string;
  description?: string | null;
  bedroomCount: number;
  bathroomCount: number;
  area?: number | null;
  floor?: number | null;
  priceEstimate?: number | null;
  status: string;
  images?: Array<{ url: string; alt?: string | null }>;
  projectName?: string;
  towerName?: string;
  floorPlanPdf?: string | null;
  estimate?: { totalMin?: number; totalMax?: number } | null;
}

interface Props {
  apartment: ApartmentData;
}

export function ApartmentJsonLd({ apartment }: Props) {
  const url = process.env.NEXT_PUBLIC_APP_URL ?? 'https://noithatlumi.vn';
  const apartmentUrl = `${url}/apartment/${apartment.name ?? apartment.code}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Apartment',
    name: apartment.projectName
      ? `${apartment.projectName} ${apartment.towerName ?? ''} ${apartment.code}`
      : `Căn hộ ${apartment.code}`,
    description: apartment.description ?? undefined,
    numberOfBedrooms: apartment.bedroomCount,
    numberOfBathrooms: apartment.bathroomCount,
    floorSize: apartment.area
      ? { '@type': 'QuantitativeValue', value: apartment.area, unitCode: 'MTK' }
      : undefined,
    floorLevel: apartment.floor ?? undefined,
    url: apartmentUrl,
    ...(apartment.images?.length && {
      image: apartment.images.map((img) => img.url),
    }),
    ...(apartment.priceEstimate && {
      offers: {
        '@type': 'Offer',
        price: apartment.priceEstimate,
        priceCurrency: 'VND',
        availability: apartment.status === 'AVAILABLE'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      },
    }),
    ...(apartment.floorPlanPdf && {
      hasDocument: {
        '@type': 'DigitalDocument',
        name: 'Mặt bằng căn hộ',
        url: apartment.floorPlanPdf,
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
