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
  /** ID komentar induk jika ini adalah balasan ('' = komentar utama) */
  parentId?: string
}

// ---- Local file fallback ----

const commentsFile = path.resolve(process.cwd(), '.data/article-comments.json')

async function readLocalComments(): Promise<ArticleComment[]> {
  try {
    const parsed = JSON.parse(await readFile(commentsFile, 'utf-8'))
    const list = Array.isArray(parsed.comments) ? parsed.comments : []
    // Normalisasi data lama yang belum punya parentId
    return list.map((c: ArticleComment) => ({ ...c, parentId: c.parentId ?? '' }))
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
    at: row.at as string,
    parentId: (row.parent_id as string) ?? ''
  }
}

// ---- Public API ----

export async function addArticleComment(input: { articleSlug: string; name: string; message: string; parentId?: string }) {
  const slug = input.articleSlug.trim()
  const name = input.name.trim().slice(0, 50)
  const message = input.message.trim().slice(0, 1000)
  const parentId = (input.parentId ?? '').trim()
  if (!slug || !/^[a-z0-9][a-z0-9-]*$/.test(slug)) throw createError({ statusCode: 400, statusMessage: 'Artikel tidak valid' })
  if (name.length < 2) throw createError({ statusCode: 400, statusMessage: 'Nama minimal 2 karakter' })
  if (message.length < 3) throw createError({ statusCode: 400, statusMessage: 'Komentar minimal 3 karakter' })

  // Validasi balasan: induk harus ada & berasal dari artikel yang sama
  if (parentId) {
    let valid = false
    if (isUsingTurso()) {
      await ensureSchema()
      const res = await db().execute({
        sql: 'SELECT id FROM article_comments WHERE id = ? AND article_slug = ?',
        args: [parentId, slug]
      })
      valid = res.rows.length > 0
    } else {
      valid = (await readLocalComments()).some((c) => c.id === parentId && c.articleSlug === slug)
    }
    if (!valid) throw createError({ statusCode: 404, statusMessage: 'Komentar yang dibalas tidak ditemukan' })
  }

  const comment: ArticleComment = {
    id: randomUUID(),
    articleSlug: slug,
    name,
    message,
    at: new Date().toISOString(),
    parentId
  }

  if (isUsingTurso()) {
    await ensureSchema()
    await db().execute({
      sql: 'INSERT INTO article_comments (id, article_slug, name, message, at, parent_id) VALUES (?, ?, ?, ?, ?, ?)',
      args: [comment.id, comment.articleSlug, comment.name, comment.message, comment.at, parentId]
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
    const result = await db().execute({ sql: 'SELECT * FROM article_comments' })
    comments = result.rows.map(rowToComment)
  } else {
    comments = await readLocalComments()
  }
  return comments.sort((a, b) => b.at.localeCompare(a.at))
}

export async function deleteArticleComment(id: string) {
  if (isUsingTurso()) {
    await ensureSchema()
    // Hapus komentar beserta semua balasan di bawahnya
    await db().execute({ sql: 'DELETE FROM article_comments WHERE parent_id = ?', args: [id] })
    const result = await db().execute({ sql: 'DELETE FROM article_comments WHERE id = ?', args: [id] })
    if (result.rowsAffected === 0) throw createError({ statusCode: 404, statusMessage: 'Komentar tidak ditemukan' })
    return { ok: true }
  }
  const comments = await readLocalComments()
  const idx = comments.findIndex((c) => c.id === id)
  if (idx === -1) throw createError({ statusCode: 404, statusMessage: 'Komentar tidak ditemukan' })
  const remaining = comments.filter((c) => c.id !== id && c.parentId !== id)
  await writeLocalComments(remaining)
  return { ok: true }
}
