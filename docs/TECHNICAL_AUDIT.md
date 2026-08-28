# Technical Audit Report — CHDEV AI ADMIN & CONTENT AGENT

> Hasil **Phase 0** dari PRD `PRD_CHDEV_AI_Admin_Content_Agent_FINAL_v1_2.docx`.
> Phase ini murni **observasi dan dokumentasi** — tidak ada kode production yang diubah.

---

## 1. Ringkasan

Audit dilakukan terhadap repository aktual `CehaDev/cehadev-portfolio` untuk
memetakan kondisi nyata terhadap asumsi/requirement PRD sebelum implementasi
Phase 1+ dimulai.

**Kesimpulan utama:** terdapat **gap arsitektural yang signifikan** antara PRD
dan kondisi repo aktual. Eksekusi Phase 1–9 tidak boleh dimulai sebelum keputusan
owner atas kontradiksi berikut ditetapkan.

---

## 2. Struktur repository aktual

Struktur terverifikasi dari folder root:

```
assets/     composables/  content/     layouts/     middleware/
pages/      public/       scripts/     server/      utils/
```

Plus: `nuxt.config.ts`, `package.json`, `DEPLOY.md`, `render.yaml`, `.env.example`.

### server/ (Backend Nitro)

Ada API admin lengkap yang **sudah berjalan**:

| Area | Endpoint |
|---|---|
| Auth | `auth/login`, `auth/logout`, `auth/me` |
| Articles (admin) | `articles.get/post`, `articles/[slug].get/put/delete`, `cover.post/delete` |
| Analytics | `analytics/overview`, `analytics/articles` |
| Chat | `chat/config`, `chat/conversations/{id}`, `chat/unread`, `chat/messages` |
| Comments | `comments` (index + delete) |
| Contact | `contact.post`, `messages/*` |
| CV | `cv.get/put`, `cv/photo.post` |
| Projects | `projects.get/post`, `projects/[slug].*`, `gallery.post/delete` |
| Settings | `settings/smtp.get/post/test` |
| Site | `site.get/put` |
| Skills | `skills.get/put` |
| Content (publik) | `content/articles`, `content/projects`, `content/skills`, `content/site`, `content/cv`, `content/render`, `content/articles/[slug]` + comments |

Middleware: `admin-auth.ts`, `security-headers.ts`. Plugin: `strip-powered-by.ts`.
Routes: `robots.txt.ts`, `sitemap.xml.ts`.

### content/ (konten statis)

- `articles/*.json` — artikel bawaan (format dua bahasa ID/EN)
- `projects/*.json`, `site.json`, `skills.json`, `cv.json`

---

## 3. Versi dependency aktual (`package.json`)

Semua versi di bawah **sesuai/menguatkan** asumsi PRD Section 2:

| Dependency | Version | PRD sebut | Status |
|---|---|---|---|
| nuxt | ^3.21.11 | 3.21.11 | ✅ |
| typescript | ^5.9.3 | 5.9.3 | ✅ |
| @libsql/client | ^0.17.4 | 0.17.4 | ✅ |
| @vercel/analytics | ^2.0.1 | 2.0.1 | ✅ |
| @vercel/blob | ^2.8.0 | 2.8.0 | ✅ |
| @nuxtjs/tailwindcss | ^6.14.0 | Tailwind module | ✅ |
| marked | ^18.0.10 | marked | ✅ |
| nodemailer | ^9.0.5 | nodemailer | ✅ |
| shiki | ^4.4.3 | shiki | ✅ |
| lucide-vue-next | ^1.0.0 | (tambahan) | — |

Scripts: `dev`, `build` (nuxt build), `generate`, `preview`, `postinstall`,
`db:seed`, `bot` (`node scripts/telegram-bot.mjs`).

**Environment (nameserver)** konfigurasi di `nuxt.config.ts`:
- `nitro.preset = 'vercel'`
- `@nuxtjs/tailwindcss` sebagai satu-satunya module

---

## 4. Deploy & arsitektur produksi

### 4.1 Kontradiksi DEPLOY.md vs deployment aktual

- **`nuxt.config.ts`**: `nitro.preset = 'vercel'` → build dioptimalkan untuk **Vercel serverless**.
- **`.vercel/project.json`**: project `cehadev-portfolio` terhubung ke Vercel; env production (`TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `BLOB_READ_WRITE_TOKEN`, SMTP, admin secret/password) **terpasang di Production** → deployment aktif di **Vercel**.
- **`DEPLOY.md`** justru menyarankan **Oracle Cloud VPS** dengan alasan: aplikasi **menulis file runtime** (`.data/`, `public/uploads/`) dan native `better-sqlite3` yang tidak cocok di serverless.
- **`render.yaml`**: opsi hosting Render (free plan) sebagai alternatif ketiga.

**Keputusan yang perlu diputus owner:** "website production" saat ini nyata berjalan di **Vercel** (serverless) dengan DB **Turso (libSQL remote)**, sedangkan dokumen deploy lama menuntun ke VPS. Storage file runtime (`.data/`, `public/uploads/`) **tidak persisten di Vercel serverless** → fitur yang menulis file ke disk akan **hilang saat function restart** jika tidak dipindah ke Blob/Turso.

### 4.2 Storage DB (keputusan penting)

`server/utils/db.ts` memakai **KV dual-mode**:
- Jika `TURSO_DATABASE_URL` ada → **Turso/libSQL remote**.
- Jika tidak → fallback **file `.data/kv.json`** (tidak cocok di Vercel serverless).

**Gap kritis dengan PRD Section 13:** PRD mendefinisikan tabel relasional
(`articles`, `article_ideas`, `article_revisions`, `activity_logs`,
`admin_users`, `roles`, `permissions`, `telegram_identities`, `media_assets`,
`agent_runs`). **Tidak satu pun tabel ini ada** di `ensureSchema()` saat ini.
Schema nyata hanya: `kv`, `visits`, `messages`, `chat_conversations`,
`chat_messages`, `article_comments`, `security_log`.

Artikel saat ini disimpan sebagai **JSON blob di key `content_articles`** dalam
KV (file `kv.json` atau Turso `kv` table), bukan baris tabel `articles`.
Tidak ada status workflow (`IDEA/DRAFT/...`), revision history, maupun
source-type (`HUMAN/AI/HUMAN_AI`) di level data.

---

## 5. Gap PRD vs repo aktual

| # | Requirement PRD | Kondisi repo | Kesenjangan |
|---|---|---|---|
| G1 | Tabel relasional `articles`, revisions, ideas, audit, roles, permissions (Sec 13) | KV blob `content_articles`; hanya `kv` + tabel chat/visits/messages/comments/security | **Tinggi** — PRD mengharuskan schema relasional, repo memakai KV dual-mode |
| G2 | Status workflow artikel `IDEA→DRAFT→REVIEW→APPROVED→PUBLISHED→SCHEDULED→ARCHIVED` (Sec 6) | Hanya `draft`/`published` sederhana di JSON | Sedang |
| G3 | Source type `HUMAN/AI/HUMAN_AI` + telusur original input (Sec 7) | Belum ada | Sedang |
| G4 | Revision history + restore (Sec 6) | N/A — belum ada | Sedang |
| G5 | `article_ideas` inbox (Sec 14) | Ada `docs/openclaw/ide-artikel.md` untuk bot, belum jadi entitas DB | Sedang |
| G6 | AI tool allowlist (Sec 10) — `createArticle`, `generateOutline`, dst | Belum ada; hanya bot manual `/artikel` (Gemini) | Tinggi |
| G7 | Telegram whitelist via `telegram_identities` + roles/permissions (Sec 5,16) | Bot manual cek `TELEGRAM_ADMIN_CHAT_ID` tunggal | Sedang |
| G8 | Telegram menu cepat & inline buttons + confirmation flow (Sec 9) | Bot manual terbatas (`/artikel /list /batal /myid`) | Tinggi |
| G9 | Agent/worker persisten (scheduler, monitoring, backup) (Sec 12,17) | Tidak ada worker; hanya bot long-polling manual | Tinggi |
| G10 | Monitoring/notifikasi/alert ke Telegram (Sec 15) | Belum ada | Tinggi |
| G11 | Media terkontrol + `media_assets` (Sec 8,13) | Ada `cover.post` (Vercel Blob) tapi tanpa entitas media_assets | Sedang |
| G12 | Admin dashboard "pusat administrasi lengkap" (Sec 14) | Dashboard admin **sudah ada & berfungsi** (auth, articles, projects, cv, chat, komentar, pesan, smtp) | ✅ Sebagian terpenuhi |
| G13 | Seed (Sec 18 Phase 1 langkah 3 & Section 4 single source of truth) | Ada `db:seed` script | ✅ |

---

## 6. Keamanan (awal, belum menyentuh production)

Sudah ada di repo: `admin-auth` middleware, `security-log` tabel, `rate-limit`,
`security-headers`, `session`. **Belum** ada (menunggu Phase 7):
role/permission granular, AI tool allowlist, peninjauan ulang log anti-bocor-secret.

Catatan env: semua secret di Vercel bertipe `Sensitive`/`Hidden` (tidak bocor via
CLI). Nama env yang dibutuhkan (tanpa nilai): `NUXT_ADMIN_PASSWORD`,
`NUXT_ADMIN_SECRET`, `NUXT_ADMIN_EMAIL`, `NUXT_SMTP_*`, `NUXT_MAIL_FROM*`,
`TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `BLOB_READ_WRITE_TOKEN`,
`TELEGRAM_BOT_TOKEN`, `TELEGRAM_ADMIN_CHAT_ID`, `GEMINI_API_KEY`.

---

## 7. Temuan arsitektur tambahan (relevan untuk keputusan)

### 7.1 Bot manual vs Rancangan OpenClaw

Selain `scripts/telegram-bot.mjs` (bot manual, hardcoded), repo sudah punya
**arsitektur OpenClaw** di `docs/openclaw/` yang **lebih maju** daripada PRD:
- Helper CRUD berbasis `scripts/lib/article-store.mjs` +
  `article-add/list/get/publish/delete.mjs` (disebut sudah diuji sandbox),
- Skill `skills/article-creator/SKILL.md`,
- Config gateway `openclaw.json.example`,
- Panduan `DEPLOY-OPENCLAW.md`, daftar ide `ide-artikel.md`.

PRD v1.2 **tidak mengakui** pendekatan OpenClaw ini; PRD justru mendefinisikan
tools AI sendiri (Phase 4) dengan bot/webhook. Perlu keputusan apakah
implementasi mengikuti PRD (AI tool calling custom) atau memanfaatkan OpenClaw
yang sudah dirancang.

### 7.2 Deployment terverifikasi

Domain `chdev.online` + `www.chdev.online` aktif di project Vercel
`cehadev-portfolio`. Alias `cehadev-portfolio.vercel.app` telah dihapus.
DNS domain dikelola **Hostinger** (nameserver `dns-parking.com`); token verifikasi
TXT domain tersedia di dashboard Vercel.

---

## 8. Rekomendasi & keputusan yang diminta owner

Sebelum Phase 1, owner perlu menetapkan keputusan berikut (Section 22 & 26 PRD):

1. **Model data**: membangun schema relasional penuh (per PRD Sec 13) vs
   mempertahankan KV dual-mode yang sudah ada. Rekomendasi: **ikuti PRD (relasional)**
   namun dengan migrasi bertahap agar data yang ada (KV) tetap aman.
2. **Database final**: Turso/libSQL (sudah terpasang di Vercel) vs PostgreSQL
   (alternatif PRD). Rekomendasi: **Turso/libSQL** — sudah terkonfigurasi.
3. **Deployment website**: tetap Vercel serverless (kondisi nyata) vs pindah VPS
   (sesuai DEPLOY.md). Rekomendasi: **Vercel untuk website** + VPS untuk
   worker/bot persisten (selaras Sec 12/17).
4. **Agent AI**: custom tool-calling (PRD Phase 4) vs OpenClaw (sudah dirancang).
5. **Telegram bot**: migrasi/penggabungan bot manual ke arsitektur baru (whitelist,
   confirmation, source-type) sesuai PRD.

**Tindakan yang DISARANKAN setelah persetujuan:**
- Memulai **Phase 1** dengan membangun schema relasional + Admin API CRUD artikel
  + revision, tanpa mengubah data production yang ada (migrasi non-destruktif).

---

## 9. Batasan audit

- Audit berbasis kode & konfigurasi repo + status project Vercel yang terverifikasi.
- Tidak membuka **nilai secret/production**.
- Tidak mengakses VPS (jika ada) atau data production runtime selain dari
  struktur repo/config publik.
- Konektivitas DNS publik (curl ke `chdev.online`) tidak dapat diverifikasi pada
  environment audit ini karena resolver lokal timeout — tidak memengaruhi
  kesimpulan arsitektur.

---

*Dokumen dibuat otomatis oleh AI coding assistant sebagai output Phase 0.*
*Menunggu persetujuan eksplisit owner (Section 26 PRD) sebelum eksekusi Phase 1.*
