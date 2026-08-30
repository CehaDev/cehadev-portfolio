import { mkdir, writeFile, readFile, stat, unlink } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import path from 'node:path'
import { put as blobPut, del as blobDel, head as blobHead, get as blobGet } from '@vercel/blob'

/**
 * Storage abstraction — media harus lewat storage terkontrol (PRD Section 8).
 *
 * Produser dipilih otomatis saat runtime:
 *  - Vercel Blob dipakai bila BLOB_READ_WRITE_TOKEN tersedia (produksi di
 *    Vercel) — persisten + CDN, tidak bergantung pada filesystem ephemeral.
 *  - LocalProvider (filesystem `.data/media`) menjadi fallback untuk dev/test
 *    dan lingkungan tanpa layanan blob.
 *
 * Untuk memaksa provider tertentu (mis. saat test), pakai setStorageProvider().
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

// ---------------------------------------------------------------------------
// Local filesystem provider (dev/test)
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Vercel Blob provider (produksi serverless)
// ---------------------------------------------------------------------------

export class VercelBlobStorageProvider implements StorageProvider {
  constructor(private token: string) {}

  async put(data: Buffer, key: string, mimeType: string): Promise<StoredFile> {
    const res = await blobPut(key, data, {
      access: 'public',
      contentType: mimeType,
      addRandomSuffix: false,
      token: this.token
    })
    return {
      key: res.pathname.replace(/^\//, ''),
      url: res.url,
      bytes: data,
      mimeType,
      size: data.length
    }
  }

  async get(key: string): Promise<StoredFile | null> {
    const safe = safeKey(key)
    try {
      const meta = await blobHead(safe, { token: this.token })
      const res = await blobGet(meta.url, { access: 'public', token: this.token })
      if (!res || !res.stream) return null
      const arrayBuf = await new Response(res.stream).arrayBuffer()
      return { key: safe, url: meta.url, bytes: Buffer.from(arrayBuf), mimeType: res.blob.contentType ?? '', size: arrayBuf.byteLength }
    } catch {
      return null
    }
  }

  async delete(key: string): Promise<boolean> {
    const safe = safeKey(key)
    try {
      await blobDel(safe, { token: this.token })
      return true
    } catch {
      return false
    }
  }
}

// ---------------------------------------------------------------------------
// Provider selection
// ---------------------------------------------------------------------------

export function defaultStorageProvider(): StorageProvider {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (token) return new VercelBlobStorageProvider(token)
  return new LocalStorageProvider()
}

const provider: { current: StorageProvider | null } = { current: null }

/** Pasang provider kustom (mis. stub untuk test). */
export function setStorageProvider(p: StorageProvider | null) {
  provider.current = p
}

export function storage(): StorageProvider {
  if (!provider.current) provider.current = defaultStorageProvider()
  return provider.current
}

/** Membuat storage key deterministik dari konten + ekstensi. */
export function makeStorageKey(data: Buffer, ext: string): string {
  return `${sha256(data)}.${ext.replace(/^\./, '')}`
}