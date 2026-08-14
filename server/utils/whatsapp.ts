import { createError } from 'h3'

const FONNTE_API = 'https://api.fonnte.com/send'

export function waConfigured() {
  return Boolean(process.env.NUXT_WHATSAPP_TOKEN)
}

export function normalizePhone(input: string) {
  let digits = (input || '').replace(/\D/g, '')
  if (digits.startsWith('0')) digits = '62' + digits.slice(1)
  return digits
}

export async function sendWhatsApp(target: string, message: string) {
  const token = process.env.NUXT_WHATSAPP_TOKEN
  if (!token) {
    throw createError({ statusCode: 503, statusMessage: 'WhatsApp belum dikonfigurasi (NUXT_WHATSAPP_TOKEN)' })
  }
  const res = await fetch(FONNTE_API, {
    method: 'POST',
    headers: {
      Authorization: token,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({ target, message }).toString()
  })
  const json = (await res.json().catch(() => ({}))) as { status?: boolean; reason?: string }
  if (!res.ok || json.status !== true) {
    throw createError({ statusCode: 502, statusMessage: json.reason || 'Gagal mengirim pesan WhatsApp' })
  }
  return { ok: true }
}
