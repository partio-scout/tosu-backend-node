const models = require('../../domain/models')
const eventgroupService = require('../../services/eventgroupService')
require('../handleTestDatabase')

var eventGroup

beforeEach(async () => {
  eventGroup = await models.EventGroup.create()
})

test('Create an event group', async () => {
  const newEventGroup = await eventgroupService.createEventGroup()
  const dbEventGroup = await models.EventGroup.findById(newEventGroup.id)
  expect(dbEventGroup.id).toBe(newEventGroup.id)
})

test('Delete an event group', async () => {
  const result = await eventgroupService.deleteEventGroup(eventGroup.id)
  expect(result).toBe(true)
  expect(await models.EventGroup.findById(eventGroup.id)).toBeNull()
})