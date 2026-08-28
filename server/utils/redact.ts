/**
 * Redaksi secret (PRD Section 16: "Log tidak boleh membocorkan token, password,
 * API key, atau data sensitif"). Digunakan pada semua titik pencatatan log
 * (agent_runs, activity_logs) agar nilai secret tersensor bila tertangkap.
 */

const SENSITIVE_KEYS = [
  'token',
  'password',
  'passwd',
  'secret',
  'apikey',
  'api_key',
  'authorization',
  'auth',
  'cookie',
  'session',
  'key'
]

const PATTERN_BEARER = /(bearer\s+)[A-Za-z0-9._~+/=-]+/gi
const PATTERN_TOKEN = /(token["']?\s*[:=]\s*["']?)[A-Za-z0-9._-]+/gi
const PATTERN_PASSWORD = /(password["']?\s*[:=]\s*["']?)[^\s,;"']+/gi
const PATTERN_KEY = /(api[_-]?key["']?\s*[:=]\s*["']?)[^\s,;"']+/gi
const PATTERN_SECRET = /(secret["']?\s*[:=]\s*["']?)[^\s,;"']+/gi

const ENV_SECRET_NAMES = [
  'ADMIN_TOKEN',
  'NUXT_ADMIN_SECRET',
  'TELEGRAM_BOT_TOKEN',
  'GEMINI_API_KEY',
  'TURSO_AUTH_TOKEN',
  'STT_API_KEY'
]

/** Daftar nilai secret dari env yang harus disensor bila muncul di mana pun. */
function envSecrets(): string[] {
  const out: string[] = []
  for (const name of ENV_SECRET_NAMES) {
    const v = process.env[name]
    if (v && v.length >= 6) out.push(v)
  }
  return out
}

function containsSensitive(value: string): boolean {
  const lower = value.toLowerCase()
  return SENSITIVE_KEYS.some((k) => lower.includes(k))
}

export function redact(value: unknown): string {
  let s = typeof value === 'string' ? value : safeStringify(value)
  s = s.replace(PATTERN_BEARER, '$1[REDACTED]')
  s = s.replace(PATTERN_TOKEN, '$1[REDACTED]')
  s = s.replace(PATTERN_PASSWORD, '$1[REDACTED]')
  s = s.replace(PATTERN_KEY, '$1[REDACTED]')
  s = s.replace(PATTERN_SECRET, '$1[REDACTED]')
  // sensor nilai env secret yang muncul mentah
  for (const secret of envSecrets()) {
    if (!secret) continue
    if (s.includes(secret)) s = s.split(secret).join('[REDACTED]')
  }
  return s
}

function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

/**
 * Sensor rekursif pada objek — menghapus/mengganti field bernama sensitif.
 * Tidak memodifikasi input asli (return objek baru).
 */
export function sanitizeRecord(record: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [key, val] of Object.entries(record)) {
    if (containsSensitive(key)) {
      out[key] = '[REDACTED]'
      continue
    }
    if (val && typeof val === 'object' && !Buffer.isBuffer(val)) {
      out[key] = sanitizeRecord(val as Record<string, unknown>)
    } else if (typeof val === 'string') {
      out[key] = redact(val)
    } else {
      out[key] = val
    }
  }
  return out
}
