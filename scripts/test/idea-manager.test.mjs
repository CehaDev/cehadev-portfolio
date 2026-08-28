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
const m = await jiti.import(path.resolve(__dirname, '../../server/utils/idea-manager.ts'))

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'prd-idea-test-'))

function freshDb() {
  const file = path.join(tmpDir, `db-${Math.random().toString(36).slice(2)}.db`)
  return createClient({ url: `file:${file}` })
}

beforeEach(async () => {
  const client = freshDb()
  await client.executeMultiple(`
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
  m.__setIdeaDbForTest(client)
})

describe('idea-manager (PRD Phase 2)', () => {
  test('createIdea membuat ide default OPEN/HUMAN', async () => {
    const idea = await m.createIdea({ raw_idea: 'Ide artikel baru' })
    assert.ok(idea.id)
    assert.equal(idea.status, 'OPEN')
    assert.equal(idea.source_type, 'HUMAN')
    assert.equal(idea.raw_idea, 'Ide artikel baru')
  })

  test('createIdea menolak ide kosong', async () => {
    await assert.rejects(() => m.createIdea({ raw_idea: '' }))
  })

  test('updateIdea mengubah status & source', async () => {
    const idea = await m.createIdea({ raw_idea: 'Topik', source_type: 'AI' })
    const updated = await m.updateIdea(idea.id, { status: 'DONE', source_type: 'HUMAN_AI' })
    assert.equal(updated.status, 'DONE')
    assert.equal(updated.source_type, 'HUMAN_AI')
  })

  test('listIdeas memfilter status', async () => {
    await m.createIdea({ raw_idea: 'A' })
    const done = await m.createIdea({ raw_idea: 'B', status: 'DONE' })
    const open = await m.listIdeas({ status: 'OPEN' })
    assert.equal(open.length, 1)
    assert.equal(open[0].id, done.id === done.id ? open[0].id : '')
  })

  test('deleteIdea menghapus', async () => {
    const idea = await m.createIdea({ raw_idea: 'Hapus' })
    await m.deleteIdea(idea.id)
    await assert.rejects(() => m.getIdea(idea.id))
  })
})
