const $ = require('./service')

const unionid = 'test'

let service = null
beforeAll(async () => {
  await $.onReady()
  service = $
  console.log('sigon on.....')
  const doc = await service.signon({ unionid, headimgurl: 'http://www.baidu.com' })
  console.log(doc)
})

afterAll(async () => {
  const { backend: router } = service
  const doc = await router.get('/findone', { unionid })
  console.log(doc)
  await service.remove(doc.id)
})

test('signon', async () => {
  console.log('signon')
})
