#!/usr/bin/env bash
set -euo pipefail

tar -czf export.tar.gz \
  --exclude=node_modules \
  --exclude=.git \
  --exclude=.env \
  --exclude=export.tar.gz \
  --exclude=.replit \
  --exclude=replit.nix \
  --exclude=.config \
  --exclude=.upm \
  --exclude=.cache \
  --exclude=.local \
  --exclude=.npm .

echo "Created export.tar.gz"
