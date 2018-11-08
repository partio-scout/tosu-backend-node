const { app, server } = require('../../index')
const supertest = require('supertest')
const api = supertest(app)
const models = require('../../domain/models')
const testUtils = require('../testUtils')
require('../handleTestDatabase')


test('Create an event group', async () => {
  const result = await api.post('/eventgroups')
    .send()
    .expect('Content-Type', /json/)
    .expect(200)
  const eventGroupId = result.body.id

  const dbEventGroup = await models.EventGroup.findById(eventGroupId)

  expect(dbEventGroup.id).toBe(eventGroupId)

})

test('Delete event group', async () => {
  const eventGroup = await models.EventGroup.create()

  const result = await api.delete('/eventgroups/'+eventGroup.id)
    .expect(204)

  const dbEventGroup = await models.EventGroup.findById(eventGroup.id)
  expect(dbEventGroup).toBe(null)
})