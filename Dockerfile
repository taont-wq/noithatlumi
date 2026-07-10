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

# Create bootstrap wrapper for server.js
# Railway uses "node server.js" as startCommand, so we inject bootstrap into server.js
RUN mv .next/standalone/server.js .next/standalone/server-original.js && \
  printf '%s\n' \
  'const { execSync } = require("child_process");' \
  'process.env.NODE_ENV = "production";' \
  'console.log("--- Starting DB bootstrap ---");' \
  'console.log("DATABASE_URL=" + (process.env.DATABASE_URL || "not set"));' \
  'try {' \
  '  execSync("mkdir -p /app/data 2>/dev/null; npx prisma db push --accept-data-loss", { stdio: "inherit", cwd: "/app" });' \
  '  console.log("DB schema pushed OK");' \
  '  execSync("node prisma/seed.prod.js", { stdio: "inherit", cwd: "/app" });' \
  '  console.log("Seed complete");' \
  '} catch (e) {' \
  '  console.error("Bootstrap warning:", e.message);' \
  '}' \
  'console.log("--- Bootstrap done, starting Next.js ---");' \
  'require("./server-original.js");' > .next/standalone/server.js

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Database path - override via Railway env var DATABASE_URL in production
ENV DATABASE_URL=file:///app/data/prod.db

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    mkdir -p /app/data && chown nextjs:nodejs /app/data

# Install only production deps, including Prisma client
COPY package.json package-lock.json* ./
RUN npm install --omit=dev && npm run prisma:generate

# Copy app artifacts
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma/seed.prod.js ./prisma/seed.prod.js
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
