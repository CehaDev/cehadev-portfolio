import { appendFile, mkdir } from 'node:fs/promises'
import path from 'node:path'

const logFile = path.resolve(process.cwd(), '.data/security.log')

export async function logSecurityEvent(event: string, details: Record<string, unknown> = {}) {
  await mkdir(path.dirname(logFile), { recursive: true }).catch(() => {})
  const line = JSON.stringify({ ts: new Date().toISOString(), event, ...details })
  await appendFile(logFile, line + '\n').catch(() => {})
}
