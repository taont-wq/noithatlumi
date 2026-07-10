import type { Metadata } from 'next';
import { Cormorant_Garamond, Outfit } from 'next/font/google';
import { Providers } from '@/components/providers/Providers';
import { SITE } from '@/lib/constants';
import './globals.css';

const cormorant = Cormorant_Garamond({
  variable: '--font-heading',
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const outfit = Outfit({
  variable: '--font-body',
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} - Nội thất căn hộ cao cấp`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    'nội thất',
    'thiết kế nội thất',
    'chung cư',
    'Lumi Design',
    'Vinhomes Ocean Park',
    'Vinhomes Smart City',
    'Ecopark',
    'nội thất cao cấp',
  ],
  authors: [{ name: 'Lumi Design' }],
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: 'Lumi Design',
    title: 'Lumi Design - Nội thất căn hộ cao cấp',
    description:
      'Tra cứu nội thất căn hộ cao cấp. Tìm kiếm dự án, tòa nhà và căn hộ với mặt bằng, hình ảnh thiết kế và video nội thất.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={`${cormorant.variable} ${outfit.variable}`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased font-body">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
