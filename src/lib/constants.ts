export const SITE = {
  name: 'Lumi Design',
  tagline: 'Nội thất cao cấp • Bespoke',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  description:
    'Lumi Design - Tra cứu nội thất căn hộ cao cấp. Tìm kiếm dự án, tòa nhà và căn hộ với mặt bằng, hình ảnh thiết kế và video nội thất.',
} as const;

export const CONTACT = {
  phone: '058 929 4444',
  phoneRaw: '0589294444',
  phone2: '083 555 7878',
  phone2Raw: '0835557878',
  email: 'info@lumidesign.vn',
  facebook: 'https://facebook.com/NoithatNewhomes',
  youtube: 'https://youtube.com/',
} as const;

export const ADDRESSES = [
  'Showroom: Shop chân đế Zurich 1, Vinhomes Ocean Park',
  'VPGD1: ZR1 0311, tòa ZR1, Vinhomes Ocean Park',
  'VPGD2: Tòa SA5, The Sakura, Vinhomes Smart City',
  'VPGD3: Tòa SF3, Skyforest, Ecopark, Hưng Yên',
] as const;

export const NAV_LINKS = [
  { label: 'Dự án', href: '#projects' },
  { label: 'Bộ lọc', href: '#filter' },
  { label: 'Liên hệ', href: '#contact' },
] as const;

export const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  AVAILABLE: { label: 'Còn trống', color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' },
  RESERVED: { label: 'Đã giữ chỗ', color: 'border-amber-500/30 text-amber-400 bg-amber-500/10' },
  SOLD: { label: 'Đã bán', color: 'border-red-500/30 text-red-400 bg-red-500/10' },
  DESIGNING: { label: 'Đang thiết kế', color: 'border-blue-500/30 text-blue-400 bg-blue-500/10' },
  CONSTRUCTING: { label: 'Đang thi công', color: 'border-violet-500/30 text-violet-400 bg-violet-500/10' },
  COMPLETED: { label: 'Hoàn thiện', color: 'border-green-500/30 text-green-400 bg-green-500/10' },
  HIDDEN: { label: 'Ẩn', color: 'border-gray-500/30 text-gray-400 bg-gray-500/10' },
} as const;

export const API_ENDPOINTS = {
  projects: '/api/projects',
  towers: '/api/towers',
  apartments: '/api/apartments',
  health: '/api/health',
} as const;

export const PAGINATION = {
  defaultPageSize: 20,
  maxPageSize: 100,
} as const;

export const FILE_LIMITS = {
  imageMaxSize: 10 * 1024 * 1024, // 10MB
  pdfMaxSize: 50 * 1024 * 1024, // 50MB
  videoMaxSize: 100 * 1024 * 1024, // 100MB
  maxImagesPerApartment: 20,
} as const;

export const BEDROOM_OPTIONS = ['Tất cả', '1PN', '2PN', '3PN', 'Studio'] as const;
