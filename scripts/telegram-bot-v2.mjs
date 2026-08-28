#!/usr/bin/env node
/**
 * CehaDev Telegram Bot v2 — PRD Phase 3 (Access Control + Quick Menu + Confirmation).
 *
 * Improvements dibanding bot v1:
 *   1. Whitelist berbasis tabel `telegram_identities` (bukan sekadar 1 chat id).
 *   2. Mapping Telegram -> admin user -> role -> permissions.
 *   3. Validasi permission per aksi (article.write/publish/delete).
 *   4. Quick menu (inline keyboard) + command Telegram.
 *   5. Confirmation flow dua-langkah untuk publish / unpublish / delete.
 *   6. Artikel disimpan di layer relasional (article-manager), bukan KV.
 *
 * Env:
 *   TELEGRAM_BOT_TOKEN
 *   TELEGRAM_ADMIN_CHAT_ID       chat id pemilik (primary whitelisted)
 *   TELEGRAM_ADMIN_USERNAME      (opsional) username pemilik, ikut di-whitelist
 *   GEMINI_API_KEY / GEMINI_MODEL
 *   TURSO_DATABASE_URL / TURSO_AUTH_TOKEN   (opsional; tanpa -> pakai file lokal .data/bot.db)
 */

import { createClient } from '@libsql/client'
import { createJiti } from 'jiti'
import { mkdir, appendFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const logFile = path.resolve(root, '.data', 'telegram-bot-v2.log')

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ''
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash'

async function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`
  try {
    await mkdir(path.resolve(root, '.data'), { recursive: true })
    await appendFile(logFile, line + '\n', 'utf-8')
  } catch {}
  console.log(line)
}

function fail(msg) {
  console.error(msg)
  process.exit(1)
}

if (!TELEGRAM_BOT_TOKEN) fail('TELEGRAM_BOT_TOKEN belum diatur')

// ---------------------------------------------------------------------------
// Load managers relasional via jiti, injeksi DB lokal (file:) bila tanpa Turso.
// ---------------------------------------------------------------------------

const jiti = createJiti(import.meta.url)
const mods = await Promise.all([
  jiti.import(path.resolve(root, 'server/utils/telegram-identity.ts')),
  jiti.import(path.resolve(root, 'server/utils/article-manager.ts')),
  jiti.import(path.resolve(root, 'server/utils/idea-manager.ts')),
  jiti.import(path.resolve(root, 'server/utils/permissions.ts')),
  jiti.import(path.resolve(root, 'server/utils/media-manager.ts')),
  jiti.import(path.resolve(root, 'server/utils/transcription.ts')),
  jiti.import(path.resolve(root, 'server/utils/ai-pipeline.ts'))
])
const [identityMod, articleMod, ideaMod, , mediaMod, transcriptionMod, pipelineMod] = mods
const { PERMISSIONS } = mods[3]

let client = null
if (process.env.TURSO_DATABASE_URL) {
  client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN || undefined
  })
} else {
  await mkdir(path.resolve(root, '.data'), { recursive: true })
  const dbFile = path.resolve(root, '.data', 'bot.db')
  client = createClient({ url: `file:${dbFile}` })
  await client.executeMultiple(`
    CREATE TABLE IF NOT EXISTS kv (key TEXT PRIMARY KEY, value TEXT NOT NULL);
  `)
}

identityMod.__setTelegramDbForTest(client)
articleMod.__setDbForTest(client)
ideaMod.__setIdeaDbForTest(client)
mediaMod.__setMediaDbForTest(client)
pipelineMod.__setAiPipelineDbForTest(client)

// Seed roles/permissions (idempotent)
await identityMod.seedDefaultAuth().catch((e) => log('seed auth: ' + e.message))

// ---------------------------------------------------------------------------
// Telegram helper
// ---------------------------------------------------------------------------

let offset = 0

async function tg(method, params = {}) {
  const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  })
  const data = await res.json()
  if (!data.ok) throw new Error(`Telegram ${method}: ${JSON.stringify(data).slice(0, 300)}`)
  return data.result
}

function sendMessage(chatId, text, extra = {}) {
  return tg('sendMessage', { chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true, ...extra })
}

function editMessage(chatId, messageId, text, extra = {}) {
  return tg('editMessageText', { chat_id: chatId, message_id: messageId, text, parse_mode: 'HTML', ...extra })
}

function answerCallback(queryId, text) {
  return tg('answerCallbackQuery', { callback_query_id: queryId, text, show_alert: false }).catch(() => {})
}

// ---------------------------------------------------------------------------
// Gemini (AI draft) — reused from v1 logic
// ---------------------------------------------------------------------------

const SYSTEM_PROMPT = `Kamu adalah penulis teknis blog untuk portfolio CehaDev.
Buat artikel lengkap dua bahasa dalam JSON valid (hanya JSON, tanpa markdown fence):
{
  "slug": "<slug-en-bersih a-z0-9-dash>",
  "title_id": "...", "title_en": "...",
  "excerpt_id": "...", "excerpt_en": "...",
  "category_id": "Catatan", "category_en": "Notes",
  "tags": ["..."],
  "content_id": "<markdown id>", "content_en": "<markdown en>",
  "seo_title_id": "","seo_title_en": "",
  "seo_description_id": "", "seo_description_en": ""
}
Konten min ~600 kata per bahasa, markdown (##, list, code block). Tanpa komentar JSON.

async ${''}`

async function askGemini(topic) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent`
  const body = {
    contents: [{ role: 'user', parts: [{ text: `Buatkan artikel baru dengan topik:\n\n"${topic}"` }] }],
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    generationConfig: { temperature: 0.7, responseMimeType: 'application/json' }
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': GEMINI_API_KEY },
    body: JSON.stringify(body)
  })
  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`Gemini HTTP ${res.status}: ${txt.slice(0, 300)}`)
  }
  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || ''
  let json
  try {
    json = JSON.parse(text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, ''))
  } catch {
    const start = text.indexOf('{')
    const end = text.lastIndexOf('}')
    if (start >= 0 && end > start) json = JSON.parse(text.slice(start, end + 1))
    else throw new Error('Gemini tidak mengembalikan JSON valid')
  }
  return json
}

function slugify(text) {
  return String(text).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-')
}

function statusEmoji(s) {
  const m = { IDEA: '💡', DRAFT: '📝', REVIEW: '🔎', APPROVED: '✅', PUBLISHED: '🚀', SCHEDULED: '📅', ARCHIVED: '🗄️' }
  return m[s] || '•'
}

// ---------------------------------------------------------------------------
// Command: quick menu (inline keyboard)
// ---------------------------------------------------------------------------

function quickMenuKeyboard() {
  return {
    inline_keyboard: [
      [
        { text: '📝 Buat Artikel', callback_data: 'cmd:create' },
        { text: '📚 Daftar Artikel', callback_data: 'cmd:list' }
      ],
      [
        { text: '🚀 Terbitkan', callback_data: 'cmd:publish' },
        { text: '🗑️ Hapus Artikel', callback_data: 'cmd:delete' }
      ],
      [{ text: '🆔 Chat ID Saya', callback_data: 'cmd:myid' }]
    ]
  }
}

// ---------------------------------------------------------------------------
// Article helpers (relasional)
// ---------------------------------------------------------------------------

function plainTitle(a) {
  try {
    const t = typeof a.title === 'string' ? JSON.parse(a.title) : a.title
    return (t && (t.id || t.en)) || a.slug
  } catch {
    return typeof a.title === 'string' ? a.title : a.slug
  }
}

function articleSummary(a) {
  return `${statusEmoji(a.status)} <b>${plainTitle(a)}</b>\n` +
    `   <code>${a.slug}</code> · ${a.source_type || 'HUMAN'}\n` +
    `   status: <b>${a.status}</b>`
}

function briskStatusList(articles) {
  return articles.slice(0, 20).map((a) => articleSummary(a)).join('\n') ||
    'Belum ada artikel.'
}

// ---------------------------------------------------------------------------
// Permission-aware dispatch
// ---------------------------------------------------------------------------

async function requirePermission(ctx, perm) {
  const ok = await identityMod.hasPermission(ctx, perm)
  return ok
}

// ---------------------------------------------------------------------------
// Confirmation flow state
// ---------------------------------------------------------------------------

const pendingConfirm = new Map() // chatId -> { slug|null, action, step }

// ---------------------------------------------------------------------------
// Handlers
// ---------------------------------------------------------------------------

async function requirePublish(ctx) {
  return requirePermission(ctx, PERMISSIONS.ARTICLE_PUBLISH)
}

async function fetchBySlug(slug) {
  try {
    const a = await articleMod.getArticleBySlug(slug)
    if (a && a.id) return a
  } catch {}
  return null
}

async function confirmPublish(chatId, ctx, slug) {
  if (!(await requirePublish(ctx))) {
    return sendMessage(chatId, '⛔ Anda tidak memiliki izin <code>article.publish</code>.')
  }
  const article = await fetchBySlug(slug)
  if (!article) return sendMessage(chatId, `⚠️ Artikel dengan slug <code>${slug}</code> tidak ditemukan.`)
  pendingConfirm.set(String(chatId), { slug, action: 'publish' })
  return sendMessage(
    chatId,
    `🚀 Terbitkan artikel:\n${articleSummary(article)}\n\nYakin?`,
    { reply_markup: { inline_keyboard: [[{ text: '✅ Ya, terbitkan', callback_data: 'confirm:yes' }, { text: '❌ Batal', callback_data: 'confirm:no' }]] } }
  )
}

async function confirmUnpublish(chatId, ctx, slug) {
  if (!(await requirePublish(ctx))) {
    return sendMessage(chatId, '⛔ Anda tidak memiliki izin <code>article.publish</code>.')
  }
  const article = await fetchBySlug(slug)
  if (!article) return sendMessage(chatId, `⚠️ Artikel dengan slug <code>${slug}</code> tidak ditemukan.`)
  pendingConfirm.set(String(chatId), { slug, action: 'unpublish' })
  return sendMessage(
    chatId,
    `⏹️ Tarik (unpublish) artikel:\n${articleSummary(article)}\n\nYakin?`,
    { reply_markup: { inline_keyboard: [[{ text: '✅ Ya, unpublish', callback_data: 'confirm:yes' }, { text: '❌ Batal', callback_data: 'confirm:no' }]] } }
  )
}

async function confirmDelete(chatId, ctx, slug) {
  if (!(await requirePermission(ctx, PERMISSIONS.ARTICLE_DELETE))) {
    return sendMessage(chatId, '⛔ Anda tidak memiliki izin <code>article.delete</code>.')
  }
  const article = await fetchBySlug(slug)
  if (!article) return sendMessage(chatId, `⚠️ Artikel dengan slug <code>${slug}</code> tidak ditemukan.`)
  pendingConfirm.set(String(chatId), { slug, action: 'delete' })
  return sendMessage(
    chatId,
    `🗑️ HAPUS artikel:\n${articleSummary(article)}\n\n⚠️ Tindakan ini permanen. Yakin?`,
    { reply_markup: { inline_keyboard: [[{ text: '✅ Ya, hapus', callback_data: 'confirm:yes' }, { text: '❌ Batal', callback_data: 'confirm:no' }]] } }
  )
}

async function handleCommand(chatId, ctx, cmd, arg) {
  if (cmd === 'create') {
    if (!(await requirePermission(ctx, PERMISSIONS.ARTICLE_WRITE))) {
      return sendMessage(chatId, '⛔ Anda tidak memiliki izin <code>article.write</code>.')
    }
    if (!arg) {
      return sendMessage(chatId, 'Gunakan: <code>/artikel topik atau ide tulisanmu</code>')
    }
    await sendMessage(chatId, `⏳ Menulis artikel <b>"${arg}"</b>... mohon tunggu.`)
    if (!GEMINI_API_KEY) return sendMessage(chatId, '❌ GEMINI_API_KEY belum diatur.')
    try {
      const g = await askGemini(arg)
      let slug = slugify(g.slug || arg.split(' ').slice(0, 4).join(' '))
      slug = slug.replace(/[^a-z0-9-]/g, '') || 'artikel'
      const article = await articleMod.createArticle(
        {
          slug,
          title: { id: g.title_id || arg, en: g.title_en || arg },
          excerpt: { id: g.excerpt_id || '', en: g.excerpt_en || '' },
          content: { id: g.content_id || '', en: g.content_en || '' },
          category_id: g.category_id || 'Catatan',
          tags: Array.isArray(g.tags) ? g.tags.slice(0, 8) : [],
          original_topic: arg
        },
        'AI',
        String(chatId)
      )
      await identityMod.logAgentRun(arg, 'gemini.create_article', 'success', `telegram:${chatId}`)
      await sendMessage(
        chatId,
        `✅ <b>Artikel dibuat (${article.status})</b>\n\n${articleSummary(article)}\n\nTinjau & terbitkan via ${arg ? '' : ''}menu /menu.`
      )
    } catch (e) {
      await identityMod.logAgentRun(arg, 'gemini.create_article', 'failed', `telegram:${chatId}`)
      await sendMessage(chatId, `❌ Gagal menulis artikel: ${e.message}`)
    }
    return
  }

  if (cmd === 'list') {
    if (!(await requirePermission(ctx, PERMISSIONS.ARTICLE_READ))) {
      return sendMessage(chatId, '⛔ Anda tidak memiliki izin <code>article.read</code>.')
    }
    const articles = await articleMod.listArticles({})
    return sendMessage(chatId, `📚 <b>Artikel (${articles.length})</b>\n\n${briskStatusList(articles)}`)
  }

  if (cmd === 'publish') {
    if (!arg) return sendMessage(chatId, 'Gunakan: <code>/publish slug-artikel</code>')
    return confirmPublish(chatId, ctx, arg)
  }

  if (cmd === 'unpublish') {
    if (!arg) return sendMessage(chatId, 'Gunakan: <code>/unpublish slug-artikel</code>')
    return confirmUnpublish(chatId, ctx, arg)
  }

  if (cmd === 'delete' || cmd === 'batal') {
    if (!arg) return sendMessage(chatId, 'Gunakan: <code>/delete slug-artikel</code>')
    return confirmDelete(chatId, ctx, arg)
  }

  if (cmd === 'myid') {
    return sendMessage(chatId, `Chat ID Anda: <code>${chatId}</code>`)
  }
}

// ---------------------------------------------------------------------------
// Media & voice (PRD Section 8)
// ---------------------------------------------------------------------------

async function downloadTelegramFile(fileId) {
  const { file_path } = await tg('getFile', { file_id: fileId })
  if (!file_path) throw new Error('File path tidak tersedia')
  const res = await fetch(`https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${file_path}`)
  if (!res.ok) throw new Error(`Gagal unduh file: HTTP ${res.status}`)
  const arrayBuffer = await res.arrayBuffer()
  return { fileName: file_path.split('/').pop() || 'file', mimeType: 'application/octet-stream', data: Buffer.from(arrayBuffer) }
}

function mimeFromFileName(name) {
  const ext = (String(name).split('.').pop() || '').toLowerCase()
  const map = { ogg: 'audio/ogg', mp3: 'audio/mpeg', m4a: 'audio/mp4', webm: 'audio/webm', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif' }
  return map[ext] || 'application/octet-stream'
}

async function handleVoice(ctx, msg) {
  const chatId = msg.chat?.id
  const voice = msg.voice || msg.audio
  if (!voice?.file_id) return sendMessage(chatId, 'Tidak ada file suara yang terdeteksi.')
  if (!(await requirePermission(ctx, PERMISSIONS.ARTICLE_WRITE))) {
    return sendMessage(chatId, '⛔ Anda tidak memiliki izin <code>article.write</code>.')
  }
  await sendMessage(chatId, '🎙️ Menerima pesan suara, memproses transkrip...')
  try {
    const file = await downloadTelegramFile(voice.file_id)
    const mime = voice.mime_type || file.mimeType || mimeFromFileName(file.fileName)
    const txt = await transcriptionMod.transcribeAudio({ data: file.data, mimeType: mime })
    await identityMod.logAgentRun('voice transcript', 'tts.transcribe', 'success', `telegram:${chatId}`)
    // Simpan aset audio (media traceability)
    let media
    try {
      media = await mediaMod.storeMedia({ data: file.data, mimeType: mime, metadata: { kind: 'telegram-voice' }, actorId: String(chatId) })
    } catch {}
    if (!txt.text.trim()) return sendMessage(chatId, 'Transkrip kosong / gagal dipahami.')
    // Transkrip -> draft (Human+AI mode: original = transkrip, AI kembangkan)
    const art = await pipelineMod.runHumanAIMode(txt.text, ctx)
    await sendMessage(
      chatId,
      `📝 <b>Draft dari suara dibuat</b>\n\n${articleSummary(art)}\n\n` +
        (media ? `🎧 audio tersimpan di media (<code>${media.id}</code>)· ` : '') +
        `Tinjau & terbitkan via /menu.`
    )
  } catch (e) {
    await identityMod.logAgentRun('voice transcript', 'tts.transcribe', 'failed', `telegram:${chatId}`)
    await sendMessage(chatId, `❌ Gagal memproses suara: ${e.message}`)
  }
}

async function handlePhoto(ctx, msg) {
  const chatId = msg.chat?.id
  const photos = msg.photo
  if (!photos?.length) return sendMessage(chatId, 'Tidak ada foto yang terdeteksi.')
  if (!(await requirePermission(ctx, PERMISSIONS.ARTICLE_WRITE))) {
    return sendMessage(chatId, '⛔ Anda tidak memiliki izin <code>article.write</code>.')
  }
  const largest = photos.reduce((a, b) => (b.file_size > a.file_size ? b : a), photos[0])
  try {
    const file = await downloadTelegramFile(largest.file_id)
    const mime = mimeFromFileName(file.fileName)
    const media = await mediaMod.storeMedia({ data: file.data, mimeType: mime, metadata: { kind: 'telegram-photo', caption: msg.caption || '' }, actorId: String(chatId) })
    await sendMessage(
      chatId,
      `🖼️ <b>Media tersimpan</b>\n\n• ID: <code>${media.id}</code>\n• Tipe: ${media.mime_type}\n• Ukuran: ${Math.round(media.size / 1024)} KB\n• URL: ${media.url}`,
      { disable_web_page_preview: false }
    )
  } catch (e) {
    await sendMessage(chatId, `❌ Gagal menyimpan foto: ${e.message}`)
  }
}

// ---------------------------------------------------------------------------
// Message + Callback dispatch
// ---------------------------------------------------------------------------

async function handleMessage(ctx, msg) {
  const chatId = msg.chat?.id
  const text = (msg.text || '').trim()
  if (chatId == null || !text) return

  if (!ctx.isWhitelisted) {
    await identityMod.logAgentRun(text, 'telegram.access', 'denied', `telegram:${chatId}`)
    return sendMessage(chatId, '⛔ Anda tidak terdaftar (whitelist). Hubungi pemilik situs.')
  }

  if (msg.voice || msg.audio) return handleVoice(ctx, msg)
  if (msg.photo && msg.photo.length) return handlePhoto(ctx, msg)

  if (text.startsWith('/menu') || text.startsWith('/start')) {
    return sendMessage(
      chatId,
      `Selamat datang di <b>CehaDev Article Bot</b> 🤖\n\nPilih aksi dari menu cepat di bawah, atau ketik perintah:\n` +
        `<code>/artikel topik</code> · <code>/list</code> · <code>/publish slug</code> · <code>/delete slug</code> · <code>/id</code>`,
      { reply_markup: quickMenuKeyboard() }
    )
  }
  if (text.startsWith('/artikel ')) {
    return handleCommand(chatId, ctx, 'create', text.replace(/^\/artikel\s*/i, ''))
  }
  if (text.startsWith('/list')) return handleCommand(chatId, ctx, 'list')
  if (text.startsWith('/publish ')) return handleCommand(chatId, ctx, 'publish', text.replace(/^\/publish\s*/, ''))
  if (text.startsWith('/unpublish ')) return handleCommand(chatId, ctx, 'unpublish', text.replace(/^\/unpublish\s*/, ''))
  if (text.startsWith('/delete ') || text.startsWith('/batal ')) {
    return handleCommand(chatId, ctx, 'delete', text.replace(/^\/(delete|batal)\s*/, ''))
  }
  if (text.startsWith('/id')) return handleCommand(chatId, ctx, 'myid')

  return sendMessage(chatId, `Perintah tidak dikenal. Ketik <code>/menu</code> untuk bantuan.`)
}

async function handleCallback(ctx, callback) {
  const chatId = callback.message?.chat?.id
  const messageId = callback.message?.message_id
  const data = callback.data || ''
  if (chatId == null) return
  await answerCallback(callback.id, '')

  if (!ctx.isWhitelisted) {
    return editMessage(chatId, messageId, '⛔ Anda tidak terdaftar (whitelist).')
  }

  if (data.startsWith('cmd:')) {
    const cmd = data.slice(4)
    if (cmd === 'myid') return handleCommand(chatId, ctx, 'myid')
    if (cmd === 'list') return handleCommand(chatId, ctx, 'list')
    if (cmd === 'create') {
      return sendMessage(chatId, 'Ketik <code>/artikel [topik]</code> untuk membuat artikel (draft).')
    }
    if (cmd === 'publish') return sendMessage(chatId, 'Ketik <code>/publish [slug]</code> untuk menerbitkan artikel.')
    if (cmd === 'delete') return sendMessage(chatId, 'Ketik <code>/delete [slug]</code> untuk menghapus artikel.')
  }

  if (data === 'confirm:yes') {
    const pending = pendingConfirm.get(String(chatId))
    pendingConfirm.delete(String(chatId))
    if (!pending) return editMessage(chatId, messageId, 'Kedaluwarsa. Ulangi aksi.')

    if (pending.action === 'publish') {
      let article = await fetchBySlug(pending.slug)
      if (!article) return editMessage(chatId, messageId, `⚠️ Artikel tidak ditemukan.`)
      try {
        article = await articleMod.transitionStatus(article.id, 'PUBLISHED', 'telegram', String(chatId), 'bot publish')
      } catch (e) {
        return editMessage(chatId, messageId, `❌ Gagal publish: ${e.message}`)
      }
      await identityMod.logAgentRun(pending.slug, 'telegram.publish', 'success', `telegram:${chatId}`)
      return editMessage(chatId, messageId, `✅ <b>Artikel diterbitkan</b>\n${articleSummary(article)}`)
    }
    if (pending.action === 'unpublish') {
      let article = await fetchBySlug(pending.slug)
      if (!article) return editMessage(chatId, messageId, `⚠️ Artikel tidak ditemukan.`)
      try {
        article = await articleMod.transitionStatus(article.id, 'APPROVED', 'telegram', String(chatId), 'bot unpublish')
      } catch (e) {
        return editMessage(chatId, messageId, `❌ Gagal unpublish: ${e.message}`)
      }
      await identityMod.logAgentRun(pending.slug, 'telegram.unpublish', 'success', `telegram:${chatId}`)
      return editMessage(chatId, messageId, `⏹️ <b>Artikel ditarik (unpublish)</b>\n${articleSummary(article)}`)
    }
    if (pending.action === 'delete') {
      const article = await fetchBySlug(pending.slug)
      if (!article) return editMessage(chatId, messageId, `⚠️ Artikel tidak ditemukan.`)
      try {
        await articleMod.deleteArticle(article.id, 'telegram', String(chatId))
      } catch (e) {
        return editMessage(chatId, messageId, `❌ Gagal delete: ${e.message}`)
      }
      await identityMod.logAgentRun(pending.slug, 'telegram.delete', 'success', `telegram:${chatId}`)
      return editMessage(chatId, messageId, `🗑️ Artikel <code>${pending.slug}</code> dihapus.`)
    }
  }

  if (data === 'confirm:no') {
    pendingConfirm.delete(String(chatId))
    return editMessage(chatId, messageId, '✅ Dibatalkan.')
  }
}

async function poll() {
  let updates
  try {
    updates = await tg('getUpdates', { timeout: 50, offset, allowed_updates: ['message', 'callback_query'] })
  } catch (e) {
    await log('getUpdates error: ' + e.message)
    return
  }
  for (const u of updates) {
    offset = u.update_id + 1
    try {
      if (u.message) {
        const msg = u.message
        const ctx = await identityMod.resolveUserContext(String(msg.from?.id || ''), msg.from?.username || '')
        await handleMessage(ctx, msg)
      } else if (u.callback_query && u.callback_query.from) {
        const cq = u.callback_query
        const ctx = await identityMod.resolveUserContext(String(cq.from.id || ''), cq.from.username || '')
        await handleCallback(ctx, cq)
      }
    } catch (e) {
      await log('update error: ' + e.message)
    }
  }
}

async function main() {
  await log(`Telegram bot v2 dimulai. Polling... (primary admin: ${process.env.TELEGRAM_ADMIN_CHAT_ID || '(none)'})`)
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
