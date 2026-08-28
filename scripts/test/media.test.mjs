import { test, describe, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { createClient } from '@libsql/client'
import { createJiti } from 'jiti'
import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '../..')
const jiti = createJiti(import.meta.url)

const mediaMod = await jiti.import(path.resolve(root, 'server/utils/media-manager.ts'))
const storageMod = await jiti.import(path.resolve(root, 'server/utils/storage.ts'))
const artMod = await jiti.import(path.resolve(root, 'server/utils/article-manager.ts'))
const idMod = await jiti.import(path.resolve(root, 'server/utils/telegram-identity.ts'))
const transMod = await jiti.import(path.resolve(root, 'server/utils/transcription.ts'))
const pipelineMod = await jiti.import(path.resolve(root, 'server/utils/ai-pipeline.ts'))
const aiMod = await jiti.import(path.resolve(root, 'server/utils/ai.ts'))
const permMod = await jiti.import(path.resolve(root, 'server/utils/permissions.ts'))
const { PERMISSIONS } = permMod

process.env.TELEGRAM_ADMIN_CHAT_ID = '555000'

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'prd-media-test-'))
const dbFile = path.join(tmpDir, 'media.db')
const client = createClient({ url: `file:${dbFile}` })

// In-memory storage provider agar test tidak menyentuh filesystem .data
class MemoryStorage {
  constructor() { this.map = new Map() }
  async put(data, key, mimeType) {
    const url = `/media/${key}`
    this.map.set(key, Buffer.from(data))
    return { key, url, bytes: Buffer.from(data), mimeType, size: data.length }
  }
  async get(key) {
    const b = this.map.get(key)
    return b ? { key, url: `/media/${key}`, bytes: b, mimeType: '', size: b.length } : null
  }
  async delete(key) { return this.map.delete(key) }
}

before(async () => {
  await client.executeMultiple(`
    CREATE TABLE IF NOT EXISTS articles (
      id TEXT PRIMARY KEY, title TEXT NOT NULL DEFAULT '{}', slug TEXT NOT NULL UNIQUE,
      excerpt TEXT NOT NULL DEFAULT '{}', content TEXT NOT NULL DEFAULT '{}',
      thumbnail TEXT NOT NULL DEFAULT '', category_id TEXT NOT NULL DEFAULT '',
      tags TEXT NOT NULL DEFAULT '[]', cover TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'IDEA', source_type TEXT NOT NULL DEFAULT 'HUMAN',
      author_id TEXT NOT NULL DEFAULT '', seo_title TEXT NOT NULL DEFAULT '{}',
      seo_description TEXT NOT NULL DEFAULT '{}', original_topic TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL, updated_at TEXT NOT NULL, published_at TEXT
    );
    CREATE TABLE IF NOT EXISTS activity_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT, actor_type TEXT NOT NULL,
      actor_id TEXT NOT NULL DEFAULT '', action TEXT NOT NULL,
      entity TEXT NOT NULL DEFAULT '', entity_id TEXT NOT NULL DEFAULT '',
      summary TEXT NOT NULL DEFAULT '', metadata TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS agent_runs (id TEXT PRIMARY KEY, request TEXT NOT NULL DEFAULT '', tool TEXT NOT NULL DEFAULT '', result_status TEXT NOT NULL DEFAULT '', actor TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS media_assets (
      id TEXT PRIMARY KEY, storage_key TEXT NOT NULL, url TEXT NOT NULL DEFAULT '',
      mime_type TEXT NOT NULL DEFAULT '', size INTEGER NOT NULL DEFAULT 0,
      metadata TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS article_pipeline (
      id TEXT PRIMARY KEY, article_id TEXT NOT NULL, mode TEXT NOT NULL DEFAULT 'AI',
      original_input TEXT NOT NULL DEFAULT '', research TEXT NOT NULL DEFAULT '',
      outline TEXT NOT NULL DEFAULT '', ai_draft TEXT NOT NULL DEFAULT '',
      final_content TEXT NOT NULL DEFAULT '', checklist TEXT NOT NULL DEFAULT '{}',
      ai_feedback TEXT NOT NULL DEFAULT '', review_iterations INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'DRAFT', created_at TEXT NOT NULL, updated_at TEXT NOT NULL
    );
  `)
  artMod.__setDbForTest(client)
  idMod.__setTelegramDbForTest(client)
  mediaMod.__setMediaDbForTest(client)
  pipelineMod.__setAiPipelineDbForTest(client)
  storageMod.setStorageProvider(new MemoryStorage())

  transMod.__setTranscriberForTest(async () => 'Transkrip dari pesan suara tentang deployment Nuxt.')
  aiMod.__setAiClientForTest(async ({ system }) => {
    // WRITE_SYSTEM (penulis dua bahasa) — untuk Human+AI dari transkrip
    return { text: JSON.stringify({ slug: 'transkrip-suara', title_id: 'Deploy Nuxt', title_en: 'Nuxt Deploy', excerpt_id: 'ringkasan', excerpt_en: 'summary', category_id: 'Catatan', tags: ['deploy'], content_id: 'Konten hasil AI '.repeat(70), content_en: 'Content '.repeat(70) }) }
  })
})

after(() => {
  artMod.__setDbForTest(null)
  idMod.__setTelegramDbForTest(null)
  mediaMod.__setMediaDbForTest(null)
  pipelineMod.__setAiPipelineDbForTest(null)
  storageMod.setStorageProvider(null)
  transMod.__setTranscriberForTest(null)
  aiMod.__setAiClientForTest(null)
  delete process.env.TELEGRAM_ADMIN_CHAT_ID
})

const PNG = Buffer.from('89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000d49444154789c626001000000ffff03000006000557bfabd40000000049454e44ae426082', 'hex')

describe('media-manager (PRD Phase 5)', () => {
  test('storeMedia valid menyimpan ke storage + metadata media_assets', async () => {
    const media = await mediaMod.storeMedia({ data: PNG, mimeType: 'image/png', metadata: { kind: 'cover' }, actorId: 'tester' })
    assert.ok(media.id.startsWith('med-'))
    assert.equal(media.mime_type, 'image/png')
    assert.equal(media.size, PNG.length)
    assert.ok(media.url.startsWith('/media/'))
    const stored = await mediaMod.getMedia(media.id)
    assert.equal(stored.storage_key, media.storage_key)
  })

  test('validasi: tipe file tak diizinkan DITOLAK (415)', async () => {
    await assert.rejects(() => mediaMod.storeMedia({ data: Buffer.from('<svg/>'), mimeType: 'image/svg+xml', actorId: 't' }), /tidak diizinkan|415/)
  })

  test('validasi: ukuran melebihi batas DITOLAK (413)', async () => {
    const big = Buffer.alloc(mediaMod.MAX_IMAGE_BYTES + 1)
    await assert.rejects(() => mediaMod.storeMedia({ data: big, mimeType: 'image/png', actorId: 't' }), /melebihi batas|413/)
  })

  test('listMedia mengembalikan daftar terbaru', async () => {
    await mediaMod.storeMedia({ data: PNG, mimeType: 'image/png', actorId: 't' })
    const list = await mediaMod.listMedia(10)
    assert.ok(list.length >= 1)
    assert.equal(list[0].mime_type, 'image/png')
  })

  test('deleteMedia menghapus record + storage', async () => {
    const media = await mediaMod.storeMedia({ data: PNG, mimeType: 'image/png', actorId: 't' })
    await mediaMod.deleteMedia(media.id, 'tester')
    await assert.rejects(() => mediaMod.getMedia(media.id), /tidak ditemukan|404/)
    const list = await mediaMod.listMedia(100)
    assert.ok(!list.some((m) => m.id === media.id))
  })

  test('stub transcriber mengubah suara menjadi DRAFT artikel (Human+AI)', async () => {
    const art = await pipelineMod.runHumanAIMode('Deploy Nuxt via Vercel', { ctx: { telegramUserId: '555000', username: 'owner', isWhitelisted: true, adminUserId: '', roleId: 'admin', roleName: 'Admin', permissions: Object.values(PERMISSIONS) } })
    assert.equal(art.status, 'DRAFT')
    const pipe = await pipelineMod.getPipelineByArticleId(art.id)
    assert.equal(pipe.mode, 'HUMAN_AI')
    assert.ok(pipe.original_input.includes('Deploy Nuxt'))
  })
})
