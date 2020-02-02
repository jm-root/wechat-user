module.exports = class extends require('service') {
  constructor (opts = {}) {
    super(opts)
    this.emit('ready')
  }

  router (opts) {
    const dir = require('path').join(__dirname, '../router')
    return new (require('router'))(this, { dir, ...opts }).router
  }
}
