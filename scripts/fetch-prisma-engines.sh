#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOCK="$ROOT/pnpm-lock.yaml"
OUT="$ROOT/prisma-engines"
TARGET="linux-musl-openssl-3.0.x"

VERSION_SPEC="$(grep -oE '@prisma/engines-version@[0-9]+\.[0-9]+\.[0-9]+-[0-9]+\.[0-9a-f]+' "$LOCK" | head -1)"
if [[ -z "$VERSION_SPEC" ]]; then
  echo "Could not find @prisma/engines-version in $LOCK" >&2
  exit 1
fi
HASH="${VERSION_SPEC##*.}"

SCHEMA="$OUT/schema-engine"
QUERY="$OUT/libquery_engine-${TARGET}.so.node"
STAMP="$OUT/.commit"

if [[ -f "$STAMP" && "$(cat "$STAMP")" == "$HASH" && -s "$SCHEMA" && -s "$QUERY" ]]; then
  echo "Prisma engines already present for $HASH"
  exit 0
fi

BASE="https://binaries.prisma.sh/all_commits/${HASH}/${TARGET}"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
mkdir -p "$OUT"

download() {
  local name="$1"
  echo "Downloading ${name}"
  curl -fsSL "$BASE/${name}" -o "$TMP/${name}"
  curl -fsSL "$BASE/${name}.sha256" -o "$TMP/${name}.sha256"
  local expected actual
  expected="$(awk '{print $1}' "$TMP/${name}.sha256")"
  actual="$(sha256sum "$TMP/${name}" | awk '{print $1}')"
  if [[ "$expected" != "$actual" ]]; then
    echo "Checksum mismatch for ${name}" >&2
    exit 1
  fi
}

download schema-engine.gz
download libquery_engine.so.node.gz

gzip -dc "$TMP/schema-engine.gz" > "$SCHEMA"
gzip -dc "$TMP/libquery_engine.so.node.gz" > "$QUERY"
chmod 755 "$SCHEMA" "$QUERY"
echo "$HASH" > "$STAMP"
echo "Saved Prisma engines for $HASH to $OUT"
