# Testing Strategy — Lumi Satellite Landing

## 1. Philosophy

**Pragmatic over comprehensive.** Focus on high-value, high-risk areas:
- Data integrity (CRUD operations, filter queries)
- Auth gates (admin routes)
- API contracts (request/response shapes)
- Critical user flows (filter → view apartment → estimate)

Skip low-value tests: trivial getters, pure UI without logic, Next.js internals.

## 2. Test Pyramid

```
       ╱╲
      ╱ E2E ╲          Playwright: 3 critical flows
     ╱────────╲
    ╱ Integration ╲     Vitest + real DB: API routes, Prisma queries
   ╱──────────────╲
  ╱   Unit + Component ╲  Vitest + Testing Library: utils, schemas, UI
 ╱──────────────────────╲
```

## 3. Tool Stack

| Layer | Tool | Why |
|-------|------|-----|
| Runner | **Vitest** | Same V8/Turbopack ecosystem as Next.js 16, fast, TS-native |
| React Testing | **@testing-library/react** | Industry standard, works with Vitest |
| E2E | **Playwright** | Reliable, cross-browser, free CI tiers |
| API Mocking | **Vitest + direct handler calls** | Simpler than MSW for Next.js route handlers |
| DB | **Isolated SQLite test DB** | Schema-compatible with Turso, fast, no mocking |

## 4. File Convention & Structure

```
tests/
├── unit/
│   ├── lib/
│   │   ├── constants.test.ts       # Config validation
│   │   ├── api/
│   │   │   ├── error.test.ts       # ApiError, tryApi
│   │   │   └── rate-limit.test.ts  # Rate limiter logic
│   │   └── pdf/
│   │       └── estimate.test.ts    # HTML template generation
│   └── schemas/
│       └── validation.test.ts      # Zod schemas
├── integration/
│   ├── api/
│   │   ├── projects.test.ts        # GET /api/projects
│   │   ├── towers.test.ts          # GET /api/towers?projectId=
│   │   ├── apartments.test.ts      # GET /api/apartments?towerId=
│   │   └── admin/
│   │       ├── projects.test.ts    # Admin CRUD
│   │       ├── apartments.test.ts  # Admin CRUD
│   │       └── estimates.test.ts   # Cost estimate lifecycle
│   └── auth/
│       └── session.test.ts         # JWT, role access
├── components/
│   ├── FilterBar.test.tsx          # 3-level filter behavior
│   ├── ApartmentCard.test.tsx      # Display + status badge
│   └── Gallery.test.tsx            # Image navigation
└── e2e/
    ├── public-flow.spec.ts         # Browse → filter → view detail
    ├── admin-flow.spec.ts          # Login → CRUD project/apartment
    └── estimate-flow.spec.ts       # Template → generate estimate → PDF
```

## 5. Key Test Scenarios

### Unit (high-value)

**Rate limiter** (`rate-limit.test.ts`):
- Single request passes
- Exceeding limit returns false
- Reset after window expires
- Different identifiers have independent counters

**Error helpers** (`error.test.ts`):
- Each error code maps to correct HTTP status
- tryApi catches thrown errors
- Custom message overrides default

**Zod schemas** (`validation.test.ts`):
- Valid apartment slug
- Invalid price (negative)
- Required fields missing
- URL format validation

### Integration (critical)

**3-level filter API** (`apartments.test.ts`):
- Filter by tower returns correct apartments
- Empty tower returns empty array
- Search by apartment code matches correctly
- Paginated results respect page/limit

**Admin CRUD** (`admin/projects.test.ts`):
- Create project → returns 201 with slug generated
- Read project → returns full data
- Update project → slug unchanged but name updated
- Delete project → cascades to towers/apartments
- Unauthenticated → 401
- Wrong role (SALES → create project) → 403

**Auth middleware** (`session.test.ts`):
- Valid JWT → session has correct role
- Expired JWT → redirected to login
- No token → 401 for /api/admin/*
- Public routes accessible without auth

### Component (UI logic)

**FilterBar**:
- Selecting project loads towers
- Selecting tower loads apartments
- Changing project resets tower + apartment
- URL parameters sync on change
- Back/forward navigation restores state

**ApartmentCard**:
- Renders room count, floor plan link
- Status badge shows correct color
- Click navigates to detail page

### E2E (happy path)

**Public flow**: Home → select project → select tower → select apartment → view detail page with gallery/video/PDF → request estimate

**Admin flow**: Login → create project → add tower → add apartment with images → verify public page shows new data

**Estimate flow**: Admin → cost templates → create template → add items → generate estimate for apartment → PDF preview

## 6. Setup Instructions

### Install test dependencies

```bash
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
# For E2E
npm install -D @playwright/test
npx playwright install chromium
```

### vitest.config.ts

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
    exclude: ['tests/e2e/**'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
});
```

### Test DB setup

```ts
// tests/setup.ts — Creates isolated SQLite DB for integration tests
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

// Use test database
process.env.DATABASE_URL = 'file:./test.db';

// Push schema to test DB
execSync('npx prisma db push --force-reset --accept-data-loss', {
  env: { ...process.env, DATABASE_URL: 'file:./test.db' },
});
```

### Playwright config

```ts
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: true,
  },
});
```

## 7. CI Integration (GitHub Actions)

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22' }
      - run: npm ci
      - run: npx prisma generate
      - run: npx vitest --reporter=verbose
```

## 8. Running Tests

```bash
# Unit + integration + component
npm run test

# Watch mode (dev)
npm run test:watch

# With coverage
npm run test:coverage

# E2E only
npx playwright test

# All
npm test && npx playwright test
```

## 9. Package.json Scripts

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

## 10. MVP Priority Order

| Priority | Layer | Tests | Effort |
|----------|-------|-------|--------|
| P0 | Integration | API routes (projects, towers, apartments, auth) | 1 day |
| P0 | Unit | Rate limiter, error helpers, validation schemas | 0.5 day |
| P1 | Unit | PDF HTML template, constants | 0.5 day |
| P1 | Component | FilterBar, ApartmentCard, Gallery | 1 day |
| P2 | Integration | Admin CRUD (all 5 entities) | 1 day |
| P2 | E2E | Public flow + admin flow | 1 day |
| P3 | E2E | Estimate flow | 0.5 day |

**Total MVP: ~2–3 days for P0 + P1**
