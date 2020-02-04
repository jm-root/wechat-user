const mss = require('jm-ms-sequelize')
const MS = require('jm-ms-core')
const { Op } = require('sequelize')
const { ObjectId } = require('bson')

const ms = new MS()
module.exports = function (service, opts = {}) {
  let listOpts = opts.list || {
    order: [['moditime', 'DESC']],
    fields: {
      exclude: ['salt', 'password']
    }
  }

  let getOpts = opts.get || {
    fields: {
      exclude: ['salt', 'password']
    }
  }

  const router = ms.router()

  router
    // 根据传入的字段及值搜索用户，搜到返回user，否则返回{}
    .add('/findone', 'get', async ({ data }) => {
      const { user } = service
      const q = Object.keys(data).map(key => {
        const value = data[key]
        const o = {}
        o[key] = value
        return o
      })
      if (!q.length) return

      let doc = await user.findOne({
        where: {
          [Op.or]: q
        },
        raw: true
      })

      return doc
    })
    .add('/', 'get', async opts => {
      opts.conditions || (opts.conditions = {})
      let { q, conditions } = opts.data

      if (conditions) {
        if (typeof conditions === 'string') {
          conditions = JSON.parse(conditions)
        }
        opts.conditions = conditions
        return
      }

      if (!q) return

      let c = []
      // 格式化特殊字符
      q = q.replace(/([`~!@#\$%\^\&\*\(\)_\+<>\?:"\{\},\.\\\/;'\[\]])/g, '\\$1') // eslint-disable-line
      if (ObjectId.isValid(q)) {
        c.push({ id: q })
        c.push({ account: { [Op.like]: `%${q}%` } })
      } else if (!isNaN(q)) {
        c.push({ uid: Number(q) })
        c.push({ mobile: { [Op.like]: `%${q}%` } })
        c.push({ account: { [Op.like]: `%${q}%` } })
      } else {
        c.push({ account: { [Op.like]: `%${q}%` } })
        c.push({ mobile: { [Op.like]: `%${q}%` } })
        c.push({ nick: { [Op.like]: `%${q}%` } })
        c.push({ ip: { [Op.like]: `%${q}%` } })
        c.push({ mac: { [Op.like]: `%${q}%` } })
      }
      opts.conditions = { [Op.or]: c }
    })

  service.onReady()
    .then(() => {
      const { user } = service
      router.use(mss(user, {
        list: listOpts,
        get: getOpts
      }))
    })

  return router
}
