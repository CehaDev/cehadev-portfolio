import { kvGetJson, kvSetJson } from './db'

export interface SmtpSettings {
  host: string
  port: number
  secure: boolean
  user: string
  pass: string
  from: string
  fromName: string
}

interface AppSettings {
  smtp?: Partial<SmtpSettings>
}

export async function readSettings(): Promise<AppSettings> {
  return kvGetJson<AppSettings>('app_settings', {})
}

export async function readSmtpSettings(): Promise<Partial<SmtpSettings>> {
  const s = await readSettings()
  return s.smtp ?? {}
}

export async function saveSmtpSettings(smtp: Partial<SmtpSettings>) {
  const s = await readSettings()
  s.smtp = { ...(s.smtp ?? {}), ...smtp }
  await kvSetJson('app_settings', s)
}
