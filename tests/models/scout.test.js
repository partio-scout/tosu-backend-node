const supertest = require('supertest')
const sequelize = require('sequelize')
const models = require('../../domain/models')
require('../handleTestDatabase')

test('Scout can be created', async () => {
  const scout = await models.Scout.create({
    googleId: "ghfjdklgh",
    name: "Teppo"
  })
  expect(Number.isInteger(scout.id)).toBe(true)
  expect(scout.googleId).toBe("ghfjdklgh")
  expect(scout.name).toBe("Teppo")
})

test('Scout can be assigned Events', async () => {
  const scout = await models.Scout.create({})
  const event1 = await models.Event.create({ scoutId: scout.id })
  const event2 = await models.Event.create({ scoutId: scout.id })
  const event3 = await models.Event.create({ scoutId: scout.id })

  const fetchedScout = await models.Scout.findById(scout.id, { include: [models.Event] })
  expect(fetchedScout.Events.length).toBe(3)
})

test('Scout can be assigned an ActivityBuffer', async () => {
  const scout = await models.Scout.create({})
  const buffer = await models.ActivityBuffer.create({ scoutId: scout.id })

  const fetchedScout = await models.Scout.findById(scout.id, { include: [models.ActivityBuffer] })
  expect(fetchedScout.ActivityBuffer.id).toBe(buffer.id)
})
