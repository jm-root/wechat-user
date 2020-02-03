const log = require('jm-log4js')
const error = require('jm-err')
const { utils } = require('jm-utils')
const consts = require('consts')
const logger = log.getLogger('main')

const BackendMongoose = require('user-mongoose')
const BackendSequelize = require('user-sequelize')

/**
 * passport service
 * @param {Object} opts
 * @example
 * opts参数:{
 *  db: 数据库
 *  weapp_uri: (可选, 默认'weapp')
 *  model_name: 模型名称(可选，默认'backend')
 *  table_name: 表名(可选, 默认'wechat_user')
 *  force_unionid: 是否必须获取unionId(可选)
 * }
 * @return {Object} service
 */
module.exports = class extends require('service') {
  constructor (opts = {}) {
    super(opts)

    const {
      db,
      force_unionid: forceUnionid = 0
    } = opts

    Object.assign(this, { forceUnionid })

    if (!db) {
      logger.error('no db config!')
      process.exit()
    }
    const dbtype = utils.getUriProtocol(db)
    if (!dbtype) {
      logger.error('database type not found!')
      process.exit()
    }

    let backendService = null
    if (dbtype === 'mongodb') {
      backendService = new BackendMongoose(opts)
    } else {
      backendService = new BackendSequelize(opts)
    }

    backendService.onReady().then(() => {
      this.backend = backendService.router()
      const { gateway } = this

      gateway.bind('sso')
      gateway.bind('user')

      this.emit('ready')
    })
  }

  router (opts) {
    const dir = require('path').join(__dirname, '../router')
    return new (require('router'))(this, { dir, ...opts }).router
  }

  /**
   * 根据微信获取的用户查找对应用户并返回token，如果查不到，先注册用户
   * @param opts
   * @param ips
   * @returns {Promise<*>}
   */
  async signon (opts = {}, ips) {
    const { backend: router, gateway: { sso, user } } = this
    logger.debug('signon', opts, ips)
    const { mpOpenid, weappOpenid, unionid, session_key: sessionKey, nickName, gender, country, province, city, avatarUrl } = opts

    const wechat = { unionid }

    if (mpOpenid) {
      wechat.mp = {
        openid: mpOpenid
      }
    }

    if (weappOpenid) {
      wechat.weapp = {
        openid: weappOpenid,
        sessionKey
      }
    }

    const q = {}
    unionid && (q.unionid = unionid)
    mpOpenid && (q.mpOpenid = mpOpenid)
    weappOpenid && (q.weappOpenid = weappOpenid)

    // 检查是否已经存在
    let doc = await router.get('/findOne', q)

    let data = {
      ext: {
        wechat
      }
    }

    Object.assign(data, {
      nick: nickName,
      gender,
      country,
      province,
      city,
      avatarUrl
    })

    if (doc) {
      let ext = data.ext
      await user.post(`/users/${doc.id}/ext`, ext)
      logger.debug('update user', doc.id, ext)
      await router.post(`/${doc.id}`, opts)
      logger.debug('update wechat user', doc.id, wechat)
    } else {
      if (this.forceUnionid && !unionid) {
        throw error.err(consts.Err.FA_INVALID_UNIONID)
      }
      doc = await user.request({ uri: '/users', type: 'post', data, ips })
      if (doc.err) throw error.err(doc)
      logger.debug('create user', data)

      data = Object.assign({}, wechat, { id: doc.id })
      doc = await router.post(`/`, data)
      logger.debug('create wechat user', data, doc)
    }
    data = {
      id: doc.id,
      wechat
    }
    doc = await sso.request({ uri: '/signon', type: 'post', data, ips })
    if (doc.err) throw error.err(doc)
    return doc
  }

  async remove (id) {
    const { backend: router, gateway: { user } } = this
    const doc = await router.get('/findone', { id })
    if (!doc) return
    await router.delete(`/${id}`)
    await user.delete(`/users/${doc.bindId || id}`)
  }
}
