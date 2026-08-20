#!/bin/sh

# Inisialisasi content/ dari data awal jika volume kosong
if [ ! -f /app/content/site.json ]; then
  echo "Initializing content directory from default data..."
  cp -r /app/content-init/* /app/content/
fi

# Inisialisasi .data/ jika belum ada
mkdir -p /app/.data

# Inisialisasi public/uploads/ jika belum ada
mkdir -p /app/public/uploads

echo "Starting CehaDev Portfolio..."
exec node .output/server/index.mjs
