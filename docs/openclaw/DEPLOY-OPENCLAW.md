# Panduan Instalasi Penuh: OpenClaw Article Agent di VM Oracle

Dokumen ini memandu pemasangan penuh AI agent **OpenClaw** di VM Oracle
(server tempat website berjalan) sehingga Anda bisa — **tanpa membuka admin
dashboard** — membuat, meninjau, dan menerbitkan artikel langsung dari
**Telegram**. Bot AI juga membuat artikel secara berkala dari daftar ide,
tapi **tidak pernah auto-publish**.

Asumsi: website sudah jalan di `/srv/cehadev` (lihat `DEPLOY.md`), OS Ubuntu.

---

## 1. Struktur file yang disiapkan (di repo)

| File | Fungsi |
|---|---|
| `scripts/lib/article-store.mjs` | penyimpanan artikel (sama dengan dashboard) |
| `scripts/article-add.mjs` | tambah draft |
| `scripts/article-list.mjs` | daftar artikel |
| `scripts/article-get.mjs` | preview/lihat isi |
| `scripts/article-publish.mjs` | terbitkan (hanya via konfirmasi) |
| `scripts/article-delete.mjs` | hapus |
| `skills/article-creator/SKILL.md` | skill OpenClaw (instruksi agent) |
| `docs/openclaw/ide-artikel.md` | daftar ide untuk bot otomatis |
| `docs/openclaw/openclaw.json.example` | contoh config gateway |

Semua helper milik project CehaDev. Pastikan repo project ter-pull di VM
(`git pull`).

---

## 1b. Cara cepat — instalasi otomatis (skrip sekali jalan)

Skrip `scripts/setup-openclaw.sh` mengotomatiskan seluruh proses di bawah
(install OpenClaw, salin skill/helper, generate `openclaw.json`, jalankan
gateway via PM2, pasang cron harian). Cukup isi data lalu jalankan sekali:

```bash
cd /srv/cehadev
cp docs/openclaw/.env.openclaw.example .env.openclaw
nano .env.openclaw        # isi TELEGRAM_BOT_TOKEN + GEMINI_API_KEY

bash scripts/setup-openclaw.sh      # (cek dulu tanpa mengubah: --dry-run)
```

Setelah itu sambungkan Telegram (section 6) dan gunakan. Rincian langkah demi
langkah manual ada di bawah untuk kebutuhan lanjutan / troubleshooting.

---

## 2. Install OpenClaw di VM

```bash
# Pakai instalasi resmi (menginstal Node versi yang dibutuhkan juga)
curl -fsSL https://openclaw.ai/install.sh | bash

# Atau via npm global:
# npm i -g openclaw

# Pastikan tersedia
openclaw --version
```

---

## 3. Siapkan skill & helper

SSH ke VM, lalu pastikan skill dapat dibaca OpenClaw. Dua pilihan:

**Opsi A — skill di folder project (workspace skill).**
Jadikan project CehaDev sebagai workspace OpenClaw, atau salin skill ke
direktori skill OpenClaw:

```bash
# salin skill ke lokasi skill OpenClaw (default ~/.openclaw/workspace/skills)
mkdir -p ~/.openclaw/workspace/skills
cp -r /srv/cehadev/skills/article-creator ~/.openclaw/workspace/skills/

# cek terdeteksi
openclaw skills list | grep article
```

Helper sudah berada di `/srv/cehadev/scripts/` bersama project (karena 1 repo).
Pastikan helper bisa dijalankan:

```bash
cd /srv/cehadev
ls scripts/article-add.mjs scripts/article-publish.mjs
node scripts/article-list.mjs
```

---

## 4. Isi config OpenClaw

```bash
mkdir -p ~/.openclaw
cp /srv/cehadev/docs/openclaw/openclaw.json.example ~/.openclaw/openclaw.json
nano ~/.openclaw/openclaw.json
```

Sesuaikan:
- `channels.telegram.botToken` → token dari @BotFather.
- `skills.entries["article-creator"].env.GEMINI_API_KEY` → key dari
  https://aistudio.google.com/apikey (gratis).

Env fallback juga didukung: `TELEGRAM_BOT_TOKEN`.

---

## 5. Jalankan Gateway (selalu online) dengan PM2

```bash
# uji dulu di foregournd beberapa detik
openclaw gateway

# lalu jalankan permanen
pm2 start openclaw --name openclaw -- gateway
pm2 save
pm2 startup   # ikuti perintah yang muncul
```

Cek: `pm2 logs openclaw`, `pm2 status`.

---

## 6. Pairing Telegram (sekali)

1. Di HP, buka chat bot Anda, kirim pesan apa pun (mis. `/start`/`/ping`).
2. Di VM:
   ```bash
   openclaw pairing list telegram
   openclaw pairing approve telegram <CODE>
   ```
   (kode kedaluwarsa 1 jam; kirim ulang pesan bila perlu)
3. Setelah approve, kirim `halo` → bot menjawab = sudah nyambung.

> Untuk satu-pemilik, `dmPolicy: "pairing"` cukup. Untuk hanya user tertentu,
> set `dmPolicy: "allowlist"` + `allowFrom: ["<ID_TELEGRAM>"]`.

---

## 7. Bot otomatis berkala (cron) — buat 1 draft per giliran, tidak auto-publish

Tambahkan jadwal di crontab agar OpenClaw membuat artikel secara berkala dari
daftar ide. Contoh: setiap hari pukul 08.00 WIB (UTC+7 → 01.00 UTC).

```bash
crontab -e
```

```cron
# setiap hari 08:00 waktu server — buat 1 artikel draft berikutnya dari daftar ide
0 8 * * * cd /srv/cehadev && /root/.local/share/pnpm/openclaw agent --message "Gunakan skill article-creator untuk membuat artikel otomatis berikutnya dari daftar ide (sekali saja, jangan auto-publish)" >> /srv/cehadev/.data/openclaw-cron.log 2>&1
```

Penyesuaian:
- Path `openclaw` mungkin beda (cek `which openclaw`).
- Ganti waktu sesuai zona server Anda (`date`).
- Log ditulis ke `.data/openclaw-cron.log` (folder `.data` sudah di-gitignore).

Karena skill artinya **sekali per giliran** dan selalu menyimpan **draft**,
batas aman. Anda tetap yang menerbitkan via `/terbitkan <slug>`.

---

## 8. Alur penggunaan di Telegram (tanpa admin dashboard)

| Anda ketik | Bot melakukan |
|---|---|
| `/artikel tips Nuxt.js` | menulis draft dua bahasa, simpan, kirim ringkasan |
| `/daftar` | menampilkan draft 📝 & published ✅ |
| `/lihat <slug>` | preview isi (per bagian bila panjang) |
| `/terbitkan <slug>` | konfirmasi dulu → baru **publish** |
| `/hapus <slug>` | hapus artikel |
| `/tambah-ide <topik>` | tambah ide ke daftar untuk bot otomatis |
| `/lihat-ide` | tampilkan daftar ide |
| (cron) | buat 1 draft dari ide berikutnya, kirim ringkasan |

Artikel hasil `/terbitkan` langsung tampil di `/articles` website. Tidak perlu
login admin.

---

## 9. Verifikasi

```bash
# semua helper berfungsi
cd /srv/cehadev
node scripts/article-add.mjs --json '{"title_id":"Tes","title_en":"Test"}'
node scripts/article-list.mjs
node scripts/article-delete.mjs --slug test
```

Di Telegram: buat artikel contoh → `/lihat` → `/terbitkan` → buka `/articles`.

---

## 10. Troubleshooting

- **Bot tidak menjawab**: pastikan `pm2 status` menunjukkan `openclaw` online;
  cek `pm2 logs openclaw`; cek pairing (`openclaw pairing list telegram`).
- **"GEMINI_API_KEY" tidak ada**: periksa config `skills.entries["article-creator"]`.
- **Helper tidak ditemukan**: pastikan repo ter-pull, `ls /srv/cehadev/scripts` berisi
  `article-*.mjs`; sesuaikan path di SKILL.md bila berbeda.
- **Artikel tidak muncul di website**: pastikan status `published`
  (`/daftar`); publik hanya menampilkan yang `published`.

---

## 11. Keamanan singkat

- Artikel **tidak pernah** auto-publish; publikasi butuh `/terbitkan` eksplisit.
- `dmPolicy: pairing`/`allowlist` membatasi siapa yang bisa memerintah bot.
- `GEMINI_API_KEY` disuntik per-turn, tidak masuk prompt.
- Helper tidak pernah menyentuh kredensial admin (`NUXT_ADMIN_PASSWORD`).
