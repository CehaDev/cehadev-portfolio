#!/usr/bin/env node
/**
 * migrate-test.mjs — Uji migration & rollback pada staging (local file DB),
 * PRD Phase 9 langkah 3: "Jalankan migration dan rollback test pada environment
 * staging sebelum menyentuh production."
 *
 * Tidak butuh TURSO — memakai database sqlite lokal sementara (file:),
 * setara staging/jalur rollback. Meng-copy DDL dari scripts/migrate.mjs.
 *
 * Alur: migrasi -> verifikasi 12 tabel -> seed-> drop (rollback) -> migrasi ulang
 * (idempotensi) -> bersihkan. Keluar non-zero bila ada kegagalan.
 */
import { createClient } from '@libsql/client'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const { DDL } = await import(path.join(__dirname, 'lib', 'ddl.mjs'))

const EXPECTED_TABLES = [
  'articles', 'article_ideas', 'article_revisions', 'activity_logs',
  'roles', 'permissions', 'role_permissions', 'admin_users',
  'telegram_identities', 'media_assets', 'agent_runs', 'article_pipeline'
]

const dir = mkdtempSync(path.join(tmpdir(), 'prd-migrate-test-'))
const dbFile = path.join(dir, 'staging.db')
const client = createClient({ url: `file:${dbFile}` })

function fail(msg) {
  console.error(`\u2716 ${msg}`)
  cleanup()
  process.exit(1)
}
function ok(msg) {
  console.log(`\u2714 ${msg}`)
}

async function listTables() {
  const res = await client.execute(`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'`)
  return res.rows.map((r) => String(r.name))
}
function cleanup() {
  try { client.close?.() } catch {}
  try { rmSync(dir, { recursive: true, force: true }) } catch {}
}

try {
  // 1) Migrasi awal
  await client.executeMultiple(DDL)
  let tables = await listTables()
  const missing = EXPECTED_TABLES.filter((t) => !tables.includes(t))
  if (missing.length) fail(`Migrasi tidak membuat tabel: ${missing.join(', ')}`)
  ok(`Migrasi membuat semua ${EXPECTED_TABLES.length} tabel relasional`)

  // 2) Idempotensi: migrasi ulang tidak gagal
  await client.executeMultiple(DDL)
  ok('Migrasi ulang (idempotent) berhasil tanpa error')

  // 3) Seed data untuk memastikan skema dapat dipakai
  await client.execute(
    `INSERT INTO articles (id,title,slug,status,source_type,created_at,updated_at) VALUES ('a1','x','x-1','DRAFT','AI',datetime('now'),datetime('now'))`
  )
  const seeded = await client.execute(`SELECT COUNT(*) AS c FROM articles`)
  ok(`Data dapat dimasukkan (articles = ${seeded.rows[0].c})`)

  // 4) Rollback: drop seluruh tabel relasional
  for (const t of EXPECTED_TABLES) {
    await client.execute(`DROP TABLE IF EXISTS "${t}"`)
  }
  tables = await listTables()
  const stillThere = EXPECTED_TABLES.filter((t) => tables.includes(t))
  if (stillThere.length) fail(`Rollback tidak menghapus: ${stillThere.join(', ')}`)
  ok('Rollback menghapus seluruh tabel relasional PRD')

  // 5) Re-migrasi setelah rollback (pull kembali, jalur recovery)
  await client.executeMultiple(DDL)
  tables = await listTables()
  const missingAfter = EXPECTED_TABLES.filter((t) => !tables.includes(t))
  if (missingAfter.length) fail(`Re-migrasi setelah rollback gagal: ${missingAfter.join(', ')}`)
  ok('Re-migrasi setelah rollback berhasil (recovery path OK)')

  console.log('\nPASS: migration & rollback test (staging) LULUS.')
  cleanup()
} catch (e) {
  fail(`Pengecualian: ${e.message}`)
}
