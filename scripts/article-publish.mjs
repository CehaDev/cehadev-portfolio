#!/usr/bin/env node
/**
 * Helper CLI: menerbitkan artikel (draft -> published).
 *
 * Hanya dipanggil SETELAH pengguna mengonfirmasi di Telegram
 * (mis. perintah /terbitkan <slug>). Tidak ada auto-publish.
 *
 *   node scripts/article-publish.mjs --slug <slug>
 *
 * Output JSON berisi status terbaru. Kembali exit 1 bila belum ada.
 */

import { publishArticle, summary } from './lib/article-store.mjs'

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
    console.error('Gunakan: node scripts/article-publish.mjs --slug <slug>')
    process.exit(2)
  }
  const article = await publishArticle(slug.trim())
  if (!article) {
    console.error('Artikel tidak ditemukan: ' + slug)
    process.exit(1)
  }
  console.log(JSON.stringify({ ok: true, ...summary(article) }, null, 2))
}

main().catch((e) => {
  console.error('Error:', e.message)
  process.exit(1)
})
