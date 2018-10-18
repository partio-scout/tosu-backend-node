const models = require('../../domain/models')
const bufferService = require('../../services/activitybufferService')
require('../handleTestDatabase')

var scout
var buffer
var activity

beforeEach(async () => {
  scout = await models.Scout.create()
  buffer = await models.ActivityBuffer.create({ scoutId: scout.id })
  activity = { 'guid': 'fsg4grgdg' }
})

test('Add activity to buffer', async () => {
  const created = await bufferService.addActivityToBuffer(activity, scout)
  expect(created.activityBufferId).toBe(buffer.id)
})

test('Add activity to buffer when buffer is null', async () => {
  buffer = null
  const created = await bufferService.addActivityToBuffer(activity, scout)
  expect(created.error).not.toBeNull()
})

test('Add activity to buffer when scout is null', async () => {
  scout = null
  const created = await bufferService.addActivityToBuffer(activity, scout)
  expect(created.error).not.toBeNull()
})

test('Add activity to buffer when buffer and scout are null', async () => {
  buffer = null
  scout = null
  const created = await bufferService.addActivityToBuffer(activity, scout)
  expect(created.error).not.toBeNull()
})

test('Find buffer by scout', async () => {
  const found = await bufferService.findByScout(scout)
  expect(found.id).toBe(buffer.id)
})

test('Find buffer by scout returns null when scout is null', async () => {
  await scout.destroy()
  const found = await bufferService.findByScout(scout)
  expect(found).toBeNull()
})

test('Find buffer by scout returns null when no buffer found', async () => {
  await buffer.destroy()
  const found = await bufferService.findByScout(scout)
  expect(found).toBeNull()
})

test('Find buffer by scout returns null when no buffer or scout found', async () => {
  await scout.destroy()
  await buffer.destroy()
  const found = await bufferService.findByScout(scout)
  expect(found).toBeNull()
})
