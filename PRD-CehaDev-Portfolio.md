# PRD — CehaDev Portfolio Website (Dark Mode)

Sumber: 5 mockup — Home (Beranda), About, Project Detail (Magerans), Skills, Contact.

---

## 1. Ringkasan Analisis Global

**Jumlah halaman:** 5 — Home, About, Projects (list — *tidak ada mockup-nya, hanya tersirat dari "View All Projects"*), Project Detail, Skills, Contact.
→ **Perlu konfirmasi:** halaman "Projects" (grid semua project) tidak ada di file yang diunggah. Yang ada hanya kartu project di Home dan satu halaman Project Detail. PRD ini mengasumsikan halaman Projects list mengikuti pola card yang sama seperti di Home, tapi *layout persisnya tidak bisa dipastikan 1:1*.

**Urutan navigasi (konsisten di semua halaman):** Home → About → Projects → Skills → Contact.

**Pola layout berulang:**
- Navbar sticky: logo kiri, menu tengah, ikon GitHub + toggle theme + tombol "Download CV" kanan.
- Hero section dua kolom: teks kiri, ilustrasi karakter kanan dengan glow lingkaran ungu-biru.
- Section diberi label dengan bullet ungu kecil + judul (mis. "● About Me", "● Skills").
- Footer identik di semua halaman: copyright kiri, tagline hati tengah ("Build. Learn. Break. Fix. Repeat."), "Back to top" kanan.
- Card selalu: background sedikit lebih terang dari body, border tipis, radius besar (~12–16px).

**Konsistensi:**
- Navigasi: konsisten, state aktif = teks putih/ungu + underline ungu di bawah item menu.
- Footer: identik persis di Home, Skills, Contact (dan diasumsikan sama di About, Projects, Project Detail meski tidak terlihat di crop About/Project Detail).
- Card: radius dan border konsisten di semua halaman.
- Tombol: primary = gradient ungu→biru, secondary = outline/transparent dengan border abu.
- Ikon: line-icon style (Lucide/Feather-like), stroke tipis, konsisten ukuran ~16–20px dalam container bulat/rounded.
- Efek glow: dipakai di ilustrasi karakter (lingkaran ungu-biru radial) dan tombol primary (subtle glow saat hover, diasumsikan).

---

## 2. Design System Extraction

### 2.1 Warna (perkiraan HEX — dari sampling visual)

| Token | Hex perkiraan | Kegunaan |
|---|---|---|
| Background utama | `#0A0A0F` – `#0B0B12` | Body background |
| Background card | `#13131C` – `#161620` | Card, input, container |
| Border card | `#26263380` (border ungu gelap semi-transparan) | Outline card |
| Primary purple | `#7C3AED` | Aksen, badge, icon |
| Primary blue | `#3B82F6` | Aksen sekunder, gradient end |
| Gradient text/button | `linear-gradient(90deg, #8B5CF6, #3B82F6)` | Nama "CehaDev", tombol utama |
| Text utama | `#F5F5F7` | Heading, body penting |
| Text secondary | `#A1A1AA` | Paragraf deskripsi |
| Text muted | `#71717A` | Caption, label kecil |
| Success green | `#22C55E` | Status "Available/Online" |
| Divider | `#FFFFFF14` (garis putih ~8% opacity) | Garis pemisah section |

*Perlu konfirmasi: nilai hex ini estimasi visual, bukan hasil color-picker presisi — perlu diverifikasi dengan file desain asli (Figma) jika ada.*

### 2.2 Typography

- **Font:** Sans-serif geometrik mirip **Inter** atau **Plus Jakarta Sans** (karakter "a", "g" dan spacing mengarah ke Inter).
- **H1 (hero):** ~48–56px, bold/extrabold (700–800), line-height ketat (~1.1).
- **H2 (section title halaman, mis. "My Skills", "Get In Touch"):** ~36–40px, bold.
- **H3 (card title, mis. "Magerans"):** ~18–20px, semibold.
- **Body:** ~15–16px, regular, line-height ~1.6.
- **Caption/label kecil (badge, meta):** ~12–13px, medium.
- **Letter-spacing:** normal ke body, sedikit tighter (-0.02em) di heading besar.

### 2.3 Radius

| Elemen | Radius perkiraan |
|---|---|
| Tombol | 8–10px |
| Card kecil (skill item, badge) | 8px |
| Card besar (project card, info card) | 14–16px |
| Input form | 8px |
| Avatar/image frame (ilustrasi karakter) | full circle (999px) |

### 2.4 Shadow & Glow

- **Box shadow default card:** halus, hampir tak terlihat (`0 4px 12px rgba(0,0,0,0.4)`), karena background sudah gelap.
- **Purple/blue glow:** radial gradient blur besar di belakang ilustrasi karakter (lingkaran ungu ke biru, blur ~60–100px), dipakai di Home, About, Skills, Contact hero.
- **Hover glow (diasumsikan, tidak terlihat statis di mockup):** tombol primary sedikit brighter + shadow ungu saat hover.
- **Active tab glow:** underline gradient ungu-biru tipis di bawah menu/tab aktif (bukan glow blur, melainkan garis solid ~2px).

---

## 3. Analisis Layout per Halaman

### 3.1 HOME (Beranda)

**Navbar**
- Tinggi ~72–80px.
- Logo "CehaDev" kiri (kata "Ceha" putih, "Dev" gradient ungu-biru) — pola ini konsisten di semua halaman.
- Menu tengah: Home, About, Projects, Skills, Contact — jarak antar item ~32–40px.
- State aktif: warna putih + underline ungu 2px di bawah.
- Kanan: ikon GitHub (outline circle), toggle theme (ikon matahari dalam circle gelap), tombol "Download CV" gradient dengan ikon download.

**Hero Section**
- Proporsi ~55/45 (teks kiri sedikit lebih lebar dari ilustrasi).
- Badge "Available for collaboration" — pill kecil, dot hijau + teks, background sedikit lebih terang dari body.
- Heading besar "Hi, I'm **CehaDev**" — nama dengan gradient text.
- Subtitle: "Web Developer & Tech Enthusiast" (abu-abu).
- Deskripsi 2 baris (text secondary).
- Tombol utama "View My Work" (gradient, ikon panah kanan) + tombol secondary "Contact Me" (outline, ikon mail).
- Ilustrasi karakter dalam frame lingkaran dengan glow ungu-biru, dikelilingi dot dekoratif kecil tersebar.
- Floating card "Building ideas / Turning ideas into digital products" — posisi overlap di bawah-kiri lingkaran ilustrasi, dengan ikon roket dan status dot hijau.

**Content Section (3 kolom)**
- Kolom 1 "About Me": deskripsi singkat + tombol "More About Me" + section "Connect With Me" (4 ikon sosial bulat: GitHub, LinkedIn, Instagram, Mail).
- Kolom 2 "Skills": list 6 skill dengan icon + progress bar horizontal + persentase di kanan (JavaScript 90%, Vue.js 85%, Nuxt.js 85%, Tailwind CSS 90%, Node.js 80%, Linux 75%, Git & GitHub 85%).
- Kolom 3 "Projects": 3 project card, tiap card berisi thumbnail image, judul, deskripsi singkat, tag teknologi (pill kecil), ikon external-link pojok kanan bawah. Link "View All Projects →" di kanan atas section.

**Footer**
- Copyright kiri: "© 2026 CehaDev. All rights reserved."
- Tengah: ikon hati merah + "Build. Learn. Break. Fix. Repeat."
- Kanan: "Back to top" + tombol ikon panah atas dalam circle.

### 3.2 ABOUT

- Hero heading: "Get to know **CehaDev**" (2 baris, nama gradient), badge "About Me" di atasnya, garis divider pendek + dot ungu di bawah heading.
- Deskripsi 2 paragraf di bawah heading.
- 4 statistik dalam grid (2+2 icon-box): "2+ Years – Learning & Building", "10+ Projects – Completed", "500+ Hours – Coding", "1 Goal – To be better every day". Tiap item: icon dalam rounded-square container ungu muda, angka besar bold, label di bawah.
- Quote card di bawah: ikon kutip ungu, teks "Code is not just about how it works, but about **how it's built.**" (bagian kedua gradient/bold ungu).
- Kanan: info card profil "CehaDev — Web Developer" dengan ilustrasi karakter (sama seperti Home tapi ukuran lebih kecil), list info (lokasi, email, website, status available) dengan icon masing-masing.
- Card "Tentang Saya" — checklist 4 poin dengan ikon centang ungu dalam circle.
- Card "Tech Stack yang Saya Gunakan" — grid 7 ikon teknologi (JS, Vue, Nuxt, Tailwind, Node, Git, Linux) dengan logo berwarna asli tiap tool dalam rounded-square container.

### 3.3 PROJECTS DETAIL (Magerans)

- Tombol "← Kembali ke Projects" di pojok kiri atas.
- Badge "★ Featured Project".
- Judul besar "Magerans" + deskripsi 1 kalimat.
- Tag teknologi (Nuxt.js, Vue.js, Tailwind CSS, TypeScript) — pill dengan icon warna masing-masing.
- Metadata 4 kolom: Peran, Tahun, Durasi, Kategori — tiap item icon + label kecil + value.
- Tombol "Live Demo" (gradient, ikon external-link) + "View on GitHub" (outline, ikon GitHub).
- Preview image besar di kanan (screenshot produk dalam browser frame mockup).
- Tab navigasi: Overview (aktif, underline ungu) | Fitur | Teknologi | Proses | Tantangan | Hasil | Galeri.
- Section "Overview": paragraf deskripsi kiri + 4 feature-highlight card kanan (2x2 grid, tiap card icon + judul + deskripsi singkat).
- Section "Fitur Utama": 5 card grid (Pencarian Layanan, Manajemen Project, Chat Real-time, Sistem Review, Notifikasi) — icon warna-warni dalam rounded container, judul, deskripsi.
- Section "Teknologi yang Digunakan": chip horizontal dengan icon tiap tech (8 item).
- Section "Proses Pengembangan": timeline horizontal 5 tahap (Perencanaan → Desain UI/UX → Pengembangan → Pengujian → Deployment), tiap node: icon dalam circle + nomor + judul + deskripsi singkat.
- Section "Galeri Project": grid 5 thumbnail screenshot.
- Section "Hasil": 4 statistik (1.000+ Pengguna Terdaftar, 500+ Project Selesai, 4.8/5 Rating Rata-rata, 99.9% Uptime Aplikasi) dengan icon.
- CTA akhir: "Tertarik untuk bekerja sama?" + tombol "Hubungi Saya" (gradient) & "Lihat Project Lainnya" (outline).

### 3.4 SKILLS

- Badge "Always learning and improving" + heading "My **Skills**" (gradient pada kata "Skills") + deskripsi.
- Ilustrasi karakter kanan (varian: dengan laptop, dikelilingi 3 floating icon box: code `</>`, terminal `>_`, globe).
- Tab kategori: All Skills (aktif) | Frontend | Backend | Tools & Others.
- Kiri: card "Technical Skills" — 2 kolom x 6 baris skill dengan icon + progress bar + persen (JavaScript 90%, CSS3 90%, Vue.js 85%, Node.js 80%, Nuxt.js 85%, PHP 70%, Tailwind CSS 90%, MySQL 75%, HTML5 95%, Git & GitHub 85%).
- Banner kecil di bawah card: "Want to work together?" + tombol "Contact Me".
- Kanan atas: "Skills Summary" — 4 kotak statistik (10+ Technologies, 2+ Years Experience, 15+ Projects Completed, Continuous Learning) dengan icon.
- Card "Tools & Others" — grid 12 tool chip (VS Code, Figma, Postman, Docker, Git, GitHub, NPM, ESLint, Prettier, Vite, Netlify, Chrome DevTools), tiap chip icon + nama.
- Card "Soft Skills" — pill chip tanpa icon (Problem Solving, Communication, Teamwork, Time Management, Adaptability, Detail Oriented).

### 3.5 CONTACT

- Badge "Let's work together" + heading "Get In **Touch**" (gradient) + deskripsi.
- 3 value proposition item horizontal (icon + judul + deskripsi kecil): Fast Response, Open to Opportunities, Let's Build Something.
- Ilustrasi karakter kanan dengan 3 floating icon bulat mengelilingi (mail, phone, chat) dan dot dekoratif grid kecil di kiri ilustrasi.
- 3 kolom bawah:
  1. **"Send Me a Message"** — form: Your Name + Your Email (2 kolom), Subject (full), Your Message (textarea besar), tombol "Send Message" (gradient, icon kirim) + teks "🔒 Your data is safe with me".
  2. **"Contact Information"** — 4 item (Email, Phone, Location, Availability) tiap item icon bulat ungu + label + value + tombol "Copy" (kecuali Availability yang berisi status "Online" hijau). Di bawahnya card "Frequently Asked Questions" — accordion 2 item terlihat + link "View more FAQs →".
  3. **"Where I'm Based"** — embed map style dark dengan pin lokasi ungu, di bawah map: alamat "Jakarta, Indonesia" + "Open to remote work worldwide" + tombol "View on Maps".

---

## 4. Analisis Ikon

| Kelompok | Contoh | Ukuran | Stroke | Style |
|---|---|---|---|---|
| Navigation | GitHub, sun (theme toggle), download | ~18–20px | tipis (~1.5px) | outline dalam circle/rounded container |
| Social | GitHub, LinkedIn, Instagram, Mail | ~18px | tipis | outline dalam circle border |
| Skill/tech | JS, Vue, Nuxt, Tailwind, Node, PHP, MySQL, HTML5, CSS3, Git | ~24px | brand logo asli (berwarna) | dalam rounded-square container gelap |
| Feature | shield, bolt, lock, chat, search, folder, star, bell | ~20px | tipis | flat colored icon dalam rounded container berwarna (hijau/biru/kuning/merah muda) |
| Action | copy, send, external-link, arrow | ~14–16px | tipis | inline atau dalam tombol |
| Status | dot hijau (available/online) | ~6–8px | solid fill | dot polos |
| Timeline | clipboard, refresh, code, check, rocket | ~20px | tipis | dalam circle border berwarna sesuai tahap |

Hover state tidak terlihat statis di mockup — **perlu konfirmasi** interaksi hover ikon (kemungkinan brighten + slight scale, standar pola web modern).

---

## 5. Analisis Spacing & Grid

**Skala spacing yang teridentifikasi:** 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80px (pola umum Tailwind default scale).

- **Container max-width:** ~1280–1320px (padding horizontal ~24–32px di viewport lebih lebar).
- **Column gap (grid 3 kolom Home content, Contact grid):** ~24–32px.
- **Row gap card:** ~16–24px.
- **Section spacing vertikal:** ~64–80px antar section besar.
- **Card internal padding:** ~24px (card besar), ~16px (card kecil/chip).

---

## 6. Analisis Responsive *(diturunkan dari desktop — perlu konfirmasi tidak ada mockup mobile)*

| Breakpoint | Navbar | Hero | Grid Project | Skills | Contact | Timeline/Gallery |
|---|---|---|---|---|---|---|
| 1440px+ | full menu | 2 kolom | 3 kolom | 2 kolom | 3 kolom | 5 kolom |
| 1280px | full menu | 2 kolom (ilustrasi mengecil) | 3 kolom | 2 kolom | 3 kolom | 4–5 kolom |
| 1024px | menu tetap, jarak diperkecil | 2 kolom, ilustrasi diperkecil | 2 kolom | 1 kolom (stack) | 2 kolom (map/form stack) | 3 kolom |
| 768px | menu → hamburger (diasumsikan) | stack 1 kolom, ilustrasi di bawah teks | 1 kolom | 1 kolom | 1 kolom stack | 2 kolom |
| 480px | hamburger, logo saja | stack, ilustrasi diperkecil/opsional disembunyikan sebagian | 1 kolom | 1 kolom | 1 kolom | 1 kolom, gallery jadi carousel |

---

## 7. Interaction & Micro-animation

- **Hover:** tombol → sedikit lift (translateY -2px) + glow ungu bertambah; card project → border highlight ungu + shadow naik; ikon sosial → scale 1.05.
- **Scroll:** fade-up + stagger untuk card di section (About/Skills/Projects), counter number animasi count-up untuk statistik (Years, Projects, Hours), progress bar skill reveal dari 0% ke target saat masuk viewport.
- **Active/Tab:** underline gradient slide transition saat pindah tab (Overview/Fitur/dst, All Skills/Frontend/dst).
- Animasi minimal, halus, tidak berlebihan — sesuai gaya desain yang clean.

---

## 8. Accessibility

- Kontras teks utama (`#F5F5F7` di atas `#0A0A0F`) sangat tinggi (>15:1) — aman.
- Teks secondary (`#A1A1AA`) di atas background gelap → perlu verifikasi rasio ≥4.5:1 untuk body text.
- Focus state: outline ring ungu 2px pada semua elemen interaktif (tombol, input, link, tab).
- Keyboard navigation: seluruh navbar, tab, accordion FAQ, form harus dapat diakses via Tab/Enter/Space.
- ARIA: form contact perlu `aria-label` per field, accordion FAQ perlu `aria-expanded`.
- Reduced motion: sediakan `prefers-reduced-motion` fallback untuk semua animasi scroll/hover.
- Screen reader: ikon dekoratif `aria-hidden="true"`, ikon fungsional (copy, external-link) perlu `aria-label`.

---

## 9. SEO & Performance

- Meta title per halaman (mis. "CehaDev — Web Developer Portfolio", "Projects | CehaDev").
- Meta description unik per halaman.
- Open Graph + Twitter Card image (pakai ilustrasi karakter/hero sebagai preview).
- Structured data: `Person` (untuk profil CehaDev), `CreativeWork`/`SoftwareApplication` per project detail.
- Image optimization: WebP/AVIF untuk screenshot project & ilustrasi, lazy-load semua gambar di bawah fold.
- Font optimization: preload font utama, `font-display: swap`.
- Target performance: LCP < 2.5s, CLS < 0.1 (reserve dimensi untuk gambar & ilustrasi hero).

---

## 10. PRD Lengkap

### 10.1 Executive Summary
Website portfolio pribadi bergaya dark-mode modern untuk menampilkan profil, skill, dan project seorang Web Developer ("CehaDev"). Target pengguna: recruiter, klien freelance, dan komunitas developer. Positioning visual: profesional, modern, tech-forward, dengan aksen gradient ungu-biru sebagai identitas.

### 10.2 Goals & Non-Goals
**Goals:** menampilkan profil & skill secara meyakinkan, showcase project dengan detail teknis, memudahkan kontak/kolaborasi, download CV satu klik.
**Non-Goals (v1):** blog/artikel, sistem autentikasi/login, dashboard admin, multi-bahasa (mockup hanya campuran ID/EN, diasumsikan bilingual UI tapi tidak ada language switcher).

### 10.3 Information Architecture
Home → About → Projects (list) → Project Detail → Skills → Contact. Navbar global di semua halaman. Footer global di semua halaman.

### 10.4 Design System Specification
Lihat Bagian 2.

### 10.5 Page-by-Page Requirements
Lihat Bagian 3 (Home, About, Project Detail, Skills, Contact). **Halaman Projects (list/grid semua project) perlu didesain tambahan** — belum ada mockup-nya.

### 10.6 Component Inventory
- Navbar (dengan state aktif)
- Button (primary gradient, secondary outline) — size default & small
- Badge/pill (status, tag teknologi)
- Card (info card, stat card, project card, feature card)
- Progress bar (skill)
- Tab navigation
- Accordion (FAQ)
- Form input (text, email, textarea)
- Icon container (rounded-square, circle)
- Floating illustration card
- Timeline node
- Footer
- Avatar/illustration frame dengan glow

### 10.7 Interaction Specification
Lihat Bagian 7.

### 10.8 Responsive Specification
Lihat Bagian 6.

### 10.9 Accessibility Specification
Lihat Bagian 8.

### 10.10 SEO & Performance Specification
Lihat Bagian 9.

### 10.11 Technical Recommendation
- **Framework:** Nuxt.js (sesuai tech stack yang disebutkan di About "Menguasai JavaScript, Vue.js, Nuxt.js") atau Next.js jika ingin React.
- **Styling:** Tailwind CSS (terlihat konsisten dengan skala spacing & utility-first pattern).
- **Animasi:** VueUse Motion / GSAP (untuk Vue-Nuxt) atau Framer Motion (jika React).
- **Deployment:** Vercel/Netlify (statis + SSR).
- **Form handling:** backend ringan (mis. serverless function) untuk contact form.

### 10.12 Implementation Phases
1. Setup design tokens (warna, tipografi, spacing) & komponen dasar (Button, Card, Badge).
2. Bangun Navbar + Footer global.
3. Halaman Home (hero + 3 kolom content).
4. Halaman About.
5. Halaman Projects (list — perlu desain tambahan) + Project Detail.
6. Halaman Skills.
7. Halaman Contact (form + validasi + map).
8. Responsive pass semua breakpoint.
9. Accessibility & performance audit.
10. SEO metadata & structured data.

### 10.13 Acceptance Criteria
- [ ] Semua 5 halaman match 1:1 secara visual dengan mockup (warna, spacing, tipografi).
- [ ] Navbar aktif-state berfungsi sesuai halaman.
- [ ] Semua progress bar skill menampilkan persentase sesuai data mockup.
- [ ] Tab (Project Detail, Skills) berfungsi switch konten.
- [ ] Form contact tervalidasi & dapat submit.
- [ ] Responsive tanpa broken layout di 5 breakpoint utama.
- [ ] Lighthouse: Performance & Accessibility ≥ 90.
- [ ] Reduced-motion dihormati.

---

## Daftar "Perlu Konfirmasi"
1. Nilai HEX warna adalah estimasi visual, bukan color-picker presisi.
2. Halaman "Projects" (grid semua project) belum ada mockup-nya.
3. Perilaku navbar mobile (hamburger) tidak terlihat di mockup — diasumsikan pola standar.
4. State hover/interaksi tidak terlihat statis di mockup — dianimasikan berdasarkan konvensi umum.
5. Font persis (kemungkinan Inter/Plus Jakarta Sans) tidak bisa dipastikan tanpa file sumber.
