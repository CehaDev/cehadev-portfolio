import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { createError } from 'h3'

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  at: string
}

interface MessageStore {
  messages: ContactMessage[]
}

const messagesFile = path.resolve(process.cwd(), '.data/messages.json')

let queue: Promise<unknown> = Promise.resolve()

function mutate<T>(fn: (store: MessageStore) => T | Promise<T>): Promise<T> {
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

async function readStore(): Promise<MessageStore> {
  try {
    const parsed = JSON.parse(await readFile(messagesFile, 'utf-8'))
    return { messages: Array.isArray(parsed.messages) ? parsed.messages : [] }
  } catch {
    return { messages: [] }
  }
}

async function writeStore(store: MessageStore) {
  await mkdir(path.dirname(messagesFile), { recursive: true })
  await writeFile(messagesFile, JSON.stringify(store, null, 2) + '\n', 'utf-8')
}

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

  return mutate(async (store) => {
    const item: ContactMessage = { id: randomUUID(), name, email, subject, message, read: false, at: new Date().toISOString() }
    store.messages.push(item)
    return { id: item.id, at: item.at }
  })
}

export async function listMessages() {
  const store = await readStore()
  return store.messages
    .map((m) => ({
      id: m.id,
      name: m.name,
      email: m.email,
      subject: m.subject,
      message: m.message,
      read: m.read,
      at: m.at
    }))
    .sort((a, b) => b.at.localeCompare(a.at))
}

export async function getMessage(id: string) {
  const store = await readStore()
  const msg = store.messages.find((m) => m.id === id)
  if (!msg) throw createError({ statusCode: 404, statusMessage: 'Pesan tidak ditemukan' })
  return msg
}

export async function markMessageRead(id: string) {
  return mutate(async (store) => {
    const msg = store.messages.find((m) => m.id === id)
    if (!msg) throw createError({ statusCode: 404, statusMessage: 'Pesan tidak ditemukan' })
    msg.read = true
    return { ok: true }
  })
}

export async function deleteMessage(id: string) {
  return mutate(async (store) => {
    const idx = store.messages.findIndex((m) => m.id === id)
    if (idx === -1) throw createError({ statusCode: 404, statusMessage: 'Pesan tidak ditemukan' })
    store.messages.splice(idx, 1)
    return { ok: true }
  })
}

export async function countUnreadMessages() {
  const store = await readStore()
  return store.messages.filter((m) => !m.read).length
}
