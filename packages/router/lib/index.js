const error = require('jm-err')
const MS = require('jm-ms-core')
const wrapper = require('jm-ms-wrapper')
const help = require('./help')
const loadRouter = require('./loadRouter')

const ms = new MS()

class Router {
  constructor (service, { dir, nohelp }) {
    const router = ms.router()
    this.router = router
    service.rootRouter = router

    wrapper(service.t)(router)

    !nohelp && (router.use(help(service, dir)))
    router
      .use(function (opts) {
        if (!service.ready) throw error.err(error.Err.FA_NOTREADY)
      })
      .use(loadRouter(service, dir))
  }
}

Router.loadRouter = loadRouter

module.exports = Router
