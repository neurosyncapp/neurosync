#!/bin/bash
# One-time TLS bootstrap for the NeuroSync stack.
# Run from the project root on the server after `.env` is in place.
set -e

DOMAINS=(neuro-sync.app www.neuro-sync.app docs.neuro-sync.app)
CERT_NAME=neuro-sync.app

# ACME_EMAIL is read from .env so it is never committed to source.
[ -f .env ] && set -a && . ./.env && set +a
EMAIL_ARG="--register-unsafely-without-email"
if [ -n "$ACME_EMAIL" ]; then EMAIL_ARG="--email $ACME_EMAIL --no-eff-email"; fi

echo "==> Starting stack with HTTP-only config..."
cp nginx/bootstrap.conf nginx/active.conf
docker compose up -d --build

echo "==> Waiting for edge nginx..."
