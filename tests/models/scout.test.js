const supertest = require('supertest')
const sequelize = require('sequelize')
const models = require('../../domain/models')
require('../handleTestDatabase')

test('Scout can be created', async () => {
  const scout = await models.Scout.create({
    googleId: 'ghfjdklgh',
    name: 'Teppo'
  })
  expect(Number.isInteger(scout.id)).toBe(true)
  expect(scout.googleId).toBe('ghfjdklgh')
  expect(scout.name).toBe('Teppo')
})

test('Scout can be created with partioid', async () => {
  const scout = await models.Scout.create({
    partioId: 5677834,
    name: 'Teppo'
  })
  expect(Number.isInteger(scout.id)).toBe(true)
  expect(scout.partioId).toBe(5677834)
  expect(scout.name).toBe('Teppo')
})

test('Scout cannot be created without googleid and partioid', async () => {
  const scout = await models.Scout.create({ name: 'Eitoimi' })
  expect(scout.isNull)
})

test('Scout can be assigned Tosus', async () => {
  const scout = await models.Scout.create({ partioId: '1234', name: 'PartioId' })
  const tosu1 = await models.Tosu.create({scoutId:scout.id, name:"tarpojat"})
  const tosu2 = await models.Tosu.create({scoutId:scout.id, name:"sudarit"})

  const fetchedScout = await models.Scout.findById(scout.id, { include: [models.Tosu] })
  expect(fetchedScout.Tosus.length).toBe(2)
})

test('Scout can be assigned an ActivityBuffer', async () => {
  const scout = await models.Scout.create({ partioId: '1234', name: 'PartioId' })
  const buffer = await models.ActivityBuffer.create({ scoutId: scout.id })

  const fetchedScout = await models.Scout.findById(scout.id, { include: [models.ActivityBuffer] })
  expect(fetchedScout.ActivityBuffer.id).toBe(buffer.id)
})
