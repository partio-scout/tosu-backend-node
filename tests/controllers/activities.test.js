const supertest = require('supertest')
const { app, server } = require('../../index')
var session = require('supertest-session')
// const api = supertest(app)
const api = session(app)
const models = require('../../domain/models')
require('../testDatabase')

var authenticatedSession
var authScout

beforeEach(function (done) {
  api
    .post('/scouts')
    .send({ Authorization: 'foo' })
    .then((result) => {
      authenticatedSession = api
      authScout = result.body
      done()
    })
})

test('Delete activity', async () => {
  const activity = await models.Activity.create()
  await api.delete('/activities/' + activity.id)
  const found = await models.Activity.findById(activity.id)
  expect(found).toBe(null)
})

test('Move Activity to buffer', async () => {
  const scout = authScout
  const buffer = await models.ActivityBuffer.create({ scoutId: scout.id })
  const activity = await models.Activity.create({ activityBufferId: buffer.id })
  // let cookie = JSON.stringify({scout:{id:1}})
  //
  // await testSession.get('/activities/' + activity.id + '/tobuffer')
  //   .set('Cookie', 'scout='+cookie+';')
  //
  await authenticatedSession.get('/activities/' + activity.id + '/tobuffer')
  const found = await models.Activity.findById(activity.id)
  expect(found.activityBufferId).toBe(null)
})

afterAll(() => {
  server.close()
})
