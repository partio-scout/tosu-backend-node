const { app, server } = require('../../index')
const supertest = require('supertest')
const api = supertest(app)
const models = require('../../domain/models')
const testUtils = require('../testUtils')
require('../handleTestDatabase')

var scout
var cookie

beforeEach(async () => {
  scout = await models.Scout.create()
  cookie = testUtils.createScoutCookieWithId(scout.id)
})

test('Get events', async () => {
  await models.Event.create({scoutId: scout.id, title: 'HAsfgkaeg'})
  await models.Event.create({scoutId: scout.id, title: 'HAsfgkaeg'})

  await api.get('/events')
    .set('cookie', [cookie])
    .then((result) => {
      expect(result.body.length).toBe(2)
      expect(result.body[0].scoutId).toBe(scout.id)
      expect(result.body[1].scoutId).toBe(scout.id)
      expect(result.body[0].title).toBe('HAsfgkaeg')
      expect(result.body[1].title).toBe('HAsfgkaeg')
    })
})

test('Get events 2', async () => {
  await api.get('/events')
    .set('cookie', [cookie])
    .then((result) => {
      expect(result.body.length).toBe(0)
    })
})


test('Create event', async () => {
  const result = await api.post('/events')
    .send({
      title: 'EGasg',
      startDate: '2018-10-19',
      startTime: '15:12:42',
      endDate:  '2018-10-20',
      endTime: '21:51:33',
      type: 'Retki',
      information: 'eHGAOSGaoe gaEGo',
      scoutId: scout.id 
    })
    .set('cookie', [cookie])
    .expect(200)
  expect(result.body.title).toBe('EGasg')
  expect(result.body.startDate).toBe('2018-10-19')
  expect(result.body.startTime).toBe('15:12:42')
  expect(result.body.endDate).toBe('2018-10-20')
  expect(result.body.endTime).toBe('21:51:33')
  expect(result.body.type).toBe('Retki')
  expect(result.body.information).toBe('eHGAOSGaoe gaEGo')
  expect(result.body.scoutId).toBe(scout.id)
  const eventId=result.body.id

  const dbEvent = await models.Event.findById(eventId)

  expect(dbEvent.title).toBe('EGasg')
  expect(dbEvent.startDate).toBe('2018-10-19')
  expect(dbEvent.endDate).toBe('2018-10-20')
  expect(dbEvent.startTime).toBe('15:12:42')
  expect(dbEvent.endTime).toBe('21:51:33')
  expect(dbEvent.type).toBe('Retki')
  expect(dbEvent.information).toBe('eHGAOSGaoe gaEGo')
  expect(dbEvent.scoutId).toBe(scout.id)
})

test('Update event', async () => {
  const event = await models.Event.create({title:'WOW', scoutId: scout.id})

  const result = await api.put('/events/'+event.id)
    .send({
      title: 'EGasg',
      startDate: '2018-10-19',
      startTime: '15:12:42',
      endDate:  '2018-10-20',
      endTime: '21:51:33',
      type: 'Retki',
      information: 'eHGAOSGaoe gaEGo',
      scoutId: scout.id 
    })
    .set('cookie', [cookie])
    .expect(200)

  expect(result.body.title).toBe('EGasg')
  expect(result.body.startDate).toBe('2018-10-19')
  expect(result.body.startTime).toBe('15:12:42')
  expect(result.body.endDate).toBe('2018-10-20')
  expect(result.body.endTime).toBe('21:51:33')
  expect(result.body.type).toBe('Retki')
  expect(result.body.information).toBe('eHGAOSGaoe gaEGo')
  expect(result.body.scoutId).toBe(scout.id)
  const eventId = result.body.id

  const dbEvent = await  models.Event.findById(eventId)
  expect(dbEvent.title).toBe('EGasg')
  expect(dbEvent.startDate).toBe('2018-10-19')
  expect(dbEvent.endDate).toBe('2018-10-20')
  expect(dbEvent.startTime).toBe('15:12:42')
  expect(dbEvent.endTime).toBe('21:51:33')
  expect(dbEvent.type).toBe('Retki')
  expect(dbEvent.information).toBe('eHGAOSGaoe gaEGo')
  expect(dbEvent.scoutId).toBe(scout.id)
})


test('Delete event', async () => {
  const event = await models.Event.create({title:'WOW', scoutId: scout.id})

  const result = await api.delete('/events/'+event.id)
    .set('cookie', [cookie])
    .expect(200)
  expect(result.body.id).toBe(event.id)
  expect(result.body.title).toBe(event.title)

  const dbEvent = await models.Event.findById(event.id)
  expect(dbEvent).toBe(null)
})
