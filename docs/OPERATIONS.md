# Operasional & Recovery — CehaDev AI Admin & Content Agent

Dokumen ini merangkum seluruh komponen operasional, script, endpoint, dan prosedur
recovery (PRD §22 "Dokumentasi operasional dan recovery tersedia"). Ini adalah referensi
operasional — **tidak** menyentuh production tanpa persetujuan (§21/§26).

## 1. Peta komponen

| Area | Kode | Keterangan |
|---|---|---|
| Schema relasional | `server/utils/db.ts`, `scripts/lib/ddl.mjs` | PRD §13; additif di atas KV legacy |
| Artikel | `server/utils/article-manager.ts` | CRUD, transisi status, revision, schedule |
| Ide | `server/utils/idea-manager.ts` | Idea inbox |
| Identitas & permission | `server/utils/telegram-identity.ts`, `permissions.ts` | whitelist + role-based permission |
| AI pipeline | `server/utils/ai.ts`, `ai-pipeline.ts` | Gemini client + 18 tools, 3 mode menulis, approval |
| Media/STT | `storage.ts`, `media-manager.ts`, `transcription.ts` | upload, validasi, voice→transkrip |
| Monitoring | `monitoring.ts` | health DB/web/API + metrics + overview |
| Scheduler | `scheduler.ts` | publish terjadwal (`scheduled_at`) |
| Backup | `backup.ts` | create/list/restore/prune (gzip, 12 tabel) |
| Notifier | `notifier.ts` | notifikasi Telegram (`sendNotification`/`notifyError`/`notifyDeployment`) |
| Redaksi secret | `redact.ts` | sensor secret pada semua log |
| Rate limit | `rate-limit.ts` | KV + in-memory |

## 2. Script & npm command (lokal / non-destruktif oleh default)

| Perintah | Fungsi |
|---|---|
| `npm test` | Jalankan seluruh test (unit+integration) |
| `npm run migrate` | Migrasi relasional ke Turso (butuh `TURSO_DATABASE_URL`) |
| `npm run migrate:test` | Uji migrasi+rollback di staging file-DB (TIDAK butuh Turso) |
| `npm run rollback` | Drop layer relasional (guard `CONFIRM_ROLLBACK=yes`) |
| `npm run bot:v2` | Jalankan Telegram bot v2 (persisten) |
| `npm run worker` | Jalankan worker: scheduler+monitor+backup+alert (persisten) |
| `npm run health` | Health-check eksternal website + `/api/health` → alert Telegram |

Persisten (disarankan via PM2, lihat `ecosystem.config.cjs`): `bot:v2`, `worker`, dan web.

## 3. Endpoint admin (autentikasi `requireAdmin` global + permission)

- Artikel/Ide: `/api/admin/articles`, `/api/admin/manage/articles`, `/api/admin/manage/ideas`
- Workflow: `/api/admin/articles/[slug]/transition|revisions|restore`, `/scheduler/run`
- AI: `/api/admin/ai/generate|tool|pipeline/[articleId]|approve`
- Media: `/api/admin/media` (+serve `/media/[key]`)
- Aktivitas: `/api/admin/manage/activity`
- Monitoring: `/api/admin/monitor/overview|health`
- Backup: `/api/admin/backup/create|(index GET)|restore`
- Health publik: `/api/health`

## 4. Prosedur backup & restore

**Backup** (otomatis oleh worker, retensi `BACKUP_RETENTION_DAYS`):
`createBackup()` menggzip 12 tabel ke `.data/backups/backup-<timestamp>.json.gz`.

**Restore** (guard path cegah traversal):
`/api/admin/backup/restore` (body `name`) → `restoreBackup(file)`; hanya tabel yang
ada di DB yang di-restore; tabel di luar dump dilewati.

**Rollback data relasional** (jika perlu turun kembali ke sistem lama):
`TURSO_DATABASE_URL=... CONFIRM_ROLLBACK=yes npm run rollback` — drag layer PRD,
KV legacy utuh.

## 5. Prosedur recovery

| Skenario | Tindakan |
|---|---|
| Service turun | `pm2 startOrRestart ecosystem.config.cjs` (autorestart sudah aktif) |
| Bocor memori | PM2 `max_memory_restart` otomatis restart |
| Reboot VPS | `pm2 startup` + `pm2 save` (aktif otomatis) |
| Data korup | Restore backup via API `/api/admin/backup/restore` |
| Migrasi gagal | `npm run migrate` (idempoten) atau `npm run rollback` lalu re-migrate |
| OS VPS rusak | `git clone` + `npm ci && npm run build` + `pm2 startOrRestart` (auditable) |
| Secret bocor/rotasi | update secret store + `revokeAllSessions()` + restart service |
| Artikel salah edit | restore via revision history (Phase 1/3) |

## 6. Log & keamanan

- `activity_logs` (opsi penting), `agent_runs` (tool AI) — semua **ter-redaksi** (`redact.ts`).
- **Tidak ada** token/password/API key yang boleh masuk log (diverifikasi `security.test`).
- Whitelist: hanya Telegram user yang terdaftar & diizinkan yang boleh akses bot.
- AI terbatas pada 18 allowlisted tools — tanpa database mentah, tanpa shell VPS.

## 7. Environment variable (production — diisi di secret store, tidak di-commit)

`NUXT_ADMIN_PASSWORD`, `NUXT_ADMIN_SECRET`, `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`,
`TELEGRAM_BOT_TOKEN`, `TELEGRAM_ADMIN_CHAT_ID`, `GEMINI_API_KEY` (opsional: `SITE_URL`, interval).
