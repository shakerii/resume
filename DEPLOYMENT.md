# Deployment

Use Node 22.14.0 and pnpm 11.7.0 (pinned in `.nvmrc`, `package.json`,
and the Dockerfile). Do not share `node_modules` between Windows and Linux;
Prisma, SWC, and Parcel include platform-specific native binaries.

## Deploy without stopping the current app first

```sh
docker compose --progress plain build app
docker compose up -d app nginx
docker compose logs --tail=100 app nginx
```

Do not use `docker compose down` before building. A failed build should leave
the existing application running. Do not delete the `resume-data` volume.

BuildKit caches the pnpm store and Next.js compilation cache between builds.
Keep the Docker build cache; `--no-cache` and builder pruning discard this benefit.
Fonts are bundled locally, so builds no longer contact Google Fonts. Unused PDF
viewer dependencies have been removed; PDF export still uses `@react-pdf/renderer`.
Prisma generation runs explicitly after the schema and build environment are available.

## Build memory and a build that stops

The Docker build uses two Next.js workers, Webpack memory optimizations, and a
2 GiB V8 heap limit. This limit is not total process memory: native allocations,
workers, Docker, and the running app need additional RAM. A 4 GiB heap setting
cannot provide 4 GiB of memory on a smaller server.

If a build stops, collect the exit status and server diagnostics:

```sh
docker compose --progress plain build app
echo "Build exit status: $?"
free -h
df -h
sudo dmesg -T | grep -Ei 'out of memory|oom|killed process'
docker compose logs --tail=100 app
```

`Killed`, exit 137, or kernel OOM messages indicate memory pressure. A JavaScript
heap error means V8 hit its own limit. An exact five-minute cutoff can instead be
an SSH/CI/provider timeout; check that service's logs. Increasing an Nginx request
timeout does not fix a Docker build timeout.

On a sufficiently provisioned build machine, override the heap budget with:

```sh
docker compose build --build-arg NODE_OPTIONS=--max-old-space-size=3072 app
```

For a very small production server, build the image on a larger machine or CI
for the server's architecture, push it to a registry, and deploy the image instead
of compiling on the live server. The first dependency download can still be slow;
registry/network retries are not compiler errors and are not fixed by more heap.

Webpack may still print cache-dependency parsing warnings for dynamic imports in
`jiti` and `next-intl`. These are dependency/cache warnings, not failed compilation;
the production build and standalone server should still be checked independently.
Package-manager update notices and deprecated-package warnings are also distinct
from errors. Do not upgrade major versions blindly just to remove these notices.

## Database behavior

The image contains a migrated, seeded SQLite database for the initial creation
of `resume-data`. Existing named volumes retain their current database on redeploy;
rebuilding does not run migrations against that existing database or reseed it.
Back up the volume and plan migrations separately when changing the schema.
Never run the seed script against production data: it deletes existing records.

## Local checks

```sh
pnpm install --frozen-lockfile
pnpm db:generate
pnpm type:check
pnpm build
```

Native optional dependencies must remain enabled. Install separately within each
OS, or use Docker for Linux builds. TypeScript errors now fail the production
build rather than being silently ignored.
