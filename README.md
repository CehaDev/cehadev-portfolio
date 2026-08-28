# CehaDev Portfolio & AI Admin-Content Agent

Website portfolio `chdev.online` + sistem **AI Admin & Content Agent** (PRD) yang memungkinkan pengelolaan artikel, ide konten, serta pipeline AI dari dashboard admin dan/atau bot Telegram.

> **Status proyek:** Implementasi inti **selesai & teruji** (`npm test` = 66/66 lulus; `npm run migrate:test` PASS; `nuxi build` clean). Bagian yang butuh server eksternal (VPS/kartu) / akses (SSO Vercel) masih menunggu, lihat [Dokumen status](#status-terkini).

---

## Arsitektur

```
┌────────────────────────────┐        ┌─────────────────────────────┐
│  Website (Nuxt 3 / Nitro)  │        │  Bot Telegram + Worker      │
│  Dashboard admin           │◄──────►│  + Scheduler + Monitoring   │
│  API (/api/**)             │   DB   │  + Backup + Notifikasi      │
└─────────────┬──────────────┘        └──────────────┬──────────────┘
              │                                      │
              └──────────────► Database ◄────────────┘
                 libSQL (`file:` lokal di VPS, atau Turso `libsql:` cloud)
```

- **DB `libSQL`** (`@libsql/client`) — mendukung **dua mode**:
  - `file:` → database SQLite lokal (dipakai di VPS/Docker, dan di *dev/staging*).
  - `libsql:` + token → Turso cloud (opsional, bila Turso diakses).
- **Schema relasional** (12+ tabel PRD): `articles`, `article_ideas`, `article_revisions`, `article_pipeline`, `activity_logs`, `roles`, `permissions`, `role_permissions`, `admin_users`, `telegram_identities`, `media_assets`, `agent_runs`, dll. Definisi tunggal di `scripts/lib/ddl.mjs`.

## Fitur utama

- Dashboard admin (`/admin`) dengan auth + rate limit (`server/middleware/admin-auth.ts`).
- Manajemen artikel dengan **workflow transisi** yang ditegakkan: `IDEA → DRAFT → REVIEW → APPROVED → PUBLISHED` (lompatan ditolak).
- **AI pipeline** (Gemini): 3 mode + 18 tool allowlist + *approval gate* (`server/utils/ai-pipeline.ts`).
- Bot Telegram (draft artikel), idea manager, media/STT/storage.
- **Ops**: scheduler (publish terjadwal), monitoring (DB/website/API), backup+restore+prune gzip, notifikasi.
- **Keamanan**: redaksi secret pada log, verifikasi PHX identity untuk whitelist Telegram, rate limit login & endpoint sensitif.

## Persyaratan

- Node.js ≥ 22 (dev: Node 24.19.0)
- `npm` (lockfile disertakan)
- Tidak butuh `better-sqlite3` — `@libsql/client` sudah menyertakan binding native.

## Menjalankan lokal (development)

```bash
npm install
npm run dev      # jalankan Nuxt di http://localhost:3000
```

DB lokal otomatis dibuat di `.data/` saat diperlukan.

### Script penting (lihat `package.json` → `scripts`)

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Dev server Nuxt |
| `npm run build` | Build produksi (Nitro `.output/`) |
| `npm test` | Uji (66 kasus, `node --test`) |
| `npm run migrate` | Buat semua tabel relasional (DB target dari env) |
| `npm run migrate:test` | Uji migrasi→idempoten→seed→rollback→re-migrasi |
| `npm run rollback` | Hapus tabel relasional PRD (butuh `CONFIRM_ROLLBACK=yes`) |
| `npm run seed` | Seed konten dari `content/*.json` |
| `npm run worker` | Worker persisten (scheduler+monitoring+backup) |
| `npm run bot` / `npm run bot:v2` | Bot Telegram |
| `npm run health` | Health-monitor CLI |

### CLI Artikel (round-trip terbukti)

```bash
export TURSO_DATABASE_URL="file:.data/cli.db"
node scripts/article-add.mjs --json '{"title_id":"...","title_en":"...","content_id":"...","content_en":"...","slug":"...","status":"IDEA"}'
node scripts/article-get.mjs --slug <slug>
node scripts/article-list.mjs
node scripts/article-publish.mjs --slug <slug>
node scripts/article-delete.mjs --slug <slug>
```

## Konfigurasi (.env)

Salin `.env.example` dan isi. Minimum untuk admin:

```env
NUXT_ADMIN_PASSWORD=...
NUXT_ADMIN_SECRET=...
```

Opsional (bot/worker/ops):

```env
TELEGRAM_BOT_TOKEN=
TELEGRAM_ADMIN_CHAT_ID=
GEMINI_API_KEY=
NUXT_SMTP_HOST=...  NUXT_SMTP_PORT=...  NUXT_SMTP_SECURE=true
NUXT_SMTP_USER=...  NUXT_SMTP_PASS=...
SITE_URL=https://chdev.online
PUBLIC_SITE_URL=https://chdev.online
```

DB (bila bukan mode file-default):

```env
TURSO_DATABASE_URL=file:/srv/data/db.sqlite   # atau libsql:... + token
TURSO_AUTH_TOKEN=
```

> Secret milik **owner** (PRD §25) — wajib diisi sendiri; tidak pernah di-commit (`.env` ter-gitignore).

## Deployment

### Opsi A — Docker (disarankan untuk VPS/Hosting)

`Dockerfile` + `docker-compose.yml` menjalankan web + bot + worker + DB file dalam satu container, dengan volume persisten `/srv/data`.

```bash
cp .env.example .env          # isi secret Anda
docker compose up -d --build  # semuanya hidup 24/7, DB di volume `chdev-data`
```

### Opsi B — VPS manual (PM2 + Nginx)

Lihat `DEPLOY.md`, `docs/PHASE8_VPS_PLAN.md`, `docs/PHASE9_ROLLOUT_PLAN.md`, dan `scripts/setup-vps.sh` + `ecosystem.config.cjs`.

### Website di Vercel

Project `cehadev-portfolio` sudah terhubung ke Vercel. **Catatan:** saat ini akses publik diarahkan ke login SSO Vercel (team) — untuk menampilkan situs ke publik, nonaktifkan "Require SSO" pada project/team (lihat STATUS).

## Dokumentasi lanjutan

- `docs/OPERATIONS.md` — peta komponen, script, endpoint, backup/restore/recovery.
- `docs/TECHNICAL_AUDIT.md` — audit teknis.
- `docs/PHASE8_VPS_PLAN.md`, `docs/PHASE9_ROLLOUT_PLAN.md` — rencana VPS & rollout.
- `docs/STATUS.md` (lihat di bawah) — status saat ini & langkah eksekusi tersisa.

## Status terkini

- **Selesai & teruji:** seluruh implementasi inti (artikel, idea, AI pipeline, media, monitoring, scheduler, backup, keamanan, ops) — `66/66` test lulus, migrasi/rollback PASS, build clean, worker boot & CLI artikel round-trip terbukti.
- **Menunggu akses user:**
  1. **Server 24/7 (VPS/VM)** untuk bot + worker + DB — butuh verifikasi (kartu) atau VM tersedia. Belum ada karena tanpa kartu. Lihat `docs/STATUS.md`.
  2. **Website publik** (`chdev.online`) — domain sudah terpasang ke Vercel & DNS benar, tapi Vercel team mengharuskan SSO; matikan SSO agar publik bisa akses.
- Setelah poin di atas teratasi, eksekusi deployment mengikuti `docs/STATUS.md`.
