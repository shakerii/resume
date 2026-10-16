# syntax=docker/dockerfile:1

FROM node:22.14.0-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl

FROM base AS tooling
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g pnpm@11.7.0

FROM tooling AS deps
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=resume-pnpm,target=/pnpm/store \
    --mount=type=cache,id=resume-pnpm-metadata,target=/root/.cache/pnpm \
    pnpm install --frozen-lockfile --store-dir=/pnpm/store

FROM tooling AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY . .

ENV DATABASE_URL="file:/tmp/resume.db"
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ARG NODE_OPTIONS="--max-old-space-size=2048"
ENV NODE_OPTIONS=$NODE_OPTIONS

RUN pnpm db:generate
RUN pnpm db:migrate:deploy && pnpm db:seed
RUN --mount=type=cache,id=resume-next,target=/app/.next/cache pnpm build

FROM tooling AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV DATABASE_URL="file:/app/data/dev.db"

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    mkdir -p /app/data && \
    chown nextjs:nodejs /app/data

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/package.json /app/prisma.config.ts ./
COPY --from=builder /app/prisma/schema.prisma ./prisma/schema.prisma
COPY --from=builder /app/prisma/migrations ./prisma/migrations
COPY --from=builder /tmp/resume.db /app/seed.db
COPY docker-entrypoint.sh /app/docker-entrypoint.sh

USER nextjs
EXPOSE 3000
ENTRYPOINT ["sh", "/app/docker-entrypoint.sh"]
CMD ["node", "server.js"]
