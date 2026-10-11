#!/bin/sh
set -e

mkdir -p /etc/nginx/certs

if [ -f /etc/letsencrypt/live/ramtin.dev/fullchain.pem ]; then
  ln -sfn /etc/letsencrypt/live/ramtin.dev/fullchain.pem /etc/nginx/certs/fullchain.pem
  ln -sfn /etc/letsencrypt/live/ramtin.dev/privkey.pem /etc/nginx/certs/privkey.pem
else
  openssl req -x509 -nodes -newkey rsa:2048 -days 30 \
    -keyout /etc/nginx/certs/privkey.pem \
    -out /etc/nginx/certs/fullchain.pem \
    -subj "/CN=ramtin.dev"
fi

exec nginx -g "daemon off;"
