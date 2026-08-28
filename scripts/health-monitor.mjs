#!/usr/bin/env node
/**
 * health-monitor.mjs — Health check HTTP terhadap endpoint publik, opsional di
 * luar VPS (mis. jadwal eksternal). Dipakai untuk menguji health check & alert
 * (PRD Section 15). Loop sekali lalu keluar; untuk berkelanjutan lebih cocok
 * worker (scripts/worker.mjs) atau crontab.
 *
 * Usage: node scripts/health-monitor.mjs [BASE_URL]
 *   BASE_URL default https://chdev.online
 */
import { createJiti } from 'jiti'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const BASE = process.argv[2] || process.env.SITE_URL || 'https://chdev.online'

const jiti = createJiti(import.meta.url)
const notifierMod = await jiti.import(path.resolve(root, 'server/utils/notifier.ts'))

async function probe(url) {
  const t0 = Date.now()
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10_000) })
    return { ok: res.ok, status: res.status, ms: Date.now() - t0 }
  } catch (e) {
    return { ok: false, status: 0, ms: Date.now() - t0, error: e.message }
  }
}

const checks = [
  { name: 'website', url: BASE },
  { name: 'health', url: `${BASE}/api/health` }
]

const results = []
for (const c of checks) {
  const r = await probe(c.url)
  console.log(`${c.name}: ${r.ok ? 'OK' : 'FAIL'} (${r.status}) ${r.ms}ms${r.error ? ' ' + r.error : ''}`)
  results.push({ name: c.name, ...r })
}

const failed = results.filter((r) => !r.ok)
if (failed.length) {
  await notifierMod.notifyError(`Health monitor eksternal gagal:\n${failed.map((f) => `• ${f.name} HTTP ${f.status || 'timeout'}`).join('\n')}`)
  process.exit(1)
}
const worst = Math.max(...results.map((r) => r.ms))
if (worst > 2000) {
  await notifierMod.sendNotification(`Health monitor: respons lambat (terbesar ${worst}ms)`, 'warning')
}
process.exit(0)
