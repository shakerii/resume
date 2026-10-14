#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
KEY="$ROOT/../ar-Personal-privatekey.pem"
REMOTE="root@94.101.186.88"
REMOTE_ARCHIVE="resume.tar.gz"
APP_DIR="resume"

if [[ ! -f "$KEY" ]]; then
  echo "SSH key not found: $KEY" >&2
  exit 1
fi

eval "$(ssh-agent -s)"
ssh-add "$KEY"

cd "$ROOT"
LOCAL_ARCHIVE="$(mktemp /tmp/resume.XXXXXX.tar.gz)"
trap 'rm -f "$LOCAL_ARCHIVE"' EXIT

# Write the archive outside this tree. Creating it inside "." makes tar
# exit 1 with "file changed as we read it", which aborts under set -e.
tar -czf "$LOCAL_ARCHIVE" \
  --exclude=node_modules \
  --exclude=.next \
  --exclude=.git \
  .

scp "$LOCAL_ARCHIVE" "$REMOTE:~/$REMOTE_ARCHIVE"

ssh "$REMOTE" bash -s <<EOF
set -euo pipefail
cd ~

if [[ -f $APP_DIR/docker-compose.yml ]]; then
  (cd $APP_DIR && docker compose down)
fi

if [[ -d $APP_DIR/data ]]; then
  rm -rf /tmp/resume-data
  mv $APP_DIR/data /tmp/resume-data
fi

rm -rf $APP_DIR
mkdir $APP_DIR
tar -xzf $REMOTE_ARCHIVE -C $APP_DIR

if [[ -d /tmp/resume-data ]]; then
  rm -rf $APP_DIR/data
  mv /tmp/resume-data $APP_DIR/data
fi

cd $APP_DIR
docker compose up -d --build
rm -f ~/$REMOTE_ARCHIVE
EOF
