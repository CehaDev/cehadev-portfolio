#!/usr/bin/env node
/**
 * Modul penyimpanan artikel bersama — dipakai oleh helper CLI artikel
 * (article-add/list/get/publish/delete) yang dipanggil OpenClaw via `exec`.
 *
 * Menulis ke KV yang SAMA dengan admin dashboard:
 *   - Turso bila TURSO_DATABASE_URL terisi,
 *   - jika tidak, file .data/kv.json (lokal).
 *
 * Key: "content_articles". Bila KV kosong, muat artikel bawaan dari
 * content/articles/*.json agar daftar publik tetap utuh.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..', '..')
const dataDir = path.resolve(root, '.data')
const kvFile = path.resolve(dataDir, 'kv.json')

export const ARTICLES_KEY = 'content_articles'

let client = null

async function db() {
  if (!client && process.env.TURSO_DATABASE_URL) {
    const { createClient } = await import('@libsql/client')
    client = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN || undefined
    })
    await client.execute(`CREATE TABLE IF NOT EXISTS kv (key TEXT PRIMARY KEY, value TEXT NOT NULL)`)
  }
  return client
}

async function kvGet(key) {
  const c = await db()
  if (c) {
    const r = await c.execute({ sql: 'SELECT value FROM kv WHERE key = ?', args: [key] })
    return r.rows[0]?.value ?? null
  }
  try {
    const store = JSON.parse(await readFile(kvFile, 'utf-8'))
    return store[key] ?? null
  } catch {
    return null
  }
}

async function kvSet(key, value) {
  const c = await db()
  if (c) {
    await c.execute({
      sql: 'INSERT OR REPLACE INTO kv (key, value) VALUES (?, ?)',
      args: [key, value]
    })
    return
  }
  await mkdir(dataDir, { recursive: true })
  let store = {}
  try {
    store = JSON.parse(await readFile(kvFile, 'utf-8'))
  } catch {}
  store[key] = value
  await writeFile(kvFile, JSON.stringify(store, null, 2) + '\n', 'utf-8')
}

async function loadBundledArticles() {
  const { readdir } = await import('node:fs/promises')
  const dir = path.resolve(root, 'content/articles')
  let files = []
  try {
    files = await readdir(dir)
  } catch {
    return []
  }
  const out = []
  for (const f of files) {
    if (!f.endsWith('.json')) continue
    try {
      out.push(JSON.parse(await readFile(path.join(dir, f), 'utf-8')))
    } catch {}
  }
  return out
}

export async function listArticles() {
  const raw = await kvGet(ARTICLES_KEY)
  if (raw) {
    try {
      return JSON.parse(raw)
    } catch {}
  }
  return loadBundledArticles()
}

export async function saveArticles(articles) {
  await kvSet(ARTICLES_KEY, JSON.stringify(articles))
}

export function slugify(text) {
  return String(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

const ls = (id, en) => ({ id: String(id || '').trim(), en: String(en || '').trim() })
const str = (v) => String(v == null ? '' : v)

export function buildArticle(g) {
  const slugRaw =
    g.slug ||
    g.title_en ||
    g.title_id ||
    (g.title && (g.title.en || g.title.id)) ||
    'artikel'
  return {
    slug: slugify(slugRaw),
    title: ls(g.title_id ?? g.title?.id, g.title_en ?? g.title?.en),
    excerpt: ls(g.excerpt_id ?? g.excerpt?.id, g.excerpt_en ?? g.excerpt?.en),
    category: ls(
      g.category_id ?? g.category?.id ?? 'Catatan',
      g.category_en ?? g.category?.en ?? 'Notes'
    ),
    tags: Array.isArray(g.tags) ? g.tags.map(str).map((s) => s.trim()).filter(Boolean).slice(0, 8) : [],
    cover: str(g.cover),
    status: 'draft',
    datePublished: new Date().toISOString().slice(0, 10),
    seoTitle: ls(g.seo_title_id ?? g.seoTitle?.id, g.seo_title_en ?? g.seoTitle?.en),
    seoDescription: ls(
      g.seo_description_id ?? g.seoDescription?.id,
      g.seo_description_en ?? g.seoDescription?.en
    ),
    content: ls(g.content_id ?? g.content?.id, g.content_en ?? g.content?.en)
  }
}

export function makeSlugUnique(slug, articles) {
  let finalSlug = slug
  let n = 2
  while (articles.some((a) => a?.slug === finalSlug)) {
    finalSlug = `${slug}-${n++}`
  }
  return finalSlug
}

export async function addArticle(input) {
  const article = buildArticle(input)
  if (!article.title.id && !article.title.en) {
    const err = new Error('Judul (title_id atau title_en) wajib diisi.')
    err.exitCode = 3
    throw err
  }
  if (!article.slug || !/^[a-z0-9][a-z0-9-]*$/.test(article.slug)) {
    const err = new Error('Slug tidak valid: ' + article.slug)
    err.exitCode = 3
    throw err
  }

  const articles = await listArticles()
  article.slug = makeSlugUnique(article.slug, articles)
  articles.push(article)
  await saveArticles(articles)
  return article
}

export async function getArticle(slug) {
  const articles = await listArticles()
  return articles.find((a) => a?.slug === slug) ?? null
}

export async function publishArticle(slug) {
  const articles = await listArticles()
  const idx = articles.findIndex((a) => a?.slug === slug)
  if (idx < 0) return null
  articles[idx].status = 'published'
  await saveArticles(articles)
  return articles[idx]
}

export async function deleteArticle(slug) {
  const articles = await listArticles()
  const idx = articles.findIndex((a) => a?.slug === slug)
  if (idx < 0) return false
  articles.splice(idx, 1)
  await saveArticles(articles)
  return true
}

export const summary = (a) => ({
  slug: a?.slug,
  status: a?.status,
  titleId: a?.title?.id,
  titleEn: a?.title?.en,
  categoryId: a?.category?.id,
  tags: a?.tags,
  datePublished: a?.datePublished,
  wordCountId: a?.content?.id?.trim().split(/\s+/).filter(Boolean).length || 0,
  wordCountEn: a?.content?.en?.trim().split(/\s+/).filter(Boolean).length || 0
})
