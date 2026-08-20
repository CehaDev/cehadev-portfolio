import { appendFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { db, ensureSchema, isUsingTurso } from './db'

const logFile = path.resolve(process.cwd(), '.data/security.log')

export async function logSecurityEvent(event: string, details: Record<string, unknown> = {}) {
  const entry = JSON.stringify({ ts: new Date().toISOString(), event, ...details })

  if (isUsingTurso()) {
    try {
      await ensureSchema()
      await db().execute({
        sql: 'INSERT INTO security_log (ts, event, details) VALUES (?, ?, ?)',
        args: [new Date().toISOString(), event, JSON.stringify(details)]
      })
    } catch {}
    return
  }

  await mkdir(path.dirname(logFile), { recursive: true }).catch(() => {})
  await appendFile(logFile, entry + '\n').catch(() => {})
}
