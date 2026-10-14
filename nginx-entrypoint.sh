#!/bin/sh
set -e

mkdir -p /etc/nginx/certs

if [ -f /etc/letsencrypt/live/ramtinshakeri.com/fullchain.pem ]; then
  ln -sfn /etc/letsencrypt/live/ramtinshakeri.com/fullchain.pem /etc/nginx/certs/fullchain.pem
  ln -sfn /etc/letsencrypt/live/ramtinshakeri.com/privkey.pem /etc/nginx/certs/privkey.pem
else
  openssl req -x509 -nodes -newkey rsa:2048 -days 30 \
    -keyout /etc/nginx/certs/privkey.pem \
    -out /etc/nginx/certs/fullchain.pem \
    -subj "/CN=ramtinshakeri.com"
fi

exec nginx -g "daemon off;"
