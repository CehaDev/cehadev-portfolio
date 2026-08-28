#!/usr/bin/env bash
#
# check-openclaw.sh — Verifikasi instalasi OpenClaw Article Agent + bantu pairing Telegram.
#
#   bash scripts/check-openclaw.sh          # cek semuanya
#   bash scripts/check-openclaw.sh pairing   # panduan pairing Telegram
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

c() { echo -e "\033[1;36m[check]\033[0m $*"; }
ok() { echo -e "\033[1;32m  OK\033[0m  $*"; }
no() { echo -e "\033[1;31m  MISS\033[0m $*"; }

mode="${1:-all}"

echo "=============================="
echo "  OpenClaw Article Agent Check"
echo "=============================="

if [[ "$mode" == "pairing" ]]; then
  echo
  c "Cek pairing Telegram yang tertunda:"
  openclaw pairing list telegram 2>&1 || true
  echo
  c "Approve:  openclaw pairing approve telegram <CODE>"
  echo "Setelah approve, kirim pesan apa pun ke bot di HP."
  echo "Tes fungsi: /artikel tips Nuxt.js  →  /daftar  →  /lihat <slug>  →  /terbitkan <slug>"
  exit 0
fi

c "1. Binari:"
( command -v openclaw >/dev/null && ok "openclaw: $(openclaw --version 2>/dev/null || true)" ) || no "openclaw tidak terinstall"
( command -v node >/dev/null && ok "node: $(node --version)" ) || no "node tidak ada"
( command -v pm2 >/dev/null && ok "pm2" ) || no "pm2 tidak ada"

c "2. Helper artikel:"
for f in article-add article-list article-get article-publish article-delete; do
  if [[ -f "$PROJECT_DIR/scripts/$f.mjs" ]]; then ok "$f.mjs"; else no "$f.mjs"; fi
done

c "3. Skill article-creator:"
SKILL_LOC="$HOME/.openclaw/workspace/skills/article-creator/SKILL.md"
if openclaw skills list 2>/dev/null | grep -q article-creator || [[ -f "$SKILL_LOC" ]]; then
  ok "skill article-creator terdeteksi ($SKILL_LOC)"
else
  no "skill belum di salin. Jalankan: bash scripts/setup-openclaw.sh"
fi

c "4. Konfigurasi gateway:"
CFG="${OPENCLAW_CONFIG_DIR:-$HOME/.openclaw}/openclaw.json"
if [[ -f "$CFG" ]]; then ok "config: $CFG"; else no "config belum dibuat"; fi

c "5. Gateway berjalan:"
if command -v pm2 >/dev/null 2>&1 && pm2 list 2>/dev/null | grep -q openclaw; then
  ok "process 'openclaw' ada di pm2 (pm2 status untuk detail)"
else
  no "gateway belum jalan. Jalankan: bash scripts/setup-openclaw.sh"
fi

c "6. Env project .env.openclaw:"
if [[ -f "$PROJECT_DIR/.env.openclaw" ]]; then ok "ada"; else no "belum ada (cp docs/openclaw/.env.openclaw.example .env.openclaw)"; fi

c "7. Cron bot otomatis:"
(crontab -l 2>/dev/null | grep -q "openclaw agent" && ok "cron terpasang") || no "cron belum ada (lihat setup-openclaw.sh)"

echo
echo "Selesai. Untuk pairing Telegram: bash scripts/check-openclaw.sh pairing"
