import nodemailer from 'nodemailer'
import { createError } from 'h3'

export interface MailConfig {
  host: string
  port: number
  secure: boolean
  user: string
  pass: string
  from: string
  fromName: string
}

export function getMailConfig(): MailConfig | null {
  const host = process.env.NUXT_SMTP_HOST?.trim()
  const user = process.env.NUXT_SMTP_USER?.trim()
  const pass = process.env.NUXT_SMTP_PASS?.trim()
  if (!host || !user || !pass) return null
  return {
    host,
    port: Number(process.env.NUXT_SMTP_PORT ?? (process.env.NUXT_SMTP_SECURE === 'true' ? 465 : 587)),
    secure: process.env.NUXT_SMTP_SECURE === 'true',
    user,
    pass,
    from: process.env.NUXT_MAIL_FROM?.trim() || user,
    fromName: process.env.NUXT_MAIL_FROM_NAME?.trim() || 'CehaDev'
  }
}

export function mailConfigured() {
  return getMailConfig() !== null
}

export async function sendMail(opts: { to: string; subject: string; text: string; html?: string }) {
  const cfg = getMailConfig()
  if (!cfg) {
    throw createError({
      statusCode: 503,
      statusMessage: 'SMTP belum dikonfigurasi. Atur NUXT_SMTP_* di file .env.'
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
      subject: opts.subject,
      text: opts.text,
      html: opts.html
    })
    return { ok: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Gagal mengirim email'
    throw createError({ statusCode: 502, statusMessage: message })
  }
}
