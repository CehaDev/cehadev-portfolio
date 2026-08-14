import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

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

const settingsFile = path.resolve(process.cwd(), '.data/settings.json')

let queue: Promise<unknown> = Promise.resolve()

function mutate<T>(fn: () => T | Promise<T>): Promise<T> {
  const run = queue.then(fn)
  queue = run.then(
    () => {},
    () => {}
  )
  return run
}

export async function readSettings(): Promise<AppSettings> {
  try {
    const parsed = JSON.parse(await readFile(settingsFile, 'utf-8'))
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

export async function readSmtpSettings(): Promise<Partial<SmtpSettings>> {
  const s = await readSettings()
  return s.smtp ?? {}
}

export async function saveSmtpSettings(smtp: Partial<SmtpSettings>) {
  return mutate(async () => {
    const s = await readSettings()
    s.smtp = { ...(s.smtp ?? {}), ...smtp }
    await mkdir(path.dirname(settingsFile), { recursive: true })
    await writeFile(settingsFile, JSON.stringify(s, null, 2) + '\n', 'utf-8')
  })
}
