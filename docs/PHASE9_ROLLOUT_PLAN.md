# Phase 9 — Testing, Migration, Production Rollout (PRD Section 18/19/21/22)

> Status: **RENCANA siap-eksekusi**. Setiap langkah produksi di bawah TIDAK boleh
> dijalankan tanpa persetujuan eksplisit owner (Section 21) dan verifikasi staging
> yang dapat dibuktikan.

## 0. Prasyarat (harus dipenuhi owner)

- [ ] VPS disediakan & akses SSH tersedia (lihat `docs/PHASE8_VPS_PLAN.md`, `scripts/setup-vps.sh`).
- [ ] Secret production diisi di tempat aman (Vercel/VPS secret store) — **tidak pernah di commit**:
      `NUXT_ADMIN_PASSWORD`, `NUXT_ADMIN_SECRET`, `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`,
      `TELEGRAM_BOT_TOKEN`, `GEMINI_API_KEY`, `TELEGRAM_ADMIN_CHAT_ID`.
- [ ] Database Turso production disediakan (endpoint + token).
- [ ] Persetujuan tertulis owner untuk deploy/migrasi/secara production.

## 1. Acceptance criteria (Section 19) — status lokal

| Kriteri | Status lokal | Keterangan / test |
|---|---|---|
| Artikel dibuat via Telegram muncul di dashboard & website sesuai status | ✅ diuji | `integration-flow`, `ops`, `telegram-identity` |
| Edit dari Telegram & dashboard memakai record sama | ✅ diuji | single *source of truth* (Phase 4) |
| Human/AI/Human+AI dapat dibedakan | ✅ diuji | `source_type` + pipeline (Phase 4) |
| Original input & revision dapat dipulihkan | ✅ diuji | revisions/restore (Phase 1,3) |
| AI generate tidak auto-publish | ✅ diuji | pipeline selalu DRAFT (Phase 4) |
| Publish memerlukan konfirmasi | ✅ diuji | confirmation flow (Phase 3/4) |
| Telegram hanya untuk identity diizinkan | ✅ diuji | non-whitelisted ditolak (Phase 3) |
| Audit log merekam operasi penting | ✅ diuji | `activity_logs`/`agent_runs` + redaksi (Phase 7) |
| Monitoring dasar tersedia via Telegram | ⚠️ siap | worker/health-monitor belum live VPS |
| Backup dapat direstore (staging) | ✅ diuji | `ops.test` round-trip (Phase 6) |
| Production tidak berubah sebelum checklist selesai | ✅ dipatuhi | belum ada deploy |

## 2. Migration & rollback test (Section 18 Phase 9 / §22)

Sudah dibuat & lulus LOCAL (staging-equivalent, file DB tanpa TURSO):

```bash
npm run migrate:test      # migrasi -> idempoten -> seed -> rollback -> re-migrasi
```

Sebelum menyentuh production, jalankan ulang build/test dan backup:
```bash
npm test
npm run migrate:test
TURSO_DATABASE_URL=... TURSO_AUTH_TOKEN=... npm run migrate   # jalankan di STAGING/production-copy dulu
```

Rollback darurat (drop layer relasional PRD; legacy KV utuh):
```bash
TURSO_DATABASE_URL=... TURSO_AUTH_TOKEN=... CONFIRM_ROLLBACK=yes npm run rollback
```

## 3. Production rollout (Section 18 Phase 9 langkah 5)

Urutan aman (WAJIB persetujuan + backup sebelum eksekusi):
1. **Backup penuh** DB production dulu (memakai `scripts/worker.mjs`/backup, atau snapshot provider).
2. **Migrasi** di production: `TURSO_DATABASE_URL=... TURSO_AUTH_TOKEN=... npm run migrate`.
3. Verifikasi tabel: `npm run health` dan artikel terbaca.
4. **Deploy via Git** (auditable) ke VPS:
   ```bash
   bash scripts/setup-vps.sh <repo> main
   ```
   (atau deploy serverless + VPS terpisah sesuai keputusan Phase 8.)
5. **Jalankan proses persisten** di VPS: `pm2 startOrRestart ecosystem.config.cjs`
   → `chdev-telegram-bot`, `chdev-worker`, `chdev-web`.
6. **Verifikasi monitoring**: `npm run health`; worker alert; dimanapun fire tidak.

## 4. Definition of Done (Section 22) — cek akhir

- [ ] Seluruh acceptance criteria terpenuhi (checklist §1).
- [ ] Security checklist lulus (Phase 7: whitelist, authz, allowlist, rate limit, redaksi).
- [ ] Migration & rollback diuji (µ `npm run migrate:test` + staging production).
- [ ] Backup/restore diuji (µ `ops.test`).
- [ ] Telegram authentication & permission diuji.
- [ ] AI tool permission diuji.
- [ ] Monitoring & alert diuji (staging/production live).
- [ ] Staging berjalan stabil.
- [ ] Production deployment via Git dan dapat di-rollback (µ `npm run rollback` + `git revert`).
- [ ] Dokumentasi operasional & recovery tersedia ⟵ dokumen ini + DEPLOY.md + PHASE8_VPS_PLAN.md.

## 5. Operasional & Recovery (ringkas)

- **Status/restart**: `pm2 status`, `pm2 restart chdev-worker`, `pm2 logs chdev-worker`.
- **Backup**: dikelola worker (`BACKUP_CRON_MS`), retention `BACKUP_RETENTION_DAYS`.
- **Restore**: `restoreBackup` via admin API `/api/admin/backup/restore` (guard path).
- **Rollback data**: `npm run rollback` (guard `CONFIRM_ROLLBACK=yes`).
- **Recovery kode**: `git pull` + `npm ci && npm run build` + `pm2 startOrRestart`.
- **Rotasi secret**: update secret store + restart service; `revokeAllSessions` bila perlu.
