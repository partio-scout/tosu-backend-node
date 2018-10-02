const supertest = require('supertest')
const sequelize = require('sequelize')
const models = require('../../domain/models')
require('../handleTestDatabase')

test('EventGroup can be created', async () => {
  const group = await models.EventGroup.create()
  expect(Number.isInteger(group.id)).toBe(true)
})

test('EventGroup can be assigned Events', async () => {
  const group = await models.EventGroup.create()
  const event1 = await models.Event.create({ eventGroupId: group.id })
  const event2 = await models.Event.create({ eventGroupId: group.id })

  const fetchedGroup = await models.EventGroup.findById(group.id, { include: [models.Event] })
  expect(fetchedGroup.Events.length).toBe(2)
})
