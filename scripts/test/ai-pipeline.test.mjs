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

const pipelineMod = await jiti.import(path.resolve(root, 'server/utils/ai-pipeline.ts'))
const artMod = await jiti.import(path.resolve(root, 'server/utils/article-manager.ts'))
const idMod = await jiti.import(path.resolve(root, 'server/utils/telegram-identity.ts'))
const aiMod = await jiti.import(path.resolve(root, 'server/utils/ai.ts'))
const permMod = await jiti.import(path.resolve(root, 'server/utils/permissions.ts'))
const { PERMISSIONS } = permMod

process.env.TELEGRAM_ADMIN_CHAT_ID = '1111000'

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'prd-pipeline-test-'))
const dbFile = path.join(tmpDir, 'pipeline.db')
const client = createClient({ url: `file:${dbFile}` })

const jsonReply = (obj) => ({ text: JSON.stringify(obj) })

before(async () => {
  await client.executeMultiple(`
    CREATE TABLE IF NOT EXISTS kv (key TEXT PRIMARY KEY, value TEXT NOT NULL);
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
    CREATE TABLE IF NOT EXISTS permissions (id TEXT PRIMARY KEY, name TEXT NOT NULL UNIQUE);
    CREATE TABLE IF NOT EXISTS roles (id TEXT PRIMARY KEY, name TEXT NOT NULL UNIQUE);
    CREATE TABLE IF NOT EXISTS role_permissions (role_id TEXT NOT NULL, permission_id TEXT NOT NULL, PRIMARY KEY (role_id, permission_id));
    CREATE TABLE IF NOT EXISTS admin_users (id TEXT PRIMARY KEY, username TEXT NOT NULL UNIQUE, display_name TEXT NOT NULL DEFAULT '', role_id TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS telegram_identities (id TEXT PRIMARY KEY, telegram_user_id TEXT NOT NULL UNIQUE, admin_user_id TEXT NOT NULL DEFAULT '', username TEXT NOT NULL DEFAULT '', is_whitelisted INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS agent_runs (id TEXT PRIMARY KEY, request TEXT NOT NULL DEFAULT '', tool TEXT NOT NULL DEFAULT '', result_status TEXT NOT NULL DEFAULT '', actor TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL);
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
  pipelineMod.__setAiPipelineDbForTest(client)

  aiMod.__setAiClientForTest(async ({ system, prompt }) => {
    if (system.includes('peneliti konten')) return jsonReply({ research: 'Riset topik X' })
    if (system.includes('editor') && system.includes('outline')) return jsonReply({ outline: '## Pendahuluan\n## Isi\n## Penutup' })
    if (system.includes('reviewer artikel')) return jsonReply({ pass: true, feedback: 'Sudah oke' })
    if (system.includes('berdasarkan outline')) return jsonReply({ content: '## Pendahuluan\nKonten outline dua ratus karakter. '.repeat(10) })
    // WRITE_SYSTEM (penulis dua bahasa)
    return jsonReply({
      slug: 'e2e-' + prompt.match(/"([^"]+)"/)?.[1]?.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 24) || 'artikel',
      title_id: 'Pipeline 2-60', title_en: 'En', error: '',
      excerpt_id: 'ringkasan', excerpt_en: 'summary',
      category_id: 'Catatan', tags: ['nuxt', 'ai'],
      content_id: 'Konten isi '.repeat(70),
      content_en: 'Content en '.repeat(70)
    })
  })
})

after(() => {
  artMod.__setDbForTest(null)
  idMod.__setTelegramDbForTest(null)
  pipelineMod.__setAiPipelineDbForTest(null)
  aiMod.__setAiClientForTest(null)
  delete process.env.TELEGRAM_ADMIN_CHAT_ID
})

const ADMIN_CTX = { ctx: { telegramUserId: '1111000', username: 'owner', isWhitelisted: true, adminUserId: '', roleId: 'admin', roleName: 'Admin', permissions: Object.values(PERMISSIONS) } }
const NOBODY = { ctx: { telegramUserId: '999', username: 'x', isWhitelisted: false, adminUserId: '', roleId: 'viewer', roleName: 'Viewer', permissions: [] } }

describe('ai-pipeline (PRD Phase 4) — isolated tools', () => {
  test('non-allowlisted tool DITOLAK', async () => {
    await assert.rejects(() => pipelineMod.runTool('shell', { cmd: 'rm -rf /' }, ADMIN_CTX), /allowlist/)
  })

  test('createArticle tool menciptakan DRAFT (tidak auto-publish)', async () => {
    const art = await pipelineMod.runTool('createArticle', { title: { id: 'Tool A', en: 'Tool A' }, content: { id: 'x', en: 'x' } }, ADMIN_CTX)
    assert.equal(art.status, 'DRAFT')
  })

  test('generateArticle writing tool menghasilkan artikel AI (draft)', async () => {
    const art = await pipelineMod.runTool('generateArticle', { topic: 'Tips' }, ADMIN_CTX)
    assert.equal(art.status, 'DRAFT')
    assert.ok(art.content.id.length > 0)
  })

  test('permission ditolak untuk user non-whitelisted', async () => {
    await assert.rejects(() => pipelineMod.runTool('createArticle', { title: { id: 'X', en: 'X' } }, NOBODY), /whitelist|ditolak/)
  })

  test('tool call terdokumentasi di agent_runs (audit)', async () => {
    const before = (await idMod.listAgentRuns(100)).length
    await pipelineMod.runTool('getArticle', { id: (await artMod.listArticles({}))[0].id }, ADMIN_CTX)
    const after = (await idMod.listAgentRuns(100)).length
    assert.ok(after > before)
  })

  test('getStatistics tool menghitung by status & source', async () => {
    const stats = await pipelineMod.runTool('getStatistics', {}, ADMIN_CTX)
    assert.equal(typeof stats.total, 'number')
    assert.ok('by_status' in stats)
    assert.ok('by_source' in stats)
  })
})

describe('ai-pipeline (PRD Phase 4) — writing modes', () => {
  test('Human mode: artikel HUMAN', async () => {
    const art = await pipelineMod.runHumanMode({ title: { id: 'Human', en: 'Human' }, content: { id: 'konten', en: 'content' } }, ADMIN_CTX)
    assert.equal(art.source_type, 'HUMAN')
  })

  test('AI mode: artikel AI + draft', async () => {
    const art = await pipelineMod.runAIMode('Jaringan', ADMIN_CTX)
    assert.equal(art.source_type, 'AI')
    assert.equal(art.status, 'DRAFT')
  })

  test('Human+AI: original input terekam di pipeline & artikel AI', async () => {
    const art = await pipelineMod.runHumanAIMode('Konten MQTT', ADMIN_CTX)
    const row = await pipelineMod.getPipelineByArticleId(art.id)
    assert.ok(row)
    assert.equal(row.mode, 'HUMAN_AI')
  })
})

describe('ai-pipeline (PRD Phase 4) — E2E IDEA→DRAFT→REVIEW→APPROVED→PUBLISHED', () => {
  test('pipeline genesis menghasilkan REVIEW (tidak auto-publish) + traceability', async () => {
    const { article, pipelineId } = await pipelineMod.generateArticlePipeline('Serverless', ADMIN_CTX, { mode: 'AI' })
    assert.ok(pipelineId)
    assert.ok(['DRAFT', 'REVIEW'].includes(article.status))
    assert.notEqual(article.status, 'PUBLISHED', 'AI tidak boleh auto-publish')
    const pipe = await pipelineMod.getPipelineByArticleId(article.id)
    assert.equal(pipe.mode, 'AI')
    assert.ok(pipe.research)
    assert.ok(pipe.outline)
  })

  test('ready-to-publish checklist terisi', async () => {
    const { article } = await pipelineMod.generateArticlePipeline('Checklist', ADMIN_CTX, { mode: 'AI' })
    const checklist = await pipelineMod.readyToPublishChecklist(article.id, ADMIN_CTX)
    assert.ok(Array.isArray(checklist))
    assert.ok(checklist.length >= 6)
    const title = checklist.find((c) => c.key === 'title_filled')
    assert.ok(title)
  })

  test('human approval: REVIEW → APPROVED', async () => {
    const { article } = await pipelineMod.generateArticlePipeline('Approve', ADMIN_CTX, { mode: 'AI' })
    const approved = await pipelineMod.humanApproveArticle(article.id, ADMIN_CTX)
    assert.equal(approved.status, 'APPROVED')
  })

  test('alur penuh hingga PUBLISHED via approval + publish', async () => {
    const { article } = await pipelineMod.generateArticlePipeline('Nitro', ADMIN_CTX, { mode: 'AI' })
    await pipelineMod.humanApproveArticle(article.id, ADMIN_CTX)
    const pub = await artMod.transitionStatus(article.id, 'PUBLISHED', 'test', 'tester')
    assert.equal(pub.status, 'PUBLISHED')
    assert.ok(pub.published_at)
    const pipe = await pipelineMod.getPipelineByArticleId(article.id)
    assert.equal(pipe.status, 'APPROVED')
  })
})
