const supertest = require('supertest')
const sequelize = require('sequelize')
const models = require('../../domain/models')
require('../testDatabase')

test('Event can be created', async () => {
  const event = await models.Event.create({
    title: "Let's go fishing!",
    startDate: "2018-09-23",
    endDate: "2018-09-23",
    startTime: "17:46:22.33",
    endTime: "18:44:05.795",
    type: "Retki",
    information: "Fishing fish"
  })
  expect(Number.isInteger(event.id)).toBe(true)
  expect(event.title).toBe("Let's go fishing!")
  expect(event.startDate).toBe("2018-09-23")
  expect(event.endDate).toBe("2018-09-23")
  expect(event.startTime).toBe("17:46:22.33")
  expect(event.endTime).toBe("18:44:05.795")
  expect(event.type).toBe("Retki")
  expect(event.information).toBe("Fishing fish")
})

test('Event can be assigned to EventGroup', async () => {
  const eventGroup = await models.EventGroup.create()
  const event = await models.Event.create({ eventGroupId: eventGroup.id })
  expect(event.eventGroupId).toBe(eventGroup.id)

  const fetchedEvent = await models.Event.findById(event.id, { include: [models.EventGroup] })
  expect(fetchedEvent.EventGroup.id).toBe(eventGroup.id)
})

test('Event can be assigned Activities', async () => {
  const event = await models.Event.create()
  const activity1 = await models.Activity.create({ eventId: event.id })
  const activity2 = await models.Activity.create({ eventId: event.id })

  const fetchedEvent = await models.Event.findById(event.id, { include: [models.Activity] })
  expect(fetchedEvent.Activities.length).toBe(2)
})

test('Event can be assigned to Scout', async () => {
  const scout = await models.Scout.create()
  const event = await models.Event.create({ scoutId: scout.id })

  const fetchedEvent = await models.Event.findById(event.id, { include: [models.Scout] })
  expect(fetchedEvent.Scout.id).toBe(scout.id)
})
