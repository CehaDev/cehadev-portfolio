import * as articleManager from './article-manager'

/**
 * Scheduler (PRD Section 15/17) — publikasi terjadwal.
 * Worker (scripts/worker.mjs) memanggil processScheduledArticles secara periodik.
 */

export interface ScheduleRunResult {
  processed: number
  published: { id: string; slug: string }[]
  errors: { id: string; message: string }[]
}

export async function processScheduledArticles(nowIso?: string): Promise<ScheduleRunResult> {
  const due = await articleManager.listDueScheduled(nowIso)
  const result: ScheduleRunResult = { processed: due.length, published: [], errors: [] }
  for (const art of due) {
    try {
      const pub = await articleManager.transitionStatus(art.id, 'PUBLISHED', 'scheduler', 'worker', 'scheduled publish')
      result.published.push({ id: pub.id, slug: pub.slug })
    } catch (e: unknown) {
      result.errors.push({ id: art.id, message: (e as Error).message })
    }
  }
  return result
}

export const DEFAULT_INTERVAL_MS = 60_000

export function startScheduler(intervalMs = DEFAULT_INTERVAL_MS, onTick?: (r: ScheduleRunResult) => void) {
  const run = async () => {
    try {
      const r = await processScheduledArticles()
      if ((r.published.length || r.errors.length) && onTick) onTick(r)
    } catch {
      // diam; tick berikutnya
    }
  }
  // jalankan sekali segera, lalu periodik
  const timer = setInterval(run, intervalMs)
  timer.unref?.()
  setTimeout(run, 0).unref?.()
  return timer
}
