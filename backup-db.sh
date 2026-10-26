#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
KEY="$ROOT/ar-Personal-privatekey.pem"
REMOTE="root@37.32.10.39"
APP_DIR="resume"
STAMP="$(date +%Y%m%d-%H%M%S)"
OUT_DIR="$ROOT/backups"
OUT="$OUT_DIR/dev-$STAMP.db"

if [[ ! -f "$KEY" ]]; then
  echo "SSH key not found: $KEY" >&2
  exit 1
fi

mkdir -p "$OUT_DIR"

eval "$(ssh-agent -s)"
ssh-add "$KEY"

REMOTE_TMP="$(ssh "$REMOTE" 'mktemp /tmp/resume-dev.XXXXXX.db')"

ssh "$REMOTE" bash -s <<EOF
set -euo pipefail
cd ~/$APP_DIR
docker compose stop app
docker compose cp app:/app/data/dev.db $REMOTE_TMP
docker compose start app
EOF

scp "$REMOTE:$REMOTE_TMP" "$OUT"
ssh "$REMOTE" "rm -f $REMOTE_TMP"

echo "Saved $OUT"
