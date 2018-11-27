const supertest = require('supertest')
const { app, server } = require('../../index')
const api = supertest(app)

const models = require('../../domain/models')
const testUtils = require('../testUtils')
require('../handleTestDatabase')

var scout
var cookie
var eventData
var event
var activity
var plan


beforeEach(async () => {
  scout = await models.Scout.create()
  cookie = testUtils.createScoutCookieWithId(scout.id)  
  eventData = {
    scoutId: scout.id, 
    startDate: '2500-10-10',
    endDate: '2501-10-10',
    startTime: '12:11:54',
    endTime: '15:18:11',
    title: 'Eventti',
    type: 'leiri',
    information: 'kgeqwg aogqa olgao e',
  }
  event = await models.Event.create(eventData)
  activity = await models.Activity.create({ guid: 'pop', eventId: event.id })
  plan = await models.Plan.create({activityId: activity.id})
})

test('Modify a plan', async () => {
  await api.put('/plans/'+plan.id)
    .send({
      title: 'EGasg'
    })
    .set('cookie', [cookie])
    .expect(200)
  const dbPlan = await models.Plan.findById(plan.id)
  expect(dbPlan.title).toBe('EGasg')
})

test('Cannot modify a plan that does not exist', async () => {
  await plan.destroy()
  await api.put('/plans/'+plan.id)
    .send({
      title: 'EGasg'
    })
    .set('cookie', [cookie])
    .expect(403)
})

test('User cannot modify a plan that that he does not own', async () => {
  const scoutImposter = await models.Scout.create()
  const imposterCookie = testUtils.createScoutCookieWithId(scoutImposter.id)  
  await api.put('/plans/'+plan.id)
    .send({
      title: 'EGasg'
    })
    .set('cookie', [imposterCookie])
    .expect(403)
})


test('Delete a plan', async () => {
  await api.delete('/plans/'+plan.id)
    .set('cookie', [cookie])
    .expect(204)
  const dbPlan = await models.Plan.findById(plan.id)
  expect(dbPlan).toBe(null)
})

test('User cannot delete a plan that that he does not own', async () => {
  const scoutImposter = await models.Scout.create()
  const imposterCookie = testUtils.createScoutCookieWithId(scoutImposter.id)  
  await api.delete('/plans/'+plan.id)
    .set('cookie', [imposterCookie])
    .expect(403)
})


test('Invalid (noninteger) planID is handled when trying to modify a plan', async () => {
  await api.put('/plans/asgasASg')
    .set('cookie', [cookie])
    .expect(400)
})


test('Invalid (noninteger) planID is handled when trying to delete a plan', async () => {
  await api.delete('/plans/asgasg')
    .set('cookie', [cookie])
    .expect(400)
})


