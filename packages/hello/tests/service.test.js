const $ = require('./service')
let service = null

beforeAll(async () => {
  await $.onReady()
  service = $
})

describe('service', async () => {
  test('bind', async () => {
    await service.bind('config')
    const doc = await service.config.get('/')
    console.log(doc)
  })
})
