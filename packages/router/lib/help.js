const helper = require('jm-ms-help')
const MS = require('jm-ms-core')
let ms = new MS()

module.exports = function (service, dir) {
  let router = ms.router()
  router.add('/', 'get', function (opts) {
    opts.help || (opts.help = {})
    opts.help.status = 1
    if (!service.ready) opts.help.status = 0
  })
  helper.enableHelp(router, require(require('path').join(dir, '../../package.json')))
  return router
}
