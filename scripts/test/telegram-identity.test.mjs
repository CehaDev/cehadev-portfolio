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
const m = await jiti.import(path.resolve(__dirname, '../../server/utils/telegram-identity.ts'))
const permMod = await jiti.import(path.resolve(__dirname, '../../server/utils/permissions.ts'))
const { PERMISSIONS } = permMod

process.env.TELEGRAM_ADMIN_CHAT_ID = '123456789'

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'prd-tg-test-'))
const dbFile = path.join(tmpDir, 'tg.db')
const client = createClient({ url: `file:${dbFile}` })

async function createMinimalSchema() {
  await client.executeMultiple(`
    CREATE TABLE IF NOT EXISTS permissions (id TEXT PRIMARY KEY, name TEXT NOT NULL UNIQUE);
    CREATE TABLE IF NOT EXISTS roles (id TEXT PRIMARY KEY, name TEXT NOT NULL UNIQUE);
    CREATE TABLE IF NOT EXISTS role_permissions (role_id TEXT NOT NULL, permission_id TEXT NOT NULL, PRIMARY KEY (role_id, permission_id));
    CREATE TABLE IF NOT EXISTS admin_users (id TEXT PRIMARY KEY, username TEXT NOT NULL UNIQUE, display_name TEXT NOT NULL DEFAULT '', role_id TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS telegram_identities (id TEXT PRIMARY KEY, telegram_user_id TEXT NOT NULL UNIQUE, admin_user_id TEXT NOT NULL DEFAULT '', username TEXT NOT NULL DEFAULT '', is_whitelisted INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS agent_runs (id TEXT PRIMARY KEY, request TEXT NOT NULL DEFAULT '', tool TEXT NOT NULL DEFAULT '', result_status TEXT NOT NULL DEFAULT '', actor TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL);
  `)
}

before(async () => {
  await createMinimalSchema()
  m.__setTelegramDbForTest(client)
  await m.seedDefaultAuth()
})

after(() => {
  m.__setTelegramDbForTest(null)
  delete process.env.TELEGRAM_ADMIN_CHAT_ID
})

describe('telegram-identity (PRD Phase 3 access control)', () => {
  test('primary admin (TELEGRAM_ADMIN_CHAT_ID) otomatis whitelisted + role admin', async () => {
    const ctx = await m.resolveUserContext('123456789', 'owner')
    assert.equal(ctx.isWhitelisted, true)
    assert.equal(ctx.roleId, 'admin')
    assert.ok(ctx.permissions.includes(PERMISSIONS.ARTICLE_PUBLISH))
    assert.ok(ctx.permissions.includes(PERMISSIONS.ARTICLE_DELETE))
  })

  test('non-whitelisted user DITOLAK (isWhitelisted false, no permissions), tidak crash', async () => {
    const ctx = await m.resolveUserContext('999999999', 'intruder')
    assert.equal(ctx.isWhitelisted, false)
    assert.deepEqual(ctx.permissions, [])
    assert.equal(await m.hasPermission(ctx, PERMISSIONS.ARTICLE_WRITE), false)
  })

  test('Akses non-whitelisted tidak berubah walau identitas tersimpan sebagai alternat', async () => {
    await m.resolveUserContext('555666777', 'stranger')
    const ctx = await m.resolveUserContext('555666777', 'stranger')
    assert.equal(ctx.isWhitelisted, false)
  })

  test('whitelistTelegramUser memberi akses setelah approve manual', async () => {
    const before = await m.resolveUserContext('777888999')
    assert.equal(before.isWhitelisted, false)
    await m.whitelistTelegramUser('777888999', { adminUserId: '', username: 'editor' })
    const after = await m.resolveUserContext('777888999')
    assert.equal(after.isWhitelisted, true)
  })

  test('unwhitelistTelegramUser mencabut akses', async () => {
    await m.whitelistTelegramUser('111222333')
    assert.equal((await m.resolveUserContext('111222333')).isWhitelisted, true)
    await m.unwhitelistTelegramUser('111222333')
    assert.equal((await m.resolveUserContext('111222333')).isWhitelisted, false)
  })

  test('logAgentRun & listAgentRuns mencatat run', async () => {
    await m.logAgentRun('topik tes', 'gemini.create_article', 'success', 'telegram:123456789')
    const runs = await m.listAgentRuns(10)
    assert.ok(runs.length >= 1)
    assert.equal(runs[0].tool, 'gemini.create_article')
    assert.equal(runs[0].result_status, 'success')
  })
})
