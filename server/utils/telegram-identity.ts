import { db, ensureSchema } from './db'
import { PERMISSIONS, DEFAULT_ROLES, type Permission } from './permissions'
import { redact } from './redact'

export interface TelegramIdentityRow {
  id: string
  telegram_user_id: string
  admin_user_id: string
  username: string
  is_whitelisted: number
  created_at: string
}

export interface UserContext {
  telegramUserId: string
  username: string
  isWhitelisted: boolean
  adminUserId: string
  roleId: string
  roleName: string
  permissions: Permission[]
}

const _override: { db: Awaited<ReturnType<typeof db>> | null } = { db: null }

export function __setTelegramDbForTest(c: Awaited<ReturnType<typeof db>> | null) {
  _override.db = c
}

function conn() {
  return _override.db ?? db()
}

export async function seedDefaultAuth() {
  for (const p of Object.values(PERMISSIONS)) {
    await conn().execute({
      sql: 'INSERT OR IGNORE INTO permissions (id, name) VALUES (?, ?)',
      args: [p, p]
    })
  }
  for (const r of Object.values(DEFAULT_ROLES)) {
    await conn().execute({
      sql: 'INSERT OR IGNORE INTO roles (id, name) VALUES (?, ?)',
      args: [r.id, r.name]
    })
    for (const perm of r.permissions) {
      await conn().execute({
        sql: 'INSERT OR IGNORE INTO role_permissions (role_id, permission_id) VALUES (?, ?)',
        args: [r.id, perm]
      })
    }
  }
}

function newId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function now() {
  return new Date().toISOString()
}

async function getRolePermissions(roleId: string): Promise<Permission[]> {
  const rows = await conn().execute({
    sql: `SELECT p.id FROM permissions p
          JOIN role_permissions rp ON rp.permission_id = p.id
          WHERE rp.role_id = ?`,
    args: [roleId]
  })
  return rows.rows.map((r) => r.id as Permission)
}

/**
 * Menemukan atau membuat identitas Telegram. Whitelisted default:
 * primary admin (TELEGRAM_ADMIN_CHAT_ID) dan username TELEGRAM_ADMIN_USERNAME (opsional).
 */
export async function resolveTelegramIdentity(telegramUserId: string, username = ''): Promise<TelegramIdentityRow> {
  await ensureSchema()
  const existing = await conn().execute({
    sql: 'SELECT * FROM telegram_identities WHERE telegram_user_id = ?',
    args: [telegramUserId]
  })
  if (existing.rows[0]) return existing.rows[0] as unknown as TelegramIdentityRow

  const primaryAdmin = (process.env.TELEGRAM_ADMIN_CHAT_ID || '').trim()
  let isWhitelisted = 0
  if (primaryAdmin && String(telegramUserId) === String(primaryAdmin)) isWhitelisted = 1
  else if (process.env.TELEGRAM_ADMIN_USERNAME) {
    if (username && String(username).toLowerCase() === String(process.env.TELEGRAM_ADMIN_USERNAME).toLowerCase()) isWhitelisted = 1
  }

  const row: TelegramIdentityRow = {
    id: newId(),
    telegram_user_id: String(telegramUserId),
    admin_user_id: '',
    username,
    is_whitelisted: isWhitelisted,
    created_at: now()
  }
  await conn().execute({
    sql: `INSERT INTO telegram_identities (id, telegram_user_id, admin_user_id, username, is_whitelisted, created_at)
          VALUES (?, ?, ?, ?, ?, ?)`,
    args: [row.id, row.telegram_user_id, row.admin_user_id, row.username, row.is_whitelisted, row.created_at]
  })
  return row
}

/**
 * Mengembalikan konteks akses untuk pengguna Telegram. Memanggil resolve sehingga
 * identitas selalu tersimpan. Memisahkan status whitelist vs non-whitelist.
 */
export async function resolveUserContext(telegramUserId: string, username = ''): Promise<UserContext> {
  const ident = await resolveTelegramIdentity(telegramUserId, username)
  const denied: UserContext = {
    telegramUserId: String(telegramUserId),
    username,
    isWhitelisted: false,
    adminUserId: '',
    roleId: '',
    roleName: '',
    permissions: []
  }
  if (!ident.is_whitelisted) return denied

  const admin = ident.admin_user_id
    ? (await conn().execute({ sql: 'SELECT * FROM admin_users WHERE id = ?', args: [ident.admin_user_id] })).rows[0]
    : null
  const roleId = admin?.role_id || 'admin'
  const roleNameRow = (await conn().execute({ sql: 'SELECT name FROM roles WHERE id = ?', args: [roleId] })).rows[0]

  return {
    telegramUserId: ident.telegram_user_id,
    username: ident.username || username,
    isWhitelisted: true,
    adminUserId: ident.admin_user_id,
    roleId,
    roleName: roleNameRow?.name || roleId,
    permissions: await getRolePermissions(roleId)
  }
}

export async function hasPermission(ctx: UserContext, perm: Permission): Promise<boolean> {
  if (!ctx.isWhitelisted) return false
  if (ctx.permissions.includes(perm)) return true
  return ctx.permissions.includes(PERMISSIONS.ADMIN_READ)
}

export async function whitelistTelegramUser(telegramUserId: string, opts: { adminUserId?: string; username?: string } = {}): Promise<void> {
  await ensureSchema()
  const existing = await resolveTelegramIdentity(telegramUserId, opts.username || '')
  await conn().execute({
    sql: `UPDATE telegram_identities SET is_whitelisted = 1, admin_user_id = ?, username = ?
          WHERE telegram_user_id = ?`,
    args: [opts.adminUserId || existing.admin_user_id, opts.username || existing.username, String(telegramUserId)]
  })
}

export async function unwhitelistTelegramUser(telegramUserId: string): Promise<void> {
  await conn().execute({
    sql: 'UPDATE telegram_identities SET is_whitelisted = 0 WHERE telegram_user_id = ?',
    args: [String(telegramUserId)]
  })
}

export async function listTelegramIdentities(limit = 100): Promise<TelegramIdentityRow[]> {
  await ensureSchema()
  const rows = await conn().execute({ sql: 'SELECT * FROM telegram_identities ORDER BY created_at DESC LIMIT ?', args: [limit] })
  return rows.rows as unknown as TelegramIdentityRow[]
}

// ---- Agent run logging (PRD Section 5) ----

export async function logAgentRun(request: string, tool: string, resultStatus: string, actor = 'telegram'): Promise<void> {
  await ensureSchema()
  await conn().execute({
    sql: `INSERT INTO agent_runs (id, request, tool, result_status, actor, created_at)
          VALUES (?, ?, ?, ?, ?, ?)`,
    args: [newId(), redact(request), tool, resultStatus, actor, now()]
  })
}

export async function listAgentRuns(limit = 50): Promise<Array<Record<string, unknown>>> {
  await ensureSchema()
  const rows = await conn().execute({ sql: 'SELECT * FROM agent_runs ORDER BY created_at DESC LIMIT ?', args: [limit] })
  return rows.rows as Array<Record<string, unknown>>
}
