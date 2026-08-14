import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { getCookie, setCookie, deleteCookie } from 'h3'
import { signToken } from './session'

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

function toBase32(buf: Buffer): string {
  let bits = 0
  let value = 0
  let out = ''
  for (const byte of buf) {
    value = (value << 8) | byte
    bits += 8
    while (bits >= 5) {
      out += BASE32_ALPHABET[(value >>> (bits - 5)) & 31]
      bits -= 5
    }
  }
  if (bits > 0) out += BASE32_ALPHABET[(value << (5 - bits)) & 31]
  return out
}

function fromBase32(input: string): Buffer {
  const clean = input.toUpperCase().replace(/[^A-Z2-7]/g, '')
  let bits = 0
  let value = 0
  const bytes: number[] = []
  for (const char of clean) {
    value = (value << 5) | BASE32_ALPHABET.indexOf(char)
    bits += 5
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 0xff)
      bits -= 8
    }
  }
  return Buffer.from(bytes)
}

function hotp(secret: Buffer, counter: number): string {
  const msg = Buffer.alloc(8)
  msg.writeBigUInt64BE(BigInt(counter))
  const digest = createHmac('sha1', secret).update(msg).digest()
  const offset = digest[digest.length - 1] & 0x0f
  const binary =
    ((digest[offset] & 0x7f) << 24) |
    (digest[offset + 1] << 16) |
    (digest[offset + 2] << 8) |
    digest[offset + 3]
  return String(binary % 1000000).padStart(6, '0')
}

export function generateSecret(): string {
  return toBase32(randomBytes(20))
}

export function totpAt(secretBase32: string, counter: number): string {
  return hotp(fromBase32(secretBase32), counter)
}

export function verifyTotp(secretBase32: string, code: string, windowSteps = 1): boolean {
  if (!/^\d{6}$/.test(code)) return false
  const now = Math.floor(Date.now() / 30000)
  for (let i = -windowSteps; i <= windowSteps; i++) {
    if (totpAt(secretBase32, now + i) === code) return true
  }
  return false
}

// ---- Penyimpanan konfigurasi (.data/totp.json) ----

interface TotpStore {
  secret?: string
  enabled?: boolean
  verifiedAt?: string
}

const totpFile = path.resolve(process.cwd(), '.data/totp.json')

async function readStore(): Promise<TotpStore> {
  try {
    const data = JSON.parse(await readFile(totpFile, 'utf-8'))
    return data && typeof data === 'object' ? data : {}
  } catch {
    return {}
  }
}

let queue: Promise<unknown> = Promise.resolve()

function writeStore(store: TotpStore): Promise<void> {
  const run = queue.then(async () => {
    await mkdir(path.dirname(totpFile), { recursive: true })
    await writeFile(totpFile, JSON.stringify(store, null, 2), 'utf-8')
  })
  queue = run.then(
    () => {},
    () => {}
  )
  return run
}

export async function getTotpConfig(): Promise<TotpStore> {
  return readStore()
}

export async function isTotpActive(): Promise<boolean> {
  const store = await readStore()
  return Boolean(store.secret && store.enabled)
}

export async function saveTotp(store: TotpStore): Promise<void> {
  await writeStore(store)
}

export async function ensureTotpSecret(): Promise<string> {
  const store = await readStore()
  if (store.secret) return store.secret
  const secret = generateSecret()
  await writeStore({ secret, enabled: false })
  return secret
}

// ---- Token "pending" untuk langkah verifikasi login ----

export const PENDING_COOKIE = 'cehadev_admin_pending'
const PENDING_TTL = 10 * 60 * 1000

export function issuePending(event: Parameters<typeof setCookie>[0]) {
  const payload = { purpose: 'totp', exp: Date.now() + PENDING_TTL }
  const str = JSON.stringify(payload)
  const token = `${Buffer.from(str).toString('base64url')}.${signToken(str)}`
  setCookie(event, PENDING_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  })
}

export function readPending(event: Parameters<typeof getCookie>[0]): boolean {
  const token = getCookie(event, PENDING_COOKIE)
  if (!token) return false
  const [b64, sig] = token.split('.')
  if (!b64 || !sig) return false
  const str = Buffer.from(b64, 'base64url').toString()
  const expected = Buffer.from(signToken(str))
  const actual = Buffer.from(sig)
  if (actual.length !== expected.length) return false
  if (!timingSafeEqual(actual, expected)) return false
  try {
    const payload = JSON.parse(str) as { exp?: number }
    return typeof payload.exp === 'number' && payload.exp > Date.now()
  } catch {
    return false
  }
}

export function clearPending(event: Parameters<typeof deleteCookie>[0]) {
  deleteCookie(event, PENDING_COOKIE, { path: '/' })
}
