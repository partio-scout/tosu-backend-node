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
  const event1 = await models.Event.create({
    title: 'Let\'s go fishing!',
    startDate: '2018-09-23',
    endDate: '2018-09-23',
    startTime: '17:46:22.33',
    endTime: '18:44:05.795',
    type: 'Retki',
    information: 'Fishing fish',
    eventGroupId: group.id,
  })
  const event2 = await models.Event.create({
    title: 'Let\'s go fishing!',
    startDate: '2018-09-23',
    endDate: '2018-09-23',
    startTime: '17:46:22.33',
    endTime: '18:44:05.795',
    type: 'Retki',
    information: 'Fishing fish',
    eventGroupId: group.id,
  })

  const fetchedGroup = await models.EventGroup.findById(group.id, { include: [models.Event] })
  expect(fetchedGroup.Events.length).toBe(2)
})
