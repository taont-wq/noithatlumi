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

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

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

# Bootstrap DB tables + seed data on first run
RUN echo '#!/bin/sh' > /start.sh && \
    echo 'set -e' >> /start.sh && \
    echo 'cd /app' >> /start.sh && \
    echo 'npx prisma db push --accept-data-loss 2>&1' >> /start.sh && \
    echo 'node prisma/seed.prod.js 2>&1' >> /start.sh && \
    echo 'exec node server.js' >> /start.sh && \
    chmod +x /start.sh

CMD ["/start.sh"]
