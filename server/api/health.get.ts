export default defineEventHandler(async () => {
  return {
    ok: true,
    service: 'cehadev-portfolio',
    time: new Date().toISOString(),
    uptime: Math.round(process.uptime())
  }
})
