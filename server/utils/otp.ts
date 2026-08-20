import { createHash, randomInt, timingSafeEqual } from 'node:crypto'
import { createError } from 'h3'
import { getMailConfig } from './mailer'
import { kvGetJson, kvSetJson } from './db'

export const OTP_TTL = 10 * 60 * 1000
const MAX_TRIES = 5

interface OtpStore {
  codeHash?: string
  exp?: number
  tries?: number
}

function hashCode(code: string) {
  return createHash('sha256').update(`otp:${code}`).digest('hex')
}

async function readStore(): Promise<OtpStore> {
  return kvGetJson<OtpStore>('otp_state', {})
}

async function writeStore(store: OtpStore): Promise<void> {
  await kvSetJson('otp_state', store)
}

export async function issueOtp(): Promise<{ code: string }> {
  const code = String(randomInt(0, 1000000)).padStart(6, '0')
  await writeStore({ codeHash: hashCode(code), exp: Date.now() + OTP_TTL, tries: 0 })
  return { code }
}

export async function verifyOtp(code: string): Promise<void> {
  if (!/^\d{6}$/.test(code)) {
    throw createError({ statusCode: 400, statusMessage: 'Kode harus 6 digit angka' })
  }
  const store = await readStore()
  if (!store.codeHash || typeof store.exp !== 'number' || store.exp < Date.now()) {
    await clearOtp()
    throw createError({ statusCode: 400, statusMessage: 'Kode sudah kedaluwarsa. Minta kode baru.' })
  }
  const tries = store.tries ?? 0
  if (tries >= MAX_TRIES) {
    await clearOtp()
    throw createError({ statusCode: 429, statusMessage: 'Terlalu banyak percobaan. Minta kode baru.' })
  }
  const expected = Buffer.from(store.codeHash, 'hex')
  const actual = Buffer.from(hashCode(code), 'hex')
  if (!timingSafeEqual(actual, expected)) {
    await writeStore({ ...store, tries: tries + 1 })
    throw createError({ statusCode: 400, statusMessage: 'Kode tidak valid' })
  }
  await clearOtp()
}

export async function clearOtp(): Promise<void> {
  await writeStore({})
}

export async function getAdminEmail(): Promise<string | null> {
  const cfg = await getMailConfig()
  return (process.env.NUXT_ADMIN_EMAIL || cfg?.from || cfg?.user || '').trim() || null
}
