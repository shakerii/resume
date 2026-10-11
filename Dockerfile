FROM node:22.14.0-alpine AS base

    RUN VERSION=$(cut -d. -f1,2 /etc/alpine-release) && \
        echo "http://mirror-linux.runflare.com/alpine/v$VERSION/main" > /etc/apk/repositories && \
        echo "http://mirror-linux.runflare.com/alpine/v$VERSION/community" >> /etc/apk/repositories

    RUN npm config set registry "https://mirror-npm.runflare.com"

    # Install libc6-compat if needed by Alpine/Turbo/Prisma
    # RUN apk add --no-cache libc6-compat
    RUN apk add --no-cache su-exec
    WORKDIR /app

    # Enable pnpm
    ENV PNPM_HOME="/pnpm"
    ENV PATH="$PNPM_HOME:$PATH"
    RUN npm install -g pnpm@11.7.0
    # RUN corepack enable && corepack prepare pnpm@11.7.0 --activate

    ENV DATABASE_URL="file:/tmp/resume.db"
    ENV PRISMA_SCHEMA_ENGINE_BINARY=/opt/prisma-engines/schema-engine
    ENV PRISMA_QUERY_ENGINE_LIBRARY=/opt/prisma-engines/libquery_engine-linux-musl-openssl-3.0.x.so.node

FROM base AS deps

    WORKDIR /app

    COPY prisma-engines/ /opt/prisma-engines/
    COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* ./
    COPY prisma ./prisma/

    RUN npm config set registry "https://mirror-npm.runflare.com"

    RUN pnpm install --frozen-lockfile

FROM base AS builder

    WORKDIR /app

    COPY --from=deps /opt/prisma-engines /opt/prisma-engines
    COPY --from=deps /app/node_modules ./node_modules
    COPY . .

    RUN pnpm db:generate
    RUN pnpm db:migrate:deploy && pnpm db:seed
    RUN test -s /tmp/resume.db && mkdir -p /seed && cp /tmp/resume.db /seed/dev.db

    RUN REAL_CLIENT="$(readlink -f node_modules/@prisma/client)" && \
        REAL_NM="$(dirname "$(dirname "$REAL_CLIENT")")" && \
        mkdir -p /opt/prisma-runtime/node_modules/@prisma && \
        cp -a "$REAL_CLIENT" /opt/prisma-runtime/node_modules/@prisma/client && \
        cp -a "$REAL_NM/.prisma" /opt/prisma-runtime/node_modules/.prisma && \
        find /opt/prisma-runtime -name 'libquery_engine-linux-musl*' | grep -q .

    RUN PRISMA_VERSION="$(node -e "console.log(require('prisma/package.json').version)")" && \
        npm install --prefix /prisma-cli "prisma@${PRISMA_VERSION}" dotenv@16.6.1

    ENV NEXT_TELEMETRY_DISABLED=1
    ENV NODE_ENV=production
    RUN pnpm build

FROM base AS runner

    WORKDIR /app

    ENV NODE_ENV=production
    ENV NEXT_TELEMETRY_DISABLED=1
    ENV PORT=3000
    ENV HOSTNAME="0.0.0.0"
    ENV DATABASE_URL="file:/app/data/dev.db"

    RUN addgroup --system --gid 1001 nodejs && \
        adduser --system --uid 1001 nextjs

    RUN mkdir .next && chown nextjs:nodejs .next

    COPY --from=builder /app/public ./public
    COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
    COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
    COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
    COPY --from=builder --chown=nextjs:nodejs /app/prisma.config.ts ./prisma.config.ts
    COPY --from=builder --chown=nextjs:nodejs /opt/prisma-runtime/node_modules/@prisma/client ./node_modules/@prisma/client
    COPY --from=builder --chown=nextjs:nodejs /opt/prisma-runtime/node_modules/.prisma ./node_modules/.prisma
    COPY --from=builder /seed/dev.db /seed/dev.db
    COPY --from=builder /prisma-cli /prisma-cli
    COPY --from=builder /opt/prisma-engines /opt/prisma-engines
    COPY entrypoint.sh /entrypoint.sh
    RUN chmod +x /entrypoint.sh

    EXPOSE 3000

    ENTRYPOINT ["/entrypoint.sh"]
