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

const artMod = await jiti.import(path.resolve(root, 'server/utils/article-manager.ts'))
const idMod = await jiti.import(path.resolve(root, 'server/utils/telegram-identity.ts'))
const schedMod = await jiti.import(path.resolve(root, 'server/utils/scheduler.ts'))
const backMod = await jiti.import(path.resolve(root, 'server/utils/backup.ts'))
const notifMod = await jiti.import(path.resolve(root, 'server/utils/notifier.ts'))
const monMod = await jiti.import(path.resolve(root, 'server/utils/monitoring.ts'))

process.env.TELEGRAM_ADMIN_CHAT_ID = '777000'

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'prd-ops-test-'))
const dbFile = path.join(tmpDir, 'ops.db')
const client = createClient({ url: `file:${dbFile}` })

async function tableExists(name) {
  const res = await client.execute({ sql: `SELECT name FROM sqlite_master WHERE type='table' AND name=?`, args: [name] })
  return res.rows.length > 0
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
      created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
      published_at TEXT, scheduled_at TEXT
    );
    CREATE TABLE IF NOT EXISTS activity_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT, actor_type TEXT NOT NULL,
      actor_id TEXT NOT NULL DEFAULT '', action TEXT NOT NULL,
      entity TEXT NOT NULL DEFAULT '', entity_id TEXT NOT NULL DEFAULT '',
      summary TEXT NOT NULL DEFAULT '', metadata TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS article_revisions (
      id TEXT PRIMARY KEY, article_id TEXT NOT NULL, title TEXT NOT NULL DEFAULT '{}',
      content TEXT NOT NULL DEFAULT '{}', source_type TEXT NOT NULL DEFAULT '',
      changed_by TEXT NOT NULL DEFAULT '', change_summary TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS agent_runs (id TEXT PRIMARY KEY, request TEXT NOT NULL DEFAULT '', tool TEXT NOT NULL DEFAULT '', result_status TEXT NOT NULL DEFAULT '', actor TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL);
  `)
  artMod.__setDbForTest(client)
  idMod.__setTelegramDbForTest(client)
  backMod.__setBackupDbForTest(client)
  monMod.__setMonitorDbForTest(client)
  notifMod.__setNotifierForTest(async ({ chatId, text }) => { if (!chatId) throw new Error('no chat'); })

  // metrics collector palin: datanya tersedia agar dapat diuji
  monMod.setMetricsCollector({
    collect: async () => ({ cpu: { usedPct: 42, text: '42%' }, ram: { usedPct: 61, text: '61%' }, disk: { usedPct: 33, text: '33%' }, uptimeSec: 900 })
  })
})

after(() => {
  artMod.__setDbForTest(null)
  idMod.__setTelegramDbForTest(null)
  backMod.__setBackupDbForTest(null)
  monMod.__setMonitorDbForTest(null)
  notifMod.__setNotifierForTest(null)
  monMod.setMetricsCollector(null)
  delete process.env.TELEGRAM_ADMIN_CHAT_ID
})

describe('ops (PRD Phase 6) — scheduler', () => {
  test('artikel SCHEDULED dengan waktu lewat dipublikasikan oleh scheduler', async () => {
    const art = await artMod.createArticle({ title: { id: 'Sched A', en: 'Sched A' }, content: { id: 'x', en: 'x' }, status: 'APPROVED' })
    await artMod.scheduleArticle(art.id, new Date(Date.now() - 1000).toISOString())
    const res = await schedMod.processScheduledArticles(new Date().toISOString())
    assert.ok(res.published.length >= 1)
    const pub = res.published.find((p) => p.id === art.id)
    assert.ok(pub, 'artikel yang dijadwalkan harus dipublikasikan')
    const got = await artMod.getArticleById(art.id)
    assert.equal(got.status, 'PUBLISHED')
    assert.ok(got.published_at)
  })

  test('artikel SCHEDULED dengan waktu masa depan TIDAK dipublikasikan', async () => {
    const art = await artMod.createArticle({ title: { id: 'Sched B', en: 'Sched B' }, content: { id: 'x', en: 'x' }, status: 'APPROVED' })
    await artMod.scheduleArticle(art.id, new Date(Date.now() + 10 * 60 * 1000).toISOString())
    const res = await schedMod.processScheduledArticles(new Date().toISOString())
    assert.ok(!res.published.some((p) => p.id === art.id))
    assert.equal((await artMod.getArticleById(art.id)).status, 'SCHEDULED')
  })

  test('scheduleArticle menolak waktu invalid / status non-approvable', async () => {
    const art = await artMod.createArticle({ title: { id: 'Bad', en: 'Bad' }, content: { id: 'x', en: 'x' }, status: 'DRAFT' })
    await assert.rejects(() => artMod.scheduleArticle(art.id, 'not-a-date'))
    await assert.rejects(() => artMod.scheduleArticle('nope', new Date().toISOString()))
  })
})

describe('ops (PRD Phase 6) — backup & restore', () => {
  test('createBackup menghasilkan file gzip berisi seluruh tabel', async () => {
    const { file, meta } = await backMod.createBackup()
    assert.ok(fs.existsSync(file))
    assert.ok(meta.bytes > 0)
  })

  test('restore backup mengembalikan data', async () => {
    // buat data, backup, hapus, restore, cek kembali
    const art = await artMod.createArticle({ title: { id: 'Backup Restore', en: 'Backup Restore' }, content: { id: 'y', en: 'y' } })
    const { file } = await backMod.createBackup()
    await artMod.deleteArticle(art.id, 'test', 'tester')
    await assert.rejects(() => artMod.getArticleById(art.id))
    const restored = await backMod.restoreBackup(file)
    assert.ok(restored.restored.includes('articles'))
    const got = await artMod.getArticleById(art.id)
    assert.equal(got.title.id, 'Backup Restore')
  })

  test('listBackups mengembalikan daftar terbaru', async () => {
    await backMod.createBackup()
    const list = await backMod.listBackups(10)
    assert.ok(list.length >= 1)
    assert.ok(list[0].name.endsWith('.json.gz'))
  })
})

describe('ops (PRD Phase 6) — monitoring & notifier', () => {
  test('getOverview mengembalikan statistik & metrics', async () => {
    const ov = await monMod.getOverview('https://example.com')
    assert.equal(typeof ov.articles.total, 'number')
    assert.equal(ov.machine.cpu.usedPct, 42)
    assert.equal(ov.machine.ram.usedPct, 61)
  })

  test('checkDatabase OK terhadap local db', async () => {
    const r = await monMod.checkDatabase()
    assert.equal(r.ok, true)
  })

  test('notifier dengan stub tidak error dan terkirim ke chat', async () => {
    const ok = await notifMod.sendNotification('test alert', 'info')
    assert.equal(ok, true)
  })

  test('notifierConfig tanpa env token mengembalikan false (tidak crash)', async () => {
    delete process.env.TELEGRAM_BOT_TOKEN
    const configured = notifMod.notifierConfigured()
    assert.equal(configured, false)
    process.env.TELEGRAM_BOT_TOKEN = 'dummy'
  })
})
