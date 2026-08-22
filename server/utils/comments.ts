import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { createError } from 'h3'
import { db, ensureSchema, isUsingTurso } from './db'

export interface ArticleComment {
  id: string
  articleSlug: string
  name: string
  message: string
  at: string
}

// ---- Local file fallback ----

const commentsFile = path.resolve(process.cwd(), '.data/article-comments.json')

async function readLocalComments(): Promise<ArticleComment[]> {
  try {
    const parsed = JSON.parse(await readFile(commentsFile, 'utf-8'))
    return Array.isArray(parsed.comments) ? parsed.comments : []
  } catch {
    return []
  }
}

async function writeLocalComments(comments: ArticleComment[]) {
  await mkdir(path.dirname(commentsFile), { recursive: true })
  await writeFile(commentsFile, JSON.stringify({ comments }, null, 2) + '\n', 'utf-8')
}

function rowToComment(row: Record<string, unknown>): ArticleComment {
  return {
    id: row.id as string,
    articleSlug: row.article_slug as string,
    name: row.name as string,
    message: row.message as string,
    at: row.at as string
  }
}

// ---- Public API ----

export async function addArticleComment(input: { articleSlug: string; name: string; message: string }) {
  const slug = input.articleSlug.trim()
  const name = input.name.trim().slice(0, 50)
  const message = input.message.trim().slice(0, 1000)
  if (!slug || !/^[a-z0-9][a-z0-9-]*$/.test(slug)) throw createError({ statusCode: 400, statusMessage: 'Artikel tidak valid' })
  if (name.length < 2) throw createError({ statusCode: 400, statusMessage: 'Nama minimal 2 karakter' })
  if (message.length < 3) throw createError({ statusCode: 400, statusMessage: 'Komentar minimal 3 karakter' })

  const comment: ArticleComment = {
    id: randomUUID(),
    articleSlug: slug,
    name,
    message,
    at: new Date().toISOString()
  }

  if (isUsingTurso()) {
    await ensureSchema()
    await db().execute({
      sql: 'INSERT INTO article_comments (id, article_slug, name, message, at) VALUES (?, ?, ?, ?, ?)',
      args: [comment.id, comment.articleSlug, comment.name, comment.message, comment.at]
    })
  } else {
    const comments = await readLocalComments()
    comments.push(comment)
    await writeLocalComments(comments)
  }

  return comment
}

export async function listArticleComments(slug: string) {
  let comments: ArticleComment[]
  if (isUsingTurso()) {
    await ensureSchema()
    const result = await db().execute({
      sql: 'SELECT * FROM article_comments WHERE article_slug = ? ORDER BY at DESC',
      args: [slug]
    })
    comments = result.rows.map(rowToComment)
  } else {
    comments = (await readLocalComments()).filter((c) => c.articleSlug === slug)
  }
  return comments.sort((a, b) => b.at.localeCompare(a.at))
}

export async function listAllComments() {
  let comments: ArticleComment[]
  if (isUsingTurso()) {
    await ensureSchema()
    const result = await db().execute('SELECT * FROM article_comments')
    comments = result.rows.map(rowToComment)
  } else {
    comments = await readLocalComments()
  }
  return comments.sort((a, b) => b.at.localeCompare(a.at))
}

export async function deleteArticleComment(id: string) {
  if (isUsingTurso()) {
    await ensureSchema()
    const result = await db().execute({ sql: 'DELETE FROM article_comments WHERE id = ?', args: [id] })
    if (result.rowsAffected === 0) throw createError({ statusCode: 404, statusMessage: 'Komentar tidak ditemukan' })
    return { ok: true }
  }
  const comments = await readLocalComments()
  const idx = comments.findIndex((c) => c.id === id)
  if (idx === -1) throw createError({ statusCode: 404, statusMessage: 'Komentar tidak ditemukan' })
  comments.splice(idx, 1)
  await writeLocalComments(comments)
  return { ok: true }
}
