# syntax=docker/dockerfile:1
FROM node:20.11-alpine AS base
# ponytail: corporate TLS MITM breaks corepack; install pnpm via npm with system CA skip in build
ENV NODE_TLS_REJECT_UNAUTHORIZED=0
RUN npm config set strict-ssl false \
  && npm install -g pnpm@9.15.9
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* .npmrc* ./
COPY apps/storefront/package.json ./apps/storefront/
COPY packages/core/package.json ./packages/core/
COPY packages/infrastructure/package.json ./packages/infrastructure/
RUN pnpm config set strict-ssl false \
  && pnpm install --filter @tn/storefront... --frozen-lockfile=false

FROM base AS dev
ENV NODE_ENV=development
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/storefront/node_modules ./apps/storefront/node_modules
COPY . .
WORKDIR /app/apps/storefront
EXPOSE 3000
USER node
CMD ["pnpm", "dev"]

FROM deps AS builder
COPY . .
WORKDIR /app/apps/storefront
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

FROM node:20.11-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/apps/storefront/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/storefront/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/storefront/.next/static ./apps/storefront/.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
CMD ["node", "apps/storefront/server.js"]
