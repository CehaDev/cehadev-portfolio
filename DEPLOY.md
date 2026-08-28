# Panduan Deploy Website CehaDev (Gratis — Oracle Cloud Always Free)

Website ini adalah aplikasi **Node.js (Nuxt 3 / Nitro)** yang:
- memakai `better-sqlite3` (native module),
- **menulis file di server saat runtime** (`.data/` untuk chat, pesan, statistik pengunjung; `content/` untuk edit konten dari panel admin; `public/uploads/` untuk foto).

Karena itu hosting yang cocok adalah **server (VM) dengan disk permanen** — bukan hosting statis/serverless (Vercel, Netlify, dll) yang filenya hilang saat restart. Solusi gratis selamanya yang pas: **Oracle Cloud Always Free (VM ARM)**.

---

## Ringkasan arsitektur

```
Internet → Nginx (port 80/443, + SSL) → PM2 → Node.js (Nuxt .output) → disk (data tersimpan permanen)
```

| Komponen | Fungsi |
|---|---|
| Oracle VM (Ubuntu 22.04) | Tempat aplikasi jalan, disk permanen |
| Node.js 22 LTS | Runtime aplikasi |
| PM2 | Menjaga aplikasi tetap hidup + auto-restart |
| Nginx | Reverse proxy + HTTPS |
| Certbot | Sertifikat SSL gratis (Let's Encrypt) |
| UptimeRobot (opsional) | Pantauan 24/7 apakah website online |

---

## A. Persiapan di laptop

1. Pastikan project sudah di-push ke GitHub (repo harus **privat** — karena berisi kode panel admin). Buat repo baru di GitHub lalu:
   ```bash
   cd /home/chdev/Dokumen/chdev
   git remote add origin git@github.com:NAMA-USER/cehadev-portfolio.git
   git push -u origin main
   ```
   > File `.env`, `.data/`, `.output/` sudah di-`.gitignore`, jadi **tidak ikut ter-upload**. Aman.

2. Siapkan SSH key di laptop (untuk akses ke server Oracle):
   ```bash
   ssh-keygen -t ed25519 -f ~/.ssh/oci_cehadev -C "cehadev-oracle"
   ```
   Simpan hasilnya (file `oci_cehadev.pub` — isinya akan dipakai saat membuat VM).

---

## B. Buat akun & VM Oracle Cloud (sekali saja)

1. Daftar di https://signup.oraclecloud.com
   - Syarat: email, nomor HP, dan **kartu kredit/debit** (hanya untuk verifikasi identitas, **tidak dipungut biaya**).
   - Pilih **home region** dengan hati-hati (mis. Jakarta, Singapore, atau Frankfurt). Instance Always Free hanya bisa dibuat di home region.
   - Setelah selesai, jangan upgrade ke "Pay As You Go" — biarkan di Always Free.

2. Buat VM:
   - Menu **Compute → Instances → Create instance**.
   - **Image**: Ubuntu 22.04.
   - **Shape**: `VM.Standard.A1.Flex` (ARM).
     - **OCPU: 2, Memory: 12 GB** ← PENTING: jangan lebih dari 2 OCPU / 12 GB total, karena sesuai aturan Oracle, kalau melebihi maka instance ARM akan di-disable 30 hari setelah masa trial.
   - **SSH keys**: paste isi `~/.ssh/oci_cehadev.pub`.
   - Boot volume: ukuran default (bisa diperbesar hingga 200 GB, tetap gratis).
   - Catat **Public IP address** dan user default = `ubuntu`.

3. Buka port firewall di Oracle:
   - **Networking → Virtual Cloud Networks → <VCN Anda> → Security Lists → Default Security List → Add Ingress Rules**:
     | Source | IP Protocol | Destination Port |
     |---|---|---|
     | 0.0.0.0/0 | TCP | 80 |
     | 0.0.0.0/0 | TCP | 443 |
     | 0.0.0.0/0 | TCP | 22 (biasanya sudah ada) |

4. Tes koneksi SSH dari laptop:
   ```bash
   ssh -i ~/.ssh/oci_cehadev ubuntu@IP_ANDA
   ```

---

## C. Setup server (satu kali)

Jalankan di dalam SSH server:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git nginx build-essential python3 ca-certificates curl

# Node.js 22 LTS
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node -v   # harus v22.x

# PM2
sudo npm install -g pm2
```

> `build-essential` + `python3` diperlukan untuk mengompilasi `better-sqlite3` jika prebuilt binary untuk ARM tidak tersedia.

---

## D. Deploy aplikasi

```bash
sudo mkdir -p /srv && sudo chown -R $USER:$USER /srv
cd /srv
git clone <URL-repo-GitHub> cehadev
cd cehadev
npm ci
npm run build
```

Buat file `.env` (manual, tidak pernah di-commit):

```bash
nano /srv/cehadev/.env
```

Isi minimal:

```env
NUXT_ADMIN_PASSWORD=PASSWORD_KUAT_ADMIN
NUXT_ADMIN_SECRET=<jalankan: openssl rand -base64 32>

# Opsional — agar balas pesan kontak via email dari panel admin jalan:
NUXT_SMTP_HOST=smtp.gmail.com
NUXT_SMTP_PORT=465
NUXT_SMTP_SECURE=true
NUXT_SMTP_USER=email-anda@gmail.com
NUXT_SMTP_PASS=app-password-16-karakter
NUXT_MAIL_FROM=email-anda@gmail.com
NUXT_MAIL_FROM_NAME=CehaDev
```

> SMTP Gmail wajib pakai **App Password** (aktifkan 2-Step Verification → https://myaccount.google.com/apppasswords). Bisa dikosongkan dulu jika belum mau.

#### Opsional — Telegram Article Bot (buat artikel dari luar kota tanpa buka admin dashboard)

Jika Anda ingin menulis artikel baru lewat Telegram padahal sedang jauh dari laptop, aktifkan bot berikut. Artikel yang dibuat otomatis tersimpan sebagai **draft** dan tinggal ditinjau/diterbitkan dari panel admin.

Tambahkan ini ke `.env` di server:

```env
# 1) Token bot dari @BotFather
TELEGRAM_BOT_TOKEN=
# 2) Chat id Anda (bot -> /start lalu /myid -> isi di sini)
TELEGRAM_ADMIN_CHAT_ID=
# 3) Gemini API key gratis: https://aistudio.google.com/apikey
GEMINI_API_KEY=
```

Cara mudah membuat bot & key:

1. **Bot Telegram**: buka chat **@BotFather** → `/newbot` → pilih nama & username → dapat `TELEGRAM_BOT_TOKEN`.
2. **Chat ID**: buka chat bot Anda → kirim `/start`, lalu `/myid` → salin angka yang muncul ke `TELEGRAM_ADMIN_CHAT_ID`.
3. **Gemini key**: buka https://aistudio.google.com/apikey → *Create API key* (gratis, tanpa kartu kredit) → salin ke `GEMINI_API_KEY`.

Jalankan bot (di server) sebagai process terpisah agar selalu hidup:

```bash
cd /srv/cehadev
pm2 start scripts/telegram-bot.mjs --name telegram-bot --node-arg=--env-file=.env
pm2 save
```

Cek log: `pm2 logs telegram-bot`.

Cara pakai di Telegram:
- `/artikel topik atau ide tulisan` → bot minta Gemini menulis draft dua bahasa (ID/EN), lalu menyimpannya sebagai **draft**.
- `/list` → lihat semua artikel.
- `/batal [slug]` → hapus artikel.
- `/myid` → lihat chat id Anda.

Kemudian tinjau & terbitkan dari dashboard admin (`/admin/articles`). Lokasi penyimpanan artikel sama dengan dashboard (KV/Turso), jadi tidak ada sinkronisasi tambahan.


Tes dulu secara manual:

```bash
cd /srv/cehadev
PORT=3000 node --env-file=.env .output/server/index.mjs
```

Buka `http://IP_ANDA:3000` di browser. Kalau tampil, hentikan (`Ctrl+C`) lalu jalankan permanen dengan PM2:

```bash
cd /srv/cehadev
cat > ecosystem.config.cjs << 'EOF'
module.exports = {
  apps: [{
    name: 'cehadev',
    cwd: '/srv/cehadev',
    script: '.output/server/index.mjs',
    node_args: '--env-file=.env',
    instances: 1,
    autorestart: true,
    max_memory_restart: '500M',
    env: { NODE_ENV: 'production', PORT: 3000 }
  }]
}
EOF
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup   # ikuti perintah yang muncul (sekali jalan, otomatis aktif saat reboot)
```

Cek: `pm2 status` → status `online`.

---

## E. Nginx reverse proxy

Buat config:

```bash
sudo nano /etc/nginx/sites-available/cehadev
```

```nginx
server {
    listen 80;
    server_name IP_ANDA cehadev.duckdns.org;   # sesuaikan dengan domain/subdomain Anda

    client_max_body_size 20M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Aktifkan:

```bash
sudo ln -s /etc/nginx/sites-available/cehadev /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

Cek `http://IP_ANDA/` — sudah bisa diakses publik tanpa port 3000.

---

## F. Domain & SSL (Anda belum punya domain)

**Opsi A — subdomain gratis (bisa langsung):**
- `sslip.io`: otomatis `https://IP_ANDA.sslip.io` akan resolve ke IP Anda. Gratis, tanpa daftar.
- **duckdns.org** (disarankan — nama lebih rapi): daftar gratis → buat subdomain mis. `cehadev.duckdns.org` → set IP ke IP server Anda → instal agen update otomatis (ikuti panduan di situs DuckDNS).

**Opsi B — beli domain (disarankan untuk jangka panjang):**
- Merek situs ini "chdev" → sebaiknya beli `chdev.online` (sudah aktif).
- Registrar lokal: Niagahoster, Domainesia, dll. Harga sekitar Rp130.000–200.000/tahun.
- Set **A record** ke IP server Anda.

Setelah domain/subdomain siap, pasang SSL gratis (Let's Encrypt):

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d cehadev.duckdns.org
```

Certbot otomatis memperbarui sertifikat (via systemd timer). Selanjutnya akses via `https://...` — otomatis diarahkan dari http.

> Setelah online, perbarui URL situs di **panel admin → Site Settings** (mis. ubah `https://chdev.online` → subdomain/domain aktif) agar link "Lihat Website" & SEO akurat.

---

## G. Update website (file offline → online)

Semua data yang dibuat lewat panel admin (konten, chat, statistik) tersimpan di disk server dan **tidak tertimpa** saat update, karena `.data/` & `.env` tidak ikut git.

**Update manual (dari laptop):**
```bash
# 1. Edit file di laptop → commit → push
git add -A && git commit -m "update konten" && git push

# 2. SSH ke server, lalu satu perintah:
cd /srv/cehadev && git pull && npm ci && npm run build && pm2 restart cehadev
```

**Opsional — script sekali ketik:** buat `deploy.sh` di server:
```bash
#!/bin/bash
cd /srv/cehadev && git pull && npm ci && npm run build && pm2 restart cehadev
```
lalu jalankan `bash deploy.sh`.

**Opsional — auto-deploy via GitHub Actions:** setiap `git push` ke `main`, GitHub menjalankan build di server (perlu menyimpan SSH key GitHub Actions ke server; skip jika dirasa berlebihan untuk tahap ini).

---

## H. Pantauan

- **Statistik pengunjung**: sudah ada di **panel admin → Dashboard → Analytics** (halaman terpopuler, perangkat, browser, negara).
- **Uptime website**: daftar gratis di https://uptimerobot.com → tambah monitor `https://domain-anda` → dapat notifikasi email/Telegram jika website down.
- **Kesehatan server**: `htop`, `df -h`, `pm2 monit`.

---

## I. Troubleshooting

| Masalah | Solusi |
|---|---|
| Port 3000 tidak bisa diakses dari luar | Cek ingress rule Oracle (port 80/443/22) + firewall server (`sudo ufw status`; jika aktif: `sudo ufw allow 80,443,22/tcp`). |
| `better-sqlite3` error saat `npm ci` | `sudo apt install -y build-essential python3` lalu `npm rebuild better-sqlite3`. |
| Nginx 502 Bad Gateway | Pastikan PM2 jalan (`pm2 status`) dan `proxy_pass` benar. |
| Perubahan konten admin hilang | Jangan pernah jalankan `git clean -fdx` — itu menghapus `.data/`. |
| Akun Oracle dianggap idle | Login ke konsol Oracle secara berkala (aturan: akun idle 30+ hari bisa di-suspend). |

---

## J. Backup data (disarankan)

Data penting: `.data/` (chat, pesan, statistik) dan `public/uploads/` (foto). Backup berkala misalnya lewat rsync dari laptop:

```bash
rsync -avz -e "ssh -i ~/.ssh/oci_cehadev" ubuntu@IP:/srv/cehadev/.data/ ~/backup-cehadev/.data/
rsync -avz -e "ssh -i ~/.ssh/oci_cehadev" ubuntu@IP:/srv/cehadev/public/uploads/ ~/backup-cehadev/uploads/
```

---

*Dokumen ini ditulis khusus untuk project ini (Nuxt 3 + @nuxt/content native SQLite + file storage). Langkah dibagi sekali-jalan (B, C) vs berulang (G).*
