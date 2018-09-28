const supertest = require('supertest')
const { app, server } = require('../../index')
var session = require('supertest-session')
// const api = supertest(app)
const api = session(app)
const models = require('../../domain/models')
require('../testDatabase')

test('Delete activity', async () => {
  const activity = await models.Activity.create()
  await api.delete('/activities/' + activity.id)
  const found = await models.Activity.findById(activity.id)
  expect(found).toBe(null)
})

test('Move Activity to buffer', async () => {
  const scout = await models.Scout.create()
  const buffer = await models.ActivityBuffer.create({ scoutId: scout.id })
  var testSession = session(app, {
    before: function (req) {
      req.set('scout', {id: scout.id});
    }
  });

  const activity = await models.Activity.create({ activityBufferId: buffer.id })
  let cookie = JSON.stringify({scout:{id:1}})

  await testSession.get('/activities/' + activity.id + '/tobuffer')
    .set('cookie', ['scout='+cookie+';'])

  const found = await models.Activity.findById(activity.id)
  expect(found.activityBufferId).toBe(null)
})

afterAll(() => {
  server.close()
})
