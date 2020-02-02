const MS = require('jm-ms-core')
const ms = new MS()

module.exports = function (service) {
  let router = ms.router()
  router.add('/', 'get', async opts => {
    const { gateway } = service
    console.log(gateway)
    await gateway.bind('config')
    const doc = await gateway.get('/')
    doc.modules.config = await gateway.config.get('/')
    return doc
  })
  return router
}
