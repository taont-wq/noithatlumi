# syntax = docker/dockerfile:1
FROM node:22-alpine AS base

# Install all dependencies (including dev) for building
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install

# Build the app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run prisma:generate
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Database path - override via Railway env var DATABASE_URL in production
ENV DATABASE_URL=file:/app/data/prod.db

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Writable directory for SQLite database
RUN mkdir -p /app/data && chown nextjs:nodejs /app/data

# Install only production deps, including Prisma client
COPY package.json package-lock.json* ./
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
RUN npm install --omit=dev && npm run prisma:generate

COPY --from=builder --chown=nextjs:nodejs /app/prisma/seed.prod.js ./prisma/seed.prod.js
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Bootstrap DB + seed on startup, then run server
# ENTRYPOINT ensures this runs even if Railway overrides CMD
RUN printf '#!/bin/sh\nset -e\ncd /app\necho "DATABASE_URL=[$DATABASE_URL]"\nmkdir -p /app/data 2>/dev/null || true\nnpx prisma db push --accept-data-loss 2>&1\necho "Seeding..."\nnode prisma/seed.prod.js 2>&1\necho "Starting server..."\nexec node server.js\n' > /start.sh && chmod +x /start.sh

ENTRYPOINT ["/start.sh"]
