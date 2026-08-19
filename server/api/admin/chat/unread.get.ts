export default defineEventHandler(async (event) => {
  return { count: await countUnreadConversations() }
})
