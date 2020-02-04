const MS = require('jm-ms-core')
const ms = new MS()

module.exports = function (service) {
  const router = ms.router()

  router
    .add('/signon', 'post', async ({ data, ips }) => {
      return service.signon(data, ips)
    })
    .add('/signon/:prefix', 'post', async ({ params: { prefix }, data, ips }) => {
      return service.signon(data, ips, prefix)
    })
    .add('/users/:id', 'delete', async ({ params: { id } }) => {
      return service.remove(id)
    })

  service.onReady()
    .then(() => {
      router.use('/users', service.backend)
    })

  return router
}
