export default defineEventHandler(async (event) => {
  return await readSiteFile()
})
