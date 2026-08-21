import { createError } from 'h3'
import helloWorld from '../../content/articles/hello-world.json'
import { normalizeLS } from './ls'
import { kvGetJson, kvSetJson } from './db'

const ARTICLES_KEY = 'content_articles'

const bundledArticles: Record<string, unknown>[] = [helloWorld]

function isValidSlug(slug: string) {
  return /^[a-z0-9][a-z0-9-]*$/.test(slug)
}

export async function listArticleFiles() {
  let articles = await kvGetJson<Array<{ slug?: string }>>(ARTICLES_KEY, [])
  if (!articles.length) {
    articles = bundledArticles
  }
  return articles
    .map((a) => a.slug)
    .filter((s): s is string => typeof s === 'string')
    .sort((a, b) => b.localeCompare(a))
}

export async function readArticleFile(slug: string) {
  if (!isValidSlug(slug)) throw createError({ statusCode: 400, statusMessage: 'Slug tidak valid' })

  let articles = await kvGetJson<Array<Record<string, unknown>>>(ARTICLES_KEY, [])
  if (!articles.length) articles = bundledArticles

  const article = articles.find((a) => a.slug === slug)
  if (!article) throw createError({ statusCode: 404, statusMessage: 'Artikel tidak ditemukan' })
  return article
}

export async function writeArticleFile(slug: string, data: unknown) {
  if (!isValidSlug(slug)) throw createError({ statusCode: 400, statusMessage: 'Slug tidak valid' })
  const articles = await kvGetJson<Array<Record<string, unknown>>>(ARTICLES_KEY, [])
  const idx = articles.findIndex((a) => a.slug === slug)
  if (idx >= 0) articles[idx] = data as Record<string, unknown>
  else articles.push(data as Record<string, unknown>)
  await kvSetJson(ARTICLES_KEY, articles)
}

export async function deleteArticleFile(slug: string) {
  if (!isValidSlug(slug)) throw createError({ statusCode: 400, statusMessage: 'Slug tidak valid' })
  const articles = await kvGetJson<Array<Record<string, unknown>>>(ARTICLES_KEY, [])
  const idx = articles.findIndex((a) => a.slug === slug)
  if (idx < 0) throw createError({ statusCode: 404, statusMessage: 'Artikel tidak ditemukan' })
  articles.splice(idx, 1)
  await kvSetJson(ARTICLES_KEY, articles)
}

export function readingMinutes(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

export function normalizeArticle(body: Record<string, unknown>) {
  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
  const arr = (v: unknown) =>
    Array.isArray(v)
      ? v.map((x) => String(x).trim()).filter(Boolean).slice(0, 8)
      : []

  const dateStr = str(body.datePublished)
  const date = dateStr && !Number.isNaN(Date.parse(dateStr)) ? dateStr : new Date().toISOString().slice(0, 10)

  return {
    slug: str(body.slug).toLowerCase(),
    title: normalizeLS(body.title),
    excerpt: normalizeLS(body.excerpt),
    category: normalizeLS(body.category),
    tags: arr(body.tags),
    cover: str(body.cover),
    status: body.status === 'draft' ? 'draft' : 'published',
    datePublished: date,
    seoTitle: normalizeLS(body.seoTitle),
    seoDescription: normalizeLS(body.seoDescription),
    content: normalizeLS(body.content)
  }
}
