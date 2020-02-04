const $ = require('./service')

const unionid = 'test_unionid'
const openid = 'test_openid'
const data = {
  unionid,
  openid,
  avatarUrl: 'http://www.baidu.com'
}

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
  const doc = await router.post('/signon', data)
  console.log(doc)
})

test('signon mp', async () => {
  console.log('sigon on mp.....')
  const doc = await router.post('/signon/mp', data)
  console.log(doc)
})

test('signon weapp', async () => {
  console.log('sigon on weapp.....')
  const doc = await router.post('/signon/weapp', data)
  console.log(doc)
})
