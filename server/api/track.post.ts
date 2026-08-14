export default defineEventHandler(async (event) => {
  const body = await readBody<{ path?: string; referrer?: string; session?: string }>(event)
  const ua = getRequestHeader(event, 'user-agent') ?? ''
  return await addVisit({
    path: typeof body.path === 'string' ? body.path : '',
    referrer: typeof body.referrer === 'string' ? body.referrer : '',
    session: typeof body.session === 'string' ? body.session : '',
    ua
  })
})
