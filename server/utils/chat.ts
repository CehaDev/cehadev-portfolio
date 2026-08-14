import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { createError } from 'h3'

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

interface ChatStore {
  enabled: boolean
  conversations: Conversation[]
}

const chatFile = path.resolve(process.cwd(), '.data/chat.json')

let queue: Promise<unknown> = Promise.resolve()

function mutate<T>(fn: (store: ChatStore) => T | Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    const store = await readStore()
    const result = await fn(store)
    await writeStore(store)
    return result
  })
  queue = run.then(
    () => {},
    () => {}
  )
  return run
}

async function readStore(): Promise<ChatStore> {
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

async function writeStore(store: ChatStore) {
  await mkdir(path.dirname(chatFile), { recursive: true })
  await writeFile(chatFile, JSON.stringify(store, null, 2) + '\n', 'utf-8')
}

function nowIso() {
  return new Date().toISOString()
}

export async function getChatConfig() {
  const store = await readStore()
  return { enabled: store.enabled }
}

export async function setChatEnabled(enabled: boolean) {
  return mutate(async (store) => {
    store.enabled = enabled
    return { enabled }
  })
}

export async function listConversations() {
  const store = await readStore()
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

export async function findConversation(id: string) {
  const store = await readStore()
  return store.conversations.find((c) => c.id === id) ?? null
}

export async function getConversation(id: string) {
  const conv = await findConversation(id)
  if (!conv) {
    throw createError({ statusCode: 404, statusMessage: 'Percakapan tidak ditemukan' })
  }
  return conv
}

export async function addVisitorMessage(input: { conversationId?: string; name: string; email: string; text: string }) {
  return mutate(async (store) => {
    const text = input.text.trim().slice(0, 2000)
    if (!text) throw createError({ statusCode: 400, statusMessage: 'Pesan wajib diisi' })

    let conv = input.conversationId ? (store.conversations.find((c) => c.id === input.conversationId) ?? null) : null

    if (!conv) {
      conv = {
        id: randomUUID(),
        visitor: { name: input.name.trim().slice(0, 80), email: input.email.trim().slice(0, 120) },
        createdAt: nowIso(),
        updatedAt: nowIso(),
        status: 'open',
        unread: 0,
        messages: []
      }
      store.conversations.push(conv)
    }

    const message: ChatMessage = { id: randomUUID(), role: 'visitor', text, at: nowIso() }
    conv.messages.push(message)
    conv.updatedAt = message.at
    conv.unread = (conv.unread ?? 0) + 1
    if (conv.status === 'resolved') conv.status = 'open'

    return { id: conv.id, message }
  })
}

export async function addAdminReply(id: string, text: string) {
  return mutate(async (store) => {
    const conv = store.conversations.find((c) => c.id === id)
    if (!conv) throw createError({ statusCode: 404, statusMessage: 'Percakapan tidak ditemukan' })
    const clean = text.trim().slice(0, 2000)
    if (!clean) throw createError({ statusCode: 400, statusMessage: 'Balasan tidak boleh kosong' })

    const message: ChatMessage = { id: randomUUID(), role: 'admin', text: clean, at: nowIso() }
    conv.messages.push(message)
    conv.updatedAt = message.at
    conv.unread = 0
    return { message }
  })
}

export async function markConversationRead(id: string) {
  return mutate(async (store) => {
    const conv = store.conversations.find((c) => c.id === id)
    if (conv) conv.unread = 0
    return { ok: true }
  })
}

export async function setConversationStatus(id: string, status: 'open' | 'resolved') {
  return mutate(async (store) => {
    const conv = store.conversations.find((c) => c.id === id)
    if (!conv) throw createError({ statusCode: 404, statusMessage: 'Percakapan tidak ditemukan' })
    conv.status = status
    return { status: conv.status }
  })
}

export async function deleteConversation(id: string) {
  return mutate(async (store) => {
    const idx = store.conversations.findIndex((c) => c.id === id)
    if (idx === -1) throw createError({ statusCode: 404, statusMessage: 'Percakapan tidak ditemukan' })
    store.conversations.splice(idx, 1)
    return { ok: true }
  })
}

export async function countUnreadConversations() {
  const store = await readStore()
  return store.conversations.reduce((n, c) => n + (c.unread > 0 ? 1 : 0), 0)
}
