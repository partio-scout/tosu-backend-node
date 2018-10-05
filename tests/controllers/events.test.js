const { app, server } = require('../../index')
const supertest = require('supertest')
const mockSession = require('mock-session')
const api = supertest(app)
const models = require('../../domain/models')
require('../handleTestDatabase')

test('Get events', async () => {
  const scout = await models.Scout.create()
  const event1 = await models.Event.create({scoutId: scout.id, title: 'HAsfgkaeg'})
  const event2 = await models.Event.create({scoutId: scout.id, title: 'HAsfgkaeg'})

  let cookie = mockSession('session', process.env.SECRET_KEY, {
    "scout": { "id": scout.id }
  })

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
  const scout = await models.Scout.create()

  let cookie = mockSession('session', process.env.SECRET_KEY, {
    "scout": { "id": scout.id }
  })

  await api.get('/events')
    .set('cookie', [cookie])
    .then((result) => {
      expect(result.body.length).toBe(0)
    })
})

test('Create event', async () => {
  const scout = await models.Scout.create()

  let cookie = mockSession('session', process.env.SECRET_KEY, {
    "scout": { "id": scout.id }
  })

  await api.post('/events')
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
    .then((result) => {
      console.log(result.body)
      expect(result.body.title).toBe('EGasg')
      expect(result.body.startDate).toBe('2018-10-19')
      expect(result.body.startTime).toBe('15:12:42')
      expect(result.body.endDate).toBe('2018-10-20')
      expect(result.body.endTime).toBe('21:51:33')
      expect(result.body.type).toBe('Retki')
      expect(result.body.information).toBe('eHGAOSGaoe gaEGo')
      expect(result.body.scoutId).toBe(scout.id)
      const eventId=result.evendIt
      models.Event.findById(eventId).then(event => {
        expect(event.title).toBe('EGasg')
        expect(event.startDate).toBe('2018-10-19')
        expect(event.endDate).toBe('2018-10-20')
        expect(event.startTime).toBe('15:12:42')
        expect(event.endTime).toBe('21:51:33')
        expect(event.type).toBe('Retki')
        expect(event.information).toBe('eHGAOSGaoe gaEGo')
        expect(event.scoutId).toBe(scout.id)
      })
    })
})