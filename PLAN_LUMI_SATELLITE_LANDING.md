# KẾ HOẠCH CHI TIẾT: LANDING PAGE VỆ TINH LUMI DESIGN
**Website chính:** https://noithatlumi.vn/  
**Mục tiêu:** Landing page vệ tinh cao cấp (sleek/modern/premium/luxury) với bộ lọc 3 cấp: **Dự án → Tòa → Mã căn hộ**  
**MVP:** Admin thông minh, bảo mật cao, Zalo Bot sync dữ liệu, báo giá dự toán chi phí

---

## 1. PHÂN TÍCH WEBSITE CHÍNH (noithatlumi.vn)

### 1.1 Brand Identity
| Yếu tố | Chi tiết |
|--------|----------|
| **Tên thương hiệu** | LUMI DESIGN / LUMI DESIGN |
| **Slogan** | "Nơi thấu hiểu và nhào nặn không gian sống" |
| **Phong cách** | Luxury, Premium, Modern, Minimalist, Bespoke |
| **Màu chủ đạo** | Gold/Champagne (#EFA21C, #D4A843), Dark Charcoal (#1A1A1A), Cream/Beige (#F5F0E8), Marble Black/White |
| **Typography** | Serif elegante (Playfair Display / Cormorant Garamond) cho heading, Sans-serif tinh tế (Inter / DM Sans / Outfit) cho body |
| **Tone of voice** | Sang trọng, tinh tế, chuyên nghiệp, nghệ thuật, "tinh bản", "độc bản", "giao thoa" |

### 1.2 Cấu trúc dữ liệu hiện tại (WordPress)
| Taxonomy | Ví dụ | Count |
|----------|-------|-------|
| **Category (Dự án/Khu vực)** | Vinhomes Ocean Park (109), Vinhomes Smart City (21), Ecopark (29), The Charm, The Sakura, Skyforest | 15+ |
| **Tags (Tòa/Phân khu/Loại căn)** | Pavilion, A3, ZR1, SA5, SF3, 1PN, 2PN, 3PN, Studio, Duplex, Penhouse | 50+ |
| **Post Type** | Chỉ có `post` (bài viết dự án) |
| **Media** | Hình ảnh chất lượng cao (WebP/JPG), chưa có PDF mặt bằng, chưa có video embed TikTok/YouTube |

### 1.3 Dữ liệu mẫu từ bài viết
```
Project: Vinhomes Ocean Park → Phân khu Pavilion
Tower: Tòa A3
Apartment: 1PN+ (A3 0703), 2PN, 3PN
Style: Modern Minimalism, Contemporary Modern, Luxury
Materials: Gỗ óc chó, Marble, Acrylic, Kính cường lực, Sơn hiệu ứng bê tông
Content: Mô tả chi tiết từng không gian + 15-20 ảnh/project
Contact: Hotline 058 929 4444, 083 555 7878, Showroom Zurich 1
```

---

## 2. KIẾN TRÚC HỆ THỐNG (SYSTEM ARCHITECTURE)

### 2.1 Tổng quan kiến trúc
```
┌─────────────────────────────────────────────────────────────────┐
│                     LUMI SATELLITE LANDING                      │
├─────────────────────────────────────────────────────────────────┤
│  FRONTEND (Static Site)          │  BACKEND (API + Admin)       │
│  ─────────────────────           │  ─────────────────────       │
│  • Next.js 14 (App Router)       │  • Next.js API Routes        │
│  • Tailwind CSS + Shadcn/UI      │  • Prisma ORM + SQLite/Postgres│
│  • Framer Motion (animations)    │  • NextAuth.js (Auth)        │
│  • React Hook Form + Zod         │  • Zalo OA API Integration   │
│  • TanStack Query (cache)        │  • PDF Generation (pdf-lib)  │
│  • Swiper (gallery)              │  • Cost Estimation Engine    │
│  • YouTube/TikTok Embed          │  • Webhook handlers          │
├──────────────────────────────────┼──────────────────────────────┤
│  DEPLOYMENT (Free Tier)          │  DATA SYNC                   │
│  ─────────────────────           │  ─────────────────────       │
│  • Vercel (Frontend + API)       │  • Zalo OA Webhook → API     │
│  • Cloudflare Pages (Alternative)│  • Cron job sync từ WP API   │
│  • Neon/Turso (DB - Free tier)   │  • Manual CSV/Excel import   │
│  • Cloudflare R2 / Supabase      │  • Image optimization (Sharp)│
│    Storage (Images/PDFs)         │                              │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Tech Stack Decision Matrix
| Layer | Choice | Reason | Free Tier Limits |
|-------|--------|--------|------------------|
| **Framework** | Next.js 14 (App Router) | SSR/SSG/ISR, API routes, edge ready | Vercel: 100GB bandwidth, unlimited personal |
| **Styling** | Tailwind CSS + Shadcn/UI | Utility-first, dark mode, accessible, tiny bundle | N/A |
| **Database** | **Turso (libSQL/SQLite)** | Edge-native, 500MB free, 10k req/day, multi-region | 500MB, 10k req/day |
| **Alternative DB** | Neon (Postgres) | 512MB free, serverless, branching | 512MB, 100h compute/mo |
| **Auth** | NextAuth.js (Credentials + Zalo OAuth) | Secure, JWT, role-based, extensible | N/A |
| **Storage** | Cloudflare R2 | 10GB free, S3-compatible, no egress fees | 10GB, 1M Class A ops |
| **Image Opt** | Next/Image + Sharp | Auto WebP/AVIF, responsive, blur placeholder | N/A |
| **PDF Gen** | pdf-lib / @react-pdf/renderer | Client/server PDF generation | N/A |
| **Video** | YouTube/TikTok Embed (lazy) | No hosting cost, native players | N/A |
| **Forms** | React Hook Form + Zod | Type-safe, minimal bundle | N/A |
| **State/Cache** | TanStack Query v5 | Server state, caching, deduping | N/A |
| **Animation** | Framer Motion | 60fps, layout animations, exit animations | N/A |
| **Monitoring** | Vercel Analytics + Sentry (free) | Real user metrics, error tracking | 100k events/mo |

---

## 3. DATA MODEL (PRISMA SCHEMA)

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "libsql"  // Turso
  url      = env("DATABASE_URL")
  authToken = env("DATABASE_AUTH_TOKEN")
}

// ==================== CORE ENTITIES ====================

model Project {
  id          String   @id @default(cuid())
  slug        String   @unique
  name        String   // "Vinhomes Ocean Park"
  nameEn      String?
  description String?  @db.Text
  shortDesc   String?  // For cards
  location    String?  // "Gia Lâm, Hà Nội"
  developer   String?  // "Vingroup"
  status      ProjectStatus @default(ACTIVE)
  order       Int      @default(0)
  thumbnail   String?  // Hero image
  images      ProjectImage[]
  towers      Tower[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([status, order])
}

enum ProjectStatus {
  ACTIVE
  COMING_SOON
  COMPLETED
  ARCHIVED
}

model ProjectImage {
  id        String   @id @default(cuid())
  projectId String
  project   Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  url       String
  alt       String?
  order     Int      @default(0)
  type      ImageType @default(GALLERY)
}

enum ImageType {
  HERO
  GALLERY
  FLOORPLAN
  MAP
}

model Tower {
  id          String   @id @default(cuid())
  slug        String   @unique
  projectId   String
  project     Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  name        String   // "Tòa A3", "Phân khu Pavilion", "Tòa ZR1"
  nameEn      String?
  description String?  @db.Text
  address     String?
  floors      Int?
  unitsPerFloor Int?
  status      TowerStatus @default(ACTIVE)
  order       Int      @default(0)
  thumbnail   String?
  apartments  Apartment[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([projectId, slug])
  @@index([projectId, status, order])
}

enum TowerStatus {
  ACTIVE
  COMING_SOON
  SOLD_OUT
}

model Apartment {
  id            String   @id @default(cuid())
  slug          String   @unique  // "A3-0703", "Pavilion-1205"
  towerId       String
  tower         Tower    @relation(fields: [towerId], references: [id], onDelete: Cascade)
  code          String   // "A3 0703", "Pavilion 1205"
  floor         Int
  unitNumber    String   // "0703", "1205"
  bedroomCount  Int      // 1, 2, 3, 4
  bathroomCount Int
  area          Float    // m2
  direction     String?  // "Đông", "Tây-Bắc", "Nam"
  layoutType    String?  // "1PN+", "2PN", "3PN", "Studio", "Duplex"
  status        ApartmentStatus @default(AVAILABLE)
  priceEstimate Float?   // Giá tham chiếu (triệu VNĐ)
  
  // Content
  description   String?  @db.Text
  highlights    String[] // ["Bespoke", "Smart home", "Marble"]
  styleTags     String[] // ["Modern", "Luxury", "Minimalism"]
  
  // Media
  floorPlanPdf  String?  // URL to PDF
  floorPlanImg  String?  // Thumbnail của PDF
  images        ApartmentImage[]
  videos        ApartmentVideo[]
  
  // SEO/Metadata
  seoTitle      String?
  seoDesc       String?
  seoKeywords   String[]
  
  // Sync metadata
  sourceType    DataSource @default(MANUAL) // MANUAL, ZALO_BOT, WP_SYNC, CSV_IMPORT
  sourceId      String?  // ID từ nguồn gốc (WP post ID, Zalo message ID)
  lastSyncedAt  DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@unique([towerId, code])
  @@index([towerId, status])
  @@index([bedroomCount, status])
  @@index([sourceType, sourceId])
}

enum ApartmentStatus {
  AVAILABLE
  RESERVED
  SOLD
  DESIGNING
  CONSTRUCTING
  COMPLETED
  HIDDEN
}

enum DataSource {
  MANUAL
  ZALO_BOT
  WP_SYNC
  CSV_IMPORT
  API_IMPORT
}

model ApartmentImage {
  id           String   @id @default(cuid())
  apartmentId  String
  apartment    Apartment @relation(fields: [apartmentId], references: [id], onDelete: Cascade)
  url          String
  alt          String?
  roomType     RoomType @default(LIVING_ROOM)
  order        Int      @default(0)
  isPrimary    Boolean  @default(false)
  width        Int?
  height       Int?
  size         Int?     // bytes
  createdAt    DateTime @default(now())
}

enum RoomType {
  LIVING_ROOM
  KITCHEN
  DINING
  MASTER_BEDROOM
  BEDROOM_2
  BEDROOM_3
  BATHROOM
  BALCONY
  HALLWAY
  STORAGE
  FLOORPLAN
  EXTERIOR
  DETAIL
  OTHER
}

model ApartmentVideo {
  id           String   @id @default(cuid())
  apartmentId  String
  apartment    Apartment @relation(fields: [apartmentId], references: [id], onDelete: Cascade)
  platform     VideoPlatform
  videoId      String   // YouTube ID or TikTok ID
  url          String   // Full URL
  title        String?
  thumbnail    String?
  duration     Int?     // seconds
  order        Int      @default(0)
  createdAt    DateTime @default(now())
}

enum VideoPlatform {
  YOUTUBE
  TIKTOK
  FACEBOOK
  INSTAGRAM
  VIMEO
}

// ==================== COST ESTIMATION ====================

model CostCategory {
  id          String   @id @default(cuid())
  name        String   // "Thiết kế", "Thi công", "Nội thất", "Vật liệu", "Khác"
  nameEn      String?
  icon        String?  // Lucide icon name
  order       Int      @default(0)
  isActive    Boolean  @default(true)
  items       CostItem[]
}

model CostItem {
  id            String   @id @default(cuid())
  categoryId    String
  category      CostCategory @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  name          String   // "Sơn tường cao cấp", "Gỗ óc chó nhập khẩu"
  unit          String   // "m2", "m", "cái", "bộ", "lô"
  unitPriceMin  Float    // Giá tối thiểu (VNĐ)
  unitPriceMax  Float    // Giá tối đa (VNĐ)
  description   String?
  specs         Json?    // Thông số kỹ thuật: {brand: "Dulux", grade: "Premium"}
  isActive      Boolean  @default(true)
  order         Int      @default(0)
}

model CostTemplate {
  id            String   @id @default(cuid())
  name          String   // "Căn 2PN Standard", "Căn 3PN Luxury", "Biệt thự Premium"
  description   String?
  bedroomCount  Int      // Áp dụng cho loại căn nào
  style         String?  // "Modern", "Luxury", "Minimalism"
  baseArea      Float?   // Diện tích cơ sở (m2)
  items         CostTemplateItem[]
  isDefault     Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model CostTemplateItem {
  id           String   @id @default(cuid())
  templateId   String
  template     CostTemplate @relation(fields: [templateId], references: [id], onDelete: Cascade)
  costItemId   String
  costItem     CostItem @relation(fields: [costItemId], references: [id], onDelete: Cascade)
  quantity     Float    // Số lượng ước tính
  quantityFormula String? // Công thức: "area * 2.5", "bedroomCount * 1"
  note         String?
}

model CostEstimate {
  id            String   @id @default(cuid())
  apartmentId   String   @unique
  apartment     Apartment @relation(fields: [apartmentId], references: [id], onDelete: Cascade)
  templateId    String?
  template      CostTemplate? @relation(fields: [templateId], references: [id], onDelete: SetNull)
  status        EstimateStatus @default(DRAFT)
  totalMin      Float    @default(0)
  totalMax      Float    @default(0)
  breakdown     Json     // Chi tiết từng hạng mục
  notes         String?  @db.Text
  generatedBy   String?  // User ID or "AUTO"
  generatedAt   DateTime @default(now())
  validUntil    DateTime?
  pdfUrl        String?  // Link PDF báo giá
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

enum EstimateStatus {
  DRAFT
  SENT
  APPROVED
  REJECTED
  EXPIRED
}

// ==================== ADMIN & AUTH ====================

model User {
  id            String   @id @default(cuid())
  email         String   @unique
  name          String?
  passwordHash  String?  // For credentials auth
  role          Role     @default(SALES)
  avatar        String?
  phone         String?
  zaloId        String?  @unique // Zalo OA user ID
  isActive      Boolean  @default(true)
  lastLoginAt   DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  estimates     CostEstimate[] @relation("EstimateCreator")
  activities    ActivityLog[]
  sessions      Session[]
}

enum Role {
  SUPER_ADMIN
  ADMIN
  MANAGER
  DESIGNER
  SALES
  VIEWER
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  token     String   @unique
  expiresAt DateTime
  ip        String?
  userAgent String?
  createdAt DateTime @default(now())
}

model ActivityLog {
  id        String   @id @default(cuid())
  userId    String?
  user      User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
  action    String   // "CREATE", "UPDATE", "DELETE", "SYNC", "EXPORT", "LOGIN"
  entity    String   // "Apartment", "Project", "Estimate", "User"
  entityId  String
  oldData   Json?
  newData   Json?
  ip        String?
  userAgent String?
  createdAt DateTime @default(now())
  
  @@index([entity, entityId])
  @@index([userId, createdAt])
  @@index([createdAt])
}

// ==================== ZALO BOT INTEGRATION ====================

model ZaloOAToken {
  id           String   @id @default(cuid())
  accessToken  String   @unique
  refreshToken String   @unique
  expiresAt    DateTime
  oaId         String   // Zalo OA ID
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model ZaloMessage {
  id           String   @id @default(cuid())
  messageId    String   @unique // Zalo message ID
  userId       String   // Zalo user ID
  userName     String?
  userPhone    String?
  messageType  ZaloMessageType
  content      String   @db.Text
  rawData      Json     // Full webhook payload
  processed    Boolean  @default(false)
  processedAt  DateTime?
  result       Json?    // Parsed data: {project, tower, apartment, images, videos}
  error        String?
  createdAt    DateTime @default(now())
  
  @@index([userId, createdAt])
  @@index([processed, createdAt])
}

enum ZaloMessageType {
  TEXT
  IMAGE
  VIDEO
  FILE
  LOCATION
  CONTACT
  STICKER
}

model ZaloSyncLog {
  id          String   @id @default(cuid())
  triggerType SyncTrigger
  status      SyncStatus
  stats       Json     // {created: 5, updated: 3, failed: 1}
  error       String?
  startedAt   DateTime @default(now())
  completedAt DateTime?
}

enum SyncTrigger {
  WEBHOOK
  CRON
  MANUAL
  ZALO_BOT_COMMAND
}

enum SyncStatus {
  PENDING
  RUNNING
  COMPLETED
  FAILED
  PARTIAL
}

// ==================== SETTINGS ====================

model Setting {
  id        String   @id @default(cuid())
  key       String   @unique
  value     Json
  type      SettingType
  group     String   // "general", "zalo", "cost", "seo", "security"
  label     String
  description String?
  isPublic  Boolean  @default(false)
  updatedAt DateTime @updatedAt
}

enum SettingType {
  STRING
  NUMBER
  BOOLEAN
  JSON
  SECRET
}
```

---

## 4. FRONTEND ARCHITECTURE (LANDING PAGE)

### 4.1 Route Structure (Next.js App Router)
```
app/
├── (public)/
│   ├── layout.tsx                 # Root layout: SEO, fonts, providers
│   ├── page.tsx                   # Landing page (Hero + Filter + Results)
│   ├── globals.css                # Tailwind + custom CSS variables
│   ├── components/
│   │   ├── ui/                    # Shadcn/UI components
│   │   ├── layout/
│   │   │   ├── Header.tsx         # Logo, nav, language, theme toggle
│   │   │   ├── Footer.tsx         # Contact, social, links
│   │   │   └── MobileNav.tsx
│   │   ├── hero/
│   │   │   ├── HeroSection.tsx    # Video background + CTA
│   │   │   ├── HeroStats.tsx      # Counter animation
│   │   │   └── ScrollIndicator.tsx
│   │   ├── filter/
│   │   │   ├── FilterBar.tsx      # 3-level cascading select
│   │   │   ├── ProjectSelect.tsx
│   │   │   ├── TowerSelect.tsx
│   │   │   ├── ApartmentSelect.tsx
│   │   │   ├── FilterURLSync.tsx  # Sync with URL params
│   │   │   └── FilterResults.tsx  # Grid/List view toggle
│   │   ├── apartment/
│   │   │   ├── ApartmentCard.tsx  # Card view (image + key info)
│   │   │   ├── ApartmentDetail.tsx# Modal/Page detail
│   │   │   ├── Gallery.tsx        # Swiper + lightbox
│   │   │   ├── VideoPlayer.tsx    # YouTube/TikTok lazy embed
│   │   │   ├── FloorPlanViewer.tsx# PDF.js viewer
│   │   │   ├── CostEstimateCTA.tsx# Nút "Xem báo giá"
│   │   │   └── ShareButtons.tsx   # Zalo, FB, Copy link
│   │   ├── ui-effects/
│   │   │   ├── MagneticButton.tsx
│   │   │   ├── ParallaxScroll.tsx
│   │   │   ├── TextReveal.tsx
│   │   │   ├── ImageReveal.tsx
│   │   │   └── CursorGlow.tsx
│   │   └── common/
│   │       ├── LoadingSkeleton.tsx
│   │       ├── ErrorBoundary.tsx
│   │       └── SEO.tsx
│   ├── lib/
│   │   ├── api.ts                 # TanStack Query hooks
│   │   ├── utils.ts               # cn(), formatters, validators
│   │   ├── constants.ts           # Enums, config
│   │   └── validations.ts         # Zod schemas
│   ├── hooks/
│   │   ├── useFilter.ts           # Filter state + URL sync
│   │   ├── useApartments.ts       # Query hooks
│   │   ├── useCostEstimate.ts
│   │   └── useMediaQuery.ts
│   └── types/
│       └── index.ts               # TypeScript types from Prisma
│
├── (admin)/
│   ├── layout.tsx                 # Admin layout with sidebar
│   ├── login/page.tsx
│   ├── dashboard/page.tsx
│   ├── projects/
│   │   ├── page.tsx               # List + CRUD
│   │   └── [id]/page.tsx          # Detail + towers
│   ├── towers/
│   ├── apartments/
│   │   ├── page.tsx               # Table + filters + bulk actions
│   │   ├── [id]/page.tsx          # Detail editor (tabs: Info, Media, Cost)
│   │   └── import/page.tsx        # CSV/Excel import
│   ├── cost-estimation/
│   │   ├── categories/page.tsx
│   │   ├── items/page.tsx
│   │   ├── templates/page.tsx
│   │   └── estimates/page.tsx
│   ├── zalo-bot/
│   │   ├── page.tsx               # Webhook config, message log
│   │   ├── messages/page.tsx      # Inbox-style message viewer
│   │   └── sync/page.tsx          # Manual sync trigger + logs
│   ├── users/page.tsx
│   ├── settings/page.tsx
│   └── activity-log/page.tsx
│
├── api/
│   ├── auth/[...nextauth]/route.ts
│   ├── projects/
│   │   ├── route.ts               # GET list, POST create
│   │   └── [id]/route.ts          # GET, PUT, DELETE
│   ├── towers/
│   ├── apartments/
│   │   ├── route.ts               # GET (with filters), POST
│   │   ├── [id]/route.ts
│   │   ├── [id]/images/route.ts
│   │   ├── [id]/videos/route.ts
│   │   ├── [id]/floorplan/route.ts
│   │   └── [id]/estimate/route.ts # GET/POST cost estimate
│   ├── cost/
│   │   ├── categories/route.ts
│   │   ├── items/route.ts
│   │   ├── templates/route.ts
│   │   └── estimate/route.ts
│   ├── zalo/
│   │   ├── webhook/route.ts       # Zalo OA webhook endpoint
│   │   ├── sync/route.ts          # Manual sync trigger
│   │   └── token/route.ts         # Token management
│   ├── upload/
│   │   ├── image/route.ts         # Upload to R2, return URL
│   │   ├── video/route.ts
│   │   └── pdf/route.ts
│   ├── sync/
│   │   ├── wordpress/route.ts     # Sync from WP API
│   │   └── csv/route.ts
│   └── health/route.ts
│
├── middleware.ts                  # Auth, i18n, security headers
├── robots.ts
├── sitemap.ts
└── manifest.ts
```

### 4.2 Component Architecture - Filter System (Core Feature)

```typescript
// components/filter/FilterBar.tsx
// 3-Level Cascading Select with URL Sync

interface FilterState {
  projectId: string | null;
  towerId: string | null;
  apartmentId: string | null;
  bedroomCount?: number;
  status?: ApartmentStatus[];
  sortBy: 'newest' | 'price_asc' | 'price_desc' | 'area_asc' | 'area_desc';
  viewMode: 'grid' | 'list';
}

const FilterBar = () => {
  const router = useRouter();
  const { data: projects } = useProjects();
  const { data: towers } = useTowers(filterState.projectId);
  const { data: apartments } = useApartments({
    towerId: filterState.towerId,
    bedroomCount: filterState.bedroomCount,
    status: filterState.status,
  });

  // URL Sync: ?project=ocean-park&tower=a3&apartment=a3-0703&beds=2&view=grid
  // Auto-reset downstream when upstream changes
};
```

**UX Flow:**
1. **Level 1 - Project**: Dropdown với thumbnail, tên, số lượng tòa/căn
2. **Level 2 - Tower**: Chỉ hiển thị tòa thuộc dự án đã chọn, badge trạng thái (Còn trống/Hết/Chờ)
3. **Level 3 - Apartment**: Grid/List view với filter phụ (số phòng, hướng, diện tích, trạng thái)
4. **URL Sync**: Mỗi lựa chọn cập nhật URL → shareable, bookmarkable, SEO-friendly
5. **Keyboard Nav**: Tab/Enter/Escape support, type-ahead search

### 4.3 Luxury UI/UX Specifications

| Component | Specification |
|-----------|---------------|
| **Color System** | CSS Variables: `--gold`, `--gold-light`, `--charcoal`, `--cream`, `--marble-dark`, `--marble-light`, `--glass-bg`, `--glass-border` |
| **Dark Mode** | Default dark (luxury), light mode toggle, system preference respect |
| **Typography** | Heading: `Cormorant Garamond` (Variable font wght 300-700) / Body: `Outfit` (Variable 300-600) |
| **Spacing Scale** | 4px base, clamp(1rem, 2vw, 2rem) responsive |
| **Border Radius** | `--radius-sm: 4px`, `--radius-md: 8px`, `--radius-lg: 16px`, `--radius-xl: 24px`, `--radius-full: 9999px` |
| **Shadows** | Layered: `shadow-soft`, `shadow-medium`, `shadow-strong`, `shadow-gold` (gold glow) |
| **Glassmorphism** | `backdrop-blur-xl`, `bg-white/5`, `border-white/10` for cards/modals |
| **Animations** | Framer Motion: `whileHover`, `whileTap`, `variants` for stagger, `layout` for FLIP |
| **Page Transitions** | `AnimatePresence` + `layout` for smooth route transitions |
| **Scroll** | `Locomotive Scroll` or native `scroll-driven-animations` for parallax/reveal |
| **Cursor** | Custom magnetic cursor với glow effect (desktop only) |
| **Loading** | Skeleton screens với shimmer effect, progressive image loading (blur-up) |

### 4.4 Apartment Detail View (Modal/Page)
```
┌─────────────────────────────────────────────────────────────┐
│  [← Back]  Vinhomes Ocean Park / Tòa A3 / A3-0703  [Share]  │
├─────────────────────────────────────────────────────────────┤
│  GALLERY (Swiper)                    │  INFO PANEL (Sticky) │
│  ┌─────────────────────────────┐     │  ┌─────────────────┐  │
│  │  [Image 1/15]  ◀ ▶          │     │  │ 2PN • 78m² • Đông │  │
│  │  [Thumbnails strip]         │     │  │ 📍 Tòa A3, P.0703 │  │
│  └─────────────────────────────┘     │  │ 💰 2.5 - 3.5 tỷ   │  │
│  [Tabs: Ảnh | Video | Mặt bằng]      │  │ [Xem báo giá ▼]   │  │
│                                      │  │ ──────────────── │  │
│  VIDEO SECTION                       │  │ Highlights:     │  │
│  ┌─────────────┐ ┌─────────────┐     │  │ ✦ Bespoke       │  │
│  │ YouTube     │ │ TikTok      │     │  │ ✦ Smart Home    │  │
│  │ Embed (lazy)│ │ Embed (lazy)│     │  │ ✦ Marble        │  │
│  └─────────────┘ └─────────────┘     │  │ ──────────────── │  │
│                                      │  │ Mô tả dự án...  │  │
│  FLOOR PLAN (PDF.js)                 │  │ [PDF Mặt bằng]  │  │
│  ┌─────────────────────────────┐     │  │ [Liên hệ Sale]  │  │
│  │  [PDF Viewer with zoom/pan] │     │  └─────────────────┘  │
│  └─────────────────────────────┘     │                       │
└──────────────────────────────────────┴───────────────────────┘
```

---

## 5. ADMIN SYSTEM (MVP)

### 5.1 Role-Based Access Control (RBAC)

| Role | Projects | Towers | Apartments | Cost Items | Templates | Estimates | Zalo Bot | Users | Settings | Logs |
|------|:--------:|:------:|:----------:|:----------:|:---------:|:---------:|:--------:|:-----:|:--------:|:----:|
| **SUPER_ADMIN** | CRUD | CRUD | CRUD | CRUD | CRUD | CRUD | Full | CRUD | Full | Read |
| **ADMIN** | CRUD | CRUD | CRUD | CRUD | CRUD | CRUD | Manage | Read | Partial | Read |
| **MANAGER** | Read | CRUD | CRUD | Read | CRUD | CRUD | View | - | - | Read |
| **DESIGNER** | Read | Read | CRUD* | Read | Read | Create | - | - | - | - |
| **SALES** | Read | Read | Read | - | - | Create/Read | View | - | - | - |
| **VIEWER** | Read | Read | Read | - | - | Read | - | - | - | - |

*Designer chỉ edit media/mô tả, không đổi status/pricing

### 5.2 Admin Features (Priority Order)

#### Phase 1 - Core (Week 1-2)
- [ ] **Auth**: NextAuth.js + Credentials + Zalo OAuth, JWT, 2FA (TOTP), session management
- [ ] **Dashboard**: Stats cards (Projects, Towers, Apartments, Estimates, Sync status), Recent activity feed
- [ ] **Project CRUD**: List (table + search), Create/Edit modal, Drag-drop reorder, Archive/Restore
- [ ] **Tower CRUD**: Nested under project, bulk create from CSV
- [ ] **Apartment CRUD**: 
  - Table view với inline edit (status, price, bedroom)
  - Detail tabs: **Thông tin** | **Hình ảnh** | **Video** | **Mặt bằng** | **Báo giá**
  - Bulk actions: Update status, Assign template, Export CSV, Generate estimates
  - Image upload: Drag-drop, multi-select, reorder, alt text, auto WebP conversion
  - Video: Paste URL → auto-detect platform, fetch thumbnail/title

#### Phase 2 - Cost Estimation (Week 3)
- [ ] **Cost Categories/Items Management**: CRUD, unit pricing min/max, specs JSON
- [ ] **Templates**: Visual builder (drag-drop items, set quantity/formula), preview calculation
- [ ] **Estimate Generator**: 
  - Auto-match template by bedroom/style/area
  - Manual override quantities
  - Real-time min/max total
  - PDF export (branded, detailed breakdown)
  - Version history

#### Phase 3 - Zalo Bot & Sync (Week 4)
- [ ] **Zalo OA Setup**: Webhook config, token management, connection test
- [ ] **Message Inbox**: Real-time message viewer, filter by processed/unprocessed
- [ ] **Parser Engine**: 
  - Regex/ML pattern matching cho format tin nhắn sale gửi
  - Extract: Project, Tower, Apartment code, Images, Videos, Floorplan
  - Confidence scoring, manual review queue
- [ ] **Sync Dashboard**: Manual trigger, cron schedule, logs, rollback

#### Phase 4 - Polish & Security (Week 5)
- [ ] **Activity Log**: Full audit trail, filter, export
- [ ] **Settings**: General, SEO, Cost defaults, Security (rate limit, IP allowlist), Backup
- [ ] **Performance**: Query optimization, indexes, caching strategy
- [ ] **Tests**: E2E (Playwright), Unit (Vitest), API contract

---

## 6. ZALO BOT INTEGRATION

### 6.1 Zalo OA Architecture
```
┌─────────────┐     Webhook      ┌──────────────┐     Parse/Validate    ┌─────────────┐
│  Sale/User  │ ──────────────▶ │  /api/zalo/  │ ──────────────────▶  │  Parser     │
│  (Zalo App) │   (HTTPS POST)  │   webhook    │   (Queue + Worker)   │  Engine     │
└─────────────┘                 └──────────────┘                      └──────┬──────┘
                                                                             │
                    ┌──────────────┐     Sync Result      ┌──────────────┐  │
                    │  Zalo User   │ ◀────────────────── │  Database    │ ◀┘
                    │  (Reply)     │   (Success/Fail)    │  (Prisma)    │
                    └──────────────┘                     └──────────────┘
```

### 6.2 Message Format Specification (Sale gửi cho Bot)
```
Format chuẩn (text + images):
---
📍 Dự án: Vinhomes Ocean Park
🏢 Tòa: A3 (Phân khu Pavilion)
🏠 Căn: A3-0703 (2PN, 78m², Hướng Đông)
💰 Giá tham chiếu: 2.8 - 3.2 tỷ
✨ Highlights: Bespoke, Smart Home, Marble
🎨 Phong cách: Modern Luxury
📎 Mặt bằng: [File PDF]
🖼️ Hình ảnh: [5-15 ảnh]
🎬 Video: https://youtube.com/... | https://tiktok.com/...
---
```

### 6.3 Parser Strategy
```typescript
// lib/zalo/parser.ts
interface ParsedApartmentData {
  project: { name: string; slug: string };
  tower: { name: string; slug: string };
  apartment: {
    code: string;
    floor: number;
    unitNumber: string;
    bedroomCount: number;
    bathroomCount: number;
    area: number;
    direction: string;
    layoutType: string;
    priceEstimateMin: number;
    priceEstimateMax: number;
    highlights: string[];
    styleTags: string[];
    description: string;
  };
  media: {
    floorPlanPdf?: File;
    images: File[];      // Max 20, auto-compress
    videos: { url: string; platform: VideoPlatform }[];
  };
  confidence: number; // 0-1
  rawText: string;
}

// Parser pipeline:
// 1. Text extraction (regex patterns for each field)
// 2. Entity matching (fuzzy match project/tower from DB)
// 3. Media processing (download, optimize, upload to R2)
// 4. Validation (Zod schema)
// 5. Confidence scoring
// 6. If confidence < 0.8 → Review queue
// 7. If confidence >= 0.8 → Auto-create/update
```

### 6.4 Bot Commands (Zalo OA Menu)
| Command | Action |
|---------|--------|
| `/sync` | Trigger full sync từ WordPress |
| `/stats` | Thống kê: số dự án, tòa, căn, báo giá hôm nay |
| `/estimate <mã căn>` | Tạo báo giá nhanh, reply PDF |
| `/help` | Hướng dẫn format tin nhắn |
| `/status <mã căn>` | Check trạng thái căn hộ |

---

## 7. COST ESTIMATION ENGINE

### 7.1 Calculation Logic
```typescript
// lib/cost/engine.ts
interface EstimateInput {
  apartmentId: string;
  templateId?: string;
  overrides?: Record<string, number>; // costItemId -> quantity
}

interface EstimateResult {
  items: EstimatedItem[];
  totalMin: number;
  totalMax: number;
  breakdown: CategoryBreakdown[];
}

interface EstimatedItem {
  costItemId: string;
  name: string;
  unit: string;
  quantity: number;
  unitPriceMin: number;
  unitPriceMax: number;
  lineTotalMin: number;
  lineTotalMax: number;
  specs?: Record<string, any>;
}

function calculateEstimate(input: EstimateInput): EstimateResult {
  // 1. Get apartment data (area, bedroom, style)
  // 2. Select template (explicit or auto-match)
  // 3. For each template item:
  //    - Resolve quantity: formula (area * factor) or fixed
  //    - Apply overrides
  //    - Calculate line totals
  // 4. Aggregate by category
  // 5. Apply global margins (VAT, management fee, contingency)
  // 6. Return structured result
}
```

### 7.2 PDF Report Template
```
╔═══════════════════════════════════════════════════════════════════╗
║                    LUMI DESIGN - BÁO GIÁ DỰ TOÁN                 ║
║                    THIẾT KẾ & THI CÔNG NỘI THẤT                  ║
╠═══════════════════════════════════════════════════════════════════╣
║  Khách hàng: [Tên/SĐT]          Căn hộ: [A3-0703]               ║
║  Dự án: Vinhomes Ocean Park     Tòa: A3 - Pavilion              ║
║  Diện tích: 78m² | 2PN 2WC      Hướng: Đông                     ║
║  Phong cách: Modern Luxury      Ngày: 10/07/2026                ║
╠═══════════════════════════════════════════════════════════════════╣
║  HẠNG MỤC                    │ ĐVT  │ SL  │ ĐƠN GIÁ (VNĐ)      ║
║                              │      │     │ Tối thiểu - Tối đa  ║
╠═══════════════════════════════════════════════════════════════════╣
║  I. THIẾT KẾ                                                            ║
║     - Bản vẽ thi công 2D/3D    │ Bộ   │ 1   │ 15.000.000 - 25.000.000║
║     - Render phối cảnh         │ Cảnh │ 8   │ 2.000.000 - 3.500.000 ║
╠═══════════════════════════════════════════════════════════════════╣
║  II. THI CÔNG (CÔNG TRÌNH)                                              ║
║     - Gạch men sàn size 60x60  │ m²   │ 78  │ 350.000 - 550.000    ║
║     - Sơn tường cao cấp        │ m²   │ 280 │ 180.000 - 280.000    ║
║     - Trần gypsum/gypsum decor │ m²   │ 78  │ 450.000 - 650.000    ║
╠═══════════════════════════════════════════════════════════════════╣
║  III. NỘI THẤT (BESPOKE)                                                ║
║     - Tủ kitchen acrylic       │ m    │ 4.5 │ 8.000.000 - 12.000.000║
║     - Tủ quần áo kịch trần     │ m²   │ 12  │ 6.500.000 - 9.000.000║
║     - Bàn ghế sofa da nhập     │ Bộ   │ 1   │ 45.000.000 - 65.000.000║
╠═══════════════════════════════════════════════════════════════════╣
║  TỔNG CỘNG (Chưa VAT 10%)     │      │     │ 420.000.000 - 620.000.000║
║  VAT (10%)                    │      │     │ 42.000.000 - 62.000.000  ║
║  PHỤ PHÍ (5% dự phòng)        │      │     │ 21.000.000 - 31.000.000  ║
╠═══════════════════════════════════════════════════════════════════╣
║  TỔNG THANH TOÁN              │      │     │ 483.000.000 - 713.000.000║
║         (≈ 483 - 713 triệu VNĐ)                                       ║
╚═══════════════════════════════════════════════════════════════════╝
```

---

## 8. DEPLOYMENT & OPERATIONS

### 8.1 Free Tier Deployment Strategy

| Service | Purpose | Free Limit | Config |
|---------|---------|------------|--------|
| **Vercel** | Frontend + API Routes | 100GB bandwidth, 100GB-hours compute | `vercel.json` with `functions.maxDuration: 30` |
| **Turso (libSQL)** | Primary Database | 500MB, 10k req/day, 3 locations | `DATABASE_URL=libsql://...` |
| **Neon** | Backup/Analytics DB | 512MB, 100h compute/mo | Read replica for reports |
| **Cloudflare R2** | Image/PDF/Video Storage | 10GB, 1M Class A ops | S3-compatible, custom domain |
| **Cloudflare Workers** | Edge middleware (auth, rate limit) | 100k req/day | `wrangler.toml` |
| **Vercel Analytics** | Web Vitals, Page views | 100k events/mo | Auto-enabled |
| **Sentry** | Error tracking | 5k errors/mo, 10k transactions | DSN in env |
| **UptimeRobot** | Uptime monitoring | 50 monitors, 5-min interval | Webhook to Slack/Zalo |

### 8.2 Environment Variables
```env
# .env.example
# App
NEXT_PUBLIC_APP_URL=https://lumi-satellite.vercel.app
NEXT_PUBLIC_APP_NAME="Lumi Design - Tìm căn hộ"
NODE_ENV=production

# Auth
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
NEXTAUTH_URL=https://lumi-satellite.vercel.app
ZALO_OA_CLIENT_ID=your_zalo_oa_client_id
ZALO_OA_CLIENT_SECRET=your_zalo_oa_client_secret
ZALO_OA_REDIRECT_URI=https://lumi-satellite.vercel.app/api/auth/callback/zalo

# Database (Turso)
DATABASE_URL=libsql://your-db.turso.io
DATABASE_AUTH_TOKEN=your_auth_token

# Storage (Cloudflare R2)
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=lumi-assets
R2_PUBLIC_URL=https://pub-xxx.r2.dev
NEXT_PUBLIC_R2_PUBLIC_URL=https://pub-xxx.r2.dev

# Zalo OA
ZALO_OA_ID=your_oa_id
ZALO_OA_SECRET_KEY=your_secret_key
ZALO_WEBHOOK_SECRET=generate-random-secret
ZALO_VERIFY_TOKEN=generate-random-token

# Email (Optional - for notifications)
RESEND_API_KEY=re_xxx
NOTIFICATION_EMAIL=admin@lumi.design

# Security
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=60000
ALLOWED_IPS=1.2.3.4,5.6.7.8  # Admin IPs
CRON_SECRET=generate-random-secret

# Feature Flags
NEXT_PUBLIC_ENABLE_COST_ESTIMATE=true
NEXT_PUBLIC_ENABLE_ZALO_SYNC=true
NEXT_PUBLIC_ENABLE_DARK_MODE=true
```

### 8.3 CI/CD Pipeline (GitHub Actions)
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint-type-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test:unit
      - run: npm run test:e2e

  deploy-preview:
    needs: lint-type-test
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod=false'

  deploy-production:
    needs: lint-type-test
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod=true'
      - name: Run DB Migration
        run: npx prisma migrate deploy
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          DATABASE_AUTH_TOKEN: ${{ secrets.DATABASE_AUTH_TOKEN }}
```

### 8.4 Monitoring & Alerting
```typescript
// lib/monitoring/health.ts
export const healthChecks = [
  { name: 'Database', check: () => db.$queryRaw`SELECT 1` },
  { name: 'R2 Storage', check: () => r2.headObject({ Bucket, Key: 'health.txt' }) },
  { name: 'Zalo API', check: () => fetch('https://openapi.zalo.me/v2.0/oa/getinfo') },
  { name: 'WordPress Sync', check: () => fetch('https://noithatlumi.vn/wp-json/wp/v2/posts?per_page=1') },
];

// Cron job (Vercel Cron / GitHub Actions)
export const cronJobs = [
  { schedule: '0 2 * * *', command: 'sync:wordpress' },      // Daily 2AM
  { schedule: '0 */6 * * *', command: 'sync:zalo-pending' }, // Every 6h
  { schedule: '0 3 * * 0', command: 'db:backup' },           // Weekly Sunday 3AM
  { schedule: '*/15 * * * *', command: 'health:check' },     // Every 15min
];
```

---

## 9. SECURITY CHECKLIST

| Layer | Measures |
|-------|----------|
| **Authentication** | NextAuth.js v5, JWT strategy, HttpOnly cookies, CSRF protection, 2FA (TOTP) |
| **Authorization** | RBAC middleware on every API route, Prisma row-level policies |
| **API Security** | Rate limiting (100 req/min/IP), CORS strict, Helmet headers, Input validation (Zod) |
| **Data Protection** | Encryption at rest (Turso), TLS 1.3 in transit, PII minimization, Audit logs |
| **Secrets** | Vercel/Cloudflare encrypted env, Rotation policy (90 days), No secrets in code |
| **File Upload** | Type validation (magic bytes), Size limits (10MB img, 50MB pdf, 100MB video), Virus scan (ClamAV on upload) |
| **Zalo Webhook** | Signature verification, IP allowlist (Zalo CIDR), Replay protection (nonce) |
| **Admin Access** | IP allowlist, Session timeout (30min), Concurrent session limit (2), Activity logging |
| **Dependencies** | `npm audit` in CI, Dependabot alerts, Pin exact versions, Minimal deps |

---

## 10. IMPLEMENTATION ROADMAP

### Sprint 0: Foundation (Week 0) - 3 days
- [ ] Repo setup: Next.js 14 + TypeScript + Tailwind + ESLint + Prettier + Husky
- [ ] Prisma + Turso setup, initial migration
- [ ] NextAuth.js config (Credentials + Zalo OAuth)
- [ ] CI/CD pipeline (GitHub Actions → Vercel)
- [ ] Component library: Shadcn/UI + custom luxury components
- [ ] Design system: Colors, Typography, Spacing, Dark mode

### Sprint 1: Public Landing + Filter (Week 1-2) - 10 days
- [ ] Hero section với video background, stats counter, scroll indicator
- [ ] **3-Level Filter System** (Core MVP feature)
  - Project → Tower → Apartment cascading selects
  - URL synchronization (shareable links)
  - Keyboard navigation, mobile responsive
  - Loading skeletons, error states
- [ ] Apartment Grid/List view với infinite scroll
- [ ] Apartment Detail Modal/Page
  - Gallery (Swiper + lightbox)
  - Video tabs (YouTube/TikTok lazy load)
  - PDF Floorplan viewer (PDF.js)
  - Cost Estimate CTA button
- [ ] SEO: Meta tags, Open Graph, JSON-LD, Sitemap, Robots
- [ ] Performance: Image optimization, Code splitting, Prefetching

### Sprint 2: Admin Core (Week 3-4) - 10 days
- [ ] Admin layout: Sidebar, Header, Breadcrumbs, User menu
- [ ] Dashboard: Stats cards, Charts (Recharts), Activity feed
- [ ] Project/Tower CRUD (Modal forms, Drag-drop reorder)
- [ ] Apartment Management
  - Table: TanStack Table v8 (sort, filter, pagination, column visibility)
  - Detail: Tabbed interface (Info/Media/Video/Floorplan/Cost)
  - Media manager: Upload, reorder, crop, alt text, bulk actions
  - Bulk operations: Status update, Template assign, Export, Estimate generate
- [ ] User management + Role assignment

### Sprint 3: Cost Estimation Engine (Week 5) - 7 days
- [ ] Cost Category/Item CRUD
- [ ] Template Builder (Visual drag-drop, formula support)
- [ ] Estimate Generator (Auto-match + Manual override)
- [ ] PDF Report Generation (@react-pdf/renderer + custom fonts)
- [ ] Estimate History & Versioning

### Sprint 4: Zalo Bot & Sync (Week 6) - 7 days
- [ ] Zola OA Webhook endpoint + Signature verification
- [ ] Message Inbox UI (Real-time with SSE/WebSocket)
- [ ] Parser Engine (Regex + Fuzzy matching + Confidence scoring)
- [ ] Review Queue (Low confidence messages)
- [ ] Auto-create/update apartments from parsed data
- [ ] Sync Dashboard: WordPress sync, Manual trigger, Logs, Rollback
- [ ] Bot Commands: /sync, /stats, /estimate, /help

### Sprint 5: Polish & Launch (Week 7) - 5 days
- [ ] Performance audit (Lighthouse > 90)
- [ ] Accessibility audit (WCAG AA)
- [ ] Cross-browser testing (Chrome, Safari, Firefox, Edge)
- [ ] Mobile testing (iOS Safari, Chrome Android)
- [ ] Security headers, CSP, Penetration test basics
- [ ] Documentation: README, API docs (Scalar/OpenAPI), Admin guide
- [ ] Training session for Sale/Admin team
- [ ] **Production Deploy** 🚀

---

## 11. RISK ASSESSMENT & MITIGATION

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Zalo OA API changes/limits | Medium | High | Abstract parser, versioned webhook, fallback to manual CSV |
| Free tier limits exceeded | Low | Medium | Monitor usage, alert at 70%, upgrade path documented |
| WordPress API breaking changes | Low | Medium | Versioned sync, field mapping config, manual override |
| PDF generation performance | Medium | Medium | Serverless function (max 30s), queue for bulk, cache templates |
| Image storage costs | Low | Low | R2 free 10GB, aggressive WebP/AVIF, cleanup orphaned files |
| Data loss | Very Low | Critical | Daily automated backup (Turso + Neon), Point-in-time recovery |
| Sale team adoption | Medium | High | UX testing with real users, Training, Zalo bot as familiar interface |

---

## 12. SUCCESS METRICS (KPIs)

| Metric | Target (Month 1) | Target (Month 3) |
|--------|------------------|------------------|
| **Page Load (LCP)** | < 2.5s | < 1.8s |
| **Filter Interaction (INP)** | < 200ms | < 100ms |
| **Search-to-Detail Conversion** | > 15% | > 25% |
| **Estimate Requests/Week** | > 20 | > 50 |
| **Zalo Bot Auto-sync Rate** | > 70% | > 90% |
| **Admin Task Time (CRUD)** | < 2 min | < 1 min |
| **Uptime** | 99.5% | 99.9% |
| **Error Rate** | < 0.1% | < 0.01% |

---

## 13. ESTIMATED EFFORT SUMMARY

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| **Sprint 0: Foundation** | 3 days | Repo, DB, Auth, CI/CD, Design System |
| **Sprint 1: Public Landing + Filter** | 10 days | 3-level filter, Apartment detail, SEO, Performance |
| **Sprint 2: Admin Core** | 10 days | Dashboard, Project/Tower/Apartment CRUD, Media Manager |
| **Sprint 3: Cost Estimation** | 7 days | Template Builder, PDF Generator, Estimate Engine |
| **Sprint 4: Zalo Bot & Sync** | 7 days | Webhook, Parser, Inbox, Sync Dashboard, Bot Commands |
| **Sprint 5: Polish & Launch** | 5 days | Audits, Testing, Docs, Training, Production Deploy |
| **TOTAL** | **~42 days (6 weeks)** | **MVP Ready for Production** |

---

## 14. NEXT STEPS

1. **Review & Approve Plan** - Confirm scope, timeline, priorities
2. **Setup Development Environment** - Clone repo, configure env, verify Turso/Vercel
3. **Sprint 0 Kickoff** - Initialize project, establish conventions
4. **Weekly Sync** - Progress review, blocker resolution, scope adjustment
5. **UAT with Sale Team** - Sprint 1-2: Filter UX, Sprint 3: Estimate flow, Sprint 4: Zalo bot

---

**Document Version:** 1.0  
**Created:** 2026-07-10  
**Author:** AI Assistant  
**Status:** Draft for Review