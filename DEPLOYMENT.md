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

The image contains a migrated, seeded SQLite database at `/app/seed.db`, outside
the persistent volume. At startup, if the database does not exist, the entrypoint
copies this seed database to `DATABASE_URL`. If the database already exists, it
runs `pnpm db:migrate:deploy` before starting the server, without reseeding it.
A migration failure stops startup. `DATABASE_URL` must be an absolute SQLite file
URL, such as the default `file:/app/data/dev.db` in the `resume-data` volume.
The runtime disables pnpm's pre-run dependency checks so migration startup uses
the dependencies baked into the image instead of attempting `pnpm install`.
Back up the volume before deploying schema changes. Never run the seed script
against production data: it deletes existing records.

## Search engine optimization

Public resume and project pages generate localized titles, plain-text descriptions,
canonical URLs, English/Persian language alternates, and Open Graph/Twitter cards.
The canonical origin is `https://ramtinshakeri.com`, configured in `src/utils/seo.ts`;
update it if the production domain changes. The existing avatar is the social image.
Profile pages include Person/ProfilePage JSON-LD; project pages include CreativeWork
and breadcrumb JSON-LD, based on the visible resume and project content.

`/sitemap.xml` queries published projects directly on each request and includes
both languages and actual project modification dates. Drafts, admin pages, and API
endpoints are excluded. `/robots.txt` advertises the sitemap and disallows API
crawling. Admin pages and authenticated project editor views declare `noindex`;
admin URLs are deliberately not blocked in robots.txt so crawlers can read that
directive. This is not access control; admin authentication remains required.

After deployment, verify `/robots.txt` and `/sitemap.xml` return the expected text
and XML, inspect canonical and language tags on both languages, and submit
`https://ramtinshakeri.com/sitemap.xml` in Google Search Console. Validate the
structured data with Google's Rich Results Test and Schema.org's validator.
Structured data does not guarantee rich results or improved rankings. Keep the
resume summary, project excerpts, and project write-ups descriptive and current.

## Visitor analytics

Docker startup automatically runs `pnpm db:migrate:deploy` for existing databases.
For non-Docker deployments, run it with `DATABASE_URL` pointing at the intended
database before starting this version. This adds the indexed `AnalyticsLog` table
without changing existing resume content. Back up production first.

Open `/en/admin/analytics` or `/fa/admin/analytics` after signing in. Reports show
unique browsers, sessions, page views, active time, traffic sources, and a
searchable/sortable/paginated event log using TanStack React Table. Aggregates
cover the selected 7/30/90 days; event details show only the latest 500 records.

The report's **Export all-time Excel** button downloads an admin-only `.xlsx`
workbook containing Summary, Pages, Sources, and all stored event fields in
Events. It ignores report date ranges, table filters, and pagination. Timestamps
are UTC and durations are milliseconds. Event records are read in batches;
exports beyond Excel's per-sheet row limit continue on numbered Events sheets.
Exports include records created up to the export start time, rather than newer
visits arriving during the download. Treat downloaded visitor/session IDs as
private analytics data.

Each data table has a full-page mode with keyboard focus containment and Escape
to exit. Sorting, filters, grouping, and pagination remain intact when entering
or leaving full-page mode.

Tracking includes client-side navigation, link/button clicks, PDF downloads,
form submissions (never field values), and 25/50/75/100% scroll milestones.
Public controls have stable `data-analytics` labels. Add this attribute to label
new controls, or `data-analytics-ignore` on a subtree to suppress interactions.
Page and link query strings/fragments are discarded; referrers store hostnames
only. `utm_source`, `utm_medium`, and `utm_campaign` accept short campaign labels.
Use campaign labels, never personal information, in these parameters.

Visitor IDs are random browser-local IDs, not verified people; sessions are
tab-local and renew after 30 minutes without recorded activity. Storage-blocked
browsers fall back to memory. Active time is estimated while focused and visible,
stopping after 60 seconds without interaction; background time is excluded.
Events flush every 10 seconds and on navigation/hide; blocked scripts, abrupt
browser exits, and unavailable networks can cause missing data. Referrer policies
can cause external visits to appear direct. No geolocation or raw IPs are stored.
Admin routes and authenticated admin visits are excluded. Do Not Track and
Global Privacy Control disable collection. Review the site's privacy notice and
consent requirements before enabling tracking for your audience; this feature
does not provide a consent banner. Logs are retained until explicitly deleted;
the report window is not a retention policy. The ingestion rate limiter is
per-process, not a distributed bot or fraud protection system.

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
