const $ = require('./service')

let user = {
  unionid: '123'
}

let router = null
let service = null
beforeAll(async () => {
  await $.onReady()
  service = $
  router = $.router()
})

afterAll(async () => {
  await init()
})

let init = async function () {
  let doc = await service.user.destroy({ where: { unionid: user.unionid } })
  return doc
}

let prepare = async function () {
  await init()
  let doc = await service.user.create(user)
  return doc
}

describe('router', () => {
  test('findone', async () => {
    let doc = await prepare()
    doc = await router.get(`/findone`, { id: doc.id })
    console.log(doc)
    expect(doc).toBeTruthy()

    doc = await router.get(`/findone`, { id: 'none' })
    console.log(doc)
    expect(!doc).toBeTruthy()
  })

  test('list', async () => {
    let doc = await prepare()
    doc = await router.get('', { rows: 2 })
    console.log(doc)
    expect(doc.page).toBeTruthy()
  })
})
