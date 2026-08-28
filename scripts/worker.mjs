#!/usr/bin/env node
/**
 * CehaDev Worker (PRD Section 15/17) — proses persisten.
 * Menjalankan secara periodik:
 *   1. Scheduler: publikasi artikel terjadwal.
 *   2. Monitoring: health check website/API/DB; alert via Telegram bila gagal.
 *   3. Backup: backup terjadwal + retensi, notifikasi hasil.
 *
 * Berjalan memakai DB Turso (TURSO_DATABASE_URL) atau file lokal (.data/worker.db)
 * bila env Turso kosong (untuk dev/staging).
 *
 * Interval dapat dikonfigurasi via env: SCHEDULER_INTERVAL_MS, MONITOR_INTERVAL_MS,
 * BACKUP_CRON_MS (default 24j), BACKUP_RETENTION_DAYS (default 7).
 */

import { createClient } from '@libsql/client'
import { createJiti } from 'jiti'
import { mkdir, appendFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const logFile = path.resolve(root, '.data', 'worker.log')

// Default DB ke file lokal bila Turso tidak dikonfigurasi. DITETAPKAN SEBELUM
// modul di-import agar setiap instance module (db()/client()) membaca env yang sama —
// menghindari ketidakcocokan instance (root bug: override __setDbForTest tidak
// sampai ke instance article-manager milik scheduler). Konsisten dengan
// Dockerfile/docker-compose (file:/srv/data/db.sqlite).
if (!process.env.TURSO_DATABASE_URL) {
  process.env.TURSO_DATABASE_URL = `file:${path.resolve(root, '.data', 'worker.db')}`
}

async function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`
  try {
    await mkdir(path.resolve(root, '.data'), { recursive: true })
    await appendFile(logFile, line + '\n', 'utf-8')
  } catch {}
  console.log(line)
}

const jiti = createJiti(import.meta.url)
const mods = await Promise.all([
  jiti.import(path.resolve(root, 'server/utils/article-manager.ts')),
  jiti.import(path.resolve(root, 'server/utils/telegram-identity.ts')),
  jiti.import(path.resolve(root, 'server/utils/idea-manager.ts')),
  jiti.import(path.resolve(root, 'server/utils/media-manager.ts')),
  jiti.import(path.resolve(root, 'server/utils/ai-pipeline.ts')),
  jiti.import(path.resolve(root, 'server/utils/scheduler.ts')),
  jiti.import(path.resolve(root, 'server/utils/monitoring.ts')),
  jiti.import(path.resolve(root, 'server/utils/backup.ts')),
  jiti.import(path.resolve(root, 'server/utils/notifier.ts')),
  jiti.import(path.resolve(root, 'server/utils/db.ts'))
])
const [articleMod, idMod, ideaMod, mediaMod, pipelineMod, schedulerMod, monitorMod, backupMod, notifierMod, dbMod] = mods

let client = null
if (process.env.TURSO_DATABASE_URL) {
  client = createClient({ url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN || undefined })
} else {
  await mkdir(path.resolve(root, '.data'), { recursive: true })
  client = createClient({ url: `file:${path.resolve(root, '.data', 'worker.db')}` })
  await client.execute('CREATE TABLE IF NOT EXISTS kv (key TEXT PRIMARY KEY, value TEXT NOT NULL)')
}
articleMod.__setDbForTest(client)
idMod.__setTelegramDbForTest(client)
ideaMod.__setIdeaDbForTest(client)
mediaMod.__setMediaDbForTest(client)
pipelineMod.__setAiPipelineDbForTest(client)
backupMod.__setBackupDbForTest(client)

if (typeof dbMod.ensureSchema === 'function') {
  await dbMod.ensureSchema()
  await log('Worker: schema terjamin (ensureSchema) pada DB target')
}

const SCHEDULER_MS = Number(process.env.SCHEDULER_INTERVAL_MS || 60_000)
const MONITOR_MS = Number(process.env.MONITOR_INTERVAL_MS || 300_000)
const BACKUP_MS = Number(process.env.BACKUP_CRON_MS || 24 * 60 * 60 * 1000)
const RETENTION_DAYS = Number(process.env.BACKUP_RETENTION_DAYS || 7)
const SITE_URL = process.env.SITE_URL || 'https://chdev.online'

let lastBackup = 0

async function runScheduler() {
  try {
    const r = await schedulerMod.processScheduledArticles()
    if (r.published.length) {
      await log(`Scheduler: publikasi ${r.published.length} artikel: ${r.published.map((p) => p.slug).join(', ')}`)
      await notifierMod.sendNotification(`📅 Scheduler menerbitkan ${r.published.length} artikel:\n${r.published.map((p) => `• ${p.slug}`).join('\n')}`, 'success')
    }
    if (r.errors.length) {
      await log(`Scheduler error: ${r.errors.map((e) => e.message).join('; ')}`)
      await notifierMod.sendNotification(`Scheduler error pada ${r.errors.length} artikel.`, 'warning')
    }
  } catch (e) {
    await log('Scheduler fatal: ' + e.message)
  }
}

async function runMonitor() {
  try {
    const [dbCheck, web, api] = await Promise.all([
      monitorMod.checkDatabase(),
      monitorMod.checkWebsite(SITE_URL),
      monitorMod.checkApi(SITE_URL)
    ])
    const failed = [dbCheck, web, api].filter((c) => !c.ok)
    if (failed.length) {
      const details = failed.map((c) => `• ${c.name}: ${c.detail}`).join('\n')
      await log(`Monitor FAIL: ${details}`)
      await notifierMod.notifyError(`Health check gagal:\n${details}`)
    }
  } catch (e) {
    await log('Monitor fatal: ' + e.message)
  }
}

async function runBackup() {
  if (Date.now() - lastBackup < BACKUP_MS) return
  lastBackup = Date.now()
  try {
    const { file, meta } = await backupMod.createBackup()
    const pruned = await backupMod.pruneBackups(RETENTION_DAYS)
    await log(`Backup dibuat: ${file} (${meta.bytes} bytes)`)
    await notifierMod.sendNotification(`💾 Backup berhasil (${meta.bytes} bytes). Pruned ${pruned} lama.`, 'success')
  } catch (e) {
    await log('Backup failed: ' + e.message)
    await notifierMod.sendNotification(`❌ Backup gagal: ${e.message}`, 'error')
  }
}

async function main() {
  await log(`Worker dimulai. Interval: scheduler=${SCHEDULER_MS}ms monitor=${MONITOR_MS}ms backup=${BACKUP_MS}ms`)
  runScheduler()
  runBackup()
  setInterval(runScheduler, SCHEDULER_MS).unref?.()
  setInterval(runMonitor, MONITOR_MS).unref?.()
  setInterval(runBackup, BACKUP_MS).unref?.()
  // jaga proses hidup
  await new Promise(() => {})
}

main().catch((e) => {
  console.error('Fatal:', e)
  process.exit(1)
})
