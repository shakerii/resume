#!/bin/sh
set -e

mkdir -p /app/data

if [ ! -f /app/data/dev.db ]; then
  cp /seed/dev.db /app/data/dev.db
fi

chown -R nextjs:nodejs /app/data

exec su-exec nextjs:nodejs sh -c '
  NODE_PATH=/prisma-cli/node_modules /prisma-cli/node_modules/.bin/prisma migrate deploy # or prisma db push if prototyping
  exec node server.js
'
