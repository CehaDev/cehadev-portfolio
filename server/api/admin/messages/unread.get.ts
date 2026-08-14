export default defineEventHandler(async (event) => {
  requireAdmin(event)
  return { count: await countUnreadMessages() }
})
