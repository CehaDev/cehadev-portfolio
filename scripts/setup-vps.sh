#!/usr/bin/env bash
# setup-vps.sh — Setelah VPS disediakan (PRD Section 17 / Phase 8, non-destruktif).
# Menyiapkan user, Node, PM2 memakai /srv/cehadev dan ecosystem.config.cjs.
# JANGAN menjalankan ini sebelum owner menyediakan VPS & persetujuan production.
# Usage:  bash scripts/setup-vps.sh [REPO_URL] [BRANCH]
set -euo pipefail

REPO_URL="${1:-git@github.com:CehaDev/cehadev-portfolio.git}"
BRANCH="${2:-main}"
APP_DIR="/srv/cehadev"

echo "==> Pastikan sistem up-to-date"
sudo apt update && sudo apt upgrade -y

echo "==> Install dependensi dasar"
sudo apt install -y git curl build-essential python3 ca-certificates nginx

echo "==> Pasang Node.js 22 LTS (bila belum ada)"
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
  sudo apt install -y nodejs
fi
node -v

echo "==> Pasang PM2 global (bila belum ada)"
if ! command -v pm2 >/dev/null 2>&1; then
  sudo npm install -g pm2
fi

echo "==> Clone/pull aplikasi ke ${APP_DIR}"
sudo mkdir -p /srv
sudo chown -R "$USER:$USER" /srv
if [ ! -d "${APP_DIR}/.git" ]; then
  git clone "$REPO_URL" "$APP_DIR"
else
  git -C "$APP_DIR" fetch origin && git -C "$APP_DIR" checkout "$BRANCH" && git -C "$APP_DIR" pull
fi
cd "$APP_DIR"

echo "==> Install dependency & build"
npm ci
npm run build

echo "==> .env harus diisi manual (tidak pernah di-commit)"
if [ ! -f "$APP_DIR/.env" ]; then
  cp .env.example "$APP_DIR/.env"
  echo "   -> Buat .env di $APP_DIR/.env dan isi secret (NUXT_ADMIN_PASSWORD, NUXT_ADMIN_SECRET, TURSO/NUXT secret, TELEGRAM_BOT_TOKEN, GEMINI_API_KEY, dll)."
  exit 0
fi

echo "==> Jalankan bot + worker (persisten) dan website memakai PM2"
pm2 startOrRestart "$APP_DIR/ecosystem.config.cjs"
pm2 save
pm2 startup || true

echo "==> Status"
pm2 status

echo "DONE. Halaman ini hanya menyiapkan proses persisten. Nginx/HTTPS & health check lihat docs/PHASE8_VPS_PLAN.md."
