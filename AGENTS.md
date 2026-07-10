<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:no-hardcode -->
# No Hardcoded Values

Values that may vary between environments, deployments, or over time MUST NOT be hardcoded. This includes but is not limited to:

- **URLs** (API endpoints, external services, file paths) → use `env` or `src/lib/constants.ts`
- **API keys, secrets, tokens** → use `.env` files, never in source
- **Color values, dimensions, spacing** → use CSS variables in `globals.css`, not inline
- **Text strings** (labels, messages, descriptions) → use `src/lib/constants.ts` or i18n
- **Magic numbers** (prices, sizes, limits) → use typed constants with clear names
- **File paths** → use `path` from `src/lib/constants.ts`
- **Feature flags** → use `process.env.NEXT_PUBLIC_*` env vars
- **Media URLs (images, PDFs, video embeds)** → store in database, never hardcode in components

All environment variables must be documented in `.env.example` with a short description.

Exception: Trivial demo/sample data in seed scripts is acceptable.
<!-- END:no-hardcode -->
