import { mkdir, writeFile, readFile, stat, unlink } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import path from 'node:path'

/**
 * Storage abstraction — media harus lewat storage terkontrol (PRD Section 8).
 *
 * Saat ini memakai LocalProvider (filesystem `.data/media`), cocok untuk dev/test
 * dan cukup untuk jangka pendek. Untuk production serverless (Vercel) storage
 * bersifat ephemeral; pertukaran ke Vercel Blob / storage persisten dilakukan
 * pada saat audit deployment (Phase 8) sesuai PRD Section 17.
 */

export interface StoredFile {
  key: string
  url: string
  bytes: Buffer
  mimeType: string
  size: number
}

export interface StorageProvider {
  put(data: Buffer, key: string, mimeType: string): Promise<StoredFile>
  get(key: string): Promise<StoredFile | null>
  delete(key: string): Promise<boolean>
}

function dataDir() {
  return path.resolve(process.cwd(), '.data', 'media')
}

function sha256(data: Buffer): string {
  return createHash('sha256').update(data).digest('hex')
}

function safeKey(key: string): string {
  const name = path.basename(key)
  if (name !== key || name.includes('..') || name.includes('/') || name.includes('\\')) {
    throw new Error('storage key tidak valid')
  }
  return name
}

export class LocalStorageProvider implements StorageProvider {
  async put(data: Buffer, key: string, mimeType: string): Promise<StoredFile> {
    const safe = safeKey(key)
    const dir = dataDir()
    await mkdir(dir, { recursive: true })
    const dest = path.join(dir, safe)
    await writeFile(dest, data)
    let size = data.length
    try {
      size = Math.max(size, (await stat(dest)).size)
    } catch {}
    return {
      key: safe,
      url: `/media/${safe}`,
      bytes: data,
      mimeType,
      size
    }
  }

  async get(key: string): Promise<StoredFile | null> {
    const safe = safeKey(key)
    const dest = path.join(dataDir(), safe)
    try {
      const bytes = await readFile(dest)
      return { key: safe, url: `/media/${safe}`, bytes, mimeType: '', size: bytes.length }
    } catch {
      return null
    }
  }

  async delete(key: string): Promise<boolean> {
    const safe = safeKey(key)
    try {
      await unlink(path.join(dataDir(), safe))
      return true
    } catch {
      return false
    }
  }
}

const provider: { current: StorageProvider | null } = { current: new LocalStorageProvider() }

/** Pasang provider kustom (mis. Vercel Blob saat production). */
export function setStorageProvider(p: StorageProvider | null) {
  provider.current = p ?? new LocalStorageProvider()
}

export function storage(): StorageProvider {
  return provider.current!
}

/** Membuat storage key deterministik dari konten + ekstensi. */
export function makeStorageKey(data: Buffer, ext: string): string {
  return `${sha256(data)}.${ext.replace(/^\./, '')}`
}
