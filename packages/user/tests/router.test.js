const $ = require('./service')

const unionid = 'test_unionid'
const openid = 'test_openid'

let service = null
let router = null
beforeAll(async () => {
  await $.onReady()
  service = $
  router = $.router()
})

afterAll(async () => {
  const { backend: router } = service
  const doc = await router.get('/findone', { unionid })
  await service.remove(doc.id)
})

test('signon', async () => {
  console.log('sigon on.....')
  const doc = await router.post('/signon', { unionid, headimgurl: 'http://www.baidu.com' })
  console.log(doc)
})

test('signon mp', async () => {
  console.log('sigon on mp.....')
  const doc = await router.post('/signon/mp', { unionid, openid, headimgurl: 'http://www.baidu.com' })
  console.log(doc)
})

test('signon weapp', async () => {
  console.log('sigon on weapp.....')
  const doc = await router.post('/signon/weapp', { unionid, openid, headimgurl: 'http://www.baidu.com' })
  console.log(doc)
})
