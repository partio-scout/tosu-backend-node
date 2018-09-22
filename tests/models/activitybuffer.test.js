const supertest = require('supertest')
const sequelize = require('sequelize')
const models = require('../../domain/models');
const connection = require('../../domain/models').sequelize; // Needs to be closed after running tests

test('ActivityBuffer can be created', async () => {
  const buffer = await models.ActivityBuffer.create()
  expect(Number.isInteger(buffer.id)).toBe(true)
})

test('ActivityBuffer can be assigned Activities', async () => {
  const buffer = await models.ActivityBuffer.create()
  const activity1 = await models.Activity.create({ guid: "fgfdgdsf", activityBufferId: buffer.id }) // way 1
  const activity2 = await models.Activity.create({ guid: "wasdwasd" })
  await activity2.update({ activityBufferId: buffer.id }) // way 2

  const fetchedBuffer = await models.ActivityBuffer.findById(buffer.id, { include: [models.Activity] })
  expect(fetchedBuffer.Activities.length).toBe(2)
})

test('ActivityBuffer can be assigned to Scout', async () => {
  const scout = await models.Scout.create({ googleId: "jkgldfög" })
  const buffer = await models.ActivityBuffer.create({ scoutId: scout.id })

  const fetchedBuffer = await models.ActivityBuffer.findById(buffer.id, { include: [models.Scout] })
  expect(fetchedBuffer.scoutId).toBe(scout.id)
  expect(fetchedBuffer.Scout.id).toBe(scout.id)
  expect(fetchedBuffer.Scout.googleId).toBe("jkgldfög")
})

afterAll(() => {
  connection.close()
})
