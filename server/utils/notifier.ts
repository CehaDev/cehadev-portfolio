/**
 * Notifier — mengirim notifikasi/monitoring alert ke Telegram (PRD Section 15).
 * Menggunakan metode sendMessage Bot API langsung (tanpa perlu bot aktif polling).
 */

export type AlertSeverity = 'info' | 'success' | 'warning' | 'error'

const SEVERITY_ICON: Record<AlertSeverity, string> = {
  info: 'ℹ️',
  success: '✅',
  warning: '⚠️',
  error: '🚨'
}

const stub: { fn: ((msg: { chatId: string; text: string }) => Promise<void>) | null } = { fn: null }

export function __setNotifierForTest(fn: ((msg: { chatId: string; text: string }) => Promise<void>) | null) {
  stub.fn = fn
}

export function notifierConfigured(): boolean {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_ADMIN_CHAT_ID)
}

function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function sendNotification(text: string, severity: AlertSeverity = 'info', chatId?: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const targetChat = chatId || process.env.TELEGRAM_ADMIN_CHAT_ID
  if (stub.fn) {
    await stub.fn({ chatId: String(targetChat || ''), text })
    return true
  }
  if (!token || !targetChat) return false
  const payload = {
    chat_id: String(targetChat),
    text: `${SEVERITY_ICON[severity]} <b>CehaDev Ops</b>\n${escapeHtml(text)}`,
    parse_mode: 'HTML',
    disable_web_page_preview: true
  }
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!res.ok) return false
  const data = await res.json()
  return Boolean(data?.ok)
}

/** Pola penyederhanaan: kirim notifikasi deployment status. */
export function notifyDeployment(status: 'success' | 'failed', details: string) {
  const severity: AlertSeverity = status === 'success' ? 'success' : 'error'
  return sendNotification(`Deployment ${status.toUpperCase()}\n${details}`, severity)
}

/** Notifikasi error alert (mis. health check gagal). */
export function notifyError(detail: string) {
  return sendNotification(detail, 'error')
}
