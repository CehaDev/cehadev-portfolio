import nodemailer from 'nodemailer'
import { createError } from 'h3'
import type { SmtpSettings } from './settings'
import { readSmtpSettings } from './settings'

export interface MailConfig {
  host: string
  port: number
  secure: boolean
  user: string
  pass: string
  from: string
  fromName: string
}

export async function getMailConfig(): Promise<MailConfig | null> {
  const stored = await readSmtpSettings()
  const host = (stored.host ?? process.env.NUXT_SMTP_HOST)?.trim()
  const user = (stored.user ?? process.env.NUXT_SMTP_USER)?.trim()
  const pass = (stored.pass || process.env.NUXT_SMTP_PASS)?.trim()
  if (!host || !user || !pass) return null
  const secure = stored.secure ?? process.env.NUXT_SMTP_SECURE === 'true'
  return {
    host,
    port: Number(stored.port ?? process.env.NUXT_SMTP_PORT ?? (secure ? 465 : 587)),
    secure,
    user,
    pass,
    from: (stored.from ?? process.env.NUXT_MAIL_FROM)?.trim() || user,
    fromName: (stored.fromName ?? process.env.NUXT_MAIL_FROM_NAME)?.trim() || 'CehaDev'
  }
}

export async function mailConfigured() {
  return (await getMailConfig()) !== null
}

export async function sendMail(opts: { to: string; subject: string; text: string; html?: string; bcc?: string }) {
  const cfg = await getMailConfig()
  if (!cfg) {
    throw createError({
      statusCode: 503,
      statusMessage: 'SMTP belum dikonfigurasi. Atur di halaman Settings admin.'
    })
  }
  const transporter = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    auth: { user: cfg.user, pass: cfg.pass }
  })
  try {
    await transporter.sendMail({
      from: `"${cfg.fromName}" <${cfg.from}>`,
      to: opts.to,
      bcc: opts.bcc,
      subject: opts.subject,
      text: opts.text,
      html: opts.html
    })
    return { ok: true }
  } catch (err) {
    const raw = err instanceof Error ? err.message : 'Gagal mengirim email'
    throw createError({ statusCode: 502, statusMessage: friendlyMailError(raw) })
  }
}

export async function testMailConnection(input: Partial<SmtpSettings>) {
  const host = input.host?.trim()
  const user = input.user?.trim()
  const pass = input.pass || undefined
  if (!host || !user) return { ok: false, message: 'Host dan user SMTP wajib diisi' }
  const transporter = nodemailer.createTransport({
    host,
    port: Number(input.port ?? 465),
    secure: input.secure ?? true,
    auth: pass ? { user, pass } : undefined
  })
  try {
    await transporter.verify()
    return { ok: true, message: 'Koneksi SMTP berhasil. Balasan akan terkirim ke pengirim + salinan ke email Anda.' }
  } catch (err) {
    const raw = err instanceof Error ? err.message : 'Gagal terhubung ke SMTP'
    return { ok: false, message: friendlyMailError(raw) }
  }
}

function friendlyMailError(raw: string) {
  if (/invalid login|username and password not accepted|5\.7\.8|535/i.test(raw)) {
    return 'Login SMTP ditolak: pastikan user adalah alamat email Gmail Anda dan pass adalah App Password 16 karakter (bukan password biasa), serta 2-Step Verification aktif.'
  }
  if (/could not connect|econnrefused|etimedout|enotfound|getaddrinfo/i.test(raw)) {
    return 'Tidak bisa terhubung ke server SMTP. Periksa host, port, dan koneksi internet Anda.'
  }
  if (/too many login attempts|eacc|auth/i.test(raw)) {
    return 'Permintaan login terlalu banyak. Tunggu beberapa menit lalu coba lagi.'
  }
  return raw
}
