import { runTool, ALLOWLISTED_TOOLS } from '../../../utils/ai-pipeline'
import { adminActorContext } from '../../../utils/admin-context'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const body = await readBody(event) as { tool?: string; args?: Record<string, unknown> }
  const tool = String(body.tool ?? '')
  if (!tool) {
    throw createError({ statusCode: 400, message: 'tool wajib diisi' })
  }
  if (!(ALLOWLISTED_TOOLS as readonly string[]).includes(tool)) {
    throw createError({ statusCode: 403, message: `Tool tidak di-allowlist: ${tool}` })
  }
  const args = body.args && typeof body.args === 'object' ? body.args : {}
  return await runTool(tool, args, adminActorContext())
})
