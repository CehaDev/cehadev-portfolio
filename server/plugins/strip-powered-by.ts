export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:response', (response: any) => {
    if (response?.headers) delete response.headers['x-powered-by']
  })
})
