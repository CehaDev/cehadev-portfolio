#!/usr/bin/env node
/**
 * rollback.mjs — Melepas layer relasional PRD (Section 13) dari database.
 *
 * HANYA menghapus tabel yang DITAMBAHKAN PRD. Tidak menyentuh tabel legacy
 * sistem KV yang masih berjalan. Digunakan untuk migration/rollback TEST di
 * staging (PRD Phase 9) dan sebagai jalur rollback darurat produksi.
 *
 * Safety: wajib CONFIRM_ROLLBACK=yes. Data pada tabel yang di-drop TIDAK
 * bisa kembali kecuali lewat backup — pastikan backup tersedia / DB staging.
 *
 * Usage:
 *   TURSO_DATABASE_URL=libsql://... TURSO_AUTH_TOKEN=... CONFIRM_ROLLBACK=yes node scripts/rollback.mjs
 */
import { createClient } from '@libsql/client'

const RELATIONAL_TABLES = [
  'article_pipeline',
  'media_assets',
  'article_revisions',
  'article_ideas',
  'activity_logs',
  'telegram_identities',
  'admin_users',
  'role_permissions',
  'permissions',
  'roles',
  'agent_runs'
]

const ARTICLES_TABLE = 'articles'

async function main() {
  if (process.env.CONFIRM_ROLLBACK !== 'yes') {
    console.error('Aksi destruktif. Set CONFIRM_ROLLBACK=yes untuk melanjutkan.')
    process.exit(1)
  }
  const url = process.env.TURSO_DATABASE_URL
  if (!url) {
    console.error('TURSO_DATABASE_URL wajib diatur.')
    process.exit(1)
  }
  const client = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN || undefined })

  // Hanya drop tabel yang benar-benar ada (toleran terhadap partial migration)
  const dropped = []
  const toDrop = [...RELATIONAL_TABLES, ARTICLES_TABLE]
  for (const t of toDrop) {
    const exists = await client.execute({ sql: `SELECT name FROM sqlite_master WHERE type='table' AND name=?`, args: [t] })
    if (!exists.rows.length) continue
    await client.execute(`DROP TABLE IF EXISTS "${t}"`)
    dropped.push(t)
  }

  console.log(`Rollback selesai. Tabel relasional PRD di-drop: ${dropped.join(', ') || '(tidak ada)'}`)
  console.log('Tabel/halaman legacy KV tidak diubah.')
  client.close?.()
}

main().catch((e) => {
  console.error('Gagal rollback:', e)
  process.exit(1)
})
