FROM node:18-alpine AS base
    # Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
    RUN apk add --no-cache libc6-compat

FROM base AS builder
    WORKDIR /app

    RUN npm install -g pnpm

    COPY . .

FROM base AS installer
    WORKDIR /app

    RUN npm config set registry https://mirror-npm.runflare.com

    RUN npm install -g pnpm@9.10.0

    # First install dependencies (as they change less often)
    COPY .gitignore .gitignore
    COPY --from=builder /app/out/json/ .
    COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
    RUN pnpm install --frozen-lockfile

    # Build the project and its dependencies
    COPY --from=builder /app/out/full/ .

    ENV NODE_ENV=production

    RUN pnpm build

FROM base AS runner
    WORKDIR /app

    RUN npm install -g pnpm@9.10.0

    # Don't run production as root
    RUN addgroup --system --gid 1001 nodejs
    RUN adduser --system --uid 1001 nextjs
    USER nextjs

    COPY --from=installer /app .

    EXPOSE 3000

    CMD ["pnpm", "start"]