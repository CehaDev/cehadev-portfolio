import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { createError } from 'h3'
import { db, ensureSchema, kvGet, kvSet, isUsingTurso } from './db'

export interface ChatMessage {
  id: string
  role: 'visitor' | 'admin'
  text: string
  at: string
}

export interface Conversation {
  id: string
  visitor: { name: string; email: string }
  createdAt: string
  updatedAt: string
  status: 'open' | 'resolved'
  unread: number
  messages: ChatMessage[]
}

// ---- Local file fallback ----

const chatFile = path.resolve(process.cwd(), '.data/chat.json')

interface LocalChatStore {
  enabled: boolean
  conversations: Conversation[]
}

async function readLocalChat(): Promise<LocalChatStore> {
  try {
    const parsed = JSON.parse(await readFile(chatFile, 'utf-8'))
    return {
      enabled: parsed.enabled !== false,
      conversations: Array.isArray(parsed.conversations) ? parsed.conversations : []
    }
  } catch {
    return { enabled: true, conversations: [] }
  }
}

async function writeLocalChat(store: LocalChatStore) {
  await mkdir(path.dirname(chatFile), { recursive: true })
  await writeFile(chatFile, JSON.stringify(store, null, 2) + '\n', 'utf-8')
}

function nowIso() {
  return new Date().toISOString()
}

// ---- Config ----

export async function getChatConfig() {
  if (isUsingTurso()) {
    await ensureSchema()
    const raw = await kvGet('chat_enabled')
    return { enabled: raw !== 'false' }
  }
  const store = await readLocalChat()
  return { enabled: store.enabled }
}

export async function setChatEnabled(enabled: boolean) {
  if (isUsingTurso()) {
    await ensureSchema()
    await kvSet('chat_enabled', String(enabled))
    return { enabled }
  }
  const store = await readLocalChat()
  store.enabled = enabled
  await writeLocalChat(store)
  return { enabled }
}

// ---- Conversations ----

export async function listConversations() {
  if (isUsingTurso()) {
    await ensureSchema()
    const result = await db().execute(`
      SELECT
        c.id, c.visitor_name, c.visitor_email, c.created_at, c.updated_at, c.status, c.unread,
        (SELECT COUNT(*) FROM chat_messages m WHERE m.conversation_id = c.id) AS message_count,
        (SELECT json_object('id', m.id, 'role', m.role, 'text', m.text, 'at', m.at)
         FROM chat_messages m WHERE m.conversation_id = c.id ORDER BY m.at DESC LIMIT 1) AS last_message
      FROM chat_conversations c ORDER BY c.updated_at DESC
    `)
    return result.rows.map((row) => ({
      id: row.id as string,
      visitor: { name: row.visitor_name as string, email: row.visitor_email as string },
      status: row.status as 'open' | 'resolved',
      unread: row.unread as number,
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
      messageCount: row.message_count as number,
      lastMessage: row.last_message ? JSON.parse(row.last_message as string) as ChatMessage : null
    }))
  }

  const store = await readLocalChat()
  return store.conversations
    .map((c) => ({
      id: c.id,
      visitor: c.visitor,
      status: c.status,
      unread: c.unread,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      messageCount: c.messages.length,
      lastMessage: c.messages[c.messages.length - 1] ?? null
    }))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

export async function findConversation(id: string): Promise<Conversation | null> {
  if (isUsingTurso()) {
    await ensureSchema()
    const convResult = await db().execute({ sql: 'SELECT * FROM chat_conversations WHERE id = ?', args: [id] })
    const row = convResult.rows[0]
    if (!row) return null
    const msgResult = await db().execute({
      sql: 'SELECT * FROM chat_messages WHERE conversation_id = ? ORDER BY at ASC',
      args: [id]
    })
    return {
      id: row.id as string,
      visitor: { name: row.visitor_name as string, email: row.visitor_email as string },
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
      status: row.status as 'open' | 'resolved',
      unread: row.unread as number,
      messages: msgResult.rows.map((m) => ({
        id: m.id as string, role: m.role as 'visitor' | 'admin', text: m.text as string, at: m.at as string
      }))
    }
  }

  const store = await readLocalChat()
  return store.conversations.find((c) => c.id === id) ?? null
}

export async function getConversation(id: string) {
  const conv = await findConversation(id)
  if (!conv) throw createError({ statusCode: 404, statusMessage: 'Percakapan tidak ditemukan' })
  return conv
}

export async function addVisitorMessage(input: { conversationId?: string; name: string; email: string; text: string }) {
  const text = input.text.trim().slice(0, 2000)
  if (!text) throw createError({ statusCode: 400, statusMessage: 'Pesan wajib diisi' })

  if (isUsingTurso()) {
    await ensureSchema()
    const now = nowIso()
    let convId = input.conversationId ?? null
    if (convId) {
      const existing = await db().execute({ sql: 'SELECT id FROM chat_conversations WHERE id = ?', args: [convId] })
      if (!existing.rows[0]) convId = null
    }
    if (!convId) {
      convId = randomUUID()
      await db().execute({
        sql: 'INSERT INTO chat_conversations (id, visitor_name, visitor_email, created_at, updated_at, status, unread) VALUES (?, ?, ?, ?, ?, ?, ?)',
        args: [convId, input.name.trim().slice(0, 80), input.email.trim().slice(0, 120), now, now, 'open', 0]
      })
    }
    const messageId = randomUUID()
    await db().execute({
      sql: 'INSERT INTO chat_messages (id, conversation_id, role, text, at) VALUES (?, ?, ?, ?, ?)',
      args: [messageId, convId, 'visitor', text, now]
    })
    await db().execute({
      sql: `UPDATE chat_conversations SET updated_at = ?, unread = unread + 1, status = CASE WHEN status = 'resolved' THEN 'open' ELSE status END WHERE id = ?`,
      args: [now, convId]
    })
    return { id: convId, message: { id: messageId, role: 'visitor' as const, text, at: now } }
  }

  // Local fallback
  const store = await readLocalChat()
  let conv = input.conversationId ? (store.conversations.find((c) => c.id === input.conversationId) ?? null) : null
  if (!conv) {
    conv = {
      id: randomUUID(),
      visitor: { name: input.name.trim().slice(0, 80), email: input.email.trim().slice(0, 120) },
      createdAt: nowIso(), updatedAt: nowIso(), status: 'open', unread: 0, messages: []
    }
    store.conversations.push(conv)
  }
  const message: ChatMessage = { id: randomUUID(), role: 'visitor', text, at: nowIso() }
  conv.messages.push(message)
  conv.updatedAt = message.at
  conv.unread = (conv.unread ?? 0) + 1
  if (conv.status === 'resolved') conv.status = 'open'
  await writeLocalChat(store)
  return { id: conv.id, message }
}

export async function addAdminReply(id: string, text: string) {
  const clean = text.trim().slice(0, 2000)
  if (!clean) throw createError({ statusCode: 400, statusMessage: 'Balasan tidak boleh kosong' })

  if (isUsingTurso()) {
    await ensureSchema()
    const conv = await db().execute({ sql: 'SELECT id FROM chat_conversations WHERE id = ?', args: [id] })
    if (!conv.rows[0]) throw createError({ statusCode: 404, statusMessage: 'Percakapan tidak ditemukan' })
    const now = nowIso()
    const messageId = randomUUID()
    await db().execute({
      sql: 'INSERT INTO chat_messages (id, conversation_id, role, text, at) VALUES (?, ?, ?, ?, ?)',
      args: [messageId, id, 'admin', clean, now]
    })
    await db().execute({ sql: 'UPDATE chat_conversations SET updated_at = ?, unread = 0 WHERE id = ?', args: [now, id] })
    return { message: { id: messageId, role: 'admin' as const, text: clean, at: now } }
  }

  const store = await readLocalChat()
  const conv = store.conversations.find((c) => c.id === id)
  if (!conv) throw createError({ statusCode: 404, statusMessage: 'Percakapan tidak ditemukan' })
  const message: ChatMessage = { id: randomUUID(), role: 'admin', text: clean, at: nowIso() }
  conv.messages.push(message)
  conv.updatedAt = message.at
  conv.unread = 0
  await writeLocalChat(store)
  return { message }
}

export async function markConversationRead(id: string) {
  if (isUsingTurso()) {
    await ensureSchema()
    await db().execute({ sql: 'UPDATE chat_conversations SET unread = 0 WHERE id = ?', args: [id] })
    return { ok: true }
  }
  const store = await readLocalChat()
  const conv = store.conversations.find((c) => c.id === id)
  if (conv) conv.unread = 0
  await writeLocalChat(store)
  return { ok: true }
}

export async function setConversationStatus(id: string, status: 'open' | 'resolved') {
  if (isUsingTurso()) {
    await ensureSchema()
    const result = await db().execute({ sql: 'UPDATE chat_conversations SET status = ? WHERE id = ?', args: [status, id] })
    if (result.rowsAffected === 0) throw createError({ statusCode: 404, statusMessage: 'Percakapan tidak ditemukan' })
    return { status }
  }
  const store = await readLocalChat()
  const conv = store.conversations.find((c) => c.id === id)
  if (!conv) throw createError({ statusCode: 404, statusMessage: 'Percakapan tidak ditemukan' })
  conv.status = status
  await writeLocalChat(store)
  return { status: conv.status }
}

export async function deleteConversation(id: string) {
  if (isUsingTurso()) {
    await ensureSchema()
    await db().execute({ sql: 'DELETE FROM chat_messages WHERE conversation_id = ?', args: [id] })
    const result = await db().execute({ sql: 'DELETE FROM chat_conversations WHERE id = ?', args: [id] })
    if (result.rowsAffected === 0) throw createError({ statusCode: 404, statusMessage: 'Percakapan tidak ditemukan' })
    return { ok: true }
  }
  const store = await readLocalChat()
  const idx = store.conversations.findIndex((c) => c.id === id)
  if (idx === -1) throw createError({ statusCode: 404, statusMessage: 'Percakapan tidak ditemukan' })
  store.conversations.splice(idx, 1)
  await writeLocalChat(store)
  return { ok: true }
}

export async function countUnreadConversations() {
  if (isUsingTurso()) {
    await ensureSchema()
    const result = await db().execute('SELECT COUNT(*) AS cnt FROM chat_conversations WHERE unread > 0')
    return (result.rows[0]?.cnt as number) ?? 0
  }
  const store = await readLocalChat()
  return store.conversations.reduce((n, c) => n + (c.unread > 0 ? 1 : 0), 0)
}
