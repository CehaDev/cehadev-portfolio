import { test, describe, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { createClient } from '@libsql/client'
import { createJiti } from 'jiti'
import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const jiti = createJiti(import.meta.url)
const managerPath = path.resolve(__dirname, '../../server/utils/article-manager.ts')
const m = await jiti.import(managerPath)

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'prd-art-test-'))

function freshDb() {
  const file = path.join(tmpDir, `db-${Math.random().toString(36).slice(2)}.db`)
  return createClient({ url: `file:${file}` })
}

async function setupSchema(client) {
  await client.executeMultiple(`
    CREATE TABLE IF NOT EXISTS articles (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL DEFAULT '{}',
      slug TEXT NOT NULL UNIQUE,
      excerpt TEXT NOT NULL DEFAULT '{}',
      content TEXT NOT NULL DEFAULT '{}',
      thumbnail TEXT NOT NULL DEFAULT '',
      category_id TEXT NOT NULL DEFAULT '',
      tags TEXT NOT NULL DEFAULT '[]',
      cover TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'IDEA',
      source_type TEXT NOT NULL DEFAULT 'HUMAN',
      author_id TEXT NOT NULL DEFAULT '',
      seo_title TEXT NOT NULL DEFAULT '{}',
      seo_description TEXT NOT NULL DEFAULT '{}',
      original_topic TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      published_at TEXT
    );
    CREATE TABLE IF NOT EXISTS article_revisions (
      id TEXT PRIMARY KEY,
      article_id TEXT NOT NULL,
      title TEXT NOT NULL DEFAULT '{}',
      content TEXT NOT NULL DEFAULT '{}',
      source_type TEXT NOT NULL DEFAULT '',
      changed_by TEXT NOT NULL DEFAULT '',
      change_summary TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS activity_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      actor_type TEXT NOT NULL,
      actor_id TEXT NOT NULL DEFAULT '',
      action TEXT NOT NULL,
      entity TEXT NOT NULL DEFAULT '',
      entity_id TEXT NOT NULL DEFAULT '',
      summary TEXT NOT NULL DEFAULT '',
      metadata TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS article_ideas (
      id TEXT PRIMARY KEY,
      raw_idea TEXT NOT NULL,
      source_type TEXT NOT NULL DEFAULT 'HUMAN',
      status TEXT NOT NULL DEFAULT 'OPEN',
      linked_article_id TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `)
}

beforeEach(async () => {
  const client = freshDb()
  await setupSchema(client)
  m.__setDbForTest(client)
})

describe('article-manager (PRD Phase 1)', () => {
  test('createArticle membuat artikel default IDEA/HUMAN', async () => {
    const art = await m.createArticle({
      title: { id: 'Judul Test', en: 'Test Title' },
      content: { id: 'Konten', en: 'Content' },
      excerpt: { id: 'Ringkas', en: 'Excerpt' }
    })
    assert.ok(art.id)
    assert.equal(art.status, 'IDEA')
    assert.equal(art.source_type, 'HUMAN')
    assert.equal(art.title.id, 'Judul Test')
    const got = await m.getArticleBySlug(art.slug)
    assert.equal(got.id, art.id)
  })

  test('createArticle menolak judul kosong', async () => {
    await assert.rejects(() => m.createArticle({ title: { id: '', en: '' } }))
  })

  test('createArticle menolak slug duplikat', async () => {
    const base = { title: { id: 'A', en: 'A' }, slug: 'satu' }
    await m.createArticle(base)
    await assert.rejects(() => m.createArticle({ ...base, title: { id: 'B', en: 'B' } }))
  })

  test('updateArticle menyimpan snapshot revision', async () => {
    const art = await m.createArticle({
      title: { id: 'Versi 1', en: 'V1' },
      content: { id: 'isi lama', en: 'old' }
    })
    await m.updateArticle(art.id, { title: { id: 'Versi 2', en: 'V2' }, content: { id: 'isi baru', en: 'new' } }, 'ADMIN', 'admin', 'ubah judul')
    const revs = await m.listRevisions(art.id)
    assert.equal(revs.length, 1)
    assert.equal(revs[0].title.id, 'Versi 1')
    const after = await m.getArticleById(art.id)
    assert.equal(after.title.id, 'Versi 2')
  })

  test('transitionStatus mengikuti workflow dan membuat revision', async () => {
    const art = await m.createArticle({ title: { id: 'T', en: 'T' } })
    await m.transitionStatus(art.id, 'DRAFT')
    await m.transitionStatus(art.id, 'REVIEW')
    await m.transitionStatus(art.id, 'APPROVED')
    const published = await m.transitionStatus(art.id, 'PUBLISHED')
    assert.equal(published.status, 'PUBLISHED')
    assert.ok(published.published_at)
    const revs = await m.listRevisions(art.id)
    assert.ok(revs.length >= 4)
  })

  test('transitionStatus menolak transisi tak valid (IDEA -> PUBLISHED)', async () => {
    const art = await m.createArticle({ title: { id: 'T2', en: 'T2' } })
    await assert.rejects(() => m.transitionStatus(art.id, 'PUBLISHED'))
  })

  test('restoreRevision mengembalikan konten lama + tetap bisa di-revert', async () => {
    const art = await m.createArticle({ title: { id: 'V0', en: 'V0' }, content: { id: 'konten awal', en: 'initial' } })
    await m.updateArticle(art.id, { content: { id: 'konten kedua', en: 'second' } }, 'ADMIN', 'admin', 'edit')
    const revs = await m.listRevisions(art.id)
    const first = revs[revs.length - 1]
    const restored = await m.restoreRevision(art.id, first.id)
    assert.equal(restored.content.id, 'konten awal')
    const after = await m.listRevisions(art.id)
    assert.ok(after.length >= 2)
  })

  test('logActivity tercatat', async () => {
    await m.logActivity('SYSTEM', 'sys', 'ping', 'test', '1', 'cek')
    const logs = await m.listActivity()
    assert.equal(logs[0].action, 'ping')
  })

  test('deleteArticle menghapus dan mencatat aktivitas', async () => {
    const art = await m.createArticle({ title: { id: 'Hapus', en: 'Del' } })
    await m.deleteArticle(art.id)
    await assert.rejects(() => m.getArticleById(art.id))
  })
})
