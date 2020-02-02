const MS = require('jm-ms-core')
const ms = new MS()

module.exports = function (service) {
  let router = ms.router()
  router.add('/', 'get', opts => {
    return { hello: 'world', ...opts }
  })
  return router
}
