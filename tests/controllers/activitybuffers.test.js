const supertest = require('supertest')
const { app, server } = require('../../index')
const api = supertest(app)

const models = require('../../domain/models')
const testUtils = require('../testUtils')
require('../handleTestDatabase')

var scout
var cookie

beforeEach(async () => {
  scout = await models.Scout.create()
  cookie = testUtils.createScoutCookieWithId(scout.id)
})

test('Add activity to buffer', async () => {
  const activity = {
    guid: 'fjsfsh4hsifldfjlksfh'
  }

  const response = await api
    .post('/activitybuffers/activity')
    .set('cookie', [cookie])
    .send(activity)
    .expect(201)

  expect(response.body.guid).toBe(activity.guid)
  expect(response.body.id).not.toBeUndefined()
  // Saved to DB
  const found = await models.Activity.findById(parseInt(response.body.id))
  expect(found).not.toBeNull()
})

// TODO: When validation works
// test('Adding activity to buffer works when no request body', async () => {
//   const response = await api
//     .post('/activitybuffers/activity')
//     .set('cookie', [cookie])
//     .send('')
//     .expect(400)
// })

test('Get buffer', async () => {
  const buffer = await models.ActivityBuffer.create({ scoutId: scout.id })

  const response = await api
    .get('/activitybuffers')
    .set('cookie', [cookie])
    .expect(200)

  expect(response.body.id).toBe(buffer.id)
})

test('Get buffer when scout has no buffer', async () => {
  const response = await api
    .get('/activitybuffers')
    .set('cookie', [cookie])
    .expect(200)

  expect(response.body).toBeNull()
})

// TODO: When logged in check implemented
// test('Buffer is not returned when not logged in (no session)', async () => {
//   await api
//     .get('/activitybuffers')
//     .expect(403)
// })
