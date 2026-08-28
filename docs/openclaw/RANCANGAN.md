# Rancangan: AI Agent Pembuat Artikel (OpenClaw + Telegram)

> Ditujukan untuk CehaDev agar bisa membuat artikel dari **luar kota** tanpa
> membuka admin dashboard. Semua ditangani oleh AI agent **OpenClaw** yang
> berjalan di **cloud (VM Oracle)** — jadi PC/laptop tidak perlu menyala.

---

## 1. Konsep inti

Daripada membuat bot sekali-pakai yang diprogram keras, kita pakai
**OpenClaw** — agent AI yang:

- berjalan terus-menerus di VM (selalu online), bukan di PC,
- bisa diajak ngobrol lewat **Telegram** (HP di luar kota),
- punya **memory persisten** & **skills** yang bisa kita bikin sendiri,
- bisa menjalankan **tools/CLI** (`exec`) untuk menulis artikel ke
  penyimpanan website.

Jadi: **Telegram = remote control**, **OpenClaw = otak agent**,
**skill = "resep" cara membuat artikel**, **helper script = tangan yang
menyimpan artikel dengan format baku**.

---

## 2. Arsitektur

```
HP Anda (di luar kota, PC MATI — aman)
   │  kirim pesan ke bot Telegram
   ▼
[ Telegram Bot ]  (channels.telegram di openclaw.json)
   ▼
[ OpenClaw Gateway ]  ← berjalan di VM Oracle, selalu online
   │   - punya memory
   │   - memuat skill: article-creator (SKILL.md)
   ▼
[ Skill article-creator ]  instruksi "bagaimana bikin artikel"
   ▼
[ exec → scripts/article-add.mjs ]  helper yang menyimpan artikel
   ▼
[ Storage website ]  .data/kv.json (atau Turso) — SAMA dengan admin dashboard
   ▼
[ Anda review & terbitkan di /admin/articles ]
```

---

## 3. Komponen yang perlu dibuat

| Komponen | Lokasi | Fungsi |
|---|---|---|
| Helper CLI | `scripts/article-add.mjs` | Menerima artikel (judul, konten ID/EN dst), validasi, simpan sebagai **draft** ke KV |
| Skill OpenClaw | `skills/article-creator/SKILL.md` | Mengajari agent cara menulis artikel & memanggil helper |
| Config gateway | `openclaw.json` | Telegram bot + workspace project + izin skill |
| Env (di VM) | `.env` | `TELEGRAM_BOT_TOKEN`, `GEMINI_API_KEY` |

Dokumen ini membahas rancangan; implementasi penuh (SKILL.md, helper, config)
diuraikan pada bagian bawah + file terkait.

---

## 4. Alur kerja end-to-end (saat di luar kota)

1. Di HP, buka chat bot Telegram, balas DM pertama & pasangkan (pairing).
2. Ketik: `buatkan artikel tentang tips optimasi Nuxt.js`
3. OpenClaw memuat skill `article-creator`, lalu:
   - menulis judul, excerpt, kategori, tag, **konten dua bahasa (ID/EN)**,
   - memanggil `scripts/article-add.mjs` via `exec` untuk menyimpan.
4. Helper menyimpan artikel dengan status **`draft`** (belum tampil publik)
   ke storage yang sama dengan dashboard.
5. Bot membalas ringkasan: judul, slug, link tinjauan.
6. Kapan pun sempat, Anda buka `/admin/articles` → tinjau → **Terbitkan**.

---

## 5. Kenapa pakai helper script, bukan biarkan agent menulis file mentah

Agent AI bagus menulis kalimat, tapi rentan salah format/duplikat slug saat
menulis struktur JSON raw. Dengan **helper CLI**, semua penyimpanan lewat satu
pintu yang:

- memvalidasi slug & menghindari duplikat (otomatis `-2`, `-3`),
- mengisi field wajib & default (status `draft`, tanggal hari ini),
- menulis ke **KV yang sama persis** dengan `server/utils/articles.ts`,
- menjaga artikel bawaan tetap utuh saat KV masih kosong.

Skill hanya "berpikir/menulis konten", helper yang "menyimpan dengan benar".

---

## 6. Keamanan

- **Draft dulu**: artikel tidak pernah langsung tayang; Anda yang menerbitkan.
- **dmPolicy** Telegram di-set `pairing`/`allowlist` → hanya chat id Anda yang
  bisa menyuruh bot (bukan orang lain).
- **GEMINI_API_KEY** disuntik per-turn lewat `openclaw.json` (tidak masuk prompt).
- Skill murni instruksi + panggil helper; tidak ada akses ke kredensial admin.

---

## 7. Komponen detail (persiapan implementasi)

### a. Helper `scripts/article-add.mjs`

Didesain dipanggil sebagai CLI standalone:

```bash
node scripts/article-add.mjs \
  --json '{"title_id":"Judul","title_en":"Title","content_id":"...","content_en":"..."}'
```

Poin penting:
- pakai penyimpanan KV dual-mode (file `.data/kv.json` **atau** Turso),
  sama seperti `server/utils/db.ts`,
- jika KV `content_articles` kosong, muat artikel bawaan dari
  `content/articles/*.json` agar daftar publik tidak "hilang",
- menghasilkan slug unik, set `status: "draft"`, `datePublished: hari ini`,
- mencetak hasil (slug/status) ke stdout untuk dibaca agent.

### b. Skill `skills/article-creator/SKILL.md`

Frontmatter + instruksi. Isi body menjelaskan:
- format artikel CehaDev (field yang harus diisi, dua bahasa ID/EN),
- gaya penulisan (Markdown, < 1600 kata, SEO-friendly),
- wajib panggil helper lewat `exec` dengan argumen `--json`,
- target lokasi helper (gunakan path absolut di VM: `/srv/cehadev/scripts/article-add.mjs`).

### c. Config `openclaw.json` (di VM)

```json5
{
  version: 1,
  agents: { entries: { writer: { skills: ["article-creator"] } } },
  skills: {
    entries: {
      "article-creator": {
        enabled: true,
        env: { GEMINI_API_KEY: "<KEY>" }  // disuntik saat agent jalan
      }
    }
  },
  channels: {
    telegram: {
      enabled: true,
      botToken: "TELEGRAM_BOT_TOKEN",
      dmPolicy: "pairing"            // hanya Anda yang bisa akses setelah approve
    }
  }
}
```

---

## 8. Deployment di VM Oracle (rangkuman)

1. `npm i -g openclaw` (atau instalasi resmi) di VM.
2. Clone/simpan config `openclaw.json` → `~/.openclaw/`.
3. Salin folder skill `skills/article-creator/` & helper `scripts/article-add.mjs`
   (skill bisa diletakkan di `<workspace>/skills` atau `~/.openclaw/workspace/skills`).
4. Isi env (`TELEGRAM_BOT_TOKEN`, `GEMINI_API_KEY`).
5. Jalankan gateway dengan PM2 agar selalu hidup:
   ```
   pm2 start openclaw --name openclaw -- gateway
   pm2 save
   ```
6. Pairing: DM bot → approve via `openclaw pairing approve telegram <CODE>`.

---

## 9. Perbandingan cepat: OpenClaw vs bot Telegram manual

| Aspek | Bot manual (`telegram-bot.mjs`) | OpenClaw (rancangan ini) |
|---|---|---|
| Kemampuan | Hanya `/artikel`, `/list`, `/batal` | Percakapan bebas, memory, banyak skill |
| Pengembangan | Hardcoded | Skill terpisah, mudah ditambah (e.g. edit, list, stats) |
| Kanal | Telegram saja | Telegram + WhatsApp + Discord + dll |
| Pemeliharaan | Anda/maintenance | Ekosistem aktif, update terjadwal |
| Kompleksitas setup | Ringan | Sedang (gateway + skill) |

> Rancangan ini **menggantikan** pendekatan bot manual sebelumnya
> (`scripts/telegram-bot.mjs`). Helper baru yang dipakai bersama untuk semua
> operasi CRUD: `scripts/lib/article-store.mjs` + `scripts/article-*.mjs`.

---

## 10. Status implementasi

Telah diimplementasikan & diuji (sandbox) di repo ini:

| Komponen | File | Status |
|---|---|---|
| Penyimpanan bersama | `scripts/lib/article-store.mjs` | ✅ diuji |
| Tambah draft | `scripts/article-add.mjs` | ✅ diuji |
| Daftar | `scripts/article-list.mjs` | ✅ diuji |
| Preview | `scripts/article-get.mjs` | ✅ diuji |
| Terbitkan (via konfirmasi) | `scripts/article-publish.mjs` | ✅ diuji |
| Hapus | `scripts/article-delete.mjs` | ✅ diuji |
| Skill OpenClaw | `skills/article-creator/SKILL.md` | ✅ dibuat |
| Daftar ide bot otomatis | `docs/openclaw/ide-artikel.md` | ✅ dibuat |
| Config gateway | `docs/openclaw/openclaw.json.example` | ✅ dibuat |
| Panduan install penuh | `docs/openclaw/DEPLOY-OPENCLAW.md` | ✅ dibuat |

Keputusan alur (sesuai kebutuhan): **semua operasi (buat → review → terbit)
lewat Telegram, tanpa admin dashboard**; bot otomatis membuat **1 draft per
giliran** dari daftar ide; **tidak pernah auto-publish** — publikasi hanya
via perintah `/terbitkan <slug>` yang dikonfirmasi pengguna.

Langkah pemasangan di VM: ikuti `docs/openclaw/DEPLOY-OPENCLAW.md`.

---

## 11. Catatan migrasi dari bot manual

`scripts/telegram-bot.mjs` (bot sekali-pakai) tidak lagi diperlukan jika memakai
OpenClaw. Helper artikel sekarang berbasis `article-store.mjs` sehingga tidak
terikat pada satu bot. Anda bisa menghapus `telegram-bot.mjs` bila sudah beralih
penuh ke OpenClaw.
