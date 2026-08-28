#!/usr/bin/env node
/**
 * Telegram Bot untuk membuat artikel CehaDev tanpa buka admin dashboard.
 *
 * Alur:
 *   1. Bot long-polling Telegram (getUpdates).
 *   2. Pesan dari TELEGRAM_ADMIN_CHAT_ID dianggap sebagai perintah.
 *   3. Perintah /artikel <topik> memanggil Gemini untuk menulis artikel
 *      lengkap dua bahasa (ID/EN), lalu menyimpannya sebagai DRAFT.
 *   4. Bot membalas ringkasan + link ke panel admin untuk ditinjau.
 *
 * Env yang dibutuhkan:
 *   TELEGRAM_BOT_TOKEN      - token dari @BotFather
 *   TELEGRAM_ADMIN_CHAT_ID  - chat id Anda (dapat dari /start lalu /myid)
 *   GEMINI_API_KEY          - kunci dari Google AI Studio
 *   GEMINI_MODEL            - (opsional) default gemini-2.0-flash
 *   TURSO_DATABASE_URL      - (opsional) jika memakai Turso; jika kosong pakai .data/kv.json
 *   TURSO_AUTH_TOKEN        - (opsional)
 */

import { readFile, writeFile, mkdir, appendFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const dataDir = path.resolve(root, '.data')
const kvFile = path.resolve(dataDir, 'kv.json')
const logFile = path.resolve(dataDir, 'telegram-bot.log')

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''
const TELEGRAM_ADMIN_CHAT_ID = (process.env.TELEGRAM_ADMIN_CHAT_ID || '').trim()
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ''
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash'

const ARTICLES_KEY = 'content_articles'

async function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`
  try {
    await appendFile(logFile, line + '\n', 'utf-8')
  } catch {}
  console.log(line)
}

function fail(msg) {
  console.error(msg)
  process.exit(1)
}

if (!TELEGRAM_BOT_TOKEN) fail('TELEGRAM_BOT_TOKEN belum diatur')
if (!GEMINI_API_KEY) fail('GEMINI_API_KEY belum diatur')

// ---------------------------------------------------------------------------
// Penyimpanan KV — mendukung Turso (jika TURSO_DATABASE_URL) atau file lokal.
// ---------------------------------------------------------------------------

let client = null

async function db() {
  if (!client && process.env.TURSO_DATABASE_URL) {
    const { createClient } = await import('@libsql/client')
    client = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN || undefined
    })
    await client.execute(`CREATE TABLE IF NOT EXISTS kv (key TEXT PRIMARY KEY, value TEXT NOT NULL)`)
  }
  return client
}

async function kvGet(key) {
  const c = await db()
  if (c) {
    const r = await c.execute({ sql: 'SELECT value FROM kv WHERE key = ?', args: [key] })
    return r.rows[0]?.value ?? null
  }
  try {
    const store = JSON.parse(await readFile(kvFile, 'utf-8'))
    return store[key] ?? null
  } catch {
    return null
  }
}

async function kvSet(key, value) {
  const c = await db()
  if (c) {
    await c.execute({
      sql: 'INSERT OR REPLACE INTO kv (key, value) VALUES (?, ?)',
      args: [key, value]
    })
    return
  }
  await mkdir(dataDir, { recursive: true })
  let store = {}
  try {
    store = JSON.parse(await readFile(kvFile, 'utf-8'))
  } catch {}
  store[key] = value
  await writeFile(kvFile, JSON.stringify(store, null, 2) + '\n', 'utf-8')
}

async function loadBundledArticles() {
  // Fallback: bila KV masih kosong, muat artikel bawaan dari content/articles/*.json
  // agar daftar publik tetap utuh saat bot menambahkan draft pertamanya.
  const { readdir } = await import('node:fs/promises')
  const dir = path.resolve(root, 'content/articles')
  const files = await readdir(dir)
  const out = []
  for (const f of files) {
    if (!f.endsWith('.json')) continue
    try {
      const raw = await readFile(path.join(dir, f), 'utf-8')
      out.push(JSON.parse(raw))
    } catch {}
  }
  return out
}

async function listArticles() {
  const raw = await kvGet(ARTICLES_KEY)
  if (raw) {
    try {
      return JSON.parse(raw)
    } catch {}
  }
  return loadBundledArticles()
}

async function saveArticles(articles) {
  await kvSet(ARTICLES_KEY, JSON.stringify(articles))
}

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function slugify(text) {
  return String(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

function isValidSlug(s) {
  return /^[a-z0-9][a-z0-9-]*$/.test(s)
}

// ---------------------------------------------------------------------------
// Gemini — menulis artikel lengkap dua bahasa.
// ---------------------------------------------------------------------------

const SYSTEM_PROMPT = `Kamu adalah penulis teknis blog untuk portfolio web developer CehaDev.
Tugasmu membuat artikel lengkap dalam format JSON yang valid (hanya output JSON, tanpa teks lain, tanpa markdown fence).

Struktur JSON yang harus dikembalikan:
{
  "slug": "<slug-en-bersih>",
  "title_id": "<judul bahasa Indonesia>",
  "title_en": "<judul bahasa Inggris>",
  "excerpt_id": "<ringkasan 1-2 kalimat bahasa Indonesia>",
  "excerpt_en": "<ringkasan 1-2 kalimat bahasa Inggris>",
  "category_id": "<kategori bahasa Indonesia>",
  "category_en": "<kategori bahasa Inggris hubungannya dgn EN>",
  "tags": ["tag1", "tag2", "tag3"],
  "content_id": "<konten markdown bahasa Indonesia>",
  "content_en": "<konten markdown bahasa Inggris>",
  "seo_title_id": "<optional>",
  "seo_title_en": "<optional>",
  "seo_description_id": "<optional>",
  "seo_description_en": "<optional>"
}

Aturan:
- slug: huruf kecil, hanya a-z 0-9 dan dash (-), tanpa spasi.
- Konten pakai Markdown: judul ##, list, blok kode dengan backticks, blockquote bila perlu.
- content harus cukup substansial (min ~600 kata per bahasa), terstruktur dengan baik, dengan intro dan penutup.
- Jangan menyertakan materi yang terlarang atau menyesatkan. Jaga nada ramah, lugas, santai.
- Jangan tulis komentar JSON maupun trailing comma.`

async function askGemini(topic) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent`
  const body = {
    contents: [
      { role: 'user', parts: [{ text: `Buatkan artikel baru dengan topik/tema berikut:\n\n"${topic}"` }] }
    ],
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    generationConfig: {
      temperature: 0.7,
      responseMimeType: 'application/json'
    }
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': GEMINI_API_KEY
    },
    body: JSON.stringify(body)
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Gemini HTTP ${res.status}: ${text.slice(0, 500)}`)
  }
  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || ''
  let json
  try {
    json = JSON.parse(text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, ''))
  } catch {
    // coba ambil objek JSON pertama
    const start = text.indexOf('{')
    const end = text.lastIndexOf('}')
    if (start >= 0 && end > start) {
      json = JSON.parse(text.slice(start, end + 1))
    } else {
      throw new Error('Gemini tidak mengembalikan JSON valid')
    }
  }
  return json
}

// ---------------------------------------------------------------------------
// Konversi hasil Gemini -> objek artikel (format aplikasi).
// ---------------------------------------------------------------------------

function toArticle(g, topic) {
  const slugBase = slugify(g.slug || topic.split(' ').slice(0, 4).join(' '))
  const ls = (id, en) => ({ id: String(id || '').trim(), en: String(en || '').trim() })
  const str = (v) => String(v || '')
  return {
    slug: slugBase,
    title: ls(g.title_id || topic, g.title_en || topic),
    excerpt: ls(g.excerpt_id, g.excerpt_en),
    category: ls(g.category_id || 'Catatan', g.category_en || 'Notes'),
    tags: Array.isArray(g.tags) ? g.tags.map(str).map((s) => s.trim()).filter(Boolean).slice(0, 8) : [],
    cover: '',
    status: 'draft',
    datePublished: today(),
    seoTitle: ls(g.seo_title_id, g.seo_title_en),
    seoDescription: ls(g.seo_description_id, g.seo_description_en),
    content: ls(g.content_id, g.content_en)
  }
}

// ---------------------------------------------------------------------------
// Telegram helper
// ---------------------------------------------------------------------------

let offset = 0

async function tg(method, params = {}) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/${method}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  })
  const data = await res.json()
  if (!data.ok) throw new Error(`Telegram ${method}: ${JSON.stringify(data)}`)
  return data.result
}

async function sendMessage(chatId, text, extra = {}) {
  return tg('sendMessage', { chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true, ...extra })
}

// ---------------------------------------------------------------------------
// Menangani perintah
// ---------------------------------------------------------------------------

async function handleArticleRequest(chatId, topic) {
  await sendMessage(chatId, `⏳ Menulis artikel <b>"${topic}"</b>... Mohon tunggu beberapa detik.`)
  try {
    const g = await askGemini(topic)
    const article = toArticle(g, topic)

    let slug = article.slug
    if (!isValidSlug(slug)) slug = slugify(topic)
    if (!isValidSlug(slug)) slug = 'artikel-' + today().replace(/-/g, '')

    const articles = await listArticles()
    let finalSlug = slug
    let n = 2
    while (articles.some((a) => a?.slug === finalSlug)) {
      finalSlug = `${slug}-${n++}`
    }
    article.slug = finalSlug

    articles.push(article)
    await saveArticles(articles)

    await sendMessage(
      chatId,
      `✅ <b>Artikel berhasil dibuat sebagai DRAFT</b>\n\n` +
        `• Judul: <b>${article.title.id}</b>\n` +
        `• Slug: <code>${finalSlug}</code>\n` +
        `• Kategori: ${article.category.id}\n` +
        `• Tag: ${article.tags.join(', ') || '-'}\n` +
        `• Tanggal: ${article.datePublished}\n\n` +
        `Belum tampil publik (status <b>draft</b>). Tinjau lalu terbitkan dari panel admin:\n` +
        `<code>/admin/articles</code>\n\n` +
        `_Balas dengan /batal ${finalSlug} jika ingin menghapus._`
    )
  } catch (e) {
    await log('Gagal menulis artikel: ' + e.message)
    await sendMessage(chatId, `❌ Gagal menulis artikel: ${e.message}`)
  }
}

async function handleDeleteRequest(chatId, slug) {
  const articles = await listArticles()
  const idx = articles.findIndex((a) => a?.slug === slug)
  if (idx < 0) {
    await sendMessage(chatId, `⚠️ Tidak ada artikel dengan slug <code>${slug}</code>.`)
    return
  }
  articles.splice(idx, 1)
  await saveArticles(articles)
  await sendMessage(chatId, `🗑️ Artikel <code>${slug}</code> dihapus.`)
}

async function handleStart(chatId) {
  await sendMessage(
    chatId,
    `Selamat datang di <b>CehaDev Article Bot</b> 🤖\n\n` +
      `Untuk membuat artikel, ketik:\n<code>/artikel topik atau ide tulisanmu</code>\n\n` +
      `Contoh: <code>/artikel tips optimasi performa Nuxt.js</code>\n\n` +
      `Status awal artikel: <b>draft</b> (belum tayang). Tinjau di panel admin: <code>/admin/articles</code>`
  )
}

async function handleMyId(chatId) {
  await sendMessage(
    chatId,
    `Chat ID Anda: <code>${chatId}</code>\n\nIsikan angka ini ke env <code>TELEGRAM_ADMIN_CHAT_ID</code>.`
  )
}

async function handleList(chatId) {
  const articles = await listArticles()
  if (!articles.length) {
    await sendMessage(chatId, 'Belum ada artikel tersimpan.')
    return
  }
  const lines = articles.map((a) => {
    const status = a?.status === 'published' ? '✅' : '📝'
    return `${status} <code>${a?.slug}</code> — ${a?.title?.id || '?'}`
  })
  await sendMessage(chatId, `📚 <b>Semua artikel (${articles.length})</b>\n\n` + lines.join('\n'))
}

async function handleMessage(chatId, text) {
  if (!TELEGRAM_ADMIN_CHAT_ID) return
  if (String(chatId) !== TELEGRAM_ADMIN_CHAT_ID) {
    await sendMessage(chatId, 'Maaf, bot ini hanya untuk pemilik situs.')
    return
  }

  const trimmed = (text || '').trim()
  if (trimmed.startsWith('/start')) return handleStart(chatId)
  if (trimmed.startsWith('/myid')) return handleMyId(chatId)
  if (trimmed.startsWith('/list')) return handleList(chatId)
  if (trimmed.startsWith('/batal')) {
    const slug = trimmed.split(/\s+/)[1]
    if (slug) return handleDeleteRequest(chatId, slug)
    return sendMessage(chatId, 'Gunakan: <code>/batal slug-artikel</code>')
  }
  if (trimmed.startsWith('/artikel ') || text?.startsWith('artikel')) {
    const topic = trimmed.replace(/^\/?artikel\s*/i, '').trim()
    if (!topic) return sendMessage(chatId, 'Gunakan: <code>/artikel topik atau ide tulisan</code>')
    return handleArticleRequest(chatId, topic)
  }
  return sendMessage(
    chatId,
    `Perintah tersedia:\n\n` +
      `<code>/artikel [topik]</code> — buat artikel baru (draft)\n` +
      `<code>/list</code> — daftar semua artikel\n` +
      `<code>/batal [slug]</code> — hapus artikel\n` +
      `<code>/myid</code> — lihat chat id ini\n` +
      `<code>/start</code> — bantuan`
  )
}

// ---------------------------------------------------------------------------
// Main loop
// ---------------------------------------------------------------------------

async function poll() {
  let updates
  try {
    updates = await tg('getUpdates', {
      timeout: 50,
      offset,
      allowed_updates: ['message']
    })
  } catch (e) {
    await log('getUpdates error: ' + e.message)
    return
  }

  for (const u of updates) {
    offset = u.update_id + 1
    const msg = u.message
    if (!msg) continue
    const chatId = msg.chat?.id
    const text = msg.text
    if (chatId == null || text == null) continue
    try {
      await handleMessage(chatId, text)
    } catch (e) {
      await log('handleMessage error: ' + e.message)
    }
  }
}

async function main() {
  await log('Telegram bot dimulai. Polling Telegram...')
  if (!TELEGRAM_ADMIN_CHAT_ID) {
    await log(
      'PERINGATAN: TELEGRAM_ADMIN_CHAT_ID belum diatur. Kirim /start ke bot lalu /myid, isi value-nya, restart.'
    )
  }
  // eslint-disable-next-line no-constant-condition
  while (true) {
    await poll()
    await new Promise((r) => setTimeout(r, 1000))
  }
}

main().catch((e) => {
  console.error('Fatal:', e)
  process.exit(1)
})
