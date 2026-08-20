import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { createError } from 'h3'
import { db, ensureSchema, isUsingTurso } from './db'
import { getMailConfig, sendMail, mailConfigured } from './mailer'

export interface MessageReply {
  id: string
  text: string
  at: string
  status: 'sent' | 'failed'
  error: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  at: string
  replies: MessageReply[]
}

// ---- Local file fallback ----

const messagesFile = path.resolve(process.cwd(), '.data/messages.json')

async function readLocalMessages(): Promise<ContactMessage[]> {
  try {
    const parsed = JSON.parse(await readFile(messagesFile, 'utf-8'))
    return Array.isArray(parsed.messages) ? parsed.messages : []
  } catch {
    return []
  }
}

async function writeLocalMessages(messages: ContactMessage[]) {
  await mkdir(path.dirname(messagesFile), { recursive: true })
  await writeFile(messagesFile, JSON.stringify({ messages }, null, 2) + '\n', 'utf-8')
}

function rowToMessage(row: Record<string, unknown>): ContactMessage {
  return {
    id: row.id as string,
    name: row.name as string,
    email: row.email as string,
    subject: row.subject as string,
    message: row.message as string,
    read: (row.read as number) === 1,
    at: row.at as string,
    replies: (() => {
      try { return JSON.parse((row.replies as string) || '[]') as MessageReply[] } catch { return [] }
    })()
  }
}

// ---- Public API ----

export async function addContactMessage(input: { name: string; email: string; subject: string; message: string }) {
  const name = input.name.trim().slice(0, 80)
  const email = input.email.trim().slice(0, 120)
  const subject = input.subject.trim().slice(0, 160)
  const message = input.message.trim().slice(0, 5000)
  if (!name) throw createError({ statusCode: 400, statusMessage: 'Nama wajib diisi' })
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError({ statusCode: 400, statusMessage: 'Email tidak valid' })
  }
  if (!subject) throw createError({ statusCode: 400, statusMessage: 'Subjek wajib diisi' })
  if (message.length < 10) throw createError({ statusCode: 400, statusMessage: 'Pesan minimal 10 karakter' })

  const id = randomUUID()
  const at = new Date().toISOString()

  if (isUsingTurso()) {
    await ensureSchema()
    await db().execute({
      sql: 'INSERT INTO messages (id, name, email, subject, message, read, at, replies) VALUES (?, ?, ?, ?, ?, 0, ?, ?)',
      args: [id, name, email, subject, message, at, '[]']
    })
  } else {
    const messages = await readLocalMessages()
    messages.push({ id, name, email, subject, message, read: false, at, replies: [] })
    await writeLocalMessages(messages)
  }

  return { id, at }
}

export async function listMessages() {
  if (isUsingTurso()) {
    await ensureSchema()
    const result = await db().execute('SELECT * FROM messages ORDER BY at DESC')
    return result.rows.map(rowToMessage)
  }
  const messages = await readLocalMessages()
  return messages.sort((a, b) => b.at.localeCompare(a.at))
}

export async function getMessage(id: string) {
  if (isUsingTurso()) {
    await ensureSchema()
    const result = await db().execute({ sql: 'SELECT * FROM messages WHERE id = ?', args: [id] })
    const row = result.rows[0]
    if (!row) throw createError({ statusCode: 404, statusMessage: 'Pesan tidak ditemukan' })
    return rowToMessage(row)
  }
  const messages = await readLocalMessages()
  const msg = messages.find((m) => m.id === id)
  if (!msg) throw createError({ statusCode: 404, statusMessage: 'Pesan tidak ditemukan' })
  return msg
}

export async function markMessageRead(id: string) {
  if (isUsingTurso()) {
    await ensureSchema()
    const result = await db().execute({ sql: 'UPDATE messages SET read = 1 WHERE id = ?', args: [id] })
    if (result.rowsAffected === 0) throw createError({ statusCode: 404, statusMessage: 'Pesan tidak ditemukan' })
    return { ok: true }
  }
  const messages = await readLocalMessages()
  const msg = messages.find((m) => m.id === id)
  if (!msg) throw createError({ statusCode: 404, statusMessage: 'Pesan tidak ditemukan' })
  msg.read = true
  await writeLocalMessages(messages)
  return { ok: true }
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export async function addMessageReply(id: string, text: string) {
  const msg = await getMessage(id)
  const clean = text.trim().slice(0, 5000)
  if (!clean) throw createError({ statusCode: 400, statusMessage: 'Balasan tidak boleh kosong' })

  let status: 'sent' | 'failed' = 'failed'
  let error = ''
  try {
    const cfg = await getMailConfig()
    await sendMail({
      to: msg.email,
      bcc: cfg ? cfg.from : undefined,
      subject: `Re: ${msg.subject}`,
      text: clean,
      html: `<p>Halo <strong>${escapeHtml(msg.name)}</strong>,</p>\n<p>${escapeHtml(clean).replace(/\n/g, '<br />')}</p>\n<br />\n<p>Salam,<br />${cfg ? escapeHtml(cfg.fromName) : 'CehaDev'}</p>`
    })
    status = 'sent'
  } catch (e) {
    error = e instanceof Error ? e.message : String(e)
  }

  const reply: MessageReply = { id: randomUUID(), text: clean, at: new Date().toISOString(), status, error }

  if (isUsingTurso()) {
    const replies = [...msg.replies, reply]
    await db().execute({
      sql: 'UPDATE messages SET replies = ?, read = 1 WHERE id = ?',
      args: [JSON.stringify(replies), id]
    })
  } else {
    const messages = await readLocalMessages()
    const m = messages.find((x) => x.id === id)
    if (m) {
      m.replies.push(reply)
      m.read = true
      await writeLocalMessages(messages)
    }
  }

  return { reply }
}

export async function deleteMessage(id: string) {
  if (isUsingTurso()) {
    await ensureSchema()
    const result = await db().execute({ sql: 'DELETE FROM messages WHERE id = ?', args: [id] })
    if (result.rowsAffected === 0) throw createError({ statusCode: 404, statusMessage: 'Pesan tidak ditemukan' })
    return { ok: true }
  }
  const messages = await readLocalMessages()
  const idx = messages.findIndex((m) => m.id === id)
  if (idx === -1) throw createError({ statusCode: 404, statusMessage: 'Pesan tidak ditemukan' })
  messages.splice(idx, 1)
  await writeLocalMessages(messages)
  return { ok: true }
}

export async function countUnreadMessages() {
  if (isUsingTurso()) {
    await ensureSchema()
    const result = await db().execute('SELECT COUNT(*) as count FROM messages WHERE read = 0')
    return Number(result.rows[0]?.count ?? 0)
  }
  const messages = await readLocalMessages()
  return messages.filter((m) => !m.read).length
}

export async function messagesMailConfigured() {
  return mailConfigured()
}
