#!/usr/bin/env node
/**
 * Helper CLI: menghapus artikel.
 *
 *   node scripts/article-delete.mjs --slug <slug>
 *
 * Output { ok: true } bila berhasil; exit 1 bila tidak ditemukan.
 */

import { deleteArticle } from './lib/article-store.mjs'

function parseArgs(argv) {
  const out = {}
  for (let i = 0; i < argv.length; i += 2) {
    if (argv[i].startsWith('--')) out[argv[i].slice(2)] = argv[i + 1]
  }
  return out
}

async function main() {
  const { slug } = parseArgs(process.argv.slice(2))
  if (!slug) {
    console.error('Gunakan: node scripts/article-delete.mjs --slug <slug>')
    process.exit(2)
  }
  const ok = await deleteArticle(slug.trim())
  if (!ok) {
    console.error('Artikel tidak ditemukan: ' + slug)
    process.exit(1)
  }
  console.log(JSON.stringify({ ok: true, slug: slug.trim() }, null, 2))
}

main().catch((e) => {
  console.error('Error:', e.message)
  process.exit(1)
})
