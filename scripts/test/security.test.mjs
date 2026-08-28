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

const redactMod = await jiti.import(path.resolve(root, 'server/utils/redact.ts'))
const rlMod = await jiti.import(path.resolve(root, 'server/utils/rate-limit.ts'))
const idMod = await jiti.import(path.resolve(root, 'server/utils/telegram-identity.ts'))

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'prd-sec-test-'))
const dbFile = path.join(tmpDir, 'sec.db')
const client = createClient({ url: `file:${dbFile}` })

const FAKE_SECRET = 'sk-test-super-secret-value-12345'

before(async () => {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS agent_runs (id TEXT PRIMARY KEY, request TEXT NOT NULL DEFAULT '', tool TEXT NOT NULL DEFAULT '', result_status TEXT NOT NULL DEFAULT '', actor TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL);
  `)
  idMod.__setTelegramDbForTest(client)
  process.env.GEMINI_API_KEY = FAKE_SECRET
  process.env.NUXT_ADMIN_SECRET = 'test-secret-at-least-32-chars-long-1234567890'
})

after(() => {
  idMod.__setTelegramDbForTest(null)
  delete process.env.GEMINI_API_KEY
  delete process.env.NUXT_ADMIN_SECRET
})

describe('PRD Section 16 — redaksi secret', () => {
  test('redact menyensor bearer token', () => {
    const out = redactMod.redact('Authorization: Bearer abc.def.ghi rest')
    assert.ok(!out.includes('abc.def.ghi'))
    assert.ok(out.includes('[REDACTED]'))
  })

  test('redact menyensor password/api_key/secret dalam object string', () => {
    const out = redactMod.redact(JSON.stringify({ password: 'hunter2', api_key: 'K123', token: 't0k' }))
    assert.ok(!out.includes('hunter2'))
    assert.ok(!out.includes('K123'))
    assert.ok(!out.includes('t0k'))
  })

  test('redact menyensor nilai secret env (GEMINI_API_KEY) di mana pun muncul', () => {
    const out = redactMod.redact('request with key ' + FAKE_SECRET + ' inside')
    assert.ok(!out.includes(FAKE_SECRET))
    assert.ok(out.includes('[REDACTED]'))
  })

  test('sanitizeRecord menyensor field bernama sensitif & nilai secret', () => {
    const clean = redactMod.sanitizeRecord({ username: 'admin', password: 'pw1', nested: { secret: 'x', ok: 1 }, apiKey: 'KEY9' })
    assert.equal(clean.password, '[REDACTED]')
    assert.equal(clean.apiKey, '[REDACTED]')
    assert.equal(clean.nested.secret, '[REDACTED]')
    assert.equal(clean.nested.ok, 1)
    assert.equal(clean.username, 'admin')
  })
})

describe('PRD Section 16 — logAgentRun tidak membocorkan secret', () => {
  test('request yang memuat secret tersimpan ter-redact di agent_runs', async () => {
    const leaky = `createArticle ${FAKE_SECRET} api_key=K123`
    await idMod.logAgentRun(leaky, 'ai.createArticle', 'success', 'agent')
    const runs = await idMod.listAgentRuns(5)
    const stored = runs.find((r) => r.tool === 'ai.createArticle')
    assert.ok(stored)
    const req = String(stored.request)
    assert.ok(!req.includes(FAKE_SECRET))
    assert.ok(!req.includes('K123'))
    assert.ok(req.includes('[REDACTED]'))
  })
})

describe('PRD Section 16 — rate limiter in-memory', () => {
  test('melewatkan di bawah batas lalu menolak di atas batas', () => {
    rlMod.resetRateLimiter()
    const opts = { max: 3, windowMs: 60_000 }
    assert.equal(rlMod.rateLimit('sec:test', opts).ok, true)
    assert.equal(rlMod.rateLimit('sec:test', opts).ok, true)
    assert.equal(rlMod.rateLimit('sec:test', opts).ok, true)
    const denied = rlMod.rateLimit('sec:test', opts)
    assert.equal(denied.ok, false)
    assert.ok(denied.retryAfterMs > 0)
  })

  test('key berbeda tidak saling memengaruhi', () => {
    rlMod.resetRateLimiter()
    const denied = rlMod.rateLimit('sec:a', { max: 1, windowMs: 1000 })
    assert.equal(denied.ok, true)
    assert.equal(rlMod.rateLimit('sec:b', { max: 1, windowMs: 1000 }).ok, true)
  })
})

describe('PRD Section 16 — session tidak rapuh terhadap tamper', () => {
  test('token palsu/rusak ditolak tanpa crash', async () => {
    const sessMod = await jiti.import(path.resolve(root, 'server/utils/session.ts'))
    assert.equal(await sessMod.isSessionValid(undefined), false)
    assert.equal(await sessMod.isSessionValid('garbage'), false)
    assert.equal(await sessMod.isSessionValid('a.b.c'), false)
    assert.equal(await sessMod.isSessionValid('!!.!!'), false)
  })
})
