#!/usr/bin/env node
/**
 * Helper CLI: lihat artikel lengkap (untuk review/preview sebelum publish).
 *
 *   node scripts/article-get.mjs --slug <slug>
 *
 * Output JSON berisi seluruh isi dua bahasa. Agent AI membaca isi penuh ini
 * untuk ditampilkan/diringkas ke pengguna di Telegram.
 */

import { getArticle } from './lib/article-store.mjs'

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
    console.error('Gunakan: node scripts/article-get.mjs --slug <slug>')
    process.exit(2)
  }
  const article = await getArticle(slug.trim())
  if (!article) {
    console.error('Artikel tidak ditemukan: ' + slug)
    process.exit(1)
  }
  console.log(JSON.stringify(article, null, 2))
}

main().catch((e) => {
  console.error('Error:', e.message)
  process.exit(1)
})
