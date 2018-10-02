const { app, server } = require('../../index')
var session = require('supertest-session')
const api = session(app)
const models = require('../../domain/models')
require('../testDatabase')

test('Delete event', async () => {
  const event = await models.Event.create()
  await api.delete('/events/' + event.id)
  const found = await models.Event.findById(event.id)
  expect(found).toBe(null)
})

