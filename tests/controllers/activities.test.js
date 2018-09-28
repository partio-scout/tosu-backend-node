const supertest = require('supertest')
const { app, server } = require('../../index')
const api = supertest(app)
const models = require('../../domain/models')
require('../testDatabase')

test('Delete activity', async () => {
  const activity = await models.Activity.create()
  await api.delete('/activities/' + activity.id)
  const found = await models.Activity.findById(activity.id)
  expect(found).toBe(null)
})

test('Move Activity to buffer', async () => {
  const activity = await models.Activity.create({ activityBufferId: 222 })
  await api.get('/activities/' + activity.id + '/tobuffer')
  const found = await models.Activity.findById(activity.id)
  expect(found.activityBufferId).toBe(null)
})

afterAll(() => {
  server.close()
})
