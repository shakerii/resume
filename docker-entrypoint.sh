#!/bin/sh
set -eu

case "$DATABASE_URL" in
  file:/*) database_path="${DATABASE_URL#file:}" ;;
  *)
    echo "DATABASE_URL must be an absolute SQLite file URL (file:/path/to/database.db)." >&2
    exit 1
    ;;
esac

database_path="${database_path%%\?*}"

if [ -e "$database_path" ]; then
  echo "Existing database found; applying pending migrations."
  pnpm db:migrate:deploy
else
  echo "No database found; copying the migrated, seeded database."
  mkdir -p "$(dirname "$database_path")"
  cp /app/seed.db "$database_path"
fi

exec "$@"
