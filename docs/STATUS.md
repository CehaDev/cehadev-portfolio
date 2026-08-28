# STATUS — CehaDev AI Admin & Content Agent

Dokumen ringkas berisi **apa yang sudah selesai**, **apa yang masih menunggu**, dan **langkah eksekusi yang tersisa** — agar satu-satunya pekerjaan yang belum bisa dikerjakan hanyalah yang benar-benar butuh akses/keputusan owner.

> Terakhir diperbarui berdasarkan audit & verifikasi penuh (semua artefak diuji ulang).

## 1. Sudah selesai & teruji

| Area | Status | Bukti |
|---|---|---|
| Schema relasional + migrasi (12+ tabel) | ✅ | `npm run migrate:test` PASS (migrasi→idempoten→rollback→re-migrasi) |
| Manajemen artikel (CRUD + workflow) | ✅ | unit test + CLI round-trip `add→get→publish→list` (file DB) |
| Enforcement workflow `IDEA→…→PUBLISHED` | ✅ | test (lompatan ditolak) |
| Idea manager | ✅ | unit test |
| AI pipeline (3 mode, 18 tool, approval gate) | ✅ | unit test |
| Media / STT / storage | ✅ | unit test |
| Telegram identity + whitelist + permission | ✅ | unit test |
| Monitoring / scheduler / backup / notifier | ✅ | unit test + worker smoke (bot/worker tetap hidup) |
| Keamanan (redaksi secret, rate limit, auth admin) | ✅ | unit test |
| Deploy artifacts (Dockerfile, compose, ecosystem, setup-vps) | ✅ | build clean, docker-compose valid |
| Suite test keseluruhan | ✅ | `npm test` = **66/66 lulus** (16 suites) |

**Verifikasi terakhir (sesi ini):** `npm test` 66/66, `npm run migrate:test` PASS, `nuxi build` clean, `worker.mjs` boot bersih + self-`ensureSchema`, CLI artikel round-trip sukses.

## 2. Salah satu masalah kode yang diperbaiki di sesi ini

- `scripts/worker.mjs`: sebelumnya override DB (`__setDbForTest`) tidak menjangkau instance `article-manager` internal milik scheduler (beda module-instance via jiti) → worker gagal dengan `Relational article store memerlukan TURSO_DATABASE_URL`.
  **Perbaikan:** default `TURSO_DATABASE_URL=file:.data/worker.db` sebelum modul di-import + panggil `ensureSchema()` saat boot → worker kini **self-contained** (boot → buat schema → jalankan loop), konsisten dengan Docker/VPS.

## 3. Belum bisa diselesaikan & alasannya (butuh keputusan/akses owner)

### 3a. Server 24/7 untuk bot + worker + DB
- **Kebutuhan:** VM/VPS yang nyala 24/7 (bot Telegram, worker scheduler/monitoring/backup, dan DB file lokal).
- **Penghambat:** semua penyedia VM gratis (Oracle Cloud Always Free, dst.) mewajibkan **verifikasi kartu** (otorisasi kecil yang dikembalikan). Owner saat ini **tidak punya kartu**.
- **Opsi:** (a) buat kartu debit virtual gratis → pakai Oracle Always Free; (b) pinjam VM orang lain; (c) tunda sampai ada kartu. Semua kode deploy sudah siap (Dockerfile + compose + DEPLOY.md + PHASE8/9).

### 3b. Website publik `chdev.online` masih dialihkan ke login SSO Vercel
- **Gejala (terverifikasi):** `chdev.online` → DNS `76.76.21.21` (Vercel) benar; project `cehadev-portfolio` di team `cehadev's projects` memiliki deployment "Ready"; tapi akses publik memicu `302 → vercel.com/sso-api` (login SSO).
- **Penyebab:** team Vercel mengaktifkan SSO (Single Sign-On/SAML).
- **Tindakan owner:** di dashboard Vercel → team → project → Settings → matikan "Require SSO"/SAML, atau pindahkan project ke account pribadi non-team; atau gunakan akun Vercel pribadi untuk domain publik.
- **Setelah SSO mati:** `chdev.online` langsung tampil publik + endpoint `/api/health` dapat diakses.

## 4. Langkah eksekusi tersisa (urut, ketika hambatan teratasi)

1. **Aktifkan website publik:** matikan SSO Vercel (3b) → verifikasi `chdev.online` & `/api/health`.
2. **Sediakan server 24/7:** dapatkan kartu virtual / VM (3a).
3. **Deploy ke server:** ikuti salah satu:
   - Docker: `cp .env.example .env` → isi secret owner → `docker compose up -d --build`.
   - Manual: `scripts/setup-vps.sh` + `ecosystem.config.cjs` + `DEPLOY.md`.
4. **Migrasi DB prod:** `npm run migrate` (DB `file:` di volume `/srv/data`).
5. **Start worker & bot:** via PM2 / compose (24/7).
6. **Set secret live** di server (`.env`): `NUXT_ADMIN_*`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_ADMIN_CHAT_ID`, `GEMINI_API_KEY`, SMTP, `SITE_URL`.
7. **Verifikasi end-to-end:** `npm run health`, cek `/api/health`, dashboard `/admin`, bot Telegram.

## 5. Keputusan yang perlu diambil owner

- Kapan & bagaimana mendapat akses verifikasi (kartu) atau VM.
- SSO Vercel: dimatikan, atau project dipindah ke akun pribadi.
- (Opsional) Turso vs DB file lokal — rekomendasi: **file lokal di VPS** (tanpa layanan cloud tambahan), kode sudah mendukung keduanya.
