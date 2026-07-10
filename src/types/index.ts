export interface Project {
  id: string;
  slug: string;
  name: string;
  shortDesc?: string;
  description?: string;
  location?: string;
  developer?: string;
  status: ProjectStatus;
  order: number;
  thumbnail?: string;
  towers?: Tower[];
  images?: ProjectImage[];
  createdAt: Date;
  updatedAt: Date;
}

export type ProjectStatus = 'ACTIVE' | 'COMING_SOON' | 'COMPLETED' | 'ARCHIVED';

export interface ProjectImage {
  id: string;
  projectId: string;
  url: string;
  alt?: string;
  order: number;
  type: ImageType;
}

export type ImageType = 'HERO' | 'GALLERY' | 'FLOORPLAN' | 'MAP';

export interface Tower {
  id: string;
  slug: string;
  projectId: string;
  project?: Project;
  name: string;
  description?: string;
  address?: string;
  floors?: number;
  unitsPerFloor?: number;
  status: TowerStatus;
  order: number;
  thumbnail?: string;
  apartments?: Apartment[];
  createdAt: Date;
  updatedAt: Date;
}

export type TowerStatus = 'ACTIVE' | 'COMING_SOON' | 'SOLD_OUT';

export interface Apartment {
  id: string;
  slug: string;
  towerId: string;
  tower?: Tower;
  code: string;
  floor?: number;
  unitNumber?: string;
  bedroomCount: number;
  bathroomCount: number;
  area?: number;
  direction?: string;
  layoutType?: string;
  status: ApartmentStatus;
  priceEstimate?: number;
  description?: string;
  highlights: string[];
  styleTags: string[];
  floorPlanPdf?: string;
  floorPlanImg?: string;
  seoTitle?: string;
  seoDesc?: string;
  seoKeywords: string[];
  sourceType: DataSource;
  sourceId?: string;
  images?: ApartmentImage[];
  videos?: ApartmentVideo[];
  estimate?: CostEstimate;
  createdAt: Date;
  updatedAt: Date;
}

export type ApartmentStatus =
  | 'AVAILABLE'
  | 'RESERVED'
  | 'SOLD'
  | 'DESIGNING'
  | 'CONSTRUCTING'
  | 'COMPLETED'
  | 'HIDDEN';

export type DataSource = 'MANUAL' | 'ZALO_BOT' | 'WP_SYNC' | 'CSV_IMPORT';

export interface ApartmentImage {
  id: string;
  apartmentId: string;
  url: string;
  alt?: string;
  roomType: RoomType;
  order: number;
  isPrimary: boolean;
  width?: number;
  height?: number;
  size?: number;
}

export type RoomType =
  | 'LIVING_ROOM'
  | 'KITCHEN'
  | 'DINING'
  | 'MASTER_BEDROOM'
  | 'BEDROOM_2'
  | 'BEDROOM_3'
  | 'BATHROOM'
  | 'BALCONY'
  | 'HALLWAY'
  | 'STORAGE'
  | 'FLOORPLAN'
  | 'EXTERIOR'
  | 'DETAIL'
  | 'OTHER';

export type VideoPlatform = 'YOUTUBE' | 'TIKTOK' | 'FACEBOOK' | 'INSTAGRAM' | 'VIMEO';

export interface ApartmentVideo {
  id: string;
  apartmentId: string;
  platform: VideoPlatform;
  videoId?: string;
  url: string;
  title?: string;
  thumbnail?: string;
  duration?: number;
  order: number;
}

// Cost Estimation

export interface CostCategory {
  id: string;
  name: string;
  icon?: string;
  order: number;
  isActive: boolean;
  items?: CostItem[];
}

export interface CostItem {
  id: string;
  categoryId: string;
  category?: CostCategory;
  name: string;
  unit: string;
  unitPriceMin: number;
  unitPriceMax: number;
  description?: string;
  specs?: Record<string, unknown>;
  isActive: boolean;
  order: number;
}

export interface CostTemplate {
  id: string;
  name: string;
  description?: string;
  bedroomCount?: number;
  style?: string;
  baseArea?: number;
  isDefault: boolean;
  items?: CostTemplateItem[];
}

export interface CostTemplateItem {
  id: string;
  templateId: string;
  costItemId: string;
  costItem?: CostItem;
  quantity: number;
  quantityFormula?: string;
  note?: string;
}

export interface CostEstimate {
  id: string;
  apartmentId: string;
  templateId?: string;
  template?: CostTemplate;
  status: EstimateStatus;
  totalMin: number;
  totalMax: number;
  breakdown: Record<string, unknown>;
  notes?: string;
  generatedBy?: string;
  generatedAt: Date;
  validUntil?: Date;
  pdfUrl?: string;
}

export type EstimateStatus = 'DRAFT' | 'SENT' | 'APPROVED' | 'REJECTED' | 'EXPIRED';

// Auth

export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'DESIGNER' | 'SALES' | 'VIEWER';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: Role;
  avatar?: string;
  phone?: string;
  isActive: boolean;
  lastLoginAt?: Date;
}

// Filter

export interface FilterState {
  projectId: string | null;
  towerId: string | null;
  apartmentId: string | null;
  bedroomCount: number | null;
  status: ApartmentStatus[];
  sortBy: SortOption;
  viewMode: 'grid' | 'list';
  page: number;
  pageSize: number;
}

export type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'area_asc' | 'area_desc';

// API

export interface ApiResponse<T> {
  data: T;
  total?: number;
  page?: number;
  pageSize?: number;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}
