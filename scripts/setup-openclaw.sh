#!/usr/bin/env bash
#
# setup-openclaw.sh — Pemasangan penuh OpenClaw Article Agent di VM Oracle
#
# Skrip ini melakukan sekali-confi secar otomatis:
#   1. Install OpenClaw bila belum ada
#   2. Salin skill article-creator + helpers ke lokasi benar
#   3. Generate ~/.openclaw/openclaw.json dari .env.openclaw
#   4. Jalankan gateway OpenClaw via PM2 (selalu online)
#   5. Pasang cron harian untuk bot otomatis (1 draft/giliran, tidak auto-publish)
#   6. Menampilkan instruksi pairing Telegram
#
# Cara pakai:
#   cp docs/openclaw/.env.openclaw.example .env.openclaw   # lalu isi datanya
#   bash scripts/setup-openclaw.sh
#
# Opsi:
#   bash scripts/setup-openclaw.sh --dry-run   # cek tanpa mengubah sistem
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

DRY_RUN=0
if [[ "${1:-}" == "--dry-run" ]]; then DRY_RUN=1; fi

log()  { echo -e "\033[1;32m[setup]\033[0m $*"; }
warn() { echo -e "\033[1;33m[warn]\033[0m $*"; }
err()  { echo -e "\033[1;31m[error]\033[0m $*" >&2; }

# ---------------------------------------------------------------------------
# Baca konfigurasi dari .env.openclaw (di project)
# ---------------------------------------------------------------------------
ENV_FILE="$PROJECT_DIR/.env.openclaw"
if [[ ! -f "$ENV_FILE" ]]; then
  err "File '$ENV_FILE' tidak ditemukan."
  err "Jalankan: cp docs/openclaw/.env.openclaw.example .env.openclaw lalu isi."
  exit 1
fi
set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

NEED=()
[[ -z "${TELEGRAM_BOT_TOKEN:-}" ]] && NEED+=("TELEGRAM_BOT_TOKEN")
[[ -z "${GEMINI_API_KEY:-}" ]] && NEED+=("GEMINI_API_KEY")
if [[ ${#NEED[@]} -gt 0 ]]; then
  err "Variabel berikut masih kosong di $ENV_FILE: ${NEED[*]}"
  exit 1
fi

OPENCLAW_JSON="${OPENCLAW_CONFIG_DIR:-$HOME/.openclaw}/openclaw.json"
WORKSPACE_SKILLS="$HOME/.openclaw/workspace/skills"
CRON_HOUR="${OPENCLAW_CRON_HOUR:-8}"
CRON_MIN="${OPENCLAW_CRON_MIN:-0}"

log "Project dir : $PROJECT_DIR"
log "Config OpenClaw : $OPENCLAW_JSON"
log "Mode: $([[ $DRY_RUN -eq 1 ]] && echo 'DRY-RUN (tidak mengubah sistem)' || echo 'EKSEKUSI')"

# ---------------------------------------------------------------------------
# 1. Install OpenClaw
# ---------------------------------------------------------------------------
install_openclaw() {
  if command -v openclaw >/dev/null 2>&1; then
    log "OpenClaw sudah terpasang: $(openclaw --version 2>/dev/null || echo '?')"
    return
  fi
  log "Menginstal OpenClaw..."
  if [[ $DRY_RUN -eq 1 ]]; then warn "[dry] skip install OpenClaw"; return; fi
  if command -v npm >/dev/null 2>&1; then
    npm i -g openclaw
  else
    curl -fsSL https://openclaw.ai/install.sh | bash
  fi
}

# ---------------------------------------------------------------------------
# 2. Salin skill + helpers
# ---------------------------------------------------------------------------
deploy_files() {
  if [[ $DRY_RUN -eq 1 ]]; then
    warn "[dry] skip menyalin skill/helper"
    return
  fi
  mkdir -p "$WORKSPACE_SKILLS"
  rm -rf "$WORKSPACE_SKILLS/article-creator"
  cp -r "$PROJECT_DIR/skills/article-creator" "$WORKSPACE_SKILLS/"
  log "Skill disalin ke: $WORKSPACE_SKILLS/article-creator"

  # Pastikan helpers di project bisa dijalankan
  chmod +x "$PROJECT_DIR"/scripts/article-*.mjs 2>/dev/null || true
  if ! command -v node >/dev/null 2>&1; then
    err "node tidak ditemukan. Pasang Node 20+ dulu."
    exit 1
  fi
  log "Helpers di project siap: $(ls "$PROJECT_DIR"/scripts/article-*.mjs)"
}

# ---------------------------------------------------------------------------
# 3. Generate openclaw.json
# ---------------------------------------------------------------------------
generate_config() {
  local cfg_dir
  cfg_dir="$(dirname "$OPENCLAW_JSON")"
  if [[ $DRY_RUN -eq 1 ]]; then
    warn "[dry] konfigurasi yang akan ditulis ke $OPENCLAW_JSON:"
    sed -e "s/<GEMINI_API_KEY>/${GEMINI_API_KEY}/" \
        -e "s/<TELEGRAM_BOT_TOKEN>/${TELEGRAM_BOT_TOKEN}/" \
        "$PROJECT_DIR/docs/openclaw/openclaw.json.example"
    return
  fi
  mkdir -p "$cfg_dir"
  sed -e "s/<GEMINI_API_KEY>/${GEMINI_API_KEY}/" \
      -e "s/<TELEGRAM_BOT_TOKEN>/${TELEGRAM_BOT_TOKEN}/" \
      "$PROJECT_DIR/docs/openclaw/openclaw.json.example" > "$OPENCLAW_JSON"
  chmod 600 "$OPENCLAW_JSON"
  log "Konfigurasi ditulis ke: $OPENCLAW_JSON (mode 600)"
}

# ---------------------------------------------------------------------------
# 4. Jalankan gateway via PM2
# ---------------------------------------------------------------------------
start_gateway() {
  if ! command -v pm2 >/dev/null 2>&1; then
    warn "pm2 belum ada. Install: npm i -g pm2 (atau pakai systemd/nohup)."
    if [[ $DRY_RUN -eq 1 ]]; then return; fi
    npm i -g pm2
  fi
  if [[ $DRY_RUN -eq 1 ]]; then warn "[dry] skip pm2 start openclaw"; return; fi
  if pm2 list 2>/dev/null | grep -q "openclaw"; then
    log "Gateway openclaw sudah terdaftar di pm2; restart."
    pm2 restart openclaw --update-env
  else
    pm2 start openclaw --name openclaw -- gateway
  fi
  pm2 save
  log "Gateway openclaw online (pm2)."
}

# ---------------------------------------------------------------------------
# 5. Pasang cron bot otomatis (1 draft per giliran, tidak auto-publish)
# ---------------------------------------------------------------------------
setup_cron() {
  local oc_bin cron_line
  oc_bin="$(command -v openclaw || echo '/usr/local/bin/openclaw')"
  cron_line="$CRON_MIN $CRON_HOUR * * * cd $PROJECT_DIR && $oc_bin agent --message \"Gunakan skill article-creator untuk membuat artikel otomatis berikutnya dari daftar ide (sekali saja, jangan auto-publish)\" >> $PROJECT_DIR/.data/openclaw-cron.log 2>&1"

  if [[ $DRY_RUN -eq 1 ]]; then
    warn "[dry] entri cron yang akan ditambahkan:"
    echo "        $cron_line"
    return
  fi
  mkdir -p "$PROJECT_DIR/.data"
  local tmp
  tmp="$(mktemp)"
  crontab -l 2>/dev/null | grep -v "article-creator untuk membuat artikel otomatis" > "$tmp" || true
  echo "$cron_line" >> "$tmp"
  crontab "$tmp"
  rm -f "$tmp"
  log "Cron terpasang: setiap hari $CRON_HOUR:$CRON_MIN (buka: crontab -e)"
}

# ---------------------------------------------------------------------------
# 6. Instruksi pairing
# ---------------------------------------------------------------------------
print_pairing_hint() {
  local chatid="${TELEGRAM_ADMIN_CHAT_ID:-}"
  cat <<'EOF'

=== LANGKAH TERAKHIR: sambungkan Telegram ===
  1. Di HP buka chat bot Anda (cari username dari @BotFather), kirim pesan apa pun.
  2. Di server jalankan:
       openclaw pairing list telegram
       openclaw pairing approve telegram <CODE>
  3. Setelah disetujui, kirim "halo" ke bot → harus dibalas.
  4. Coba: /artikel tips Nuxt.js  → lalu /daftar → /lihat <slug> → /terbitkan <slug>

PENTING KONTROL AKSES:
  - Sekarang dmPolicy = "pairing" (Anda approve DM pertama).
  - Ingin hanya chat id Anda? Set dmPolicy="allowlist" dan allowFrom=["<ID>"]
    lalu restart: pm2 restart openclaw --update-env
  - ID Anda: kirim /whoami ke bot setelah pairing, atau pakai @userinfobot.
EOF
  if [[ -n "$chatid" ]]; then
    echo "  (TELEGRAM_ADMIN_CHAT_ID terisi=$chatid — pastikan sesuai ID Anda)"
  fi
}

# ---------------------------------------------------------------------------
install_openclaw
deploy_files
generate_config
start_gateway
setup_cron
print_pairing_hint

log "SELESAI. Periksa: pm2 status | grep openclaw ; openclaw skills list | grep article"
