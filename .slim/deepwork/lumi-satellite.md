# Deepwork: Lumi Satellite Landing Page

## Goal
Build a sleek/modern/premium/luxury satellite landing page for noithatlumi.vn.

## Current Phase: Sprint 0 - Foundation ✅ COMPLETED

### What was built

**1. Project Initialization**
- Next.js 16.2.10 with App Router, TypeScript, Tailwind v4
- Package.json with all dependencies (next-auth, framer-motion, prisma, @tanstack/react-query, etc.)
- .gitignore, .ignore (for deepwork), .env.example

**2. Database (Prisma 7 + Turso/libSQL)**
- Complete Prisma schema with 17 models:
  - Project ↔ Tower ↔ Apartment (3-level hierarchy)
  - ApartmentImage, ApartmentVideo (media management)
  - CostCategory, CostItem, CostTemplate, CostTemplateItem (estimation)
  - CostEstimate (with breakdown JSON, PDF export), User, Session
  - ActivityLog, ZaloMessage, ZaloSyncLog, Setting
- SQLite database created and seeded with sample data:
  - 3 projects (Ocean Park, Smart City, Ecopark)
  - 6 towers, 15 apartments
  - 5 cost categories, 14 cost items, 1 cost template
  - 2 users (admin@lumi.design, sale@lumi.design)

**3. Authentication (NextAuth.js v5)**
- Credentials provider with bcryptjs password hashing
- JWT strategy with role-based session
- TypeScript declarations for custom user fields (role, avatar, phone)
- Login page with Suspense boundary
- Auth middleware for route protection

**4. Design System & UI Components**
- Luxury CSS theme: gold (#D4A843), charcoal (#1A1A1A), cream (#F5F0E8)
- Tailwind v4 CSS variables with glassmorphism, gold gradients, shimmer animations
- Fonts: Cormorant Garamond (headings) + Outfit (body)
- Shadcn/UI components: Button, Card, Input, Label, Badge, Skeleton
- Dark mode default, light mode support via CSS

**5. Landing Page (Public)**
- Hero section with animated gradient background, grid pattern, gold accent badge
- 3-level FilterBar component (Project → Tower → Apartment) with URL sync
- Apartment grid with status badges, details, and hover effects
- Stats section, Header with sticky scroll, Footer with contact/address

**6. API Routes**
- `/api/projects` - List active projects
- `/api/towers?projectId=` - List towers for project
- `/api/apartments?towerId=&q=&page=` - List/search apartments
- `/api/health` - Health check
- `/api/auth/[...nextauth]` - Auth endpoints

**7. Hooks & Utilities**
- TanStack Query hooks: useProjects, useTowers, useApartments, useApartment
- Utility functions: cn(), formatPrice(), formatArea(), slugify(), truncate()

### Build Result
- **Compiled & Built Successfully** 
- Routes: / (public), /login, /api/* (5 endpoints)
- Middleware for admin route protection

## Next Phase: Sprint 1 - Public Landing & Filter (In Progress)

### Remaining Sprint 1 Tasks
- [ ] Apartment detail page (modal/route) with gallery, video, PDF viewer
- [ ] SEO optimization (JSON-LD, OpenGraph, sitemap)
- [ ] Performance optimization (image lazy loading, code splitting)
- [ ] Add remaining Shadcn/UI components (Dialog, Select, DropdownMenu, Avatar, Tabs)
- [ ] Admin dashboard page

## Design Decisions
- Default mode: Dark (luxury aesthetic)
- Color palette: Gold, Charcoal, Cream
- Typography: Cormorant Garamond (headings), Outfit (body)
- Database: SQLite (dev) → Turso/libSQL (prod)
- Auth: Credentials (dev) → + Zalo OAuth (phase 4)
