import { test, describe, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { createClient } from '@libsql/client'
import { createJiti } from 'jiti'
import * as os from 'node:os'
import * as path from 'node:path'
import * as fs from 'node:fs'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '../..')
const jiti = createJiti(import.meta.url)

const notifMod = await jiti.import(path.resolve(root, 'server/utils/notifier.ts'))
const monMod = await jiti.import(path.resolve(root, 'server/utils/monitoring.ts'))
const artMod = await jiti.import(path.resolve(root, 'server/utils/article-manager.ts'))

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'prd-tgm-test-'))
const dbFile = path.join(tmpDir, 'tgm.db')
const client = createClient({ url: `file:${dbFile}` })

const sent = []
async function stubNotifier({ chatId, text }) {
  if (!chatId) throw new Error('sendNotification tanpa chatId')
  sent.push(text)
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
  `)
  artMod.__setDbForTest(client)
  monMod.__setMonitorDbForTest(client)
  monMod.setMetricsCollector({
    collect: async () => ({ cpu: { usedPct: 12, text: '12%' }, ram: { usedPct: 45, text: '45%' }, disk: { usedPct: 20, text: '20%' }, uptimeSec: 1200 })
  })
  notifMod.__setNotifierForTest(stubNotifier)
  process.env.TELEGRAM_ADMIN_CHAT_ID = '999000'
})

after(() => {
  artMod.__setDbForTest(null)
  monMod.__setMonitorDbForTest(null)
  monMod.setMetricsCollector(null)
  notifMod.__setNotifierForTest(null)
  delete process.env.TELEGRAM_ADMIN_CHAT_ID
})

describe('PRD Section 19/15 — Monitoring tersedia via Telegram (jalur alert)', () => {
  test('getOverview menyertakan metrik mesin & ringkasan artikel', async () => {
    await artMod.createArticle({ title: { id: 'Satu', en: 'One' }, content: { id: 'c', en: 'c' }, status: 'PUBLISHED' })
    await artMod.createArticle({ title: { id: 'Dua', en: 'Two' }, content: { id: 'd', en: 'd' }, status: 'DRAFT' })
    const ov = await monMod.getOverview('https://example.com')
    assert.equal(ov.articles.total, 2)
    assert.equal(ov.articles.published, 1)
    assert.equal(ov.articles.drafts, 1)
    assert.equal(ov.machine.cpu.usedPct, 12)
    assert.equal(ov.machine.ram.usedPct, 45)
    assert.equal(ov.connections.database, 'local-file')
  })

  test('health check DB ok terhadap database lokal', async () => {
    const r = await monMod.checkDatabase()
    assert.equal(r.ok, true)
  })

  test('notifyError mengirim pesan ke Telegram (stub) saat ada kegagalan', async () => {
    sent.length = 0
    await notifMod.notifyError('koneksi DB putus')
    assert.ok(sent.length >= 1, 'harus ada pesan terkirim')
    assert.ok(sent[0].includes('koneksi DB putus'))
  })

  test('notifyDeployment mengirim status success/failed ke Telegram', async () => {
    sent.length = 0
    await notifMod.notifyDeployment('failed', 'gagal build di staging')
    assert.ok(sent.length >= 1)
    assert.ok(sent[0].toLowerCase().includes('gagal') || sent[0].toLowerCase().includes('failed'))
  })
})
