#!/usr/bin/env node
/**
 * Helper CLI: daftar artikel (draft & published).
 *
 *   node scripts/article-list.mjs --status draft
 *   node scripts/article-list.mjs            # semua
 */

import { listArticles, summary } from './lib/article-store.mjs'

function parseArgs(argv) {
  const out = {}
  for (let i = 0; i < argv.length; i += 2) {
    if (argv[i].startsWith('--')) out[argv[i].slice(2)] = argv[i + 1]
  }
  return out
}

async function main() {
  const { status } = parseArgs(process.argv.slice(2))
  let articles = await listArticles()
  if (status) {
    const s = String(status).trim()
    articles = articles.filter((a) => a.status === s)
  }
  console.log(JSON.stringify({ count: articles.length, articles: articles.map(summary) }, null, 2))
}

main().catch((e) => {
  console.error('Error:', e.message)
  process.exit(1)
})
