import { test, describe, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { createClient } from '@libsql/client'
import { createJiti } from 'jiti'
import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const jiti = createJiti(import.meta.url)
const artMod = await jiti.import(path.resolve(__dirname, '../../server/utils/article-manager.ts'))
const ideaMod = await jiti.import(path.resolve(__dirname, '../../server/utils/idea-manager.ts'))

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'prd-e2e-'))
const dbFile = path.join(tmpDir, 'e2e.db')
const client = createClient({ url: `file:${dbFile}` })

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
    CREATE TABLE IF NOT EXISTS article_revisions (
      id TEXT PRIMARY KEY, article_id TEXT NOT NULL, title TEXT NOT NULL DEFAULT '{}',
      content TEXT NOT NULL DEFAULT '{}', source_type TEXT NOT NULL DEFAULT '',
      changed_by TEXT NOT NULL DEFAULT '', change_summary TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS activity_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT, actor_type TEXT NOT NULL,
      actor_id TEXT NOT NULL DEFAULT '', action TEXT NOT NULL,
      entity TEXT NOT NULL DEFAULT '', entity_id TEXT NOT NULL DEFAULT '',
      summary TEXT NOT NULL DEFAULT '', metadata TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS article_ideas (
      id TEXT PRIMARY KEY, raw_idea TEXT NOT NULL, source_type TEXT NOT NULL DEFAULT 'HUMAN',
      status TEXT NOT NULL DEFAULT 'OPEN', linked_article_id TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL, updated_at TEXT NOT NULL
    );
  `)
  artMod.__setDbForTest(client)
  ideaMod.__setIdeaDbForTest(client)
})

after(() => {
  artMod.__setDbForTest(null)
  ideaMod.__setIdeaDbForTest(null)
})

describe('End-to-end flow artikel (dashboard → API)', () => {
  test('alur IDEA → DRAFT → REVIEW → APPROVED → PUBLISHED + publish_at', async () => {
    const art = await artMod.createArticle({
      title: { id: 'E2E Artikel', en: 'E2E Article' },
      content: { id: 'konten', en: 'content' },
      slug: 'e2e-artikel'
    })
    assert.equal(art.status, 'IDEA')
    const draft = await artMod.transitionStatus(art.id, 'DRAFT')
    assert.equal(draft.status, 'DRAFT')
    await artMod.transitionStatus(art.id, 'REVIEW')
    await artMod.transitionStatus(art.id, 'APPROVED')
    const pub = await artMod.transitionStatus(art.id, 'PUBLISHED')
    assert.equal(pub.status, 'PUBLISHED')
    assert.ok(pub.published_at)
  })

  test('update → revision tersimpan → restore mengembalikan konten lama', async () => {
    const art = await artMod.createArticle({ title: { id: 'R0', en: 'R0' }, content: { id: 'v1', en: 'v1' } })
    await artMod.updateArticle(art.id, { content: { id: 'v2', en: 'v2' } }, 'ADMIN', 'admin', 'edit')
    const revs = await artMod.listRevisions(art.id)
    assert.ok(revs.length >= 1)
    const restored = await artMod.restoreRevision(art.id, revs[revs.length - 1].id)
    assert.equal(restored.content.id, 'v1')
  })

  test('transisi ilegal ditolak — IDEA langsung PUBLISH', async () => {
    const art = await artMod.createArticle({ title: { id: 'L', en: 'L' } })
    await assert.rejects(() => artMod.transitionStatus(art.id, 'PUBLISHED'))
  })

  test('ide → status DONE + tercatat, lalu artikel dibuat dari ide', async () => {
    const idea = await ideaMod.createIdea({ raw_idea: 'Ide yang menjadi artikel', source_type: 'HUMAN' })
    const done = await ideaMod.updateIdea(idea.id, { status: 'DONE' })
    assert.equal(done.status, 'DONE')
    const art = await artMod.createArticle({ title: { id: 'Dari ide', en: 'From idea' } })
    await ideaMod.updateIdea(idea.id, { linked_article_id: art.id })
    const linked = await ideaMod.getIdea(idea.id)
    assert.equal(linked.linked_article_id, art.id)
  })

  test('activity log mencatat seluruh operasi artikel', async () => {
    const art = await artMod.createArticle({ title: { id: 'Log', en: 'Log' } })
    await artMod.transitionStatus(art.id, 'DRAFT')
    await artMod.deleteArticle(art.id)
    const logs = await artMod.listActivity(50)
    const actions = logs.map((l) => l.action)
    assert.ok(actions.includes('article.create'))
    assert.ok(actions.includes('article.status'))
    assert.ok(actions.includes('article.delete'))
  })
})
