#!/usr/bin/env node
/**
 * Migrasi database relasional — PRD CHDEV AI ADMIN & CONTENT AGENT (Section 13).
 *
 * Membuat seluruh tabel relasional (articles, article_ideas, article_revisions,
 * activity_logs, roles, permissions, role_permissions, admin_users,
 * telegram_identities, media_assets, agent_runs) beserta index.
 *
 * Aman dijalankan berulang (idempotent, pakai CREATE TABLE IF NOT EXISTS) dan
 * tidak menghapus/mengubah tabel lama yang sudah ada.
 *
 * Usage:
 *   TURSO_DATABASE_URL=libsql://... TURSO_AUTH_TOKEN=... node scripts/migrate.mjs
 */
import { createClient } from '@libsql/client'
import { DDL } from './lib/ddl.mjs'

async function main() {
  const url = process.env.TURSO_DATABASE_URL
  const authToken = process.env.TURSO_AUTH_TOKEN
  if (!url) {
    console.error('TURSO_DATABASE_URL harus diatur')
    process.exit(1)
  }

  const client = createClient({ url, authToken: authToken || undefined })
  console.log('Menjalankan migrasi relasional PRD (Section 13)...')
  await client.executeMultiple(DDL)
  console.log('Migrasi selesai. Seluruh tabel relasional tersedia.')
  client.close?.()
}

main().catch((e) => {
  console.error('Gagal migrasi:', e)
  process.exit(1)
})
