# Phase 8 — VPS Deployment Plan (PRD Section 17)

> Status: **DESAIN/siap-eksekusi** — belum menyentuh VPS/production. Menunggu
> data akses & persetujuan owner (PRD §25: jangan mengasumsikan kredensial).

Architect banyak menulis keputusan ini ke server dengan disk permanen (network terlihat nyata):
PRD §12/§17 menegaskan proses persisten (bot, worker, scheduler, monitoring) **tidak cocok**
di platform serverless (Vercel) karena butuh proses selalu-hidup & state lokal. DEPLOY.md
sudah mengarahkan ke **Oracle Cloud Always Free (VM ARM)** — sejalan dengan kebutuhan ini.

## 1. Arsitektur target

```
                    ┌────────────────────────────────────────────┐
                    │  VPS (VM, disk permanen)                    │
                    │  Nginx (HTTPS) ─► Node/PiM2                 │
                    │    • chdev-web    : Nitro (807/3000)        │
                    │    • chdev-telegram-bot : polling Telegram  │
                    │    • chdev-worker : scheduler+monitor+backup│
                    │  .env  (secret, di-commit tidak pernah)     │
                    │  .data (DB lokal / backup, bekerja di sini) │
                    └────────────────────────────────────────────┘
                              ▲
        Vercel/serverless (opsional) ─► public site + serverless API
```

Keputusan pemisahan (PRD §17.2): **webserver boleh** tetap di serverless, namun
**bot + worker wajib di VPS**. Jika jaringan/proses dibawa ke satu VPS, seluruh stack
dijalankan di VPS dengan PM2 (lihat `ecosystem.config.cjs`).

## 2. Evaluasi kebutuhan resource (PRD §17.1)

| Komponen | Sifat | Dumata | Estimasi |
|---|---|---|---|
| Website Nitro | on-demand | request-driven | 1 CPU kecil, memori ~200–400MB |
| Telegram bot v2 | polling idle | selalu hidup | memori ~60–150MB, negligible CPU |
| Worker | interval | selalu hidup | memori ~80–150MB, CPU saat backup/alert |
| Database (Turso bila dipakai) | eksternal | saaat panggilan | cloud, tidak di VPS |
| Total baseline | — | — | 1–2 vCPU, 0.5–1GB RAM |

Rekomendasi **minimum**: 1 vCPU / 1–2 GB RAM / 20–30 GB disk (Oracle A1.Flex 2 OCPU /
12GB dalam kuota free tetap aman). Bot+worker berjalan pada **fork single-instance**
(memang di `ecosystem.config.cjs`); tidak perlu cluster.

## 3. Health check & restart policy (PRD §17.4, §15)

Disediakan tiga lapisan:

1. **PM2 autorestart** — `ecosystem.config.cjs` mengatur:
   - `autorestart: true` + `restart_delay: 5000` (restart saat crash, tidak menggila)
   - `max_memory_restart: 300M` (bot/worker) & `500M` (web) → pembunuh saat bocor memori
   - `pm2 startup` + `pm2 save` → otomatis aktif kembali saat reboot VPS
2. **Worker berulang** — `scripts/worker.mjs` (`npm run worker`) melakukan `processScheduledArticles`
   + `checkDatabase`/`checkWebsite`/`checkApi` + threshold alert + backup terjadwal, kirim
   notifikasi ke Telegram memakai `server/utils/notifier.ts`.
3. **External probe** — `scripts/health-monitor.mjs` memeriksa `GET <base>` dan
   `GET <base>/api/health`, alert via notifier bila gagal/lambat. Dapat dijadwalkan via cron.

Langkah disarankan saat VPS tersedia (bukan sekarang):
```bash
bash scripts/setup-vps.sh
pm2 status
```

## 4. Fallback & recovery (PRD §17.5)

- Free VPS dianggap **experimental**: jangan menggantungkan single instance.
  - Data disimpan real di Turso (remote), bukan hanya disk lokal → bisa dipindah.
  - Backup terjadwal (`scripts/worker.mjs`) → `restoreBackup`.
- Recovery path:
  1. `pm2 restart <app>` bila service turun.
  2. Restore dari backup bila data korup.
  3. Rebuild VPS bila OS rusak → `git clone` + `npm ci && npm run build` (auditable via Git).
- Tidak ada **manual deploy tanpa jejak**: deploy selalu via `git pull` + `pm2 startOrRestart`
  (workflow auditable, PRD §17.4).

## 5. Yang TIDAK dilakukan di Phase 8 (masuk Phase 9 + persetujuan)

- Menyediakan/menjalankan VPS aktual, Nginx, SSL, memperbarui DNS — butuh kredensial & persetujuan owner (§21).
- Migration produksi / perubahan database utama (§21).
- Set secret produksi (§16).
