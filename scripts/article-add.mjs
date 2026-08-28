#!/usr/bin/env node
/**
 * Helper CLI: menambah artikel baru sebagai DRAFT.
 *
 * Dipanggil oleh OpenClaw skill `article-creator` via exec:
 *
 *   node scripts/article-add.mjs \
 *     --json '{"title_id": "...", "title_en": "...", "excerpt_id": "...",
 *              "excerpt_en": "...", "category_id": "...", "category_en": "...",
 *              "tags": ["a","b"], "content_id": "...", "content_en": "...",
 *              "seo_title_id": "", "seo_title_en": "",
 *              "seo_description_id": "", "seo_description_en": ""}'
 *
 * Artikel TIDAK pernah auto-publish; selalu status "draft".
 */

import { addArticle, summary } from './lib/article-store.mjs'

function parseArgs(argv) {
  const out = {}
  for (let i = 0; i < argv.length; i += 2) {
    if (argv[i] === '--json' && argv[i + 1]) {
      try {
        out.json = JSON.parse(argv[i + 1])
      } catch (e) {
        throw new Error('argumen --json bukan JSON valid: ' + e.message)
      }
    } else if (argv[i].startsWith('--')) {
      out[argv[i].slice(2)] = argv[i + 1]
    }
  }
  return out
}

async function main() {
  const { json } = parseArgs(process.argv.slice(2))
  if (!json || json === true) {
    console.error(
      'Gunakan: node scripts/article-add.mjs --json \'{"title_id": "...", "content_id": "..."}\''
    )
    process.exit(2)
  }
  const article = await addArticle(json)
  console.log(JSON.stringify({ ok: true, ...summary(article) }, null, 2))
}

main().catch((e) => {
  console.error('Error:', e.message)
  process.exit(e.exitCode || 1)
})
